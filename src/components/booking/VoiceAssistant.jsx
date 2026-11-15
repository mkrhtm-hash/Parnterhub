import { useEffect, useRef, useState } from 'react';
import { AudioLines, LoaderCircle, Mic, MicOff, PhoneOff, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import { startVoiceSession } from '../../services/leads';
import { useI18n } from '../../i18n/I18nContext';

/**
 * Optional voice call with Noor, the MKPips AI assistant, shown after a booking.
 * The call runs in the browser through ElevenLabs. The server checks the booking pass and hands out a
 * one-off token, so the ElevenLabs key never reaches the page. Shown only once the assistant is set up.
 */
export default function VoiceAssistant({ ticket, firstName }) {
  const { t, lang } = useI18n();
  const [available, setAvailable] = useState(false);
  const [state, setState] = useState('idle'); // idle | connecting | live | ended | error
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState('');
  const conversation = useRef(null);

  useEffect(() => {
    if (!ticket) return undefined;
    let active = true;
    fetch('/api/voice-session')
      .then((res) => (res.ok ? res.json() : {}))
      .then((body) => active && setAvailable(Boolean(body.available)))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [ticket]);

  // Hang up if the visitor leaves the page mid-call.
  useEffect(() => () => conversation.current?.endSession(), []);

  if (!ticket || !available) return null;

  const start = async () => {
    setState('connecting');
    setError('');
    try {
      // Ask for the microphone first, so a refusal gives a clear message.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      const [{ Conversation }, session] = await Promise.all([import('@elevenlabs/client'), startVoiceSession(ticket, lang)]);
      conversation.current = await Conversation.startSession({
        conversationToken: session.token,
        connectionType: 'webrtc',
        dynamicVariables: session.variables,
        overrides: {
          agent: {
            language: session.lang,
            firstMessage: t("Hi {name}, I'm Noor, MKPips' AI assistant. Thanks for booking a call. Do you have a couple of minutes so I can confirm the details and pass a few notes to your consultant?", { name: firstName }),
          },
        },
        onConnect: () => setState('live'),
        onModeChange: ({ mode }) => setSpeaking(mode === 'speaking'),
        onDisconnect: () => {
          conversation.current = null;
          setSpeaking(false);
          setState((now) => (now === 'error' ? now : 'ended'));
        },
        onError: () => {
          setError(t('The call dropped. Your booking is still saved.'));
          setState('error');
        },
      });
    } catch (err) {
      conversation.current = null;
      setError(
        err?.name === 'NotAllowedError' || err?.name === 'NotFoundError'
          ? t('We need your microphone for the call. Allow it in your browser, then try again.')
          : t(err?.message && err.code ? err.message : 'The assistant is not available right now. Your booking is still saved.'),
      );
      setState('error');
    }
  };

  const hangUp = () => conversation.current?.endSession();
  const toggleMute = () => {
    conversation.current?.setMicMuted(!muted);
    setMuted(!muted);
  };

  return (
    <div className="mt-8 rounded-3xl border border-line bg-[var(--glass)] p-6 text-start">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-blue/15 text-blue">
          {state === 'live' ? <AudioLines className={`size-5 ${speaking ? 'animate-pulse' : ''}`} aria-hidden="true" /> : <Sparkles className="size-5" aria-hidden="true" />}
        </span>
        <div>
          <h2 className="text-lg font-semibold">{t('Talk to Noor, our AI assistant')}</h2>
          <p className="text-sm text-muted" aria-live="polite">
            {state === 'live'
              ? t(speaking ? 'Noor is speaking' : 'Noor is listening')
              : state === 'connecting'
                ? t('Connecting')
                : state === 'ended'
                  ? t('Call ended. Thanks, your consultant will see the notes.')
                  : t('A short voice call to confirm your booking and prepare for your consultation.')}
          </p>
        </div>
      </div>

      {(state === 'idle' || state === 'error' || state === 'ended') && (
        <>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            {t('Noor is an AI, not a person, and does not give financial advice. The call runs through our voice provider, ElevenLabs, and a transcript is kept so your consultant can prepare. Your browser will ask to use your microphone.')}
          </p>
          {error && <p role="alert" className="mt-3 text-sm text-[var(--red,#f87171)]">{error}</p>}
          <Button type="button" onClick={start} className="mt-4 w-full sm:w-auto">
            <Mic className="size-4" aria-hidden="true" />
            {t(state === 'idle' ? 'Start voice call' : 'Call again')}
          </Button>
        </>
      )}

      {state === 'connecting' && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted">
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          {t('Connecting')}
        </div>
      )}

      {state === 'live' && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="ghost" onClick={toggleMute} aria-pressed={muted}>
            {muted ? <MicOff className="size-4" aria-hidden="true" /> : <Mic className="size-4" aria-hidden="true" />}
            {t(muted ? 'Unmute' : 'Mute')}
          </Button>
          <Button type="button" variant="danger" onClick={hangUp}>
            <PhoneOff className="size-4" aria-hidden="true" />
            {t('End call')}
          </Button>
        </div>
      )}
    </div>
  );
}
