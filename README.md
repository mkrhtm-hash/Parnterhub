# Partnerhub

Consultancy website for FX and CFD traders. React, Vite, Tailwind CSS, Framer Motion, React Router and lucide-react, with a Neon Postgres database behind functions in `/api`.

## Run it

First time only:

1. `npm install`
2. Copy your connection string from the Neon dashboard into `.env` as `DATABASE_URL=...`. Running `npm run dev` without it prints the steps and creates the file.
3. `npm run db:setup` creates the tables and adds starting data. It is safe to run again.

Then, every time:

```
npm run dev       # http://localhost:5174
```

This starts the site and a small local API server on port 3101. That server loads the same `/api` files Vercel will use.

## Where things live

| What | Where |
|---|---|
| Tables | `db/schema.sql` |
| Starting data | `db/seed.sql` |
| API routes | `api/` (`_lib` holds shared helpers and is not a route) |
| Match scoring | `src/lib/matchEngine.js` |
| Wording that shows even if the database is down | `src/data/staticContent.js` |
| Optional analytics and marketing scripts, loaded only after Accept | `src/context/CookieContext.jsx` |
| Colours and theme | `src/index.css` |

The connection string is only read on the server. Nothing under `src/` touches the database directly.

## Changing content

Content now lives in the database, so edit it in the Neon dashboard under **Tables** or **SQL Editor**. Re-running `db:setup` will not overwrite your edits.

| Content | Table |
|---|---|
| Brokers and licences | `brokers`, `broker_licences` |
| Regulators, tiers, countries | `regulators`, `regulator_tiers`, `countries` |
| Company, founder, risk percentage, legal pages, FAQ, time slots, form options | `site_content` (one JSON value per `key`) |

For example, to set the risk percentage:

```sql
UPDATE site_content
SET value = jsonb_set(value, '{retailLossPercent}', '"74"')
WHERE key = 'compliance';
```

Bracketed text such as `[Legal entity name]` displays with a dashed gold highlight, so unfinished content is easy to spot.

For a real broker, set `is_sample` to `false` and add `verify_url` if you can link directly to its register entry.

## Consultation requests

The booking form saves to the `consultations` table. To see requests, run this in the Neon SQL Editor:

```sql
SELECT * FROM consultations ORDER BY created_at DESC;
```

No API route returns these rows. Nothing notifies you yet when a request arrives. To add an email or CRM notification, edit `api/consultations.js`.

## Deploying

`vercel.json` already sends page routes to `index.html`. Add `DATABASE_URL` and `JWT_SECRET` in the Vercel project settings.

Social platforms need a full URL for the sharing image. Before launch, change `/og-image.png` in `index.html` to `https://yourdomain.com/og-image.png`, for both the `og:image` and `twitter:image` tags.
