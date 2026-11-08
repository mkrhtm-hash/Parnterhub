import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ExternalLink, Landmark, LifeBuoy, ShieldCheck, TriangleAlert, Vault } from 'lucide-react';
import Button from '../components/ui/Button';
import { IconTile, PageHeader, Reveal, SectionHeading } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSiteData } from '../context/SiteDataContext';

const verifySteps = [
  { title: 'Find the legal entity', text: 'Look in the website footer or terms for the company name and licence number. A brand name alone is not enough.' },
  { title: 'Go to the regulator directly', text: 'Type the regulator\'s address yourself or use a trusted link. Do not rely on a link the broker sent you.' },
  { title: 'Search the official register', text: 'Search by company name and licence number. Confirm that the status is active and covers CFDs or derivatives.' },
  { title: 'Match the contact details', text: 'Compare the website, email and phone number with the register. Clone firms copy real details from genuine companies.' },
  { title: 'Check who holds your account', text: 'Groups often have several entities. Read your client agreement to see which one, and which regulator, applies to you.' },
];

const protections = [
  {
    Icon: Vault,
    title: 'Segregated funds',
    text: 'Client money is held separately from the broker\'s own money. This helps keep it from being used for company expenses, but it does not protect you from trading losses.',
  },
  {
    Icon: ShieldCheck,
    title: 'Negative balance protection',
    text: 'If the market moves sharply against you, this rule stops you from losing more than the money in your account. It is required in some jurisdictions for retail clients, not everywhere.',
  },
  {
    Icon: LifeBuoy,
    title: 'Compensation schemes',
    text: 'Some jurisdictions have a scheme that may pay eligible clients if a regulated firm fails. Limits apply, and these schemes do not cover trading losses.',
  },
];

const redFlags = [
  'The licence number is missing, or you cannot find it on the regulator\'s register',
  'They promise fixed or certain returns, or play down the risk of losing money',
  'Someone pressures you to deposit today or keep adding money',
  'Withdrawals are delayed, or new conditions appear when you ask for your money',
  'The company name, address or legal entity is vague or hard to find',
  'They ask you to pay a personal account, an unrelated company or a private crypto wallet',
  'The website or contact details differ from those on the register, a sign of a clone firm',
];

function RegulatorCard({ regulator }) {
  const details = [
    ['Client money', regulator.segregation],
    ['Negative balance', regulator.negativeBalance],
    ['Compensation', regulator.compensation],
  ];
  return (
    <article className="glass flex flex-col p-6">
      <div className="flex items-start gap-3">
        <IconTile icon={Landmark} />
        <div>
          <h4 className="text-xl font-semibold">{regulator.code}</h4>
          <p className="text-sm text-muted">{regulator.name}</p>
          <p className="text-xs text-faint">{regulator.jurisdiction}</p>
        </div>
      </div>
      <dl className="mt-5 mb-5 grid flex-1 gap-3 text-sm">
        {details.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-medium text-faint">{label}</dt>
            <dd className="mt-0.5 leading-relaxed text-muted">{value}</dd>
          </div>
        ))}
      </dl>
      <a href={regulator.registerUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-emerald underline-offset-2 hover:underline lg:min-h-0">
        Open the official site or register
        <ExternalLink className="size-3.5" aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </article>
  );
}

function TierExplorer() {
  const { regulators, regulatorTiers } = useSiteData().data;
  const [activeId, setActiveId] = useState(1);
  const tier = regulatorTiers.find((t) => t.id === activeId);
  const inTier = Object.values(regulators).filter((r) => r.tier === activeId);

  return (
    <div className="mt-10">
      <div role="group" aria-label="Choose a regulator tier" className="grid grid-cols-3 gap-1 rounded-2xl border border-line bg-[var(--glass)] p-1.5">
        {regulatorTiers.map((t) => {
          const active = t.id === activeId;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveId(t.id)}
              className={`relative min-h-14 rounded-xl px-2 py-2 text-center transition-colors ${active ? 'text-on-accent' : 'text-muted hover:text-ink'}`}
            >
              {active && <motion.span layoutId="tier-pill" className="bg-brand absolute inset-0 rounded-xl" transition={{ type: 'spring', stiffness: 340, damping: 30 }} />}
              <span className="relative block font-display text-sm font-semibold">{t.name}</span>
              <span className="relative hidden text-xs sm:block">{t.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={activeId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
          <h3 className="mt-6 text-lg font-semibold sm:hidden">{tier.label}</h3>
          <p className="mt-2 mb-6 max-w-2xl leading-relaxed text-muted sm:mt-6">{tier.summary}</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inTier.map((r) => (
              <RegulatorCard key={r.code} regulator={r} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mt-5 text-xs leading-relaxed text-faint">
        These tiers are our own simplification, not an official ranking, and not every regulator is listed. Rules change and can vary by entity and client type. Confirm the current position with the regulator.
      </p>
    </div>
  );
}

function RedFlagChecklist() {
  const [ticked, setTicked] = useState([]);
  const toggle = (i) => setTicked((t) => (t.includes(i) ? t.filter((x) => x !== i) : [...t, i]));

  return (
    <div className="glass mt-10 p-5 md:p-8">
      <ul className="grid gap-2">
        {redFlags.map((flag, i) => {
          const checked = ticked.includes(i);
          return (
            <li key={flag}>
              <label className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${checked ? 'border-danger/60 bg-danger/8' : 'border-line hover:border-gold/50'}`}>
                <input type="checkbox" checked={checked} onChange={() => toggle(i)} className="peer sr-only" />
                <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald ${checked ? 'border-danger bg-danger text-bg' : 'border-faint'}`}>
                  {checked && <Check className="size-3.5" aria-hidden="true" />}
                </span>
                <span className="leading-relaxed"><span className="mr-1.5 font-display font-semibold text-gold">{i + 1}.</span>{flag}</span>
              </label>
            </li>
          );
        })}
      </ul>

      <div role="status" className="mt-5 min-h-16">
        {ticked.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted">Tick anything you have seen with a broker you are considering.</p>
        ) : (
          <div className="flex gap-3 rounded-2xl bg-danger/8 p-4 text-sm leading-relaxed">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
            <p>
              <strong className="font-semibold">You ticked {ticked.length} {ticked.length === 1 ? 'red flag' : 'red flags'}.</strong>{' '}
              Please pause before sending any money, and check the firm on the regulator's register. If you have already paid, contact your bank and the relevant regulator.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegulationGuide() {
  usePageMeta('Regulation Guide', 'A plain-English guide to broker regulation: how to verify a licence, what client protections mean, regulator tiers and 7 red flags of an unsafe broker.');
  return (
    <>
      <PageHeader
        eyebrow="Regulation guide"
        title="Regulation, in plain English."
        intro="A regulated broker is licensed by a financial authority and has to follow its rules on capital, client money and conduct. Regulation reduces certain risks. It does not protect you from trading losses."
      />

      <section className="shell">
        <SectionHeading title="How to verify a licence" intro="This takes about five minutes. Do it for every broker, including any we introduce to you." />
        <ol className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {verifySteps.map(({ title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 0.06} className="glass lift p-5">
              <span className="text-brand font-display text-3xl font-semibold">{i + 1}</span>
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="shell pt-16 md:pt-28">
        <SectionHeading title="Client protections explained" intro="Protection depends on the regulator, the entity holding your account and your client type." />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {protections.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08} className="glass lift p-7">
              <IconTile icon={Icon} tone={i === 1 ? 'gold' : 'emerald'} />
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell pt-16 md:pt-28">
        <SectionHeading title="Regulator tier explorer" intro="A broad guide to how regulators compare. Pick a tier to see examples." />
        <TierExplorer />
      </section>

      <section className="shell pt-16 md:pt-28">
        <SectionHeading eyebrow="Checklist" title="7 red flags of an unsafe broker" />
        <RedFlagChecklist />
        <Reveal className="mt-8 flex justify-center">
          <Button to="/book" variant="ghost">Ask us to go through a broker with you</Button>
        </Reveal>
      </section>
    </>
  );
}
