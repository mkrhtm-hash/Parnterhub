import { getSql } from './_lib/db.js';
import { route } from './_lib/handler.js';
import { readVoiceTicket } from './_lib/voiceTicket.js';

// Starts a voice call with the MKPips AI assistant (an ElevenLabs agent) for someone who has just booked.
// The ElevenLabs API key stays here on the server. The browser gets a one-off conversation token,
// plus the booking details the assistant may mention, read from the database rather than from the browser.

const LANGS = ['en', 'ur', 'ar'];

export default route({
  // Lets the booking page show the assistant only once it has been set up.
  GET: async (_req, res) => res.status(200).json({ available: Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_AGENT_ID) }),

  POST: async (req, res) => {
    const { ELEVENLABS_API_KEY: key, ELEVENLABS_AGENT_ID: agentId } = process.env;
    if (!key || !agentId) {
      return res.status(503).json({ error: 'voice_unavailable', message: 'The AI assistant is not available right now.' });
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const id = readVoiceTicket(body.ticket);
    if (!id) {
      return res.status(403).json({ error: 'ticket_invalid', message: 'This call link has expired. Your booking is still saved, and we will be in touch.' });
    }

    const sql = getSql();
    const [booking] = await sql`
      SELECT name, country, experience, preferred_date, preferred_time, kind
      FROM consultations WHERE id = ${id}`;
    if (!booking) return res.status(403).json({ error: 'ticket_invalid', message: 'We could not find that booking.' });
    const [settings] = await sql`SELECT value FROM site_content WHERE key = 'consultation'`;
    const minutes = settings?.value?.durationMinutes ?? 30;

    const reply = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${encodeURIComponent(agentId)}`, {
      headers: { 'xi-api-key': key },
    });
    if (!reply.ok) {
      console.error(`[voice] ElevenLabs token request failed: ${reply.status} ${(await reply.text()).slice(0, 300)}`);
      return res.status(502).json({ error: 'voice_unavailable', message: 'The AI assistant is not available right now.' });
    }
    const { token } = await reply.json();

    const date = booking.preferred_date instanceof Date ? booking.preferred_date.toISOString().slice(0, 10) : String(booking.preferred_date);
    return res.status(200).json({
      token,
      lang: LANGS.includes(body.lang) ? body.lang : 'en',
      variables: {
        first_name: booking.name.trim().split(/\s+/)[0].slice(0, 40),
        call_date: date,
        call_time: booking.preferred_time,
        call_kind: booking.kind === 'market-expert' ? 'a paid session with a market expert' : `a free ${minutes}-minute consultation`,
        experience: booking.experience,
        country: booking.country,
        booking_ref: `MK-${id}`,
      },
    });
  },
});
