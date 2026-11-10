/**
 * Wording that ships with the site rather than coming from the database, so it
 * still appears while data loads and if the database cannot be reached.
 * Everything else lives in Neon. See db/seed.sql and the README.
 */

export const fallbackCompliance = {
  riskWarning:
    'CFDs are complex instruments and carry a high risk of losing money rapidly due to leverage. Only trade with money you can afford to lose.',
  compensationDisclosure:
    'MKPips may receive compensation from partner brokers. Ask us about any arrangement that applies to a broker we discuss with you.',
  notAdvice:
    'Content on this site is general information, not investment advice. It does not take your personal circumstances into account.',
};

export const weDo = [
  'Explain your broker options in plain English',
  'Check licences and country availability',
  'Compare spreads, commissions and platforms',
  'Support you through account opening',
  'Help escalate issues with your broker',
];

export const weDont = ['Manage funds', 'Hold client money', 'Give trading signals', 'Promise returns'];

/**
 * The paid one-to-one session on the Learning page (Book with Market Expert tab).
 * Set pricePerSession to the price as it should appear, for example 'USD 50'.
 * While it is in square brackets the page shows "Price per session confirmed by email" instead.
 */
export const expertSession = {
  pricePerSession: '[Price per session]',
};

/** Sample options for the test booking form at /book/test, which works without the database. */
export const testBooking = {
  consultation: {
    timeSlots: ['09:00', '10:30', '13:00', '14:30', '16:00'],
    timezoneLabel: 'your local time (test)',
    durationMinutes: 30,
    bookingWindowDays: 45,
  },
  countries: [
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'AU', name: 'Australia' },
    { code: 'AE', name: 'United Arab Emirates' },
  ],
  options: {
    experienceLevels: [
      { id: 'new', label: 'New to trading' },
      { id: 'some', label: 'Some experience' },
      { id: 'experienced', label: 'Experienced' },
      { id: 'professional', label: 'Professional' },
    ],
  },
};
