import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Eye, HeartHandshake, ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { IconTile, isBlank, withoutBlanks, PageHeader, PlaceholderText, Reveal, SectionHeading } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSiteData } from '../context/SiteDataContext';

const values = [
  { Icon: Eye, title: 'Transparency', text: 'We tell you how we may be paid, what we cannot do and when a broker is not right for you.' },
  { Icon: HeartHandshake, title: 'Client-first advice', text: 'Your circumstances come first. "This is not for you" is a perfectly good answer from us.' },
  { Icon: ShieldCheck, title: 'Regulated partners only', text: 'We only work with regulated partners, and we show you how to check each licence yourself.' },
];

export default function About() {
  const { company, founder } = useSiteData().data;
  usePageMeta('About', 'Meet the founder of MKPips and the values behind the service: transparency, client-first advice and regulated partners only.');
  const lineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ['start 80%', 'end 60%'] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const highlights = founder.highlights.filter((h) => !isBlank(h));
  const timeline = founder.timeline.filter(({ title }) => !isBlank(title));

  return (
    <>
      <PageHeader eyebrow="About" title="Built on 15+ years of conversations with traders." intro="MKPips exists because choosing a broker should not depend on who has the loudest advert." />

      <section className="shell">
        <Reveal className={`glass grid gap-8 p-6 md:p-10 ${founder.photo ? 'md:grid-cols-[17rem_1fr]' : ''}`}>
          {founder.photo && <img src={founder.photo} alt={withoutBlanks(founder.name)} className="aspect-[4/5] w-full rounded-2xl object-cover" />}
          <div>
            {!isBlank(founder.name) && <h2 className="text-2xl font-semibold md:text-3xl"><PlaceholderText text={founder.name} /></h2>}
            {!isBlank(founder.role) && <p className="mt-2 text-muted"><PlaceholderText text={founder.role} /></p>}
            {!isBlank(founder.bio) && <p className="mt-5 leading-relaxed text-muted"><PlaceholderText text={founder.bio} /></p>}
            <div className="mt-6 flex first:mt-0 flex-wrap items-center gap-x-6 gap-y-4">
              <p className="text-brand font-display text-5xl font-semibold">
                <AnimatedCounter value={company.yearsExperience} suffix="+" />
              </p>
              <p className="max-w-40 text-sm leading-snug text-muted">years in FX and CFD sales</p>
            </div>
            {highlights.length > 0 && (
              <>
                <h3 className="mt-7 mb-3 text-sm font-semibold">Career highlights</h3>
                <ul className="flex flex-wrap gap-2 text-sm">
                  {highlights.map((highlight) => (
                    <li key={highlight}><PlaceholderText text={highlight} /></li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Reveal>
      </section>

      {timeline.length > 0 && <section className="shell pt-16 md:pt-28">
        <SectionHeading eyebrow="Career timeline" title="15+ years in FX and CFD sales." />
        <ol ref={lineRef} className="relative mt-10 grid max-w-3xl gap-8">
          <div className="absolute top-2 bottom-2 left-[7px] w-px bg-line" aria-hidden="true" />
          <motion.div className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-gradient-to-b from-emerald to-gold" style={{ scaleY }} aria-hidden="true" />
          {timeline.map(({ period, title, detail }, i) => (
            <Reveal as="li" key={period} delay={i * 0.04} className="relative pl-10">
              <span className="bg-brand absolute top-1 left-0 size-[15px] rounded-full ring-4 ring-bg" aria-hidden="true" />
              <p className="eyebrow">{period}</p>
              <h3 className="mt-2 text-lg font-semibold"><PlaceholderText text={title} /></h3>
              <p className="mt-2 text-sm leading-relaxed text-muted"><PlaceholderText text={detail} /></p>
            </Reveal>
          ))}
        </ol>
      </section>}

      <section className="shell pt-16 md:pt-28">
        <SectionHeading eyebrow="Values" title="What you can hold us to." />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {values.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08} className="glass lift p-7">
              <IconTile icon={Icon} tone={i === 1 ? 'gold' : 'emerald'} />
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 flex justify-center">
          <Button to="/book">Book a Free Consultation</Button>
        </Reveal>
      </section>
    </>
  );
}
