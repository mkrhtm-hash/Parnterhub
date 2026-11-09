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
  if (res.ok) return;
  const body = await res.json().catch(() => ({}));
  const error = new Error(body.message ?? 'Submission failed');
  error.fields = body.fields;
  throw error;
}

export const submitLead = (payload) => post('/api/consultations', payload);
export const submitOpinion = (payload) => post('/api/feedback', payload);
