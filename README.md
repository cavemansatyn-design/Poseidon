# Poseidon

**Freight disruption response with PayPal Sandbox invoicing and an AI analyst**

Poseidon helps freight operators answer a customer’s question after a missed connection: **Where is my shipment, what are my options, and what’s the status of my freight invoice?** It brings shipment history, route comparison, and billing into one workflow.

## Why we built it

When cargo misses a transfer, a freight operator has to find the last reported milestone, compare alternatives, check the invoice, and explain the situation to the customer. Those details often sit in separate systems. Poseidon gives the operator a single place to investigate a shipment, prepare the next carrier conversation, and share a tracking view with the customer.

## Judge walkthrough

Follow **TF-1042**, a sample shipment of palletized equipment from Shanghai to Rotterdam. It misses its onward connection in Singapore, moving the recorded arrival estimate from **November 18 to November 23**.

1. **Find the shipment.** Open **Atlas**, select **Singapore**, and choose **TF-1042** under **Last reported here**. Review its milestone history, reported hub, and revised arrival date.
2. **Compare onward routes.** Select **Compare onward routes**, exclude **Port Said**, choose **Lowest cost**, and click **Compare options**. Compare the modeled Cape and express alternatives. Select a result to highlight it on the globe.
3. **Connect billing to the shipment.** With PayPal Sandbox configured and preview mode off, open the billing panel and select **Create draft for TF-1042** if the invoice does not already exist. Select **Sync invoices**, then return to tracking and select **Check PayPal invoice**. The shipment view looks up the matching invoice number and displays its status, amount, and currency.
4. **Ask the AI analyst.** Enable **Allow the analyst to read PayPal invoice fields** and submit the prompt below. The response shows the tools the analyst used when available.
5. **Show the customer view.** Open **Open shareable tracking view** to see the timeline, hub map, and invoice lookup without the operator dashboard. Access follows the host’s existing access controls.

> For TF-1042, compare the modeled Singapore-to-Rotterdam options avoiding Port Said. Look up its PayPal Sandbox invoice and tell me what to confirm with the carrier.

## How PayPal and AI work together

**PayPal Invoicing v2** supplies the billing record for the shipment investigation. The server uses the merchant’s Sandbox credentials to create an unsent freight draft, sync recent invoices, and look up the invoice linked by shipment number. The demo creates a draft and makes no charge.

**The Groq analyst** can call read-only tools to compare freight routes, inspect branch figures, check port news and weather, or look up invoice fields when the operator enables access. For TF-1042, the analyst can bring the modeled reroute options and the PayPal invoice status into one response and suggest what to verify with the carrier.

## Features and data

| Feature | What it shows | Data source |
| --- | --- | --- |
| **Globe and shipment tracking** | Ports, trade lanes, reported hubs, shipment milestones, and a shareable customer view | Generated shipment records dated through November 12, 2026, and OpenStreetMap hub maps |
| **Route planning** | Onward options ranked by transit time, cost, or emissions, with an option to exclude a waypoint | Modeled routes and planning estimates |
| **Port conditions** | Recent freight headlines and a three-day weather outlook for a selected hub | Google News and Open-Meteo, subject to feed availability |
| **Freight billing** | Draft creation, recent invoice sync, and shipment-specific invoice lookup | PayPal Sandbox in connected mode, generated invoice records in preview mode |
| **Branch finance** | Budget variance, currency impact, debt and liquidity, and supplier cash scenarios | Planning data |

MarineTraffic is available as an external vessel lookup. Poseidon’s shipment timeline and hub markers use the generated manifest.

## Run locally

**Requirements:** Node.js 22 or newer.

From the project root:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000/). The atlas, shipment histories, route comparisons, and finance calculators work without credentials.

### Connect PayPal Sandbox and Groq

Copy `.env.example` to `.env`, then add your credentials locally and restart the server.

| Environment variable | Value |
| --- | --- |
| `PAYPAL_CLIENT_ID` | Client ID from your PayPal Sandbox REST app |
| `PAYPAL_CLIENT_SECRET` | Client secret from the same Sandbox app |
| `GROQ_API_KEY` | API key from the Groq Console |
| `PAYPAL_INVOICE_PREVIEW` | Set to `0` for PayPal Sandbox or `1` for generated invoice records |

With **invoice preview** set to `1`, **Sync invoices** loads generated records without calling PayPal. Set it to `0` and restart to demonstrate the Sandbox API flow. The AI analyst requires a Groq key.

Keep `.env` out of Git. Use an owner-private deployment for credentialed demos unless tenant authorization and rate limits are in place.

## Verification

```bash
npm test
```

The test suite checks shipment histories, PayPal draft creation and invoice lookup, and Groq tool calling with controlled provider responses. To verify the connected flow, run the judge walkthrough with your own Sandbox and Groq credentials.

## References

- [PayPal Sandbox Apps & Credentials](https://developer.paypal.com/dashboard/applications/sandbox)
- [PayPal Invoicing v2](https://developer.paypal.com/api/invoicing/v2)
- [Groq Console](https://console.groq.com/keys)
- [Groq tool calling](https://console.groq.com/docs/tool-use/local-tool-calling)
