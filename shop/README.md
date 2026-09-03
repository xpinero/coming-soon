# XP Prints (`shop.xaverpinero.com`)

A small 3D-print shop, separate from the portfolio at [xaverpinero.com](https://www.xaverpinero.com). Point QR codes at this app.

## What it does

- Catalog of prints with a live quote
- **In-stock colors:** discounted per-gram rate
- **Colors not in stock:** full commercial per-gram rate + restock fee
- Special requests (MakerWorld URL or notes)
- Stripe Checkout with US/Canada shipping

Edit these files to match what you actually print:

| File | What to change |
| --- | --- |
| `src/data/inventory.ts` | Filament colors and which are on the shelf |
| `src/data/pricing.ts` | Per-gram rates, restock fee, handling |
| `src/data/catalog.ts` | Models you are licensed to sell (add MakerWorld URLs) |
| `src/data/shipping.ts` | Shipping amounts and countries |

Only list MakerWorld models with a **commercial license**, or your own designs.

## Local development

```bash
cd shop
cp .env.example .env.local
# paste a Stripe secret key (rk_ test restricted key, or sk_test_)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). QR preview: `/ ?src=qr`.

## Payments

Uses Stripe Checkout Sessions. Do not enable Stripe Tax in code until you have an active tax registration in the Dashboard; otherwise Checkout will collect no tax.

Set:

- `STRIPE_SECRET_KEY` — restricted key preferred (`rk_`)
- `NEXT_PUBLIC_SITE_URL` — `https://shop.xaverpinero.com` in production

## Deploy as a second site

Keep the existing Netlify site for the portfolio. Create a **new** site whose base directory is `shop/`.

**Netlify**

1. Add a new site from this repo, base directory `shop`
2. Domain: `shop.xaverpinero.com`
3. Environment variables as above
4. DNS: CNAME `shop` → the Netlify site hostname

**Vercel** (often simpler for Next.js)

1. Import the repo, set Root Directory to `shop`
2. Add the same env vars and attach `shop.xaverpinero.com`

The portfolio nav already links to `https://shop.xaverpinero.com`. After DNS is live, QR codes can use:

`https://shop.xaverpinero.com/?src=qr`
