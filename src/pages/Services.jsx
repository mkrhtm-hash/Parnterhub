import { ArrowRight, BriefcaseBusiness, Check, ChartLine, Compass, Handshake, LifeBuoy, Network, UserRound } from 'lucide-react';
import Button from '../components/ui/Button';
import { IconTile, PageHeader, Reveal, SectionHeading } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';

const services = [
  {
    Icon: Compass,
    title: 'Broker selection consulting',
    text: 'We turn your location, experience and priorities into a short list you can check yourself.',
    points: ['Availability in your country', 'Licence and legal entity check', 'A clear reason for every option'],
  },
  {
    Icon: Handshake,
    title: 'Account opening support',
    text: 'Opening an account should not feel like guesswork. We explain each stage before you reach it.',
    points: ['What documents brokers usually ask for', 'What suitability questions mean', 'Who to contact if it stalls'],
  },
  {
    Icon: ChartLine,
    title: 'Trading conditions review',
    text: 'Headline spreads rarely tell the whole story. We look at what trading actually costs you.',
    points: ['Spreads and commissions', 'Leverage limits for your client type', 'Execution and order handling'],
  },
  {
    Icon: LifeBuoy,
    title: 'Ongoing relationship support',
    text: 'Our help does not stop once you open an account. If something goes wrong, you have someone to call.',
    points: ['Help escalating issues with your broker', 'Guidance on formal complaint routes', 'A check-in when your needs change'],
  },
];

const paths = [
  {
    Icon: UserRound,
    audience: 'Retail traders',
    title: 'Start with the protections that apply to you.',
    text: 'We focus on suitable regulation, clear costs and sensible account set-up. If you are new, we will also tell you what to learn first.',
    cta: 'Find my broker match',
    to: '/broker-match',
  },
  {
    Icon: BriefcaseBusiness,
    audience: 'Professional traders',
    title: 'Sharper conditions, with the trade-offs made clear.',
    text: 'We review pricing, execution and account structure. Professional status can mean giving up some retail protections, so we go through that with you first.',
    cta: 'Talk through my set-up',
    to: '/book?path=professional',
  },
  {
    Icon: Network,
    audience: 'Introducing partners',
    title: 'Build broker relationships properly.',
    text: 'If you introduce clients, we can talk through partner structures, disclosure and what to check with your local regulator before you start.',
    cta: 'Discuss a partnership',
    to: '/book?path=partner',
  },
];

export default function Services() {
  usePageMeta('Services', 'Broker selection, account opening support, trading conditions reviews and ongoing relationship support for FX and CFD traders.');
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Practical help, from your first question to your broker relationship."
        intro="MKPips helps you choose and work with a regulated broker. Trading decisions, and the risks that come with them, remain yours."
      />

      <section className="shell grid gap-4 md:grid-cols-2">
        {services.map(({ Icon, title, text, points }, i) => (
          <Reveal key={title} delay={i * 0.06} className="glass lift p-7 md:p-9">
            <IconTile icon={Icon} tone={i === 1 || i === 2 ? 'gold' : 'emerald'} />
            <h2 className="mt-6 text-2xl font-semibold">{title}</h2>
            <p className="mt-3 leading-relaxed text-muted">{text}</p>
            <ul className="mt-5 grid gap-2.5 text-sm">
              {points.map((point) => (
                <li key={point} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </section>

      <section className="shell pt-16 md:pt-28">
        <SectionHeading eyebrow="Your path" title="Different traders need different conversations." />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {paths.map(({ Icon, audience, title, text, cta, to }, i) => (
            <Reveal key={audience} delay={i * 0.08} className="glass lift flex flex-col p-7">
              <div className="flex items-center gap-3">
                <IconTile icon={Icon} tone={i === 1 ? 'gold' : 'emerald'} />
                <p className="text-sm font-semibold">{audience}</p>
              </div>
              <h3 className="mt-6 text-xl font-semibold">{title}</h3>
              <p className="mt-3 mb-6 flex-1 text-sm leading-relaxed text-muted">{text}</p>
              <Button to={to} variant="ghost" className="w-full">
                {cta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
