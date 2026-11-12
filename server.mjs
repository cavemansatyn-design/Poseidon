import {createServer} from 'node:http';
import worker from './dist/server/index.js';

const port = Number(process.env.PORT || 3000);
createServer(async (incoming, outgoing) => {
  const body = [];
  let length = 0;
  for await (const chunk of incoming) {
    length += chunk.length;
    if (length > 3000) {
      outgoing.writeHead(413,{'content-type':'application/json'});
      outgoing.end(JSON.stringify({error:'Request is too large.'}));
      return;
    }
    body.push(chunk);
  }
  const request = new Request(new URL(incoming.url,'http://' + incoming.headers.host), {
    method:incoming.method, headers:incoming.headers,
    body:body.length ? Buffer.concat(body) : undefined
  });
  const response = await worker.fetch(request,process.env);
  outgoing.writeHead(response.status,Object.fromEntries(response.headers));
  outgoing.end(Buffer.from(await response.arrayBuffer()));
}).listen(port,'127.0.0.1',()=>console.log('TerraFlux is running at http://localhost:' + port));
