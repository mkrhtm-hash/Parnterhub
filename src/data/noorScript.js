/**
 * What Noor, the scripted voice assistant, says after a booking. Used when the live AI assistant
 * (ElevenLabs) is not set up. Each line has a recording per language in public/voice/, named
 * noor-<lang>-<id>.mp3. Urdu and Arabic wording is in src/i18n/ur.json and ar.json. If you change a
 * line here, update those translations and record the line again (see README, "AI call assistant").
 */
export const noorScript = [
  { id: 'greet', text: "Hi, I'm Noor, the automated assistant at MKPips. Thanks for booking a call. I have three quick questions so your consultant can prepare. You can answer by speaking, or type if you prefer." },
  { id: 'q1', question: true, label: 'What you want from the call', text: 'First, what would you most like to get from your call?' },
  { id: 'q2', question: true, label: 'Markets of interest', text: 'Which markets interest you? For example currencies, gold or indices.' },
  { id: 'q3', question: true, label: 'Existing trading account', text: 'And do you already have a trading account with a broker?' },
  { id: 'bye', text: "Thank you, that's all I need. Your consultant will see your answers, and someone from MKPips will confirm your call by email. Just a reminder: we don't give investment advice, and CFDs carry a high risk of losing money. Goodbye for now." },
];

// Speech recognition language for each site language.
export const listenLang = { en: 'en-GB', ur: 'ur-PK', ar: 'ar-SA' };
