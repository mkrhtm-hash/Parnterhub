import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Check, ChevronLeft, ChevronRight, CircleCheck, Clock, FlaskConical, Lock, LoaderCircle, TriangleAlert } from 'lucide-react';
import Button from '../components/ui/Button';
import { isBlank, PageHeader, PlaceholderText, withoutBlanks } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useToast } from '../context/ToastContext';
import { submitLead } from '../services/leads';
import { useSiteData } from '../context/SiteDataContext';
import { testBooking } from '../data/staticContent';
import { expertSessions, findExpertSession } from '../../shared/expertSessions';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const pathMessages = {
  professional: 'I am a professional trader and would like to talk through my set-up.',
  partner: 'I am interested in becoming an introducing partner.',
};

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a, b) => Boolean(a && b) && a.getTime() === b.getTime();
// A local calendar date. toISOString() would shift it to the previous day for visitors east of UTC.
const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const longDate = (d) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

function Calendar({ consultation, selected, onSelect }) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const lastDay = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + consultation.bookingWindowDays);
    return d;
  }, [today, consultation]);
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const cells = useMemo(() => {
    const offset = (view.getDay() + 6) % 7; // Weeks start on Monday.
    const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    return [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1))];
  }, [view]);

  const canGoBack = view > new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoForward = new Date(view.getFullYear(), view.getMonth() + 1, 1) <= lastDay;
  const move = (n) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" aria-label="Previous month" disabled={!canGoBack} onClick={() => move(-1)} className="grid size-11 place-items-center rounded-full border border-line enabled:hover:border-blue/60 disabled:opacity-30">
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <p className="font-display font-semibold" aria-live="polite">{view.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
        <button type="button" aria-label="Next month" disabled={!canGoForward} onClick={() => move(1)} className="grid size-11 place-items-center rounded-full border border-line enabled:hover:border-blue/60 disabled:opacity-30">
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_LABELS.map((d) => (
          <span key={d} className="py-1 text-xs font-medium text-faint">{d}</span>
        ))}
        {cells.map((date, i) => {
          if (!date) return <span key={`blank-${i}`} />;
          const weekend = date.getDay() === 0 || date.getDay() === 6;
          const disabled = weekend || date <= today || date > lastDay;
          const active = sameDay(date, selected);
          return (
            <button
              key={isoDate(date)}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              aria-label={longDate(date)}
              onClick={() => onSelect(date)}
              className={`aspect-square min-h-10 rounded-xl text-sm font-medium transition-colors ${
                active ? 'bg-brand' : disabled ? 'text-faint/45' : 'hover:bg-blue/15'
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Field({ id, label, optional, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label} {optional && <span className="font-normal text-faint">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex gap-1.5 text-sm text-danger">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function validate(form, date, time, expert) {
  const errors = {};
  if (expert && !form.session) errors.session = 'Please choose a session.';
  if (!date) errors.date = 'Please pick a day that suits you.';
  if (date && !time) errors.time = 'Please pick a time on that day.';
  if (form.name.trim().length < 2) errors.name = 'Please tell us your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'That email does not look quite right. Could you check it?';
  if (form.phone.replace(/\D/g, '').length < 7 || !/^[+\d][\d\s()./-]*$/.test(form.phone.trim())) {
    errors.phone = 'Please add a phone number with your country code, for example +44 7700 900000.';
  }
  if (!form.country) errors.country = 'Please choose your country.';
  if (!form.experience) errors.experience = 'Please choose the closest option.';
  if (!form.consent) errors.consent = 'We need your consent before we can contact you.';
  return errors;
}

/** The booking form. expert: the Book with Market Expert tab on Learning, shown without a page header. */
export default function Book({ testMode = false, expert = false }) {
  const siteData = useSiteData().data;
  const { consultation, countries, options } = testMode ? testBooking : siteData;
  const { experienceLevels } = options;
  usePageMeta(expert ? false : testMode ? 'Test Booking Form' : 'Book a Consultation', 'Book a free consultation with MKPips. Pick a time and tell us what you need. We never ask for passwords, payment details or ID documents here.');
  const toast = useToast();
  const [params] = useSearchParams();
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    experience: '',
    message: pathMessages[params.get('path')] ?? '',
    consent: false,
    session: '',
    website: '', // Hidden from people. Bots fill it in, and the server then discards the request.
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const formRef = useRef(null);

  const update = (key) => (e) => {
    const value = key === 'consent' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(({ [key]: _removed, ...rest }) => rest);
  };

  const fieldProps = (key) => ({
    id: key,
    name: key,
    value: form[key],
    onChange: update(key),
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? `${key}-error` : undefined,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form, date, time, expert);
    setErrors(found);
    const firstKey = ['session', 'date', 'time', 'name', 'email', 'phone', 'country', 'experience', 'consent'].find((k) => found[k]);
    if (firstKey) {
      const target = formRef.current.querySelector(`[data-field="${firstKey}"]`) ?? formRef.current.querySelector(`#${firstKey}`);
      target?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      target?.focus?.({ preventScroll: true });
      return;
    }
    setStatus('sending');
    if (testMode) {
      // Nothing leaves the browser in test mode.
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStatus('success');
      toast('Test complete. Nothing was sent or saved.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    try {
      const { session, ...details } = form;
      await submitLead({ ...details, date: isoDate(date), time, ...(expert ? { kind: 'market-expert', session } : {}) });
      setStatus('success');
      toast(`Your request for ${longDate(date)} at ${time} is in.`);
      if (!expert) window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setStatus('idle');
      if (error.fields) {
        setErrors(error.fields);
        toast('Please check the highlighted fields.', 'error');
      } else {
        toast('Sorry, we could not save your request just now. Nothing was lost on your side, so please try again, or message us on WhatsApp.', 'error');
      }
    }
  };

  if (status === 'success' && testMode) {
    return (
      <section className="shell pt-12 md:pt-24">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="glass mx-auto max-w-2xl p-8 text-center md:p-12">
          <FlaskConical className="mx-auto size-14 text-green" aria-hidden="true" />
          <h1 className="mt-6 text-3xl font-semibold md:text-4xl">Test complete</h1>
          <p className="mt-3 leading-relaxed text-muted">
            The form accepted a test request for <strong className="font-semibold text-ink">{longDate(date)}</strong> at{' '}
            <strong className="font-semibold text-ink">{time}</strong>. Nothing was sent or saved, and no call has been booked.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="ghost" onClick={() => setStatus('idle')}>Run another test</Button>
            <Button to="/">Back to home</Button>
          </div>
        </motion.div>
      </section>
    );
  }

  if (status === 'success') {
    return (
      <section className={expert ? '' : 'shell pt-12 md:pt-24'}>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="glass mx-auto max-w-2xl p-8 text-center md:p-12">
          <CircleCheck className="mx-auto size-14 text-blue" aria-hidden="true" />
          <h1 className="mt-6 text-3xl font-semibold md:text-4xl">Thanks, {form.name.trim().split(' ')[0]}.</h1>
          <p className="mt-3 leading-relaxed text-muted">
            You asked for {expert ? `a ${findExpertSession(form.session)?.price} session with a market expert` : `a ${consultation.durationMinutes}-minute call`} on <strong className="font-semibold text-ink">{longDate(date)}</strong> at{' '}
            <strong className="font-semibold text-ink">{time}</strong>.{' '}
            {expert
              ? `We will email ${form.email.trim()} to confirm the slot and how to pay. Your session is booked once payment is received.`
              : `We will confirm by email at ${form.email.trim()}.`}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            {expert ? <Button to="/learning/videos" variant="ghost">Watch our videos</Button> : <Button to="/learning" variant="ghost">Explore learning</Button>}
            <Button to="/">Back to home</Button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <>
      {testMode && <meta name="robots" content="noindex" />}
      {!expert && <PageHeader eyebrow={testMode ? 'Test booking form' : 'Book a consultation'} title="Let's talk it through." intro={`A free ${consultation.durationMinutes}-minute call. No pressure, and no obligation to open an account.`} />}

      {testMode && (
        <div className="shell mb-5">
          <p className="flex gap-3 rounded-2xl border border-dashed border-green/60 bg-green/10 p-4 text-sm leading-relaxed text-ink">
            <FlaskConical className="mt-0.5 size-4 shrink-0 text-green" aria-hidden="true" />
            <span><strong className="font-semibold">Test mode.</strong> This form works without the database. Nothing you enter is sent or saved, and no call is booked.</span>
          </p>
        </div>
      )}

      <form ref={formRef} onSubmit={onSubmit} noValidate className={`${expert ? '' : 'shell '}grid items-start gap-5 lg:grid-cols-[0.9fr_1.1fr]`}>
        {expert && (
          <fieldset data-field="session" tabIndex={-1} className="glass p-5 outline-none md:p-7 lg:col-span-2" aria-describedby={errors.session ? 'session-error' : undefined}>
            <legend className="sr-only">Choose your session</legend>
            <h2 className="mb-1 text-lg font-semibold" aria-hidden="true">Choose your session</h2>
            <p className="mb-4 text-sm text-muted">Prices are per session, in US dollars. You pay after we confirm your slot by email.</p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {expertSessions.map((s) => {
                const chosen = form.session === s.id;
                return (
                  <label key={s.id} className={`relative flex min-h-20 cursor-pointer flex-col items-center justify-center rounded-2xl border p-3 text-center transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue ${chosen ? 'bg-brand border-transparent' : errors.session ? 'border-danger' : 'border-line hover:border-blue/60'}`}>
                    <input type="radio" name="session" value={s.id} checked={chosen} onChange={update('session')} className="sr-only" />
                    <span className="font-display text-2xl font-semibold">{s.price}</span>
                    <span className={`text-xs ${chosen ? '' : 'text-muted'}`}>{isBlank(s.detail) ? 'per session' : withoutBlanks(s.detail)}</span>
                    {chosen && <Check className="absolute top-2 right-2 size-4" aria-hidden="true" />}
                  </label>
                );
              })}
            </div>
            {errors.session && <p id="session-error" className="mt-3 flex gap-1.5 text-sm text-danger"><TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />{errors.session}</p>}
          </fieldset>
        )}
        <div className="glass p-5 md:p-7 lg:sticky lg:top-24">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
            <CalendarDays className="size-5 text-blue" aria-hidden="true" />
            Choose a day
          </h2>
          <div data-field="date" tabIndex={-1} className="outline-none">
            <Calendar
              consultation={consultation}
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setTime('');
                setErrors(({ date: _d, ...rest }) => rest);
              }}
            />
          </div>
          {errors.date && <p className="mt-3 flex gap-1.5 text-sm text-danger"><TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />{errors.date}</p>}

          <AnimatePresence initial={false}>
            {date && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <h2 className="mt-6 mb-1 flex items-center gap-2 text-lg font-semibold">
                  <Clock className="size-5 text-blue" aria-hidden="true" />
                  Choose a time
                </h2>
                {isBlank(consultation.timezoneLabel) ? <div className="mb-3" /> : <p className="mb-3 text-xs text-muted">Times shown in <PlaceholderText text={consultation.timezoneLabel} /></p>}
                <div data-field="time" tabIndex={-1} className="grid grid-cols-3 gap-2 p-0.5 outline-none">
                  {consultation.timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      aria-pressed={time === slot}
                      onClick={() => {
                        setTime(slot);
                        setErrors(({ time: _t, ...rest }) => rest);
                      }}
                      className={`min-h-11 rounded-xl border text-sm font-medium tabular-nums transition-colors ${time === slot ? 'bg-brand border-transparent' : 'border-line hover:border-blue/60'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {errors.time && <p className="mt-3 flex gap-1.5 text-sm text-danger"><TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />{errors.time}</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="glass grid gap-5 p-5 md:p-7">
          <h2 className="text-lg font-semibold">Your details</h2>
          <input type="text" name="website" value={form.website} onChange={update('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Name" error={errors.name}>
              <input {...fieldProps('name')} type="text" autoComplete="name" className="field" />
            </Field>
            <Field id="email" label="Email" error={errors.email}>
              <input {...fieldProps('email')} type="email" autoComplete="email" inputMode="email" className="field" />
            </Field>
            <Field id="phone" label="Phone" error={errors.phone}>
              <input {...fieldProps('phone')} type="tel" autoComplete="tel" placeholder="+44 7700 900000" className="field" />
            </Field>
            <Field id="country" label="Country" error={errors.country}>
              <select {...fieldProps('country')} className="field">
                <option value="">Select your country</option>
                {countries.filter((c) => c.code !== 'OTHER').map((c) => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </Field>
          </div>
          <Field id="experience" label="Experience level" error={errors.experience}>
            <select {...fieldProps('experience')} className="field">
              <option value="">Select the closest option</option>
              {experienceLevels.map((o) => (
                <option key={o.id} value={o.label}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field id="message" label="Message" optional>
            <textarea {...fieldProps('message')} rows={4} placeholder={expert ? 'Which markets or topics would you like to cover? For example gold, major currency pairs or reading an economic calendar.' : 'What would you like to talk about?'} className="field resize-y" />
          </Field>

          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={form.consent}
                onChange={update('consent')}
                aria-invalid={errors.consent ? 'true' : undefined}
                aria-describedby={errors.consent ? 'consent-error' : undefined}
                className="peer sr-only"
              />
              <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue ${form.consent ? 'bg-brand border-transparent' : errors.consent ? 'border-danger' : 'border-faint'}`}>
                {form.consent && <Check className="size-3.5" aria-hidden="true" />}
              </span>
              <span className="text-muted">
                I agree that MKPips may contact me about this request and handle my details as set out in the{' '}
                <Link to="/privacy" className="font-medium text-ink underline underline-offset-2">Privacy Policy</Link>. I understand that CFDs carry a high risk of losing money and that MKPips may receive compensation from partner brokers.
              </span>
            </label>
            {errors.consent && <p id="consent-error" className="mt-2 flex gap-1.5 text-sm text-danger"><TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />{errors.consent}</p>}
          </div>

          <Button type="submit" disabled={status === 'sending'} className="w-full">
            {status === 'sending' ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <CalendarDays className="size-4" aria-hidden="true" />}
            {status === 'sending' ? 'Sending your request' : testMode ? 'Send test request' : expert ? 'Request my expert session' : 'Request my free consultation'}
          </Button>

          <p className="flex gap-2 text-xs leading-relaxed text-faint">
            <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            We never ask for passwords, payment details or ID documents on this site.
          </p>
        </div>
      </form>
    </>
  );
}
