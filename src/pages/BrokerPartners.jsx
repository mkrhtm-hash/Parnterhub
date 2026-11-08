import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Scale, SearchX, X } from 'lucide-react';
import BrokerCard from '../components/brokers/BrokerCard';
import CompareDialog from '../components/brokers/CompareDialog';
import Button from '../components/ui/Button';
import { PageHeader, SampleBadge } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useToast } from '../context/ToastContext';
import { useSiteData } from '../context/SiteDataContext';

const MAX_COMPARE = 3;
const noFilters = { regulator: '', platform: '', instrument: '' };

function FilterSelect({ label, value, onChange, options, allLabel }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field">
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

export default function BrokerPartners() {
  const { brokers, regulators, options } = useSiteData().data;
  const { instruments, platforms } = options;
  const regulatorOptions = useMemo(
    () =>
      [...new Set(brokers.flatMap((b) => b.licences.map((l) => l.regulator)))].map((code) => ({
        value: code,
        label: `${code} (${regulators[code].jurisdiction})`,
      })),
    [brokers, regulators],
  );
  usePageMeta('Broker Partners', 'Filter and compare broker partners by regulator, platform and instrument, with a link to verify each licence. Currently showing fictional sample data.');
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState(noFilters);
  const [compareIds, setCompareIds] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Broker Match links here with ?compare=a,b,c to open its results side by side.
  useEffect(() => {
    const ids = (params.get('compare') ?? '').split(',').filter((id) => brokers.some((b) => b.id === id)).slice(0, MAX_COMPARE);
    if (ids.length) {
      setCompareIds(ids);
      setDialogOpen(ids.length > 1);
      setParams({}, { replace: true });
    }
  }, [params, setParams, brokers]);

  const shown = useMemo(
    () =>
      brokers.filter(
        (b) =>
          (!filters.regulator || b.licences.some((l) => l.regulator === filters.regulator)) &&
          (!filters.platform || b.platforms.includes(filters.platform)) &&
          (!filters.instrument || b.instruments.includes(filters.instrument)),
      ),
    [filters, brokers],
  );

  const compared = compareIds.map((id) => brokers.find((b) => b.id === id));
  const hasFilters = Object.values(filters).some(Boolean);
  const setFilter = (key) => (value) => setFilters((f) => ({ ...f, [key]: value }));

  const toggleCompare = (id) => {
    if (compareIds.includes(id)) {
      setCompareIds((ids) => ids.filter((x) => x !== id));
    } else if (compareIds.length >= MAX_COMPARE) {
      toast(`You can compare up to ${MAX_COMPARE} brokers. Remove one to add another.`, 'info');
    } else {
      setCompareIds((ids) => [...ids, id]);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Broker partners"
        title="Compare the details. Then verify them yourself."
        intro="Every listing shows the regulator, the licence number and a link to the regulator's register."
      />

      <section className="shell">
        <div className="mb-6 flex gap-3 rounded-2xl border border-dashed border-gold/60 bg-gold/8 p-4 text-sm leading-relaxed">
          <SampleBadge className="h-fit shrink-0" />
          <p className="text-muted">
            These brokers are fictional examples, and their figures and licence numbers are made up. The regulators are real, but they have no connection to these listings, and the sample numbers will not appear on their registers.
          </p>
        </div>

        <div className="glass grid gap-3 p-4 sm:grid-cols-3 md:p-5">
          <FilterSelect label="Regulator" value={filters.regulator} onChange={setFilter('regulator')} allLabel="All regulators" options={regulatorOptions} />
          <FilterSelect label="Platform" value={filters.platform} onChange={setFilter('platform')} allLabel="All platforms" options={platforms.map((p) => ({ value: p, label: p }))} />
          <FilterSelect label="Instrument" value={filters.instrument} onChange={setFilter('instrument')} allLabel="All instruments" options={instruments.map((i) => ({ value: i.id, label: i.label }))} />
        </div>

        <div className="mt-5 mb-4 flex min-h-11 items-center justify-between gap-3">
          <p className="text-sm text-muted" role="status">
            Showing {shown.length} of {brokers.length} brokers
          </p>
          {hasFilters && (
            <button type="button" onClick={() => setFilters(noFilters)} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-emerald">
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>

        {shown.length === 0 ? (
          <div className="glass p-10 text-center md:p-14">
            <SearchX className="mx-auto size-8 text-gold" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold">No brokers match that combination</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">Try removing a filter, or tell us what you are looking for and we will see what is possible.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="ghost" onClick={() => setFilters(noFilters)}>Clear filters</Button>
              <Button to="/book">Talk to us</Button>
            </div>
          </div>
        ) : (
          <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false}>
              {shown.map((broker) => (
                <motion.div key={broker.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.22 }}>
                  <BrokerCard broker={broker} selected={compareIds.includes(broker.id)} onToggleCompare={toggleCompare} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.aside
            aria-label="Brokers selected to compare"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed inset-x-3 z-40 mx-auto max-w-2xl rounded-3xl border border-line p-3 shadow-2xl bottom-[calc(4.25rem+env(safe-area-inset-bottom))] lg:bottom-6"
            style={{ background: 'var(--glass-solid)' }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <ul className="flex min-w-0 flex-wrap gap-1.5">
                {compared.map((b) => (
                  <li key={b.id}>
                    <button
                      type="button"
                      onClick={() => toggleCompare(b.id)}
                      aria-label={`Remove ${b.name} from comparison`}
                      className="inline-flex min-h-9 items-center gap-1 rounded-full border border-line px-3 text-xs font-medium hover:border-emerald/60"
                    >
                      {b.name.replace('Sample Broker ', '')}
                      <X className="size-3" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
              <Button onClick={() => setDialogOpen(true)} disabled={compareIds.length < 2} className="!min-h-10 !py-2">
                <Scale className="size-4" aria-hidden="true" />
                {compareIds.length < 2 ? 'Pick one more' : `Compare ${compareIds.length}`}
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <CompareDialog open={dialogOpen} brokers={compared} onClose={() => setDialogOpen(false)} />
    </>
  );
}
