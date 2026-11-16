# MKPips

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
| Learning page videos, ebooks and webinars | `learning_resources` |
| Company, founder, risk percentage, legal pages, FAQ, time slots, form options | `site_content` (one JSON value per `key`) |

For example, to set the risk percentage:

```sql
UPDATE site_content
SET value = jsonb_set(value, '{retailLossPercent}', '"74"')
WHERE key = 'compliance';
```

Bracketed text such as `[Legal entity name]` displays with a dashed gold highlight, so unfinished content is easy to spot.

To publish a lesson, put its link in the `url` column. Until then it shows as "Coming soon". Videos can be YouTube or Vimeo links, or an `https://` link to an MP4. Ebooks can be an `https://` link to a PDF, or a PDF placed in `public/learning/` and written as `/learning/my-guide.pdf`:

```sql
UPDATE learning_resources
SET url = 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID', length_label = '8 min'
WHERE id = 'how-cfds-work';
```

For a webinar, also set the date. A future date shows a Register button and a past date shows Watch recording:

```sql
UPDATE learning_resources
SET starts_at = '2027-01-20 18:00+00', url = 'https://example.com/your-webinar-link'
WHERE id = 'choosing-a-regulated-broker';
```

Messages from the Your Opinion tab are private. Read them in the Neon SQL Editor:

```sql
SELECT * FROM learning_feedback ORDER BY created_at DESC;
```

For a real broker, set `is_sample` to `false` and add `verify_url` if you can link directly to its register entry.

## Languages

Visitors can switch between English, Urdu (اردو) and Arabic (العربية) from the language button in the header. Urdu and Arabic turn the whole site right to left. The choice is remembered, and a link ending in `?lang=ur` or `?lang=ar` opens the site in that language. The admin page stays in English.

| What | Where |
|---|---|
| Urdu and Arabic wording | `src/i18n/ur.json`, `src/i18n/ar.json` |
| Every English string the site shows | `src/i18n/source.json` (where each one is used: `source-where.json`) |
| Switching, fonts and right-to-left | `src/i18n/I18nContext.jsx`, `src/index.css` |
| Urdu and Arabic videos | `public/videos/<id>.ur.mp4` and `<id>.ar.mp4`: narrated in Urdu (voice: Gul) or Arabic (voice: Zariyah), Microsoft neural voices, with on-screen text and subtitles in that language |

English is the source. Each translation is stored under a short code made from the English text, so anything without a translation simply shows in English. That includes database content: if you change a FAQ answer or broker note in Neon, the Urdu and Arabic pages show the new English until it is translated.

After changing any English wording, run the preview and then:

```
node scripts/i18n-extract.js
```

It updates `source.json` and reports how many strings each language is missing. Add the new translations to `ur.json` and `ar.json` under the codes listed in `source.json`. Keep placeholders such as `{name}` exactly as they are.

The translations were drafted for MKPips and have not yet been reviewed by native speakers. Have the legal pages, risk warnings and broker details checked before you rely on them. The translated legal pages say that the English version is the legally binding one.

## Consultation requests

The booking form saves to the `consultations` table. To see requests, run this in the Neon SQL Editor:

```sql
SELECT * FROM consultations ORDER BY created_at DESC;
```

You can also read bookings and opinions at `/admin`, which is protected by the `ADMIN_PASSWORD` environment variable. Set it in `.env` and in Vercel. To change the password, update it in Vercel and redeploy. Only `/api/admin` returns these rows, and only after sign-in. Nothing notifies you yet when a request arrives. To add an email or CRM notification, edit `api/consultations.js`.

## AI call assistant (Noor)

After someone books, the confirmation screen offers a short voice call in the browser with Noor, in English, Urdu or Arabic to match the site. Noor works in one of two ways:

- **Scripted (now).** Noor plays recorded lines, asks three questions (what they want from the call, which markets interest them, whether they already have a trading account) and listens to each answer through the browser's speech recognition, or the visitor types it. The answers are added to the booking's message, so they show in `/admin`. The recordings are in `public/voice/`, and the wording is in `src/data/noorScript.js`. All three languages use Google Cloud Text-to-Speech Chirp 3 HD voices, which are licensed for business use: en-GB-Chirp3-HD-Achernar, ur-IN-Chirp3-HD-Achernar and ar-XA-Chirp3-HD-Despina. To change a line, update the script and its translations and record it again.
- **Live AI (once set up).** With an ElevenLabs key, Noor becomes a real conversation built on ElevenLabs Agents. She confirms the booking, asks questions for the consultant and answers simple questions. She is told never to give financial advice, make promises or take payment details. Once both ElevenLabs values are set, this replaces the scripted version automatically.

| What | Where |
|---|---|
| Noor's instructions, greeting and voice | `scripts/voice-agent.js` |
| Starts a call for a real booking (the API key stays on the server) | `api/voice-session.js`, `api/_lib/voiceTicket.js` |
| The call panels | `src/components/booking/VoiceAssistant.jsx` (live AI), `ScriptedAssistant.jsx` (scripted) |
| Saves scripted answers onto the booking | `api/voice-notes.js` |

To switch on the live AI version:

1. Create an account at elevenlabs.io and make an API key under **Developers > API keys**. Give it access to **ElevenLabs Agents**.
2. Add `ELEVENLABS_API_KEY=...` to `.env`.
3. Run `node --env-file=.env scripts/voice-agent.js`. It creates the agent and adds `ELEVENLABS_AGENT_ID` to `.env`.
4. Add both values in Vercel under **Settings > Environment Variables**, then redeploy.

To change what Noor says, edit `scripts/voice-agent.js` and run it again. Call transcripts are in the ElevenLabs dashboard under **Agents > Conversations**. Each booking gets a call pass that lasts two hours, and calls end after ten minutes.

## Deploying

`vercel.json` already sends page routes to `index.html`. Add `DATABASE_URL` and `JWT_SECRET` in the Vercel project settings.

Social platforms need a full URL for the sharing image. Before launch, change `/og-image.png` in `index.html` to `https://yourdomain.com/og-image.png`, for both the `og:image` and `twitter:image` tags.
