/**
 * Sends visitor forms to the database through /api.
 * To also email you or update a CRM, add that to the matching file in /api, on the server,
 * where API keys stay private.
 */
async function post(path, payload) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.ok) return res.json().catch(() => ({}));
  const body = await res.json().catch(() => ({}));
  const error = new Error(body.message ?? 'Submission failed');
  error.fields = body.fields;
  throw error;
}

export const submitLead = (payload) => post('/api/consultations', payload);
export const submitOpinion = (payload) => post('/api/feedback', payload);

/** Asks the server for a voice call with the AI assistant, using the pass returned with a booking. */
export async function startVoiceSession(ticket, lang) {
  const res = await fetch('/api/voice-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticket, lang }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(body.message ?? 'Could not start the call'), { code: body.error });
  return body;
}

/** Saves the answers given to Noor, the scripted voice assistant, onto the booking. */
export async function saveVoiceNotes(ticket, answers, lang) {
  const res = await fetch('/api/voice-notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticket, answers, lang }),
  });
  if (res.ok) return;
  const body = await res.json().catch(() => ({}));
  throw Object.assign(new Error(body.message ?? 'Could not save'), { code: body.error });
}
