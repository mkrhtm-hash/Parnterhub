import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { money, useInstrumentLabel, VerifyLink } from './BrokerCard';
import { SampleBadge } from '../ui/Primitives';
import { useSiteData } from '../../context/SiteDataContext';

const buildRows = (regulators, instrumentLabel) => [
  {
    label: 'Regulators and licences',
    render: (b) => (
      <ul className="grid gap-3">
        {b.licences.map((l) => (
          <li key={l.regulator}>
            <p className="font-medium">{regulators[l.regulator].code}</p>
            {l.entity && <p className="text-xs text-muted">{l.entity}</p>}
            <p className="mb-1 font-mono text-xs break-all text-faint">{l.number}</p>
            <VerifyLink licence={l} verifyUrl={b.verifyUrl} />
          </li>
        ))}
      </ul>
    ),
  },
  { label: 'Minimum deposit', render: (b) => money(b.minDeposit) },
  { label: 'Typical spreads', render: (b) => b.spreads },
  { label: 'Commission', render: (b) => b.commission },
  { label: 'Platforms', render: (b) => b.platforms.join(', ') },
  { label: 'Instruments', render: (b) => b.instruments.map(instrumentLabel).join(', ') },
  { label: 'Support', render: (b) => b.support },
];

export default function CompareDialog({ open, brokers, onClose }) {
  const ref = useRef(null);
  const { regulators } = useSiteData().data;
  const rows = buildRows(regulators, useInstrumentLabel());

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="compare-title"
      className="m-auto max-h-[92dvh] w-[min(64rem,calc(100vw-1.5rem))] rounded-3xl border border-line text-ink shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      style={{ background: 'var(--bg-2)' }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line p-5">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="compare-title" className="text-xl font-semibold md:text-2xl">Compare brokers</h2>
          {brokers.some((b) => b.isSample) && <SampleBadge />}
        </div>
        <button type="button" onClick={onClose} aria-label="Close comparison" className="grid size-11 shrink-0 place-items-center rounded-full border border-line hover:border-blue/60">
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <td className="sticky left-0 w-32 p-4" style={{ background: 'var(--bg-2)' }} />
              {brokers.map((b) => (
                <th key={b.id} scope="col" className="min-w-40 p-4 align-top font-display font-semibold">{b.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ label, render }) => (
              <tr key={label} className="border-b border-line last:border-b-0">
                <th scope="row" className="sticky left-0 w-32 p-4 align-top text-xs font-medium text-faint" style={{ background: 'var(--bg-2)' }}>{label}</th>
                {brokers.map((b) => (
                  <td key={b.id} className="p-4 align-top">{render(b)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-line p-5 text-xs leading-relaxed text-faint">
        Fictional sample data, shown for illustration. Sample licence numbers will not appear on any regulator's register. Real figures vary by account type, entity and market conditions.
      </p>
    </dialog>
  );
}
