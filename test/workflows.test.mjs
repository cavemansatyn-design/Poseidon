import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../dist/server/index.js';
import { shipmentRecordDate, shipments } from '../planner.mjs';
import { hubs } from '../network.mjs';

const origin = 'http://localhost:3000';
const paypalHost = 'api-m.sandbox.paypal.com';
const groqHost = 'api.groq.com';
const credentials = {PAYPAL_CLIENT_ID:'fixture-client', PAYPAL_CLIENT_SECRET:'fixture-secret', GROQ_API_KEY:'fixture-key'};
const invoice = {id:'INV2-FIXTURE', detail:{invoice_number:'TF-1042'}, status:'DRAFT', amount:{value:'42000.00',currency_code:'EUR'}};
const question = {
  question:'Compare the onward routes and check invoice TF-1042.',
  branch:0, officeFx:0, corridor:0, delay:6, fx:0, lane:null, signalCity:'Singapore', shipmentId:'TF-1042',
  plan:{origin:'Singapore',destination:'Rotterdam',avoid:'Port Said',rank:'cost'}
};

async function request(path, env = {}, body, source = origin) {
  const options = body === undefined ? {} : {
    method:'POST', headers:{origin:source,'content-type':'application/json'}, body:JSON.stringify(body)
  };
  const response = await worker.fetch(new Request(origin+path,options),env);
  return {status:response.status, data:await response.json()};
}

test('all shipment histories are dated, ordered and tied to known locations', () => {
  const locations = new Set(hubs.map(([name]) => name));
  assert.equal(new Set(shipments.map(item => item.id)).size, 13);
  for (const item of shipments) {
    assert.ok([item.origin,item.destination,item.location].every(city => locations.has(city)), item.id);
    const dates = item.events.map(([date]) => date);
    assert.deepEqual(dates, [...dates].sort());
    assert.ok(dates.every(date => Number.isFinite(Date.parse(date)) && date <= shipmentRecordDate));
    if (item.status === 'Delivered') assert.equal(dates.at(-1), item.revised);
  }
});

test('disconnected services, invalid requests and unlinked shipments return useful statuses', async () => {
  assert.equal((await request('/api/invoices')).status, 503);
  assert.equal((await request('/api/invoices/draft', {}, {confirm:true})).status, 503);
  assert.equal((await request('/api/invoices/draft', {}, {confirm:false})).status, 403);
  assert.equal((await request('/api/invoices/draft', credentials, {confirm:true}, 'https://example.com')).status, 403);
  assert.equal((await request('/api/analyst', {}, question)).status, 503);
  assert.equal((await request('/api/analyst', {}, {...question,officeFx:30})).status, 400);
  assert.equal((await request('/api/analyst', {}, {...question,question:'a'.repeat(4000)})).status, 413);
  assert.equal((await request('/api/tracking-invoice?shipment=unknown')).status, 404);
  assert.deepEqual(await request('/api/tracking-invoice?shipment=TF-1043'), {status:200,data:{matches:[]}});
  assert.equal((await request('/api/signals?city=unknown')).status, 400);
});

test('invoice preview works without contacting PayPal, including draft and shipment lookup', async t => {
  const outbound = t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('Invoice preview must not call PayPal.');
  });
  const env = {PAYPAL_INVOICE_PREVIEW:'1'};
  const ledger = await request('/api/invoices',env);
  assert.equal(ledger.status,200);
  assert.equal(ledger.data.source,'preview');
  assert.ok(ledger.data.invoices.length > 1);
  const shipmentInvoice = ledger.data.invoices.find(item => item.number === 'TF-1042');
  assert.equal(shipmentInvoice.status,'DRAFT');
  const tracking = await request('/api/tracking-invoice?shipment=TF-1042',env);
  assert.deepEqual(tracking.data,{matches:[shipmentInvoice],source:'preview'});
  assert.deepEqual((await request('/api/invoices/draft',env,{confirm:true})).data,{status:'existing',source:'preview'});
  assert.equal(outbound.mock.callCount(),0);
});

test('PayPal sync, exact shipment lookup, and unsent draft creation use Sandbox', async t => {
  let created = 0;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    const target = new URL(url);
    assert.equal(target.host, paypalHost);
    if (target.pathname.endsWith('/token')) {
      assert.equal(options.body, 'grant_type=client_credentials');
      assert.match(options.headers.authorization, /^Basic /);
      return Response.json({access_token:'fixture-token'});
    }
    assert.equal(options.headers.authorization, 'Bearer fixture-token');
    if (target.pathname.endsWith('/search-invoices')) {
      assert.equal(options.method, 'POST');
      assert.deepEqual(JSON.parse(options.body), {invoice_number:'TF-1042'});
      return Response.json({items:created ? [invoice,{...invoice,detail:{invoice_number:'TF-10420'}}] : []});
    }
    assert.equal(target.pathname, '/v2/invoicing/invoices');
    if (options.method === 'POST') {
      const draft = JSON.parse(options.body);
      assert.equal(draft.detail.invoice_number, 'TF-1042');
      assert.equal(draft.detail.currency_code, 'EUR');
      assert.equal(draft.primary_recipients[0].billing_info.email_address, 'terraflux-buyer@example.com');
      assert.ok(options.headers['PayPal-Request-Id']);
      created++;
      return Response.json(invoice,{status:201});
    }
    return Response.json({items:created ? [invoice] : []});
  });
  assert.deepEqual((await request('/api/invoices',credentials)).data.invoices, []);
  assert.equal((await request('/api/invoices/draft',credentials,{confirm:true})).data.status, 'created');
  assert.equal((await request('/api/invoices/draft',credentials,{confirm:true})).data.status, 'existing');
  assert.equal(created, 1);
  const invoiceList = (await request('/api/invoices',credentials)).data.invoices;
  assert.deepEqual(invoiceList, [{id:'INV2-FIXTURE',number:'TF-1042',status:'DRAFT',amount:'42000.00',currency:'EUR'}]);
  assert.deepEqual((await request('/api/tracking-invoice?shipment=TF-1042',credentials)).data.matches, invoiceList);
});

test('PayPal distinguishes duplicate invoices and upstream errors', async t => {
  let failure = 'duplicate';
  let lookups = 0;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    if (url.endsWith('/token')) {
      return failure === 'auth' ? Response.json({}, {status:401}) : Response.json({access_token:'token'});
    }
    if (url.includes('/search-invoices')) {
      lookups++;
      return Response.json({items:lookups === 1 ? [] : [invoice]});
    }
    if (options.method === 'POST') return Response.json({details:[{issue:'DUPLICATE_INVOICE_NUMBER'}]}, {status:422});
    return failure === 'malformed' ? Response.json({items:null}) : Response.json({}, {status:403});
  });
  assert.equal((await request('/api/invoices/draft',credentials,{confirm:true})).data.status,'existing');
  assert.equal((await request('/api/invoices',credentials)).status,502);
  failure = 'malformed';
  assert.match((await request('/api/invoices',credentials)).data.error,/invalid invoice list/i);
  failure = 'auth';
  assert.match((await request('/api/invoices',credentials)).data.error,/authentication failed/i);
});

test('Groq receives ranked routes, branch and port evidence, and optional invoice fields', async t => {
  let shareInvoices = false;
  let calls = 0;
  let paypalCalls = 0;
  const methods = ['compare_freight_routes','compare_branches','check_port_signals','lookup_paypal_invoices'];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    const {host,pathname} = new URL(url);
    if (host === 'news.google.com') return new Response('<rss><channel></channel></rss>');
    if (host === 'api.open-meteo.com') return Response.json({daily:{time:['2026-11-13'],wind_gusts_10m_max:[25],precipitation_sum:[2]}});
    if (host === paypalHost) {
      paypalCalls++;
      return pathname.endsWith('/token') ? Response.json({access_token:'fixture-token'}) : Response.json({items:[invoice]});
    }
    assert.equal(host,groqHost);
    assert.equal(options.headers.authorization,'Bearer fixture-key');
    const body = JSON.parse(options.body);
    assert.equal(body.model,'openai/gpt-oss-20b');
    const context = JSON.parse(body.messages[1].content);
    assert.equal(context.shipment.id,'TF-1042');
    assert.equal(context.plan.rank,'cost');
    assert.ok(!options.body.includes(credentials.PAYPAL_CLIENT_SECRET));
    const index = calls++;
    const name = methods[index];
    if (index < (shareInvoices ? methods.length : methods.length - 1)) {
      assert.ok(body.tools.some(tool => tool.function.name === name));
      assert.equal(body.tools.some(tool => tool.function.name === methods[3]), shareInvoices);
      return Response.json({choices:[{message:{tool_calls:[{id:'call_'+index,type:'function',function:{name,arguments:'{}'}}]}}]});
    }
    const evidence = body.messages.filter(message => message.role === 'tool').map(message => JSON.parse(message.content));
    assert.deepEqual(evidence[0].map(route => route.cost),[2300,11600]);
    assert.ok(evidence[1].some(branch => branch.name === 'Berlin'));
    assert.equal(evidence[2].weather[0].gustKmh,25);
    if (shareInvoices) assert.deepEqual(evidence[3],[{number:'TF-1042',status:'DRAFT',amount:'42000.00',currency:'EUR'}]);
    return Response.json({choices:[{message:{content:'The Cape route is the lowest-cost onward option.'}}]});
  });
  assert.deepEqual((await request('/api/analyst',credentials,question)).data.tools,methods.slice(0,3));
  assert.equal(paypalCalls,0);
  calls=0;
  shareInvoices=true;
  const answer = (await request('/api/analyst',credentials,{...question,includeSandbox:true})).data;
  assert.deepEqual(answer.tools,methods);
  assert.match(answer.answer,/Cape route/);
  assert.equal(paypalCalls,2);
});

test('Groq returns a clear rate-limit or empty-answer error', async t => {
  let limited = true;
  t.mock.method(globalThis, 'fetch', async () => limited
    ? Response.json({}, {status:429})
    : Response.json({choices:[{message:{content:''}}]}));
  assert.equal((await request('/api/analyst',credentials,question)).status,429);
  limited=false;
  assert.match((await request('/api/analyst',credentials,question)).data.error,/no final answer/i);
});
