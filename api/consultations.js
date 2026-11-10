import { getSql } from './_lib/db.js';
import { route } from './_lib/handler.js';
import { findExpertSession } from '../shared/expertSessions.js';

const text = (value) => (typeof value === 'string' ? value.trim() : '');

const LIMITS = { name: 200, email: 254, phone: 40, country: 100, experience: 100, message: 4000 };

function validate(body, consultation) {
  const errors = {};
  const name = text(body.name);
  const email = text(body.email);
  const phone = text(body.phone);
  const date = text(body.date);

  if (name.length < 2) errors.name = 'Please tell us your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'That email does not look quite right. Could you check it?';
  if (phone.replace(/\D/g, '').length < 7 || !/^[+\d][\d\s()./-]*$/.test(phone)) {
    errors.phone = 'Please add a phone number with your country code, for example +44 7700 900000.';
  }
  if (!text(body.country)) errors.country = 'Please choose your country.';
  if (!text(body.experience)) errors.experience = 'Please choose the closest option.';
  if (body.consent !== true) errors.consent = 'We need your consent before we can contact you.';

  for (const [field, max] of Object.entries(LIMITS)) {
    if (text(body[field]).length > max) errors[field] = `Please keep this under ${max} characters.`;
  }

  const day = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T12:00:00Z`) : null;
  const weekday = day && !Number.isNaN(day.getTime()) && day.getUTCDay() % 6 !== 0;
  // One day of tolerance either way, because the visitor's time zone can differ from the server's.
  const daysAway = day ? (day.getTime() - Date.now()) / 86_400_000 : NaN;
  if (!weekday || !(daysAway > -1 && daysAway < consultation.bookingWindowDays + 1)) {
    errors.date = 'Please pick a day that suits you.';
  }
  if (!consultation.timeSlots.includes(body.time)) errors.time = 'Please pick a time on that day.';

  return errors;
}

export default route({
  POST: async (req, res) => {
    const body = req.body && typeof req.body === 'object' ? req.body : {};

    // Hidden field that people never see. Bots fill it in, and get a normal reply with nothing saved.
    if (text(body.website)) return res.status(201).json({ ok: true });

    const sql = getSql();
    const [row] = await sql`SELECT value FROM site_content WHERE key = 'consultation'`;
    const errors = validate(body, row.value);
    if (Object.keys(errors).length) {
      return res.status(400).json({ error: 'validation_failed', message: 'Please check the highlighted fields.', fields: errors });
    }

    const kind = body.kind === 'market-expert' ? 'market-expert' : 'consultation';
    // A market expert booking must name one of the listed prices. The price text is saved as the visitor saw it.
    const session = kind === 'market-expert' ? findExpertSession(body.session) : null;
    if (kind === 'market-expert' && !session) {
      return res.status(400).json({ error: 'validation_failed', message: 'Please check the highlighted fields.', fields: { session: 'Please choose a session.' } });
    }
    await sql`
      INSERT INTO consultations (name, email, phone, country, experience, message, preferred_date, preferred_time, consent, kind, session_price)
      VALUES (${text(body.name)}, ${text(body.email)}, ${text(body.phone)}, ${text(body.country)}, ${text(body.experience)},
              ${text(body.message)}, ${text(body.date)}, ${body.time}, true, ${kind}, ${session?.price ?? ''})`;

    // Nothing about the request is sent back to the browser.
    return res.status(201).json({ ok: true });
  },
});
