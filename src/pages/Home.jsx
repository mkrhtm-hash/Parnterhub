import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Check, ChartLine, Compass, Globe, GraduationCap, Handshake, LifeBuoy, ShieldCheck, TriangleAlert, X } from 'lucide-react';
import NetworkCanvas from '../components/hero/NetworkCanvas';
import HubVisual from '../components/hero/HubVisual';
import Button from '../components/ui/Button';
import Accordion from '../components/ui/Accordion';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { IconTile, PlaceholderText, Reveal, SampleBadge, SectionHeading } from '../components/ui/Primitives';
import { CardSkeleton, DataError } from '../components/ui/DataState';
import { usePageMeta } from '../hooks/usePageMeta';
import { useCompliance, useSiteData } from '../context/SiteDataContext';
import { weDo, weDont } from '../data/staticContent';

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.09, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } }),
};

const services = [
  { Icon: Compass, title: 'Broker selection', text: 'A shortlist built around where you live, what you trade and what matters to you.' },
  { Icon: Handshake, title: 'Account opening', text: 'Know what documents to expect and what each step means before you start.' },
  { Icon: ChartLine, title: 'Conditions review', text: 'Spreads, commissions, leverage and execution, compared in plain English.' },
  { Icon: LifeBuoy, title: 'Ongoing support', text: 'Someone to call later, including help escalating an issue with your broker.' },
];

function Stats() {
  const { status, data } = useSiteData();
  if (status === 'error') return <DataError compact />;
  if (status === 'loading') {
    return (
      <div role="status" aria-label="Loading" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <CardSkeleton className="!rounded-2xl" />
        <CardSkeleton className="!rounded-2xl" />
        <CardSkeleton className="!rounded-2xl" />
      </div>
    );
  }
  const { stats } = data;
  const items = [
    { Icon: CalendarDays, value: stats.years, suffix: '+', label: 'years of experience' },
    { Icon: ShieldCheck, value: stats.partners, label: 'regulated broker partners', sample: stats.usingSampleData },
    { Icon: Globe, value: stats.jurisdictions, label: 'regulatory jurisdictions covered', sample: stats.usingSampleData },
  ];
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map(({ Icon, value, suffix, label, sample }) => (
        <div key={label} className="glass lift !rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2">
            <Icon className="size-5 text-emerald" aria-hidden="true" />
            {sample && <SampleBadge />}
          </div>
          <dd className="text-brand mt-3 font-display text-4xl font-semibold">
            <AnimatedCounter value={value} suffix={suffix} />
          </dd>
          <dt className="mt-1 text-sm text-muted">{label}</dt>
        </div>
      ))}
    </dl>
  );
}

function Faqs() {
  const { status, data } = useSiteData();
  if (status === 'error') return <DataError compact />;
  if (status === 'loading') return <CardSkeleton />;
  return <Accordion items={data.faqs} />;
}

export default function Home() {
  usePageMeta();
  const compliance = useCompliance();
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <NetworkCanvas />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />
        </div>

        <div className="border-b border-line bg-gold/8">
          <p className="shell flex gap-2 py-2.5 text-xs leading-relaxed">
            <TriangleAlert className="mt-px size-4 shrink-0 text-gold" aria-hidden="true" />
            <span>
              {compliance.riskWarning}{' '}
              {compliance.retailLossPercent && (
                <>
                  <PlaceholderText text={`${compliance.retailLossPercent}%`} /> {compliance.retailLossSentence}{' '}
                </>
              )}
              <Link to="/risk-disclosure" className="font-medium whitespace-nowrap underline underline-offset-2">Full risk disclosure</Link>
            </span>
          </p>
        </div>

        <div className="shell grid items-center gap-8 pt-8 pb-10 md:pt-14 lg:grid-cols-[1.12fr_0.88fr] lg:gap-6 lg:pt-14 lg:pb-14">
          <div>
            <motion.p custom={0} variants={rise} initial="hidden" animate="show" className="eyebrow mb-4">
              MKPips · FX and CFD broker consultancy
            </motion.p>
            <motion.h1 custom={1} variants={rise} initial="hidden" animate="show" className="text-[2.45rem] leading-[1.06] font-semibold sm:text-6xl lg:text-[4.1rem]">
              The right broker starts with the <span className="text-brand">right partner.</span>
            </motion.h1>
            <motion.p custom={2} variants={rise} initial="hidden" animate="show" className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Access trusted, regulated FX and CFD brokers, guided by 18 years of industry experience.
            </motion.p>
            <motion.div custom={3} variants={rise} initial="hidden" animate="show" className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button to="/book">
                <CalendarDays className="size-4" aria-hidden="true" />
                Book a Free Consultation
              </Button>
              <Button to="/broker-match" variant="ghost">
                Find My Broker Match
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </motion.div>
          </div>
          <div className="hidden lg:block">
            <HubVisual />
          </div>
        </div>

        <div className="shell pb-14">
          <Stats />
        </div>
      </section>

      <section className="shell py-14 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="What we do" title="Experience you can talk to, not just a list of brokers." />
          <Reveal>
            <Link to="/services" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald">
              All services <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.07} className="glass lift p-6">
              <IconTile icon={Icon} tone={i % 2 ? 'gold' : 'emerald'} />
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell pb-14 md:pb-24">
        <Reveal className="glass relative overflow-hidden p-6 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow mb-3">Straight talk</p>
              <h2 className="text-3xl leading-tight font-semibold md:text-4xl">Know exactly where we stand.</h2>
              <p className="mt-4 leading-relaxed text-muted">
                {compliance.compensationDisclosure} {compliance.notAdvice}
              </p>
              <Button to="/how-it-works" variant="ghost" className="mt-6">How it works</Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-emerald">We do</h3>
                <ul className="grid gap-3 text-sm">
                  {weDo.slice(0, 4).map((item) => (
                    <li key={item} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-emerald" aria-hidden="true" />{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gold">We don't</h3>
                <ul className="grid gap-3 text-sm">
                  {weDont.map((item) => (
                    <li key={item} className="flex gap-2"><X className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="shell grid gap-4 pb-14 md:grid-cols-2 md:pb-24">
        <Reveal>
          <Link to="/broker-match" className="glass lift group block h-full p-7 md:p-10">
            <IconTile icon={Compass} />
            <h2 className="mt-6 text-2xl font-semibold md:text-3xl">Six questions. Three brokers worth a closer look.</h2>
            <p className="mt-3 leading-relaxed text-muted">Each match explains why it fits you, and what you should check.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald">
              Find my broker match <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        </Reveal>
        <Reveal delay={0.08}>
          <Link to="/learning" className="glass lift group block h-full p-7 md:p-10">
            <IconTile icon={GraduationCap} tone="gold" />
            <h2 className="mt-6 text-2xl font-semibold md:text-3xl">Learn the basics before you risk real money.</h2>
            <p className="mt-3 leading-relaxed text-muted">Short videos and ebooks, each showing exactly what you will learn.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold">
              Explore learning <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        </Reveal>
      </section>

      <section id="faq" className="shell scroll-mt-24">
        <SectionHeading eyebrow="FAQ" title="The questions people ask first." />
        <Reveal className="mt-8">
          <Faqs />
        </Reveal>
      </section>

      <section className="shell pt-14 md:pt-24">
        <Reveal className="glass relative overflow-hidden p-8 text-center md:p-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(36rem_18rem_at_50%_110%,var(--glow-1),transparent_70%)]" aria-hidden="true" />
          <h2 className="text-3xl leading-tight font-semibold md:text-5xl">Start with a conversation.</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">Tell us what you trade and what has gone wrong before. You will get a straight answer, with no obligation to open an account.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/book">
              <CalendarDays className="size-4" aria-hidden="true" />
              Book a Free Consultation
            </Button>
            <Button to="/broker-match" variant="ghost">Find My Broker Match</Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
