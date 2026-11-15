import { getSql } from './_lib/db.js';
import { route } from './_lib/handler.js';
import { readVoiceTicket } from './_lib/voiceTicket.js';

// Saves the answers given to Noor, the scripted voice assistant, onto the booking's message,
// so the consultant sees them in /admin. Needs the pass returned with the booking. Saves once per booking.

const QUESTIONS = {
  q1: 'What they want from the call',
  q2: 'Markets of interest',
  q3: 'Existing trading account',
};
const MARKER = '--- Answers given to Noor (voice assistant) ---';

export default route({
  POST: async (req, res) => {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const id = readVoiceTicket(body.ticket);
    if (!id) return res.status(403).json({ error: 'ticket_invalid', message: 'This call link has expired. Your booking is still saved, and we will be in touch.' });

    const answers = body.answers && typeof body.answers === 'object' ? body.answers : {};
    const lines = Object.entries(QUESTIONS)
      .map(([key, label]) => [label, typeof answers[key] === 'string' ? answers[key].trim().slice(0, 1000) : ''])
      .map(([label, answer]) => `${label}: ${answer || '(no answer)'}`);
    const lang = ['en', 'ur', 'ar'].includes(body.lang) ? body.lang : 'en';
    const notes = `${MARKER}\nLanguage: ${{ en: 'English', ur: 'Urdu', ar: 'Arabic' }[lang]}\n${lines.join('\n')}`;

    const sql = getSql();
    const saved = await sql`
      UPDATE consultations
      SET message = CASE WHEN message = '' THEN ${notes} ELSE message || E'\n\n' || ${notes} END
      WHERE id = ${id} AND position(${MARKER} in message) = 0
      RETURNING id`;
    if (!saved.length) return res.status(409).json({ error: 'already_saved', message: 'Your answers are already saved.' });
    return res.status(201).json({ ok: true });
  },
});
