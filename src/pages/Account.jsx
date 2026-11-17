import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, KeyRound, LoaderCircle, LogIn, LogOut, Plus, RotateCcw, TriangleAlert, UserPlus } from 'lucide-react';
import Button from '../components/ui/Button';
import { PageHeader } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSiteData } from '../context/SiteDataContext';
import { useI18n } from '../i18n/I18nContext';
import { journeys as serviceList } from '../../shared/journeys';
import Roadmap, { JourneySummary } from '../components/journey/Roadmap';

async function call(method, body) {
  const res = await fetch('/api/account', {
    method,
    cache: 'no-store',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || 'We could not do that just now. Please try again.'), { status: res.status, field: data.field });
  return data;
}

function Field({ id, label, error, hint, children }) {
  const { t } = useI18n();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{t(label)}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{t(hint)}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex gap-1.5 text-sm text-danger">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {t(error)}
        </p>
      )}
    </div>
  );
}

function ServicePicker({ value, onChange, error }) {
  const { t } = useI18n();
  const toggle = (id) => onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium">{t('Services you would like')}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {serviceList.map((s) => {
          const on = value.includes(s.id);
          return (
            <label
              key={s.id}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border p-3 text-sm transition ${on ? 'border-blue bg-blue/10' : 'border-line bg-[var(--glass)]'}`}
            >
              <input type="checkbox" checked={on} onChange={() => toggle(s.id)} className="size-4 accent-[var(--blue)]" />
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: s.color }} aria-hidden="true" />
              <span className="font-medium">{t(s.title)}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <p className="mt-1.5 flex gap-1.5 text-sm text-danger">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {t(error)}
        </p>
      )}
    </fieldset>
  );
}

function SignUp({ onDone }) {
  const { t } = useI18n();
  const { raw } = useSiteData();
  const [params] = useSearchParams();
  const preset = serviceList.some((s) => s.id === params.get('service')) ? [params.get('service')] : [];
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', password: '', services: preset, consent: false });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: key === 'consent' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const found = {};
    if (form.name.trim().length < 2) found.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) found.email = 'Please enter a valid email address.';
    if (form.password.length < 8) found.password = 'Please use at least 8 characters.';
    if (!form.services.length) found.services = 'Please choose at least one service.';
    if (!form.consent) found.consent = 'Please agree to the Privacy Policy to continue.';
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      onDone(await call('POST', { action: 'signup', ...form }));
    } catch (err) {
      setErrors({ [err.field || 'form']: err.message });
      setBusy(false);
    }
  };

  const props = (key) => ({
    id: `su-${key}`,
    value: form[key],
    onChange: update(key),
    className: 'field',
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? `su-${key}-error` : undefined,
  });

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="su-name" label="Name" error={errors.name}><input {...props('name')} type="text" autoComplete="name" /></Field>
        <Field id="su-email" label="Email" error={errors.email}><input {...props('email')} type="email" autoComplete="email" inputMode="email" /></Field>
        <Field id="su-phone" label="Phone (optional)"><input {...props('phone')} type="tel" autoComplete="tel" placeholder="+44 7700 900000" /></Field>
        <Field id="su-country" label="Country">
          <select {...props('country')}>
            <option value="">{t('Select your country')}</option>
            {(raw?.countries ?? []).filter((c) => c.code !== 'OTHER').map((c) => (
              <option key={c.code} value={c.name}>{t(c.name)}</option>
            ))}
            <option value="Other">{t('Other')}</option>
          </select>
        </Field>
      </div>
      <Field id="su-password" label="Password" error={errors.password} hint="At least 8 characters.">
        <input {...props('password')} type="password" autoComplete="new-password" />
      </Field>
      <ServicePicker value={form.services} onChange={(services) => setForm((f) => ({ ...f, services }))} error={errors.services} />
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input type="checkbox" checked={form.consent} onChange={update('consent')} className="mt-1 size-4 shrink-0 accent-[var(--blue)]" />
          <span>
            {t('I agree that MKPips keeps my details and my roadmap to provide the services I chose, as set out in the')}{' '}
            <Link to="/privacy" className="underline underline-offset-2">{t('Privacy Policy')}</Link>.
          </span>
        </label>
        {errors.consent && <p className="mt-1.5 text-sm text-danger">{t(errors.consent)}</p>}
      </div>
      {errors.form && <p role="alert" className="text-sm text-danger">{t(errors.form)}</p>}
      <Button type="submit" disabled={busy} className="w-full sm:w-auto">
        {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <UserPlus className="size-4" aria-hidden="true" />}
        {t('Create my account')}
      </Button>
    </form>
  );
}

function SignIn({ onDone }) {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      onDone(await call('POST', { action: 'signin', email, password }));
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <Field id="si-email" label="Email"><input id="si-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" /></Field>
      <Field id="si-password" label="Password" hint="Forgotten it? Message us on WhatsApp and we will set a new one for you.">
        <input id="si-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" />
      </Field>
      {error && <p role="alert" className="text-sm text-danger">{t(error)}</p>}
      <Button type="submit" disabled={busy || !email || !password} className="w-full sm:w-auto">
        {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <LogIn className="size-4" aria-hidden="true" />}
        {t('Sign in')}
      </Button>
    </form>
  );
}

function ChangePassword() {
  const { t } = useI18n();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [msg, setMsg] = useState(null);
  const submit = async (e) => {
    e.preventDefault();
    try {
      await call('POST', { action: 'password', password: current, newPassword: next });
      setMsg({ ok: true, text: 'Your password has been changed.' });
      setCurrent('');
      setNext('');
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    }
  };
  return (
    <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <Field id="cp-current" label="Current password"><input id="cp-current" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className="field" /></Field>
      <Field id="cp-next" label="New password"><input id="cp-next" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className="field" /></Field>
      <Button type="submit" variant="ghost" disabled={!current || next.length < 8}>
        <KeyRound className="size-4" aria-hidden="true" />
        {t('Change')}
      </Button>
      {msg && <p role="status" className={`text-sm sm:col-span-3 ${msg.ok ? 'text-green' : 'text-danger'}`}>{t(msg.text)}</p>}
    </form>
  );
}

function MyJourney({ data, onChange, onSignOut }) {
  const { t } = useI18n();
  const [adding, setAdding] = useState('');
  const joined = new Set(data.journeys.map((j) => j.service));
  const more = serviceList.filter((s) => !joined.has(s.id));

  const add = async (service) => {
    setAdding(service);
    try {
      onChange(await call('POST', { action: 'add-service', service }));
    } finally {
      setAdding('');
    }
  };

  return (
    <>
      <JourneySummary journeys={data.journeys} />
      <div className="mt-10">
        <Roadmap journeys={data.journeys} />
      </div>

      {more.length > 0 && (
        <div className="glass mx-auto mt-12 max-w-3xl p-5 md:p-6">
          <h2 className="text-lg font-semibold">{t('Add another service')}</h2>
          <p className="mt-1 text-sm text-muted">{t('Its stops join your trail in date order.')}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {more.map((s) => (
              <Button key={s.id} variant="ghost" disabled={Boolean(adding)} onClick={() => add(s.id)} className="!min-h-11 !py-2">
                {adding === s.id ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
                <span className="size-2 rounded-full" style={{ background: s.color }} aria-hidden="true" />
                {t(s.title)}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="glass mx-auto mt-6 max-w-3xl p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">{data.client.name}</h2>
            <p className="break-all text-sm text-muted">{data.client.email}</p>
          </div>
          <Button variant="ghost" onClick={onSignOut} className="!min-h-11 !py-2">
            <LogOut className="size-4" aria-hidden="true" />
            {t('Sign out')}
          </Button>
        </div>
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-medium text-blue">{t('Change my password')}</summary>
          <ChangePassword />
        </details>
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-muted">
        {t('MKPips does not give investment advice. Every decision about brokers and trading is yours. CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage.')}
      </p>
    </>
  );
}

export default function Account() {
  const { t } = useI18n();
  usePageMeta('My Journey', 'Sign in to see your roadmap with MKPips, stop by stop.');
  const [state, setState] = useState({ status: 'loading' });
  const [mode, setMode] = useState('signup');

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      setState({ status: 'ready', data: await call('GET') });
    } catch (err) {
      setState({ status: err.status === 401 ? 'signedOut' : 'error' });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const signOut = async () => {
    await call('DELETE').catch(() => {});
    setMode('signin');
    setState({ status: 'signedOut' });
  };
  const ready = (data) => {
    window.scrollTo({ top: 0 });
    setState({ status: 'ready', data });
  };

  const signedIn = state.status === 'ready';
  return (
    <>
      <PageHeader
        eyebrow={signedIn ? 'My Journey' : 'Client account'}
        title={signedIn ? 'Your journey with MKPips' : 'Follow your journey with MKPips'}
        intro={signedIn
          ? 'Every step of the services you chose, in order. We tick each stop as it is done.'
          : 'Create an account to see your roadmap for each service you choose, from the first call to the last check-in.'}
      />
      <section className="shell min-h-[40vh] pb-16">
        {state.status === 'loading' && (
          <p role="status" className="flex items-center justify-center gap-2 py-10 text-sm text-muted">
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            {t('Loading')}
          </p>
        )}

        {state.status === 'error' && (
          <div role="alert" className="glass mx-auto max-w-md p-8 text-center">
            <p className="text-sm text-muted">{t('We could not load this right now.')}</p>
            <Button variant="ghost" className="mt-5" onClick={load}>
              <RotateCcw className="size-4" aria-hidden="true" />
              {t('Try again')}
            </Button>
          </div>
        )}

        {state.status === 'signedOut' && (
          <div className="glass mx-auto max-w-2xl p-5 md:p-8">
            <div role="group" aria-label={t('Account')} className="mb-6 grid grid-cols-2 gap-1 rounded-2xl border border-line bg-[var(--glass)] p-1.5">
              {[['signup', 'Create account'], ['signin', 'Sign in']].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={mode === id}
                  onClick={() => setMode(id)}
                  className={`min-h-11 rounded-xl px-4 text-sm font-semibold transition-colors ${mode === id ? 'bg-brand text-on-accent' : 'text-muted hover:text-ink'}`}
                >
                  {t(label)}
                </button>
              ))}
            </div>
            {mode === 'signup' ? <SignUp onDone={ready} /> : <SignIn onDone={ready} />}
            <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-muted">
              <Check className="mt-0.5 size-3.5 shrink-0 text-green" aria-hidden="true" />
              {t('We never ask for trading passwords, card details or ID documents here.')}
            </p>
          </div>
        )}

        {signedIn && <MyJourney data={state.data} onChange={(data) => setState({ status: 'ready', data })} onSignOut={signOut} />}
      </section>
    </>
  );
}
