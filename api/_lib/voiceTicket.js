import { createHmac, timingSafeEqual } from 'node:crypto';

// A short-lived pass that lets the person who just booked start a call with the AI assistant.
// It names the booking and an expiry time, signed with JWT_SECRET, so it cannot be made up or reused later.
const LIFETIME_MS = 2 * 60 * 60 * 1000;

const secret = () => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');
  return process.env.JWT_SECRET;
};
const sign = (id, expires) => createHmac('sha256', secret()).update(`voice-ticket:${id}:${expires}`).digest('base64url');

export function issueVoiceTicket(id) {
  const expires = Date.now() + LIFETIME_MS;
  return `${id}.${expires}.${sign(id, expires)}`;
}

/** Returns the booking id, or null if the ticket is malformed, forged or expired. */
export function readVoiceTicket(ticket) {
  const match = /^(\d{1,18})\.(\d{13})\.([\w-]{43})$/.exec(typeof ticket === 'string' ? ticket : '');
  if (!match) return null;
  const [, id, expires, signature] = match;
  if (Number(expires) < Date.now()) return null;
  const expected = Buffer.from(sign(id, expires));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given) ? id : null;
}
