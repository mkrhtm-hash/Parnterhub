import { useCallback, useEffect, useState } from 'react';
import { LoaderCircle, Lock, LogOut, Mail, Phone, RotateCcw, Star, TriangleAlert } from 'lucide-react';
import Button from '../components/ui/Button';
import { PageHeader } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';

const when = (value) => new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const callDate = (value) => new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { dateStyle: 'medium' });
const topics = { video: 'Videos', ebook: 'eBook', webinar: 'Webinar', general: 'General' };

function SignIn({ onSignedIn }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) return onSignedIn();
      setError(res.status === 401 ? 'That password is not right.' : 'We could not sign you in just now. Please try again.');
    } catch {
      setError('We could not sign you in just now. Please try again.');
    }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} noValidate className="glass mx-auto grid max-w-md gap-4 p-6 md:p-8">
      <div>
        <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium">Password</label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'admin-error' : undefined}
          className="field"
        />
        {error && (
          <p id="admin-error" className="mt-1.5 flex gap-1.5 text-sm text-danger">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
      <Button type="submit" disabled={busy || !password} className="w-full">
        {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
        Sign in
      </Button>
    </form>
  );
}

function Detail({ label, children }) {
  return (
    <div>
      <dt className="text-xs text-faint">{label}</dt>
      <dd className="mt-0.5 break-words text-sm">{children}</dd>
    </div>
  );
}

function BookingCard({ item }) {
  return (
    <article className="glass p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="min-w-0 break-words text-lg font-semibold">{item.name}</h2>
        <span className="rounded-full border border-line px-3 py-1 text-xs font-medium capitalize text-muted">{item.status}</span>
      </div>
      <p className="mt-1 text-sm font-medium text-blue">Call: {callDate(item.preferredDate)} at {item.preferredTime}</p>
      <div className="mt-3 flex flex-wrap gap-x-5">
        <a href={`mailto:${item.email}`} className="inline-flex min-h-11 min-w-0 items-center gap-2 break-all text-sm underline underline-offset-2">
          <Mail className="size-4 shrink-0" aria-hidden="true" />
          {item.email}
        </a>
        <a href={`tel:${item.phone.replace(/[^+\d]/g, '')}`} className="inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-2">
          <Phone className="size-4 shrink-0" aria-hidden="true" />
          {item.phone}
        </a>
      </div>
      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
        <Detail label="Country">{item.country}</Detail>
        <Detail label="Experience">{item.experience}</Detail>
        <Detail label="Received">{when(item.createdAt)}</Detail>
      </dl>
      {item.message && <p className="mt-4 whitespace-pre-wrap break-words border-t border-line pt-4 text-sm leading-relaxed text-muted">{item.message}</p>}
    </article>
  );
}

function OpinionCard({ item }) {
  return (
    <article className="glass p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="min-w-0 break-words text-lg font-semibold">{item.name || 'Anonymous'}</h2>
        <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted">{topics[item.topic]}</span>
      </div>
      <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-muted">
        {when(item.createdAt)}
        {item.rating && (
          <span className="inline-flex items-center gap-1 text-green">
            <Star className="size-3.5 fill-current" aria-hidden="true" />
            {item.rating} out of 5
          </span>
        )}
      </p>
      <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted">{item.message}</p>
    </article>
  );
}

export default function Admin() {
  usePageMeta('Admin');
  const [state, setState] = useState({ status: 'loading' });
  const [tab, setTab] = useState('bookings');

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const res = await fetch('/api/admin', { cache: 'no-store' });
      if (res.status === 401) return setState({ status: 'signedOut' });
      if (!res.ok) return setState({ status: 'error' });
      setState({ status: 'ready', ...(await res.json()) });
    } catch {
      setState({ status: 'error' });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const signOut = async () => {
    await fetch('/api/admin', { method: 'DELETE' }).catch(() => {});
    setState({ status: 'signedOut' });
  };

  const tabs = state.status === 'ready' ? [
    { id: 'bookings', label: 'Bookings', count: state.bookings.length },
    { id: 'opinions', label: 'Opinions', count: state.opinions.length },
  ] : [];
  const rows = state.status === 'ready' ? state[tab] : [];
  const Card = tab === 'bookings' ? BookingCard : OpinionCard;

  return (
    <>
      <meta name="robots" content="noindex" />
      <PageHeader eyebrow="Private" title="Admin" intro="Booking requests and opinions sent through the site, newest first." />
      <section className="shell min-h-[40vh]">
        {state.status === 'loading' && (
          <p role="status" className="flex items-center justify-center gap-2 py-10 text-sm text-muted">
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Loading
          </p>
        )}

        {state.status === 'signedOut' && <SignIn onSignedIn={load} />}

        {state.status === 'error' && (
          <div role="alert" className="glass mx-auto max-w-md p-8 text-center">
            <p className="text-sm text-muted">We could not load this right now.</p>
            <Button variant="ghost" className="mt-5" onClick={load}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Try again
            </Button>
          </div>
        )}

        {state.status === 'ready' && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div role="group" aria-label="Admin sections" className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-[var(--glass)] p-1.5">
                {tabs.map(({ id, label, count }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={tab === id}
                    onClick={() => setTab(id)}
                    className={`min-h-11 rounded-xl px-4 text-sm font-semibold transition-colors ${tab === id ? 'bg-brand text-on-accent' : 'text-muted hover:text-ink'}`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" className="!min-h-11 !py-2" onClick={load}>
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Refresh
                </Button>
                <Button variant="ghost" className="!min-h-11 !py-2" onClick={signOut}>
                  <LogOut className="size-4" aria-hidden="true" />
                  Sign out
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {rows.length === 0 ? (
                <p className="glass p-10 text-center text-sm text-muted">Nothing here yet.</p>
              ) : (
                rows.map((item) => <Card key={item.id} item={item} />)
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}
