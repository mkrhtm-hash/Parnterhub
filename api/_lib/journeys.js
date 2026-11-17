import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { findJourney, journeys } from '../../shared/journeys.js';

const scrypt = promisify(scryptCallback);

/** Password hash as scrypt$salt$hash (base64url). */
export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 32);
  return `scrypt$${salt.toString('base64url')}$${key.toString('base64url')}`;
}

export async function checkPassword(password, stored) {
  const [kind, salt, hash] = String(stored ?? '').split('$');
  if (kind !== 'scrypt' || !salt || !hash) return false;
  const key = await scrypt(password, Buffer.from(salt, 'base64url'), 32);
  const expected = Buffer.from(hash, 'base64url');
  return expected.length === key.length && timingSafeEqual(key, expected);
}

/** A readable temporary password for admin resets, e.g. "k7m-q2xp-9wrt". */
export function temporaryPassword() {
  const letters = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = randomBytes(11);
  const chars = [...bytes].map((b) => letters[b % letters.length]).join('');
  return `${chars.slice(0, 3)}-${chars.slice(3, 7)}-${chars.slice(7, 11)}`;
}

// Client sessions. The signature covers the end of the password hash, so a password reset signs out old sessions.
const COOKIE = 'mkpips_client';
const SESSION_SECONDS = 30 * 24 * 60 * 60;
const secret = () => process.env.JWT_SECRET ?? '';
const sign = (id, expires, passwordHash) =>
  createHmac('sha256', secret()).update(`client-session:${id}:${expires}:${String(passwordHash).slice(-16)}`).digest('base64url');
const digest = (value) => createHash('sha256').update(value).digest();

export function setClientSession(res, client) {
  const secure = process.env.VERCEL ? '; Secure' : '';
  if (!client) {
    res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; Path=/api/account; SameSite=Lax; Max-Age=0${secure}`);
    return;
  }
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  const value = `${client.id}.${expires}.${sign(client.id, expires, client.passwordHash)}`;
  res.setHeader('Set-Cookie', `${COOKIE}=${value}; HttpOnly; Path=/api/account; SameSite=Lax; Max-Age=${SESSION_SECONDS}${secure}`);
}

/** Reads the session cookie. Returns { id, expires, signature } to check against the database, or null. */
export function readClientSession(req) {
  if (!secret()) return null;
  const value = (req.headers.cookie ?? '')
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  const [id, expires, signature] = (value ?? '').split('.');
  if (!/^\d+$/.test(id ?? '') || !expires || !signature || Number(expires) <= Date.now() / 1000) return null;
  return { id, expires, signature };
}

export const sessionMatches = (session, passwordHash) =>
  timingSafeEqual(digest(session.signature), digest(sign(session.id, session.expires, passwordHash)));

export const validServices = (list) => [...new Set((Array.isArray(list) ? list : []).filter((id) => findJourney(id)))];

/** Adds services to a client and copies each service's stops onto their roadmap, dated from today. */
export async function addServices(sql, clientId, services) {
  const rows = services.flatMap((service) =>
    findJourney(service).stops.map((stop, i) => ({ service, position: i + 1, title: stop.title, note: stop.note, offset_days: stop.day })),
  );
  if (!rows.length) return;
  await sql`
    WITH cs AS (
      INSERT INTO client_services (client_id, service)
      SELECT ${clientId}, s FROM unnest(${services}::text[]) AS s
      ON CONFLICT (client_id, service) DO NOTHING
      RETURNING id, service
    )
    INSERT INTO journey_stops (client_service_id, position, title, note, due_on)
    SELECT cs.id, t.position, t.title, t.note, current_date + t.offset_days
    FROM cs JOIN jsonb_to_recordset(${JSON.stringify(rows)}::jsonb)
      AS t(service text, position integer, title text, note text, offset_days integer) ON t.service = cs.service`;
}

const order = Object.fromEntries(journeys.map((j, i) => [j.id, i]));

/** Roadmaps for the given clients: { [clientId]: [{ id, service, startedOn, stops: [...] }] }, services in the order of shared/journeys.js. */
export async function loadJourneys(sql, clientIds) {
  if (!clientIds.length) return {};
  const rows = await sql`
    SELECT cs.client_id AS "clientId", cs.id AS "serviceRowId", cs.service, cs.started_on::text AS "startedOn",
           s.id, s.position, s.title, s.note, s.due_on::text AS "dueOn", s.done_at AS "doneAt"
    FROM client_services cs
    LEFT JOIN journey_stops s ON s.client_service_id = cs.id
    WHERE cs.client_id = ANY(${clientIds.map(Number)}::bigint[])
    ORDER BY cs.client_id, cs.id, s.position`;
  const out = {};
  for (const r of rows) {
    const list = (out[r.clientId] ??= []);
    let journey = list.find((j) => j.id === r.serviceRowId);
    if (!journey) {
      journey = { id: r.serviceRowId, service: r.service, startedOn: r.startedOn, stops: [] };
      list.push(journey);
    }
    if (r.id) journey.stops.push({ id: r.id, position: r.position, title: r.title, note: r.note, dueOn: r.dueOn, doneAt: r.doneAt });
  }
  for (const list of Object.values(out)) list.sort((a, b) => (order[a.service] ?? 99) - (order[b.service] ?? 99));
  return out;
}
