import { useState } from 'react';
import { ChevronDown, KeyRound, LoaderCircle, Mail, Phone, Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Roadmap, { JourneySummary, flatten } from './Roadmap';
import { findJourney, journeys as serviceList } from '../../../shared/journeys';

const when = (value) => (value ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Never');

async function patch(body) {
  const res = await fetch('/api/admin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'That change did not save. Please try again.');
  return data;
}

/** A button that asks "Sure?" on the first click and acts on the second. */
function ConfirmButton({ onConfirm, children, label }) {
  const [armed, setArmed] = useState(false);
  return (
    <Button
      variant={armed ? 'danger' : 'ghost'}
      className="!min-h-10 !py-1.5"
      onClick={() => (armed ? onConfirm() : setArmed(true))}
      onBlur={() => setArmed(false)}
    >
      {children}
      {armed ? `Click again to ${label}` : label}
    </Button>
  );
}

function StopRow({ stop, onSaved, onError }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(stop.note);
  const save = async (changes) => {
    setBusy(true);
    try {
      onSaved((await patch({ op: 'stop', id: stop.id, ...changes })).stop);
    } catch (err) {
      onError(err.message);
    }
    setBusy(false);
  };
  return (
    <li className="grid gap-2 border-t border-line py-3 sm:grid-cols-[auto_1fr_auto] sm:items-start">
      <label className="flex min-h-10 cursor-pointer items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={Boolean(stop.doneAt)} disabled={busy} onChange={(e) => save({ done: e.target.checked })} className="size-5 accent-[var(--blue)]" />
        <span className="w-14 text-xs text-muted">Stop {stop.number}</span>
      </label>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{stop.title}</p>
        <textarea
          aria-label={`Note for stop ${stop.number}`}
          value={note}
          rows={1}
          maxLength={500}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => note.trim() !== stop.note && save({ note })}
          className="field mt-1 !min-h-0 resize-y !py-1.5 text-xs"
        />
        {stop.doneAt && <p className="mt-1 text-xs text-green">Done {when(stop.doneAt)}</p>}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          aria-label={`Date for stop ${stop.number}`}
          value={stop.dueOn ?? ''}
          disabled={busy}
          onChange={(e) => save({ dueOn: e.target.value || null })}
          className="field !min-h-10 !py-1.5 text-sm"
        />
        {busy && <LoaderCircle className="size-4 animate-spin text-muted" aria-label="Saving" />}
      </div>
    </li>
  );
}

function ClientCard({ client, onUpdate, onDeleted }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [adding, setAdding] = useState('');
  const { stops } = flatten(client.journeys);
  const done = stops.filter((s) => s.doneAt).length;
  const numbered = Object.fromEntries(stops.map((s) => [s.id, s.number]));
  const joined = new Set(client.journeys.map((j) => j.service));

  const run = async (body, apply) => {
    setError('');
    try {
      apply(await patch(body));
    } catch (err) {
      setError(err.message);
    }
  };
  const saveStop = (stop) =>
    onUpdate({ ...client, journeys: client.journeys.map((j) => ({ ...j, stops: j.stops.map((s) => (s.id === stop.id ? stop : s)) })) });

  return (
    <article className="glass p-5 md:p-6">
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex w-full flex-wrap items-start justify-between gap-3 text-start">
        <div className="min-w-0">
          <h2 className="break-words text-lg font-semibold">{client.name}</h2>
          <p className="mt-1 flex flex-wrap gap-1.5">
            {client.journeys.map((j) => (
              <span key={j.id} className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-xs">
                <span className="size-2 rounded-full" style={{ background: findJourney(j.service)?.color }} aria-hidden="true" />
                {findJourney(j.service)?.title ?? j.service}
              </span>
            ))}
          </p>
        </div>
        <span className="flex items-center gap-3 text-sm">
          <span className="font-semibold">{done} of {stops.length} stops</span>
          <ChevronDown className={`size-5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </span>
      </button>

      <div className="mt-3 flex flex-wrap gap-x-5 text-sm">
        <a href={`mailto:${client.email}`} className="inline-flex min-h-10 items-center gap-2 break-all underline underline-offset-2">
          <Mail className="size-4 shrink-0" aria-hidden="true" />
          {client.email}
        </a>
        {client.phone && (
          <a href={`tel:${client.phone.replace(/[^+\d]/g, '')}`} className="inline-flex min-h-10 items-center gap-2 underline underline-offset-2">
            <Phone className="size-4 shrink-0" aria-hidden="true" />
            {client.phone}
          </a>
        )}
        <span className="inline-flex min-h-10 items-center text-muted">{client.country || 'Country not given'}</span>
      </div>
      <p className="text-xs text-muted">Joined {when(client.createdAt)} · Last sign-in {when(client.lastSignIn)}</p>

      {open && (
        <div className="mt-6 border-t border-line pt-6">
          <JourneySummary journeys={client.journeys} />
          <div className="mt-8">
            <Roadmap journeys={client.journeys} />
          </div>

          <h3 className="mt-10 text-base font-semibold">Update the roadmap</h3>
          <p className="mt-1 text-sm text-muted">Tick a stop when it is done. The client sees changes the next time they open My Journey.</p>
          {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
          {client.journeys.map((j) => (
            <section key={j.id} className="mt-5 rounded-2xl border border-line p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="flex items-center gap-2 font-semibold">
                  <span className="size-2.5 rounded-full" style={{ background: findJourney(j.service)?.color }} aria-hidden="true" />
                  {findJourney(j.service)?.title ?? j.service}
                </h4>
                <ConfirmButton label="Remove service" onConfirm={() => run({ op: 'remove-service', id: j.id }, (d) => onUpdate({ ...client, journeys: d.journeys }))}>
                  <Trash2 className="size-4" aria-hidden="true" />
                </ConfirmButton>
              </div>
              <ol className="mt-2">
                {j.stops.map((s) => (
                  <StopRow key={s.id} stop={{ ...s, number: numbered[s.id] }} onSaved={saveStop} onError={setError} />
                ))}
              </ol>
            </section>
          ))}

          <div className="mt-6 flex flex-wrap gap-2">
            {serviceList.filter((s) => !joined.has(s.id)).map((s) => (
              <Button
                key={s.id}
                variant="ghost"
                className="!min-h-10 !py-1.5"
                disabled={Boolean(adding)}
                onClick={async () => {
                  setAdding(s.id);
                  await run({ op: 'add-service', id: client.id, service: s.id }, (d) => onUpdate({ ...client, journeys: d.journeys }));
                  setAdding('');
                }}
              >
                {adding === s.id ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
                Add {s.title}
              </Button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-6">
            <ConfirmButton label="Reset password" onConfirm={() => run({ op: 'reset-password', id: client.id }, (d) => setTempPassword(d.password))}>
              <KeyRound className="size-4" aria-hidden="true" />
            </ConfirmButton>
            <ConfirmButton label="Delete client" onConfirm={() => run({ op: 'delete-client', id: client.id }, () => onDeleted(client.id))}>
              <Trash2 className="size-4" aria-hidden="true" />
            </ConfirmButton>
          </div>
          {tempPassword && (
            <p role="status" className="mt-3 rounded-2xl border border-green/40 bg-green/10 p-3 text-sm">
              New password: <b className="select-all font-mono">{tempPassword}</b>. Send it to the client privately (for example on WhatsApp). They can change it under My Journey. It is shown only once.
            </p>
          )}
        </div>
      )}
    </article>
  );
}

/** The Clients tab on /admin: every client account with its roadmap, newest first. */
export default function ClientsAdmin({ clients, onChange }) {
  if (!clients.length) {
    return <p className="glass p-10 text-center text-sm text-muted">No client accounts yet. Clients sign up at /account.</p>;
  }
  return clients.map((c) => (
    <ClientCard
      key={c.id}
      client={c}
      onUpdate={(next) => onChange(clients.map((x) => (x.id === next.id ? next : x)))}
      onDeleted={(id) => onChange(clients.filter((x) => x.id !== id))}
    />
  ));
}
