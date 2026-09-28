# AYUSYDAH Storefront

The AYUSYDAH storefront is a React 19 single-page application built with Vite. It connects to the separate Express and MongoDB backend in `../lac-supplement-backend` for the product catalogue, accounts, carts, wishlists, checkout, orders, reviews, and admin operations. Product and category content is served by the backend API; the storefront does not use a mock product catalogue.

## Local development

1. Install Node.js and npm, then install dependencies:

   ```sh
   npm ci
   ```

2. Copy `.env.example` to `.env.local` and set the public storefront configuration:

   - `VITE_API_URL`: backend origin, without the `/api` suffix.
   - `VITE_SITE_URL`: canonical storefront origin.
   - `VITE_GOOGLE_CLIENT_ID`: Google web client ID, if Google sign-in is enabled.
   - `VITE_PAYPAL_CLIENT_ID`: PayPal client ID for the configured environment.

   These `VITE_` values are included in browser code. Never put API secrets, database credentials, signing secrets, or payment-provider secrets in this file.

3. Start the backend separately from `../lac-supplement-backend` after configuring its `.env` from that folder’s `.env.example`.

4. Start Vite:

   ```sh
   npm run dev
   ```

The local storefront is available at `http://localhost:5173`.

## Build and checks

```sh
npm run build
npm run lint
npm run preview
```

The frontend package does not currently define an automated test script.

## Production deployment

Deploy this directory as the Vercel project root. Configure the frontend environment variables above for the Production environment. The Vercel sitemap function also reads `VITE_API_URL` at runtime to fetch public products and categories; the backend must allow the storefront origin in `CLIENT_ORIGINS`.

Deploy `../lac-supplement-backend` as a separate Node.js service with `npm start`. Configure its values from the backend `.env.example`, including MongoDB, JWT, shipping and discount rates, Google, Cloudinary, PayPal or Razorpay, and email settings. Keep all backend secrets in the backend host’s environment settings. Use the Vercel and backend service URLs in the corresponding configuration, and register the payment webhooks with the backend service URL.

The Vercel configuration provides SPA route rewrites, redirects the apex domain to `www`, and routes `/sitemap.xml` to a serverless sitemap generator. Keep `VITE_API_URL` available to the function in the deployed Vercel environment. The sitemap is assembled from the public API at request time and cached for one hour at the edge.

## Routing, metadata, and consent

Major customer, admin, account, checkout, and policy routes use React lazy loading. Product and category metadata updates after API content loads. The app is client-rendered rather than server-rendered, so crawlers that do not execute JavaScript may still receive the generic HTML metadata; server rendering or pre-rendering would be needed to remove that limitation. Google Analytics loads only after the visitor continues through the cookie notice.
