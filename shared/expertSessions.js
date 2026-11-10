/**
 * Paid one-to-one sessions on the Learning page (Book with Market Expert tab).
 * Used by the website and by api/consultations.js, so a price can only be booked if it is listed here.
 *
 * id:     saved with the booking. Keep it unchanged once bookings exist.
 * price:  shown to visitors and on the admin page.
 * detail: optional line under the price, for example '30 minutes'. Leave it in square brackets to hide it.
 */
export const expertSessions = [
  { id: 'usd-24', price: '$24', detail: '[What this session includes]' },
  { id: 'usd-46', price: '$46', detail: '[What this session includes]' },
  { id: 'usd-74', price: '$74', detail: '[What this session includes]' },
  { id: 'usd-94', price: '$94', detail: '[What this session includes]' },
];

export const findExpertSession = (id) => expertSessions.find((s) => s.id === id);
