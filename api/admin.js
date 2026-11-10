import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { getSql } from './_lib/db.js';
import { route } from './_lib/handler.js';

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

/** Private: lists bookings and opinions for the /admin page, and signs the owner in and out. */
export default route({
  GET: async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (!isSignedIn(req)) return res.status(401).json({ error: 'not_signed_in', message: 'Please sign in.' });

    const sql = getSql();
    const [bookings, opinions] = await Promise.all([
      sql`SELECT id, name, email, phone, country, experience, message,
                 preferred_date::text AS "preferredDate", preferred_time AS "preferredTime", status, kind, session_price AS "sessionPrice", created_at AS "createdAt"
          FROM consultations ORDER BY created_at DESC LIMIT ${ROW_LIMIT}`,
      sql`SELECT id, name, topic, rating, message, created_at AS "createdAt"
          FROM learning_feedback ORDER BY created_at DESC LIMIT ${ROW_LIMIT}`,
    ]);
    return res.status(200).json({ bookings, opinions });
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
