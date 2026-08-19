# gov.inLens

India's information layer for government services — the first vertical of
[inLens](https://inlens.in). Search any government service, scheme, or exam;
inLens explains eligibility, documents, fees, and process in plain language,
then sends you to the official source to apply. inLens never processes
applications or logins itself — see [`src/components/Footer.tsx`](src/components/Footer.tsx).

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS 4)
- **Deployed to Cloudflare Workers** via [OpenNext](https://opennext.js.org/cloudflare) — not Cloudflare Pages, which is in maintenance mode for full SSR Next.js apps
- Data lives as JSON files in [`src/data/services`](src/data/services) — no database yet, git-diff friendly for the MVP stage

## Data model

Each government service is one JSON file conforming to [`src/lib/types.ts`](src/lib/types.ts):
eligibility, documents, fee, step-by-step process, official/apply/track URLs,
FAQ, `lastVerified` date, and an optional `changeLog` for tracking what
changed and when (the site's core freshness/trust signal — see `/updates`).

Services that are genuinely state-specific (e.g. Income Certificate) can
carry a `stateVariants` array with real per-state portal, fee, and
processing-time data. This renders at `/services/[slug]/[state]`
(e.g. `/services/income-certificate/mh`) — the pattern for scaling into
"structured data → useful pages" described in the product plan. Only add a
state variant when the content is genuinely different; don't template pages
just for SEO volume.

## Development

```bash
npm run dev          # start the dev server at localhost:3000
npm run build         # production build
npm run lint           # eslint
npx tsc --noEmit        # type-check
```

## Deploying to Cloudflare Workers

```bash
npx wrangler login      # one-time: authenticate with your Cloudflare account
npm run preview          # build with OpenNext and preview locally against the Workers runtime
npm run deploy             # build and deploy to Cloudflare Workers
```

`wrangler.jsonc` sets the Worker name (`gov-inlens`) and static asset
binding. Set up a custom domain (`gov.inlens.in`) in the Cloudflare dashboard
under Workers & Pages → your worker → Settings → Domains & Routes once
deployed. Update the `BASE_URL` constants in `src/app/layout.tsx`,
`src/app/sitemap.ts`, `src/app/robots.ts`, and the two service page files if
the production domain ever changes.

## Adding a new service

1. Add a JSON file to `src/data/services/` following `src/lib/types.ts`.
2. Import and register it in the `services` array in `src/lib/services.ts`.
3. Run `npm run build` — the service page, sitemap entry, and search index
   are all generated automatically.

## SEO

- `src/app/sitemap.ts` / `src/app/robots.ts` — auto-generated from the data layer
- Structured data (JSON-LD): `GovernmentService`, `FAQPage`, and
  `BreadcrumbList` per service page, `WebSite`/`Organization` site-wide
  (`src/components/JsonLd.tsx`)
- Per-page Open Graph / Twitter card metadata via `generateMetadata`
