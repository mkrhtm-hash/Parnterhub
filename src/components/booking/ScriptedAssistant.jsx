import { useEffect, useRef, useState } from 'react';
import { AudioLines, Check, Mic, PhoneOff, RotateCcw, SkipForward, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import { saveVoiceNotes } from '../../services/leads';
import { listenLang, noorScript } from '../../data/noorScript';
import { useI18n } from '../../i18n/I18nContext';

const Recognition = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

/**
 * Noor, the scripted voice assistant. She plays recorded lines in the site language, listens to each
 * answer with the browser's speech recognition (or the visitor types it), and saves the answers onto
 * the booking for the consultant. Used when the live AI assistant is not set up.
 */
export default function ScriptedAssistant({ ticket }) {
  const { t, lang } = useI18n();
  const [step, setStep] = useState(-1); // -1 not started, index into noorScript, noorScript.length when finished
  const [phase, setPhase] = useState('idle'); // idle | speaking | answering | done | ended
  const [answers, setAnswers] = useState({});
  const [draft, setDraft] = useState('');
  const [listening, setListening] = useState(false);
  const [micBlocked, setMicBlocked] = useState(false);
  const [saveError, setSaveError] = useState('');
  const audio = useRef(null);
  const recognition = useRef(null);
  const heard = useRef('');

  const line = noorScript[step];

  const stopListening = () => {
    recognition.current?.abort();
    recognition.current = null;
    setListening(false);
  };

  const listen = () => {
    if (!Recognition || micBlocked) return;
    stopListening();
    const r = new Recognition();
    r.lang = listenLang[lang] ?? 'en-GB';
    r.continuous = true;
    r.interimResults = true;
    heard.current = '';
    r.onresult = (e) => {
      let final = '';
      let interim = '';
      for (const result of e.results) (result.isFinal ? (final += result[0].transcript) : (interim += result[0].transcript));
      heard.current = final;
      setDraft(`${final}${interim}`.trim());
    };
    r.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'audio-capture') setMicBlocked(true);
    };
    r.onend = () => {
      if (recognition.current === r) {
        recognition.current = null;
        setListening(false);
      }
    };
    recognition.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  // Play the current line, then listen if it is a question.
  useEffect(() => {
    if (!line || phase === 'ended') return undefined;
    stopListening();
    setPhase('speaking');
    const a = new Audio(`/voice/noor-${lang}-${line.id}.mp3`);
    audio.current = a;
    const next = () => {
      if (audio.current !== a) return;
      if (line.question) {
        setPhase('answering');
        setDraft((d) => d || answers[line.id] || '');
        listen();
      } else if (line.id === 'greet') {
        setStep((s) => s + 1);
      } else {
        setPhase('done');
      }
    };
    a.addEventListener('ended', next);
    // If the browser blocks or cannot play the audio, carry on with the text on screen.
    a.play().catch(() => setTimeout(next, 2500));
    return () => {
      a.pause();
      a.removeEventListener('ended', next);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, lang]);

  // Stop everything if the visitor leaves the page.
  useEffect(() => () => {
    audio.current?.pause();
    recognition.current?.abort();
  }, []);

  const save = async (all) => {
    if (!Object.values(all).some(Boolean)) return;
    try {
      await saveVoiceNotes(ticket, all, lang);
    } catch (error) {
      if (error.code !== 'already_saved') setSaveError(t('We could not save your answers just now. Your booking is still saved.'));
    }
  };

  const answer = (skip = false) => {
    stopListening();
    const all = { ...answers, [line.id]: skip ? '' : draft.trim() };
    setAnswers(all);
    setDraft('');
    if (line.id === 'q3') save(all);
    setStep((s) => s + 1);
  };

  const repeat = () => {
    const a = audio.current;
    if (!a) return;
    stopListening();
    setPhase('speaking');
    a.currentTime = 0;
    a.play().catch(() => setPhase('answering'));
  };

  const hangUp = () => {
    audio.current?.pause();
    audio.current = null;
    stopListening();
    if (step > 0 && step < noorScript.length - 1) save(answers);
    setPhase('ended');
  };

  const start = () => {
    setPhase('speaking');
    setStep(0);
    // Ask for the microphone up front, so the browser's prompt does not interrupt Noor.
    navigator.mediaDevices?.getUserMedia?.({ audio: true })
      .then((stream) => stream.getTracks().forEach((track) => track.stop()))
      .catch(() => setMicBlocked(true));
  };

  const live = phase === 'speaking' || phase === 'answering';
  const finished = phase === 'done' || phase === 'ended';
  const canSpeak = Boolean(Recognition) && !micBlocked;

  return (
    <div className="mt-8 rounded-3xl border border-line bg-[var(--glass)] p-6 text-start">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-blue/15 text-blue">
          {live ? <AudioLines className={`size-5 ${phase === 'speaking' ? 'animate-pulse' : ''}`} aria-hidden="true" /> : <Sparkles className="size-5" aria-hidden="true" />}
        </span>
        <div>
          <h2 className="text-lg font-semibold">{t('Talk to Noor, our voice assistant')}</h2>
          <p className="text-sm text-muted" aria-live="polite">
            {phase === 'speaking'
              ? t('Noor is speaking')
              : phase === 'answering'
                ? t(listening ? 'Noor is listening' : canSpeak ? 'Your turn' : 'Type your answer')
                : finished
                  ? t('Call ended. Thanks, your consultant will see your answers.')
                  : t('Three quick questions, so your consultant can prepare. About two minutes.')}
          </p>
        </div>
      </div>

      {phase === 'idle' && (
        <>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            {t('Noor is an automated assistant with a computer-generated voice, not a person, and does not give financial advice. If you answer by speaking, your browser turns your words into text using its own speech service. Your answers are saved with your booking for your consultant.')}
          </p>
          <Button type="button" onClick={start} className="mt-4 w-full sm:w-auto">
            <Mic className="size-4" aria-hidden="true" />
            {t('Start voice call')}
          </Button>
        </>
      )}

      {live && line && (
        <div className="mt-5">
          <p className="rounded-2xl bg-[var(--bg-2)] p-4 leading-relaxed">{t(line.text)}</p>

          {phase === 'answering' && (
            <div className="mt-4">
              <label htmlFor="noor-answer" className="text-sm font-semibold">
                {t(canSpeak ? 'Your answer (speak, or type here)' : 'Your answer')}
              </label>
              <textarea
                id="noor-answer"
                rows={2}
                value={draft}
                onChange={(e) => {
                  stopListening();
                  setDraft(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    answer();
                  }
                }}
                maxLength={1000}
                className="mt-2 w-full rounded-2xl border border-line bg-[var(--bg-2)] p-3 text-ink"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" onClick={() => answer()} disabled={!draft.trim()}>
                  <Check className="size-4" aria-hidden="true" />
                  {t('Next')}
                </Button>
                {canSpeak && !listening && (
                  <Button type="button" variant="ghost" onClick={listen}>
                    <Mic className="size-4" aria-hidden="true" />
                    {t('Speak again')}
                  </Button>
                )}
                <Button type="button" variant="ghost" onClick={repeat}>
                  <RotateCcw className="size-4" aria-hidden="true" />
                  {t('Repeat question')}
                </Button>
                <Button type="button" variant="quiet" onClick={() => answer(true)}>
                  <SkipForward className="size-4" aria-hidden="true" />
                  {t('Skip')}
                </Button>
              </div>
              {micBlocked && Recognition && <p className="mt-2 text-xs text-muted">{t('Your microphone is off, so please type your answer.')}</p>}
            </div>
          )}

          <Button type="button" variant="danger" onClick={hangUp} className="mt-5">
            <PhoneOff className="size-4" aria-hidden="true" />
            {t('End call')}
          </Button>
        </div>
      )}

      {finished && (
        <>
          {phase === 'done' && <p className="mt-5 rounded-2xl bg-[var(--bg-2)] p-4 leading-relaxed">{t(noorScript.at(-1).text)}</p>}
          {saveError && <p role="alert" className="mt-3 text-sm text-[#f87171]">{saveError}</p>}
        </>
      )}
    </div>
  );
}
