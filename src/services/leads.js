/**
 * Saves a consultation request to the database through /api/consultations.
 * To also email you or update a CRM, add that to api/consultations.js, on the server,
 * where API keys stay private.
 */
export async function submitLead(payload) {
  const res = await fetch('/api/consultations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.ok) return;
  const body = await res.json().catch(() => ({}));
  const error = new Error(body.message ?? 'Lead submission failed');
  error.fields = body.fields;
  throw error;
}
