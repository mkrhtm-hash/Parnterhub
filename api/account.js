import { getSql } from './_lib/db.js';
import { route } from './_lib/handler.js';
import {
  addServices, checkPassword, hashPassword, loadJourneys, readClientSession, sessionMatches, setClientSession, validServices,
} from './_lib/journeys.js';

// Client accounts for My Journey (/account): sign up, sign in, sign out, and the signed-in client's roadmap.
// A client only ever sees their own details and roadmap. Only /admin can tick stops done.

const FAILED_DELAY_MS = 500;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const slow = () => new Promise((resolve) => setTimeout(resolve, FAILED_DELAY_MS));
const bad = (res, field, message) => res.status(400).json({ error: 'invalid', field, message });

async function signedInClient(req, sql) {
  const session = readClientSession(req);
  if (!session) return null;
  const [client] = await sql`SELECT id, name, email, phone, country, password_hash AS "passwordHash", created_at AS "createdAt" FROM clients WHERE id = ${session.id}`;
  return client && sessionMatches(session, client.passwordHash) ? client : null;
}

async function profile(sql, client) {
  const journeys = (await loadJourneys(sql, [client.id]))[client.id] ?? [];
  const { passwordHash, ...rest } = client;
  return { client: rest, journeys };
}

export default route({
  GET: async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const sql = getSql();
    const client = await signedInClient(req, sql);
    if (!client) return res.status(401).json({ error: 'not_signed_in', message: 'Please sign in.' });
    return res.status(200).json(await profile(sql, client));
  },

  POST: async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (!process.env.JWT_SECRET) return res.status(503).json({ error: 'not_configured', message: 'Accounts are not available right now.' });
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const sql = getSql();
    const email = text(body.email, 200).toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';

    if (body.action === 'signup') {
      const name = text(body.name, 100);
      const phone = text(body.phone, 40);
      const country = text(body.country, 80);
      const services = validServices(body.services);
      if (name.length < 2) return bad(res, 'name', 'Please enter your full name.');
      if (!EMAIL.test(email)) return bad(res, 'email', 'Please enter a valid email address.');
      if (password.length < 8 || password.length > 200) return bad(res, 'password', 'Please use at least 8 characters.');
      if (!services.length) return bad(res, 'services', 'Please choose at least one service.');
      if (body.consent !== true) return bad(res, 'consent', 'Please agree to the Privacy Policy to continue.');

      const passwordHash = await hashPassword(password);
      const [client] = await sql`
        INSERT INTO clients (name, email, phone, country, password_hash, last_sign_in)
        VALUES (${name}, ${email}, ${phone}, ${country}, ${passwordHash}, now())
        ON CONFLICT (email) DO NOTHING
        RETURNING id, name, email, phone, country, password_hash AS "passwordHash", created_at AS "createdAt"`;
      if (!client) return res.status(409).json({ error: 'email_taken', field: 'email', message: 'An account with this email already exists. Please sign in instead.' });
      await addServices(sql, client.id, services);
      setClientSession(res, client);
      return res.status(201).json(await profile(sql, client));
    }

    if (body.action === 'signin') {
      const [client] = EMAIL.test(email)
        ? await sql`SELECT id, name, email, phone, country, password_hash AS "passwordHash", created_at AS "createdAt" FROM clients WHERE email = ${email}`
        : [];
      if (!client || !password || !(await checkPassword(password, client.passwordHash))) {
        await slow();
        return res.status(401).json({ error: 'wrong_details', message: 'That email and password do not match.' });
      }
      await sql`UPDATE clients SET last_sign_in = now() WHERE id = ${client.id}`;
      setClientSession(res, client);
      return res.status(200).json(await profile(sql, client));
    }

    if (body.action === 'add-service') {
      const client = await signedInClient(req, sql);
      if (!client) return res.status(401).json({ error: 'not_signed_in', message: 'Please sign in.' });
      const services = validServices([body.service]);
      if (!services.length) return bad(res, 'service', 'Please choose a service.');
      await addServices(sql, client.id, services);
      return res.status(200).json(await profile(sql, client));
    }

    if (body.action === 'password') {
      const client = await signedInClient(req, sql);
      if (!client) return res.status(401).json({ error: 'not_signed_in', message: 'Please sign in.' });
      const next = typeof body.newPassword === 'string' ? body.newPassword : '';
      if (!(await checkPassword(password, client.passwordHash))) {
        await slow();
        return bad(res, 'password', 'Your current password is not right.');
      }
      if (next.length < 8 || next.length > 200) return bad(res, 'newPassword', 'Please use at least 8 characters.');
      const passwordHash = await hashPassword(next);
      await sql`UPDATE clients SET password_hash = ${passwordHash} WHERE id = ${client.id}`;
      setClientSession(res, { ...client, passwordHash });
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'unknown_action', message: 'That request could not be read.' });
  },

  DELETE: async (_req, res) => {
    setClientSession(res, null);
    return res.status(200).json({ ok: true });
  },
});
