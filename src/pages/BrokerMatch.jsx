import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CalendarDays, Check, CircleAlert, Globe, RotateCcw, Search, SearchX } from 'lucide-react';
import Button from '../components/ui/Button';
import { PageHeader, SampleBadge } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useToast } from '../context/ToastContext';
import { findMatches } from '../lib/matchEngine';
import { useSiteData } from '../context/SiteDataContext';

const MAX_PRIORITIES = 3;

const empty = { country: '', experience: '', instruments: [], platform: '', deposit: '', priorities: [] };

const steps = [
  { key: 'country', short: 'Country', title: 'Where do you live?', help: 'Brokers can only accept clients from certain countries, so this comes first.' },
  { key: 'experience', short: 'Experience', title: 'How much trading experience do you have?', help: 'Be honest. This changes what we would suggest you check.' },
  { key: 'instruments', short: 'Instruments', title: 'What do you want to trade?', help: 'Choose all that apply.' },
  { key: 'platform', short: 'Platform', title: 'Which platform do you prefer?', help: 'If you are not sure, MT5 is a common starting point. You can change your mind later.' },
  { key: 'deposit', short: 'Deposit', title: 'What deposit range are you considering?', help: 'Only consider money you can afford to lose.' },
  { key: 'priorities', short: 'Priorities', title: 'What matters most to you?', help: `Choose up to ${MAX_PRIORITIES}.` },
];

function Option({ selected, onClick, title, hint, multi }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-colors ${
        selected ? 'border-emerald bg-emerald/12' : 'border-line bg-[var(--glass)] hover:border-emerald/50'
      }`}
    >
      <span>
        <span className="block font-medium">{title}</span>
        {hint && <span className="mt-0.5 block text-sm text-muted">{hint}</span>}
      </span>
      <span className={`grid size-6 shrink-0 place-items-center border transition-colors ${multi ? 'rounded-md' : 'rounded-full'} ${selected ? 'bg-brand border-transparent' : 'border-line'}`}>
        {selected && <Check className="size-3.5" aria-hidden="true" />}
      </span>
    </button>
  );
}

function CountryStep({ value, onChange }) {
  const { countries } = useSiteData().data;
  const [query, setQuery] = useState('');
  const shown = useMemo(() => countries.filter((c) => c.code === 'OTHER' || c.name.toLowerCase().includes(query.trim().toLowerCase())), [query, countries]);
  return (
    <>
      <div className="relative mb-4">
        <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-faint" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search countries"
          aria-label="Search countries"
          className="field !pl-11"
        />
      </div>
      <div className="grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {shown.map((c) => (
          <Option key={c.code} title={c.name} selected={value === c.code} onClick={() => onChange(c.code)} />
        ))}
      </div>
    </>
  );
}

function StepBody({ stepKey, answers, set, onLimit }) {
  const { experienceLevels, instruments, platforms, depositRanges, priorities } = useSiteData().data.options;
  const toggle = (key, id, limit) => {
    const current = answers[key];
    if (current.includes(id)) set(key, current.filter((x) => x !== id));
    else if (limit && current.length >= limit) onLimit();
    else set(key, [...current, id]);
  };

  switch (stepKey) {
    case 'country':
      return <CountryStep value={answers.country} onChange={(v) => set('country', v)} />;
    case 'experience':
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {experienceLevels.map((o) => (
            <Option key={o.id} title={o.label} hint={o.hint} selected={answers.experience === o.id} onClick={() => set('experience', o.id)} />
          ))}
        </div>
      );
    case 'instruments':
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {instruments.map((o) => (
            <Option key={o.id} multi title={o.label} selected={answers.instruments.includes(o.id)} onClick={() => toggle('instruments', o.id)} />
          ))}
        </div>
      );
    case 'platform':
      return (
        <div className="grid gap-2 sm:grid-cols-3">
          {platforms.map((p) => (
            <Option key={p} title={p} selected={answers.platform === p} onClick={() => set('platform', p)} />
          ))}
        </div>
      );
    case 'deposit':
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {depositRanges.map((o) => (
            <Option key={o.id} title={o.label} selected={answers.deposit === o.id} onClick={() => set('deposit', o.id)} />
          ))}
        </div>
      );
    default:
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {priorities.map((o) => (
            <Option key={o.id} multi title={o.label} hint={o.hint} selected={answers.priorities.includes(o.id)} onClick={() => toggle('priorities', o.id, MAX_PRIORITIES)} />
          ))}
        </div>
      );
  }
}

function NoResults({ icon: Icon, title, text, onRestart }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass mx-auto max-w-2xl p-8 text-center md:p-12">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gold/12 text-gold">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-6 text-2xl font-semibold md:text-3xl">{title}</h2>
      <p className="mt-3 leading-relaxed text-muted">{text}</p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Button to="/book">
          <CalendarDays className="size-4" aria-hidden="true" />
          Talk to us
        </Button>
        <Button variant="ghost" onClick={onRestart}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Change my answers
        </Button>
      </div>
    </motion.div>
  );
}

function Results({ answers, onRestart }) {
  const { data } = useSiteData();
  const { countries, regulators } = data;
  const { status, results } = useMemo(() => findMatches(answers, data), [answers, data]);
  const country = countries.find((c) => c.code === answers.country);

  if (status === 'no-country') {
    return (
      <NoResults
        icon={Globe}
        title={answers.country === 'OTHER' ? 'We need to know a little more' : `No match in ${country.name} for now`}
        text="We do not have a partner broker available in your country at the moment. Local rules decide who can serve you, so we would rather say so than point you to a firm that should not be taking your account. You are welcome to contact us, and the regulation guide can help you check any firm yourself."
        onRestart={onRestart}
      />
    );
  }

  if (status === 'no-fit') {
    return (
      <NoResults
        icon={SearchX}
        title="No broker fits all of that yet"
        text="We have partners in your country, but none match that deposit range and instrument mix. Try changing those answers, or book a call and we can talk through your options."
        onRestart={onRestart}
      />
    );
  }

  const compareLink = `/partners?compare=${results.map((r) => r.broker.id).join(',')}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold md:text-3xl">
            {results.length === 1 ? 'Your top match' : `Your top ${results.length} matches`}
          </h2>
          <p className="mt-1 text-sm text-muted">Based only on your answers and the listed broker details.</p>
        </div>
        <SampleBadge />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {results.map(({ broker, rank, fit, why, checks }, i) => (
          <motion.article
            key={broker.id}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            className="glass flex flex-col p-6"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-brand font-display text-sm font-semibold">Match {rank}</span>
              <span className="rounded-full bg-emerald/12 px-2.5 py-1 text-xs font-medium text-emerald">{fit}</span>
            </div>
            <h3 className="mt-3 text-xl font-semibold">{broker.name}</h3>
            <p className="mt-1 text-sm text-muted">
              {broker.licences.map((l) => regulators[l.regulator].code).join(' · ')} · from ${broker.minDeposit.toLocaleString('en-US')}
            </p>

            <h4 className="mt-5 text-sm font-semibold">Why this fits you</h4>
            <ul className="mt-2 grid gap-2 text-sm leading-relaxed text-muted">
              {why.map((reason) => (
                <li key={reason} className="flex gap-2">
                  <Check className="mt-1 size-3.5 shrink-0 text-emerald" aria-hidden="true" />
                  {reason}
                </li>
              ))}
            </ul>

            {checks.length > 0 && (
              <>
                <h4 className="mt-5 text-sm font-semibold">Worth checking</h4>
                <ul className="mt-2 grid gap-2 text-sm leading-relaxed text-muted">
                  {checks.map((check) => (
                    <li key={check} className="flex gap-2">
                      <CircleAlert className="mt-1 size-3.5 shrink-0 text-gold" aria-hidden="true" />
                      {check}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </motion.article>
        ))}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-faint">
        This is an illustration using fictional sample brokers. It is general information, not investment advice or a personal recommendation. Check any licence on the regulator's own register before opening an account.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button to="/book">
          <CalendarDays className="size-4" aria-hidden="true" />
          Talk through these results
        </Button>
        {results.length > 1 && <Button to={compareLink} variant="ghost">Compare side by side</Button>}
        <Button variant="quiet" onClick={onRestart}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Start again
        </Button>
      </div>
    </div>
  );
}

export default function BrokerMatch() {
  usePageMeta('Broker Match', 'Answer six questions to see up to three sample broker matches, each with a plain explanation of why it fits and what to check.');
  const toast = useToast();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState(empty);
  const [done, setDone] = useState(false);
  const [direction, setDirection] = useState(1);
  const topRef = useRef(null);
  const headingRef = useRef(null);
  const firstRender = useRef(true);

  const step = steps[stepIndex];
  const value = answers[step.key];
  const complete = Array.isArray(value) ? value.length > 0 : Boolean(value);
  const last = stepIndex === steps.length - 1;
  const progress = done ? 100 : ((stepIndex + 1) / steps.length) * 100;

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    topRef.current?.scrollIntoView({ block: 'start' });
    headingRef.current?.focus({ preventScroll: true });
  }, [stepIndex, done]);

  const set = (key, v) => setAnswers((a) => ({ ...a, [key]: v }));

  const next = () => {
    if (last) setDone(true);
    else {
      setDirection(1);
      setStepIndex((i) => i + 1);
    }
  };

  const back = () => {
    setDirection(-1);
    setStepIndex((i) => i - 1);
  };

  const restart = () => {
    setAnswers(empty);
    setStepIndex(0);
    setDone(false);
  };

  return (
    <>
      <PageHeader
        eyebrow="Broker match"
        title="Find a broker that fits how you actually trade."
        intro="Six quick questions. You get up to three matches, with reasons and things to check. No sign-up needed."
      />

      <section ref={topRef} className="shell scroll-mt-20 md:scroll-mt-24">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">{done ? 'Your results' : `Step ${stepIndex + 1} of ${steps.length}: ${step.short}`}</span>
            <span className="text-faint tabular-nums">{Math.round(progress)}%</span>
          </div>
          <div role="progressbar" aria-label="Questionnaire progress" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded-full bg-line">
            <motion.div className="bg-brand h-full rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.45, ease: 'easeOut' }} />
          </div>
        </div>

        {done ? (
          <div ref={headingRef} tabIndex={-1} className="outline-none">
            <Results answers={answers} onRestart={restart} />
          </div>
        ) : (
          <div className="glass overflow-hidden p-5 md:p-9">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={step.key}
                custom={direction}
                initial={{ opacity: 0, x: direction * 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -28 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold outline-none md:text-3xl">{step.title}</h2>
                <p className="mt-2 mb-6 text-sm text-muted md:text-base">{step.help}</p>
                <StepBody
                  stepKey={step.key}
                  answers={answers}
                  set={set}
                  onLimit={() => toast(`You can choose up to ${MAX_PRIORITIES} priorities. Remove one to pick another.`, 'info')}
                />
              </motion.div>
            </AnimatePresence>

            <div className="mt-7 flex items-center justify-between gap-3 border-t border-line pt-5">
              <Button variant="quiet" onClick={back} disabled={stepIndex === 0} className="!px-3">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back
              </Button>
              <Button onClick={next} disabled={!complete}>
                {last ? 'See my matches' : 'Continue'}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {!done && (
          <p className="mt-4 text-center text-xs text-faint">
            Your answers stay in your browser. See our <Link to="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
          </p>
        )}
      </section>
    </>
  );
}
