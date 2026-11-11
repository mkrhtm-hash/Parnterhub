import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, ClipboardList, ListChecks, PhoneCall, Rocket, X } from 'lucide-react';
import Button from '../components/ui/Button';
import { IconTile, PageHeader, Reveal } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { weDo, weDont } from '../data/staticContent';
import StanceList from '../components/ui/StanceList';

const steps = [
  { Icon: PhoneCall, title: 'Discovery call', text: 'A free conversation about where you are, what you want to trade and any problems you have had before.' },
  { Icon: ClipboardList, title: 'Needs assessment', text: 'We map your country, experience, instruments, platform, deposit range and priorities. This also tells us what would not suit you.' },
  { Icon: ListChecks, title: 'Broker shortlist', text: 'You get a short list with reasons, trade-offs and licence details you can verify yourself.' },
  { Icon: Rocket, title: 'Guided onboarding', text: 'If you choose to proceed, we help you through account opening and stay available afterwards.' },
];

export default function HowItWorks() {
  usePageMeta('How It Works', 'Four clear steps from a discovery call to guided onboarding, and a plain statement of what MKPips does and does not do.');
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 75%', 'end 60%'] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <>
      <PageHeader eyebrow="How it works" title="Four steps. No pressure at any of them." intro="You can stop at any point. Whether you open an account, and with whom, is your decision." />

      <section className="shell">
        <ol ref={timelineRef} className="relative mx-auto grid max-w-3xl gap-6 md:gap-8">
          <div className="absolute top-3 bottom-3 left-[1.35rem] w-px bg-line md:left-[1.85rem]" aria-hidden="true" />
          <motion.div
            className="absolute top-3 bottom-3 left-[1.35rem] w-px origin-top bg-gradient-to-b from-blue via-green to-red md:left-[1.85rem]"
            style={{ scaleY }}
            aria-hidden="true"
          />
          {steps.map(({ Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={0.05} className="relative pl-14 md:pl-20">
              <span className="bg-brand absolute top-5 left-0 grid size-11 place-items-center rounded-full font-display text-sm font-semibold md:top-6 md:size-[3.75rem] md:text-lg">
                {i + 1}
              </span>
              <div className="glass lift p-6 md:p-7">
                <Icon className="size-5 text-blue" aria-hidden="true" />
                <h2 className="mt-3 text-xl font-semibold md:text-2xl">{title}</h2>
                <p className="mt-2 leading-relaxed text-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="shell pt-16 md:pt-28">
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal className="glass p-7 md:p-9">
            <IconTile icon={Check} />
            <h2 className="mt-5 text-2xl font-semibold md:text-3xl">What we do</h2>
            <div className="mt-6"><StanceList items={weDo} kind="do" large /></div>
          </Reveal>
          <Reveal delay={0.08} className="glass p-7 md:p-9">
            <IconTile icon={X} tone="red" />
            <h2 className="mt-5 text-2xl font-semibold md:text-3xl">What we don't do</h2>
            <div className="mt-6"><StanceList items={weDont} kind="dont" large /></div>
            <p className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-muted">
              If anyone claiming to be from MKPips offers to do these things, please do not proceed. Contact us directly.
            </p>
          </Reveal>
        </div>
        <Reveal className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/book">Book a Free Consultation</Button>
          <Button to="/broker-match" variant="ghost">Find My Broker Match</Button>
        </Reveal>
      </section>
    </>
  );
}
