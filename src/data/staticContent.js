/**
 * Wording that ships with the site rather than coming from the database, so it
 * still appears while data loads and if the database cannot be reached.
 * Everything else lives in Neon. See db/seed.sql and the README.
 */

export const fallbackCompliance = {
  riskWarning:
    'CFDs are complex instruments and carry a high risk of losing money rapidly due to leverage. Only trade with money you can afford to lose.',
  compensationDisclosure:
    'Partnerhub may receive compensation from partner brokers. Ask us about any arrangement that applies to a broker we discuss with you.',
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
