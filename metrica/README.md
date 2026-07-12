# Metrica

FF&E specification & procurement tool for boutique interior design and
architecture studios in Europe. Extraction that reads European PDF cut-sheets, a
library that speaks Italian, and spec books a studio would put its name on.

## Where this lives

This app is a **self-contained Next.js project in the `metrica/` subdirectory**
of the repository. The Capitolo marketing site remains untouched at the repo
root. This separation was chosen so the marketing site's i18n middleware never
interferes with the app's authenticated routes, and so each deploys as its own
Vercel project (set the Vercel root directory to `metrica/`).

## Stack

- Next.js 14 (App Router) + TypeScript (strict) + Tailwind
- Supabase — Auth (magic link + Google), Postgres, Storage, **RLS on every table**
- Anthropic Claude (vision) — server-only, in `/api/extract` (Milestone 2)
- Stripe — subscriptions + EU VAT (Milestone 7)
- React-PDF — server-side spec books (Milestone 4)
- Satoshi Variable, self-hosted via `next/font/local`

## Getting started

```bash
cp .env.example .env.local   # fill in Supabase (EU region), later Anthropic/Stripe
npm install
npm run dev
```

### Local preview without a backend

Set `NEXT_PUBLIC_METRICA_DEMO=1` (and leave Supabase unset) to render the
authenticated shell with demo data — useful for design review. This flag is
inert once Supabase is configured; auth is always enforced in production.

### Database

Apply `supabase/migrations/0001_init.sql` to a Supabase project created in an
**EU region** (GDPR is a product promise — make it true). It creates the full
schema, RLS policies on every table, the onboarding/membership helper functions,
and the `get_shared_project` / `set_shared_item_status` SECURITY DEFINER
functions that serve the public client-approval view without ever disabling RLS.

Configure the email auth template's confirmation URL to
`{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type={{ .Type }}`.

## Design system — "Gesso"

Six palette tokens + two functional status colours, defined once in
`src/app/globals.css` and mirrored into `tailwind.config.ts`. Satoshi is the only
typeface. No shadows anywhere; corners ≤ 4px; `--accent` appears only on the
primary CTA, link hover, and the active nav item. Numbers use tabular figures.

## Milestones

1. ✅ Foundation — stack, tokens, Satoshi, schema + RLS, auth, app shell
2. ⬜ Extraction pipeline (`/api/extract`, URL + PDF/image, strict JSON, quota)
3. ⬜ The schedule — projects, rooms, inline-editable table, extraction review
4. ⬜ Spec book (React-PDF) + preview + export + tearsheet
5. ⬜ Library + seed data (80–120 curated EU products)
6. ⬜ Client approval link (`/share/[token]`)
7. ⬜ Billing (Stripe Checkout, Portal, webhooks, quotas)
8. ⬜ Polish — states, keyboard nav, Lighthouse, account deletion
