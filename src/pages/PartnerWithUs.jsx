import {
  BadgeCheck, BookOpen, CalendarDays, Check, FileSignature, GraduationCap, Handshake, LifeBuoy, Megaphone,
  MessagesSquare, PhoneCall, Rocket, Settings2, ShieldCheck, Store, UserRound, Users, X,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Pathway from '../components/ui/Pathway';
import { IconTile, PageHeader, Reveal, SectionHeading } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';

const audiences = [
  { Icon: Handshake, title: 'Introducing brokers', text: 'You already refer clients and want regulated brokers and a clear agreement behind you.' },
  { Icon: GraduationCap, title: 'Educators and communities', text: 'You teach or run a trading group, and your members ask which broker to use.' },
  { Icon: Megaphone, title: 'Content creators', text: 'You publish about markets and want partnerships you can explain openly to your audience.' },
  { Icon: Store, title: 'Businesses', text: 'You serve people who trade, and want to offer them a trusted route to a broker.' },
];

const benefits = [
  { Icon: ShieldCheck, title: 'Regulated broker partners', text: 'A choice of brokers, each with a licence you and your clients can check on the regulator\'s own register.' },
  { Icon: Settings2, title: 'A deal shaped around you', text: 'The structure is set for your region, your audience and the brokers that suit them, not copied from a template.' },
  { Icon: UserRound, title: 'One partner manager', text: 'A single contact from your first call through setup and every review after it.' },
  { Icon: BookOpen, title: 'Education for your clients', text: 'Our videos, eBooks and learning pathway, free to share, so your clients start with the basics.' },
  { Icon: BadgeCheck, title: 'Compliant marketing', text: 'We review your wording and materials before they go live, including the risk warnings and disclosures.' },
  { Icon: LifeBuoy, title: 'Support when clients need it', text: 'Help with onboarding questions and with raising issues with the broker on your clients\' behalf.' },
];

const steps = [
  { Icon: MessagesSquare, title: 'Tell us about you', text: 'Your audience, the regions you serve and how you reach people. A short form is all it takes.' },
  { Icon: PhoneCall, title: 'Discovery call', text: 'We talk through your goals, your clients and which regulated brokers fit them.' },
  { Icon: Settings2, title: 'Your customised proposal', text: 'Broker options and a deal structure built for your region, audience and expected activity.' },
  { Icon: FileSignature, title: 'Agreement and compliance check', text: 'A written agreement with the broker, your disclosure wording, and a check of the rules where you operate.' },
  { Icon: Rocket, title: 'Onboarding', text: 'Your partner links and tracking, education materials and a walkthrough of the broker\'s partner tools.' },
  { Icon: Users, title: 'Ongoing support', text: 'Regular reviews, help with client questions, and the deal revisited as your partnership grows.' },
];

const shapedBy = [
  'The regions you serve and the rules that apply there',
  'Which regulated brokers suit your audience',
  'How active your clients are expected to be',
  'The way you prefer the arrangement to be structured, for example per client or by trading activity',
];

const expectations = [
  [true, 'Tell people that you may be paid for referrals'],
  [true, 'Show the risk warning wherever you promote trading'],
  [true, 'Follow the rules on promoting brokers where you and your clients live'],
  [false, 'Promise profits or returns, or call trading safe'],
  [false, 'Hold client money, or log in to accounts for clients'],
  [false, 'Give trading signals presented as advice'],
];

export default function PartnerWithUs() {
  usePageMeta('Partner with us', 'Refer clients to regulated FX and CFD brokers with MKPips: a clear partner pathway, compliant marketing support and customised deals.');

  return (
    <>
      <PageHeader
        eyebrow="Partner with us"
        title="Refer clients to regulated brokers, on terms built for you."
        intro="For introducing brokers, educators, communities and creators who want to work with regulated FX and CFD brokers, with clear rules and real support."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button to="/book?path=partner">
            <CalendarDays className="size-4" aria-hidden="true" />
            Discuss a customised deal
          </Button>
          <Button to="#pathway" variant="ghost">See the partner pathway</Button>
        </div>
      </PageHeader>

      <section className="shell">
        <SectionHeading eyebrow="Who it is for" title="Built for people clients already trust." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.06} className="glass lift p-6">
              <IconTile icon={Icon} tone={['blue', 'green', 'red', 'blue'][i]} />
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell pt-16 md:pt-28">
        <SectionHeading eyebrow="What you get" title="Everything you need to refer clients properly." />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.05} className="glass lift p-6 md:p-7">
              <IconTile icon={Icon} tone={['blue', 'green', 'red'][i % 3]} />
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell pt-16 md:pt-28">
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue via-green to-red p-[2px]">
          <div className="grid gap-8 rounded-[calc(1.5rem-2px)] p-7 md:grid-cols-[1.1fr_1fr] md:p-12" style={{ background: 'var(--bg-2)' }}>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green/12 px-3 py-1 text-xs font-semibold text-green">
                <Settings2 className="size-3.5" aria-hidden="true" />
                Customised deals available
              </span>
              <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">No two partners are the same, so no two deals are either.</h2>
              <p className="mt-4 leading-relaxed text-muted">
                Tell us how you work and who you serve. We put together a proposal with the broker that fits, and you see every term in writing before you agree to anything.
              </p>
              <Button to="/book?path=partner" className="mt-7">
                Request a customised deal
              </Button>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Each deal is shaped by</h3>
              <ul className="mt-4 grid gap-3">
                {shapedBy.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-green" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-2xl border border-line bg-[var(--glass)] p-4 text-xs leading-relaxed text-muted">
                Terms depend on the broker, your region and local rules, and are agreed in writing with the broker. We do not promise any level of income.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="pathway" className="shell scroll-mt-24 pt-16 md:pt-28">
        <SectionHeading eyebrow="Partner pathway" title="From first message to an active partnership." intro="Six steps. You can stop at any point, and nothing is agreed until you sign." />
        <div className="mt-12">
          <Pathway steps={steps} label="Partner pathway" />
        </div>
      </section>

      <section className="shell pt-16 md:pt-28">
        <SectionHeading eyebrow="Ground rules" title="What we ask of every partner." />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Reveal className="glass p-6 md:p-8">
            <h3 className="text-sm font-semibold text-green">Partners always</h3>
            <ul className="mt-4 grid gap-3">
              {expectations.filter(([ok]) => ok).map(([, text]) => (
                <li key={text} className="flex gap-3 text-sm leading-relaxed text-muted"><Check className="mt-0.5 size-4 shrink-0 text-green" aria-hidden="true" />{text}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.06} className="glass p-6 md:p-8">
            <h3 className="text-sm font-semibold text-red">Partners never</h3>
            <ul className="mt-4 grid gap-3">
              {expectations.filter(([ok]) => !ok).map(([, text]) => (
                <li key={text} className="flex gap-3 text-sm leading-relaxed text-muted"><X className="mt-0.5 size-4 shrink-0 text-red" aria-hidden="true" />{text}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="glass mt-10 flex flex-col items-start justify-between gap-5 p-7 md:flex-row md:items-center md:p-10">
          <div>
            <h2 className="text-2xl font-semibold">Ready to talk it through?</h2>
            <p className="mt-2 leading-relaxed text-muted">Book a call and tell us about your audience. We will come back with options, not pressure.</p>
          </div>
          <Button to="/book?path=partner" className="shrink-0">
            <CalendarDays className="size-4" aria-hidden="true" />
            Discuss a customised deal
          </Button>
        </Reveal>
        <p className="mt-6 text-xs leading-relaxed text-faint">
          MKPips introduces clients to regulated brokers and may receive compensation from them. Partner arrangements are subject to each broker&apos;s approval and to the rules where you and your clients are based.
        </p>
      </section>
    </>
  );
}
