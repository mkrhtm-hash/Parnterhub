import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { getSql } from './_lib/db.js';
import { route } from './_lib/handler.js';
import { addServices, hashPassword, loadJourneys, temporaryPassword, validServices } from './_lib/journeys.js';

const COOKIE = 'partnerhub_admin';
const SESSION_SECONDS = 8 * 60 * 60;
const FAILED_LOGIN_DELAY_MS = 500;
const ROW_LIMIT = 500;

const adminPassword = () => process.env.ADMIN_PASSWORD ?? '';
const sign = (expires) => createHmac('sha256', adminPassword()).update(`admin-session:${expires}`).digest('base64url');
const digest = (value) => createHash('sha256').update(value).digest();
const matches = (a, b) => timingSafeEqual(digest(a), digest(b));

function setCookie(res, value, maxAge) {
  const secure = process.env.VERCEL ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE}=${value}; HttpOnly; Path=/api/admin; SameSite=Strict; Max-Age=${maxAge}${secure}`);
}

function isSignedIn(req) {
  if (!adminPassword()) return false;
  const value = (req.headers.cookie ?? '')
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  const [expires, signature] = (value ?? '').split('.');
  if (!expires || !signature) return false;
  return Number(expires) > Date.now() / 1000 && matches(signature, sign(expires));
}

/** Private: lists bookings, opinions and clients for the /admin page, updates client roadmaps, and signs the owner in and out. */
export default route({
  GET: async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (!isSignedIn(req)) return res.status(401).json({ error: 'not_signed_in', message: 'Please sign in.' });

    const sql = getSql();
    const [bookings, opinions, clients] = await Promise.all([
      sql`SELECT id, name, email, phone, country, experience, message,
                 preferred_date::text AS "preferredDate", preferred_time AS "preferredTime", status, kind, session_price AS "sessionPrice", created_at AS "createdAt"
          FROM consultations ORDER BY created_at DESC LIMIT ${ROW_LIMIT}`,
      sql`SELECT id, name, topic, rating, message, created_at AS "createdAt"
          FROM learning_feedback ORDER BY created_at DESC LIMIT ${ROW_LIMIT}`,
      sql`SELECT id, name, email, phone, country, created_at AS "createdAt", last_sign_in AS "lastSignIn"
          FROM clients ORDER BY created_at DESC LIMIT ${ROW_LIMIT}`,
    ]);
    const journeys = await loadJourneys(sql, clients.map((c) => c.id));
    return res.status(200).json({ bookings, opinions, clients: clients.map((c) => ({ ...c, journeys: journeys[c.id] ?? [] })) });
  },

  // Client roadmaps: tick a stop done, change its date or note, add or remove a service, reset a password.
  PATCH: async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (!isSignedIn(req)) return res.status(401).json({ error: 'not_signed_in', message: 'Please sign in.' });
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const id = /^\d+$/.test(String(body.id ?? '')) ? String(body.id) : null;
    if (!id) return res.status(400).json({ error: 'invalid', message: 'Missing id.' });
    const sql = getSql();

    if (body.op === 'stop') {
      const dueOn = body.dueOn === null || /^\d{4}-\d{2}-\d{2}$/.test(body.dueOn ?? '') ? body.dueOn : undefined;
      const note = typeof body.note === 'string' ? body.note.trim().slice(0, 500) : undefined;
      const done = typeof body.done === 'boolean' ? body.done : undefined;
      const [stop] = await sql`
        UPDATE journey_stops SET
          done_at = CASE WHEN ${done === undefined} THEN done_at WHEN ${done === true} THEN coalesce(done_at, now()) ELSE NULL END,
          due_on  = CASE WHEN ${dueOn === undefined} THEN due_on ELSE ${dueOn ?? null}::date END,
          note    = coalesce(${note ?? null}, note)
        WHERE id = ${id}
        RETURNING id, position, title, note, due_on::text AS "dueOn", done_at AS "doneAt"`;
      if (!stop) return res.status(404).json({ error: 'not_found', message: 'That stop no longer exists.' });
      return res.status(200).json({ stop });
    }

    if (body.op === 'add-service') {
      const services = validServices([body.service]);
      if (!services.length) return res.status(400).json({ error: 'invalid', message: 'Unknown service.' });
      await addServices(sql, id, services);
      return res.status(200).json({ journeys: (await loadJourneys(sql, [id]))[id] ?? [] });
    }

    if (body.op === 'remove-service') {
      const [row] = await sql`DELETE FROM client_services WHERE id = ${id} RETURNING client_id AS "clientId"`;
      if (!row) return res.status(404).json({ error: 'not_found', message: 'That service no longer exists.' });
      return res.status(200).json({ journeys: (await loadJourneys(sql, [row.clientId]))[row.clientId] ?? [] });
    }

    if (body.op === 'reset-password') {
      const password = temporaryPassword();
      const [row] = await sql`UPDATE clients SET password_hash = ${await hashPassword(password)} WHERE id = ${id} RETURNING id`;
      if (!row) return res.status(404).json({ error: 'not_found', message: 'That client no longer exists.' });
      return res.status(200).json({ password });
    }

    if (body.op === 'delete-client') {
      await sql`DELETE FROM clients WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'invalid', message: 'Unknown change.' });
  },

  POST: async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!adminPassword() || !password || !matches(password, adminPassword())) {
      await new Promise((resolve) => setTimeout(resolve, FAILED_LOGIN_DELAY_MS));
      return res.status(401).json({ error: 'wrong_password', message: 'That password is not right.' });
    }
    const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
    setCookie(res, `${expires}.${sign(expires)}`, SESSION_SECONDS);
    return res.status(200).json({ ok: true });
  },

  DELETE: async (_req, res) => {
    setCookie(res, '', 0);
    return res.status(200).json({ ok: true });
  },
});
