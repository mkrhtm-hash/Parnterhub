import { Check, ChartLine, Compass, Footprints, Handshake, LifeBuoy, Lock } from 'lucide-react';
import { findJourney } from '../../../shared/journeys';
import { useI18n } from '../../i18n/I18nContext';

const icons = { 'broker-selection': Compass, 'account-opening': Handshake, 'conditions-review': ChartLine, 'ongoing-support': LifeBuoy };
const GOLD = '#d9a520';
const ROW = 108; // card height, px
const GAP = 28; // space between rows, px
const GUTTER = 112; // width of the trail between the two columns, px

export const shortDate = (iso, locale) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' }) : '';
export const longDate = (iso, locale) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';

/**
 * All stops of all a client's services as one numbered trail in date order (services run side by side),
 * and the first stop not yet done. Stops without a date go last.
 */
export function flatten(journeys) {
  const stops = journeys.flatMap((j, order) => {
    const meta = findJourney(j.service) ?? { title: j.service, color: '#64748b' };
    return j.stops.map((s) => ({ ...s, order, service: j.service, serviceTitle: meta.title, color: meta.color }));
  });
  stops.sort((a, b) => (a.dueOn ?? '9999').localeCompare(b.dueOn ?? '9999') || a.order - b.order || a.position - b.position);
  stops.forEach((s, i) => {
    s.number = i + 1;
  });
  return { stops, current: stops.find((s) => !s.doneAt) ?? null };
}

function StopCard({ stop, state, side }) {
  const { t, locale } = useI18n();
  const Icon = icons[stop.service] ?? Compass;
  return (
    <div
      title={t(stop.note)}
      className={`relative flex h-full items-center gap-3 rounded-2xl border p-3 shadow-sm transition ${
        state === 'current' ? 'border-blue bg-blue/10 ring-2 ring-blue/30' : 'border-line bg-[var(--glass-solid)]'
      } ${state === 'upcoming' ? 'opacity-75' : ''}`}
    >
      <span
        aria-hidden="true"
        className="absolute -start-2 -top-2 grid size-5 place-items-center rounded-full text-white shadow"
        style={{ background: state === 'done' ? GOLD : '#94a3b8' }}
      >
        {state === 'done' ? <Check className="size-3" strokeWidth={3} /> : state === 'upcoming' ? <Lock className="size-2.5" strokeWidth={3} /> : null}
      </span>
      {state === 'current' && side && (
        <span
          aria-hidden="true"
          className={`absolute top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border-2 border-blue bg-[var(--bg)] text-blue shadow-lg ${side === 'left' ? '-end-[1.4rem]' : '-start-[1.4rem]'}`}
        >
          <Footprints className="size-4" />
        </span>
      )}
      <span className="grid size-11 shrink-0 place-items-center rounded-xl" style={{ background: `${stop.color}22`, color: stop.color }}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex min-w-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide">
          <span className="shrink-0 rounded px-1.5 py-0.5 text-white" style={{ background: stop.color }}>
            {t('Stop {n}', { n: stop.number })}
          </span>
          <span className="truncate" style={{ color: stop.color }}>{t(stop.serviceTitle)}</span>
        </p>
        <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug">{t(stop.title)}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-muted">{shortDate(stop.dueOn, locale)}</span>
          {state === 'done' && (
            <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" style={{ background: GOLD, color: '#2a1b00' }}>
              {t('Done')}
            </span>
          )}
          {state === 'current' && <span className="shrink-0 rounded-full bg-blue px-2 py-0.5 text-[10px] font-bold uppercase text-white">{t('You are here')}</span>}
        </div>
      </div>
    </div>
  );
}

const stateOf = (stop, current) => (stop.doneAt ? 'done' : stop === current ? 'current' : 'upcoming');

/** The zigzag trail: stop 1 on the left, stop 2 on the right, and so on, joined by a line in each service's colour. */
export default function Roadmap({ journeys }) {
  const { t, dir } = useI18n();
  const { stops, current } = flatten(journeys);
  if (!stops.length) return <p className="glass p-8 text-center text-sm text-muted">{t('No stops yet.')}</p>;

  const rows = Math.ceil(stops.length / 2);
  const height = rows * ROW + (rows - 1) * GAP;
  const y = (row) => row * (ROW + GAP) + ROW / 2;
  const segments = stops.slice(1).map((to, i) => {
    const row = Math.floor(i / 2);
    const d = i % 2 === 0
      ? `M 0 ${y(row)} L ${GUTTER} ${y(row)}`
      : `M ${GUTTER} ${y(row)} C ${GUTTER} ${(y(row) + y(row + 1)) / 2}, 0 ${(y(row) + y(row + 1)) / 2}, 0 ${y(row + 1)}`;
    return { d, color: to.color, done: Boolean(to.doneAt) };
  });

  return (
    <>
      <p className="mb-3 text-center text-xs italic text-muted">{t('Follow the trail. The marker shows where you are today.')}</p>

      {/* Wide screens: two columns joined by the trail. */}
      <ol className="relative mx-auto hidden max-w-3xl md:grid" style={{ gridTemplateColumns: `1fr ${GUTTER}px 1fr`, rowGap: GAP, gridAutoRows: ROW }}>
        <svg
          aria-hidden="true"
          width={GUTTER}
          height={height}
          className="pointer-events-none absolute top-0"
          style={{ insetInlineStart: `calc(50% - ${GUTTER / 2}px)`, transform: dir === 'rtl' ? 'scaleX(-1)' : undefined }}
        >
          {segments.map((s, i) => (
            <g key={i}>
              {s.done && <path d={s.d} fill="none" stroke={s.color} strokeWidth="9" strokeOpacity="0.15" strokeLinecap="round" />}
              <path d={s.d} fill="none" stroke={s.color} strokeWidth={s.done ? 3 : 2} strokeOpacity={s.done ? 1 : 0.4} strokeDasharray={s.done ? undefined : '6 6'} strokeLinecap="round" />
            </g>
          ))}
        </svg>
        {stops.map((stop, i) => (
          <li
            key={stop.id}
            style={{ gridColumn: i % 2 === 0 ? 1 : 3, gridRow: Math.floor(i / 2) + 1 }}
            aria-current={stop === current ? 'step' : undefined}
          >
            <StopCard stop={stop} state={stateOf(stop, current)} side={i % 2 === 0 ? 'left' : 'right'} />
          </li>
        ))}
      </ol>

      {/* Phones: one column with the trail down the side. */}
      <ol className="grid gap-0 md:hidden">
        {stops.map((stop, i) => (
          <li key={stop.id} aria-current={stop === current ? 'step' : undefined}>
            {i > 0 && (
              <span
                aria-hidden="true"
                className="ms-8 block h-6 w-0.5"
                style={{ background: stop.doneAt ? stop.color : `repeating-linear-gradient(${stop.color}66 0 4px, transparent 4px 8px)` }}
              />
            )}
            <div className="h-[108px]">
              <StopCard stop={stop} state={stateOf(stop, current)} />
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

/** The progress card above the trail: how many stops are done, the dates, and a key to the service colours. */
export function JourneySummary({ journeys }) {
  const { t, locale } = useI18n();
  const { stops, current } = flatten(journeys);
  const done = stops.filter((s) => s.doneAt).length;
  const percent = stops.length ? Math.round((done / stops.length) * 100) : 0;
  const dates = stops.map((s) => s.dueOn).filter(Boolean).sort();
  const colors = journeys.map((j) => findJourney(j.service)?.color ?? '#64748b');

  return (
    <div className="mx-auto max-w-xl">
      <div className="glass p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-lg font-semibold">
            <span style={{ color: GOLD }}>{done}</span> {t('of {n} stops', { n: stops.length })}
          </p>
          <p className="text-xs text-muted">{t('{p}% of the trail', { p: percent })}</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--bg-2)]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={t('Progress')}>
          <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, background: `linear-gradient(90deg, ${colors.join(', ')}${colors.length === 1 ? `, ${colors[0]}` : ''})` }} />
        </div>
        {dates.length > 0 && (
          <p className="mt-3 text-center text-xs text-muted">
            {t('Starts')} <b className="text-ink">{shortDate(dates[0], locale)}</b>
            <span className="mx-2" aria-hidden="true">·</span>
            {t('Last stop')} <b className="text-ink">{longDate(dates.at(-1), locale)}</b>
          </p>
        )}
        {current && (
          <div className="mt-4 rounded-2xl border border-blue/30 bg-blue/8 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue">{t('Next stop')} · {shortDate(current.dueOn, locale)}</p>
            <p className="mt-1 font-semibold">{t(current.title)}</p>
            <p className="mt-1 text-sm text-muted">{t(current.note)}</p>
          </div>
        )}
        {!current && stops.length > 0 && <p className="mt-4 text-center text-sm font-semibold text-green">{t('Every stop is done. Thank you for travelling with us.')}</p>}
      </div>
      <ul className="mt-4 flex flex-wrap justify-center gap-2">
        {journeys.map((j) => {
          const meta = findJourney(j.service);
          return (
            <li key={j.id} className="inline-flex items-center gap-2 rounded-full border border-line bg-[var(--glass)] px-3 py-1 text-xs">
              <span className="size-2 rounded-full" style={{ background: meta?.color }} aria-hidden="true" />
              {t(meta?.title ?? j.service)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
