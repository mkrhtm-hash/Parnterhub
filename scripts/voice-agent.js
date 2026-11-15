/**
 * Creates or updates "Noor", the MKPips AI booking assistant, as an ElevenLabs agent.
 *   node --env-file=.env scripts/voice-agent.js
 * Needs ELEVENLABS_API_KEY in .env. The first run creates the agent and adds ELEVENLABS_AGENT_ID to .env;
 * later runs update the same agent, so edit the wording here and run it again.
 * Optional: ELEVENLABS_VOICE_ID to use a different voice from your ElevenLabs Voice Library.
 */
import { appendFileSync } from 'node:fs';

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error('Add ELEVENLABS_API_KEY=... to .env first (ElevenLabs > Developers > API keys).');
  process.exit(1);
}
// "Sarah", a warm female voice from ElevenLabs' standard library.
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

const PROMPT = `You are Noor, the AI booking assistant for MKPips, an independent introducer that helps people compare regulated FX and CFD brokers. You are speaking by voice with someone who has just booked a call on the MKPips website.

Their booking: {{call_kind}} on {{call_date}} at {{call_time}}, reference {{booking_ref}}. Their name is {{first_name}}, they are in {{country}}, and they described their trading experience as "{{experience}}".

Your job, in this order:
1. Confirm the booking details back to them and check they are right. If something is wrong, tell them to reply to the confirmation email or message MKPips on WhatsApp, because you cannot change bookings.
2. Ask two or three short questions so the consultant is ready for the call: what they hope to get from the call, which markets interest them (for example currencies, gold or indices), and whether they already have a trading account. Ask one question at a time.
3. Explain what happens next: a person from MKPips will confirm by email and then hold the call at the booked time.
4. Answer simple questions about how MKPips works: it compares regulated brokers, may receive compensation from partner brokers, and offers free learning videos and eBooks on the website.

Rules you must always follow:
- Say you are an AI assistant if asked, and never claim to be a person.
- Never give investment, financial, tax or legal advice. Never tell anyone to buy, sell or trade anything, which broker to choose, how much to deposit or what leverage to use. Say the consultant can talk them through factual comparisons, and that the decision is theirs.
- Never predict prices or markets, and never say anything is guaranteed, risk-free, safe or the best. If trading comes up, mention that CFDs are complex and carry a high risk of losing money rapidly because of leverage.
- Never ask for or accept passwords, card numbers, bank details, account logins or ID documents. If someone starts to share them, stop them politely.
- Do not invent facts about MKPips, its partners, fees or results. If you do not know, say the consultant will confirm on the call.
- Keep each reply short and conversational, one or two sentences, warm and calm. This is a voice call, so do not use lists, symbols or links.
- Speak the same language as the person. If they switch between English, Urdu or Arabic, follow them if you can.
- If they want to end the call, thank them and say goodbye. Keep the whole call under ten minutes.`;

const agent = {
  name: 'MKPips booking assistant (Noor)',
  tags: ['mkpips', 'booking'],
  conversation_config: {
    agent: {
      first_message: "Hi {{first_name}}, I'm Noor, MKPips' AI assistant. Thanks for booking a call. Do you have a couple of minutes so I can confirm the details and pass a few notes to your consultant?",
      language: 'en',
      dynamic_variables: {
        dynamic_variable_placeholders: {
          first_name: 'there', call_kind: 'a free consultation', call_date: 'the booked day', call_time: 'the booked time',
          booking_ref: 'MK-0', country: 'not given', experience: 'not given',
        },
      },
      prompt: { prompt: PROMPT, temperature: 0.4 },
    },
    tts: { voice_id: VOICE_ID },
    conversation: { max_duration_seconds: 600 },
  },
  platform_settings: {
    // Only the MKPips server can start calls, with a token that needs the API key.
    auth: { enable_auth: true },
    // The site sets the language (English, Urdu or Arabic) and the greeting in that language.
    overrides: { conversation_config_override: { agent: { language: true, first_message: true } } },
  },
};

const api = async (method, path, body) => {
  const res = await fetch(`https://api.elevenlabs.io${path}`, {
    method,
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
    body: body && JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status} ${text.slice(0, 800)}`);
  return text ? JSON.parse(text) : {};
};

const existing = process.env.ELEVENLABS_AGENT_ID;
if (existing) {
  await api('PATCH', `/v1/convai/agents/${existing}`, agent);
  console.log(`Updated agent ${existing}.`);
} else {
  const { agent_id: id } = await api('POST', '/v1/convai/agents/create', agent);
  appendFileSync('.env', `\nELEVENLABS_AGENT_ID=${id}\n`);
  console.log(`Created agent ${id} and added ELEVENLABS_AGENT_ID to .env.`);
  console.log('Add ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID in Vercel too (Settings > Environment Variables), then redeploy.');
}
