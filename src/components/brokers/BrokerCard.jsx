import { Check, ExternalLink, Plus } from 'lucide-react';
import { SampleBadge } from '../ui/Primitives';
import SmileCoin from './SmileCoin';
import { useSiteData } from '../../context/SiteDataContext';

export function useInstrumentLabel() {
  const { instruments } = useSiteData().data.options;
  return (id) => instruments.find((i) => i.id === id)?.label ?? id;
}

export const money = (n) => `$${n.toLocaleString('en-US')}`;

export function VerifyLink({ licence, verifyUrl }) {
  const regulator = useSiteData().data.regulators[licence.regulator];
  return (
    <a
      href={licence.verifyUrl ?? verifyUrl ?? regulator.registerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-10 items-center gap-1 text-xs font-medium text-blue underline-offset-2 hover:underline lg:min-h-0"
    >
      {licence.kind === 'registration' ? 'See the registration details' : `Verify on ${regulator.code}'s register`}
      <ExternalLink className="size-3" aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

function Chips({ items }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">{item}</li>
      ))}
    </ul>
  );
}

export default function BrokerCard({ broker, selected, onToggleCompare }) {
  const { regulators } = useSiteData().data;
  const instrumentLabel = useInstrumentLabel();
  return (
    <article className={`glass lift flex h-full flex-col p-6 ${selected ? '!border-blue' : ''}`}>
      <div className="flex min-h-8 items-center justify-between gap-3">
        {broker.logo ? (
          <h3 className="text-lg font-semibold">
            <span className="sr-only">{broker.name}</span>
            <img src={`${broker.logo}-on-dark.svg`} alt="" className="logo-on-dark h-8 w-auto" />
            <img src={`${broker.logo}-on-light.svg`} alt="" className="logo-on-light h-8 w-auto" />
          </h3>
        ) : (
          <h3 className="text-lg font-semibold">{broker.name}</h3>
        )}
        {broker.isSample && <SampleBadge className="shrink-0" />}
      </div>

      {broker.highlights?.length > 0 && (
        <ul className="mt-4 grid gap-2">
          {broker.highlights.map(({ title, note }) => (
            <li key={title} className="flex items-center gap-3 rounded-2xl border border-[#e8b73a]/40 bg-gradient-to-r from-[#f6c945]/14 to-transparent p-2.5 pr-3">
              <SmileCoin className="size-10 shrink-0" />
              <span>
                <span className="block text-sm font-semibold">{title}</span>
                {note && <span className="block text-xs leading-snug text-muted">{note}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}

      <ul className="mt-4 grid gap-3">
        {broker.licences.map((licence) => (
          <li key={licence.regulator} className="rounded-2xl border border-line p-3">
            <p className="text-sm font-medium">
              {regulators[licence.regulator].code}
              <span className="font-normal text-muted"> · {regulators[licence.regulator].jurisdiction}</span>
            </p>
            {licence.entity && <p className="mt-1 text-xs text-ink/85">{licence.kind === 'registration' ? 'Registered as' : 'Licensed as'} {licence.entity}</p>}
            <p className="mt-0.5 mb-1.5 font-mono text-xs break-all text-faint">{licence.kind === 'registration' ? 'Registration no.' : 'Licence no.'} {licence.number}</p>
            {licence.address && <p className="mb-1.5 text-xs leading-relaxed text-faint">{licence.address}</p>}
            <VerifyLink licence={licence} verifyUrl={broker.verifyUrl} />
          </li>
        ))}
      </ul>

      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-xs text-faint">Minimum deposit</dt>
          <dd className="mt-0.5 font-medium">{money(broker.minDeposit)}</dd>
        </div>
        <div>
          <dt className="text-xs text-faint">Typical spreads</dt>
          <dd className="mt-0.5 font-medium">{broker.spreads}</dd>
        </div>
        {broker.leverage && (
          <div className="col-span-2">
            <dt className="text-xs text-faint">Leverage</dt>
            <dd className="mt-0.5 font-medium">{broker.leverage}</dd>
          </div>
        )}
      </dl>

      <div className="mt-5 grid gap-3">
        <div>
          <p className="mb-1.5 text-xs text-faint">Platforms</p>
          <Chips items={broker.platforms} />
        </div>
        <div>
          <p className="mb-1.5 text-xs text-faint">Instruments</p>
          <Chips items={broker.instruments.map(instrumentLabel)} />
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button
          type="button"
          aria-pressed={selected}
          onClick={() => onToggleCompare(broker.id)}
          className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-colors ${
            selected ? 'border-blue bg-blue/12 text-blue' : 'border-line hover:border-blue/60'
          }`}
        >
          {selected ? <Check className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
          {selected ? 'Added to compare' : 'Add to compare'}
        </button>
      </div>
    </article>
  );
}
