# Poseidon

Poseidon brings freight routes, shipment histories, port conditions, branch finance, and PayPal Sandbox billing into one workspace.

## Run locally

Use Node.js 22 or later and run `npm start`. Open [localhost:3000](http://localhost:3000/). The atlas, shipment histories, route comparisons, and finance calculators work without credentials.

To connect PayPal Sandbox and Groq, copy `.env.example` to `.env` and set `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` from a [PayPal Sandbox REST app](https://developer.paypal.com/dashboard/applications/sandbox). Set `GROQ_API_KEY` from the [Groq Console](https://console.groq.com/keys), then restart the server. Keep credentials on the server and keep credentialed deployments owner-private unless tenant authorization and rate limits are in place.

For a recording, set `PAYPAL_INVOICE_PREVIEW=1` in `.env` and restart. **Sync invoices** loads generated records without contacting PayPal. Set it back to `0` and restart to reconnect to PayPal Sandbox.

## Walk through the workspace

1. In **Atlas**, select Singapore and open the port map. The map shows the location in OpenStreetMap. Select TF-1042 under **Last reported here** to open its shipment history.
2. In **Track shipment**, choose **Compare onward routes**. Exclude Port Said and rank the alternatives by cost, transit time, or emissions. Select a result to highlight it on the globe. **Browse trade lanes** opens the full route library.
3. In **Sandbox billing**, create the unsent TF-1042 draft, sync recent invoices, and return to tracking to check the exact invoice number. Poseidon only creates drafts. The tracking link opens a view with shipment history and a map. Access follows the site's existing access boundary.
4. In **Analyst**, ask for a route comparison, a branch budget explanation, or port disruption signals. Enable invoice access only when you want the analyst to use PayPal Sandbox invoice fields.
5. In **Finance**, pick a branch and adjust the exchange rate to see how USD operating costs and budget variance change. Open **Supplier cash forecast** to explore collection timing and customer exchange rates.

## Data and verification

Shipment histories use generated records dated through November 12, 2026. Branch figures and supplier cash use planning data. Freight route costs, transit times, and emissions are estimates. Port news and weather are drawn from Google News and Open-Meteo. OpenStreetMap shows hub locations, and MarineTraffic is available through a separate vessel lookup link. Poseidon does not connect to a live carrier or AIS feed.

Run `npm test` to verify shipment histories and the PayPal and Groq request flows with controlled provider responses. Live provider verification requires credentials.

- [PayPal Invoicing v2](https://developer.paypal.com/api/invoicing/v2)
- [Groq tool calling](https://console.groq.com/docs/tool-use/local-tool-calling)

