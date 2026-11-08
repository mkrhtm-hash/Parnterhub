import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';

/** Fades content up as it scrolls into view. */
export function Reveal({ children, delay = 0, className = '', as = 'div' }) {
  const Component = motion[as];
  return (
    <Component
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
    >
      {children}
    </Component>
  );
}

export function SectionHeading({ eyebrow, title, intro, align = 'left', as: Heading = 'h2', className = '' }) {
  const centered = align === 'center';
  return (
    <Reveal className={`${centered ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <Heading className="text-3xl font-semibold leading-[1.12] md:text-5xl">{title}</Heading>
      {intro && <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{intro}</p>}
    </Reveal>
  );
}

export function PageHeader({ eyebrow, title, intro, children }) {
  return (
    <header className="shell pt-10 pb-8 md:pt-20 md:pb-14">
      <SectionHeading as="h1" eyebrow={eyebrow} title={title} intro={intro} />
      {children}
    </header>
  );
}

export function SampleBadge({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-dashed border-gold/60 bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold ${className}`}>
      <FlaskConical className="size-3" aria-hidden="true" />
      Sample data
    </span>
  );
}

/**
 * Prints text and gives any [bracketed placeholder] a dashed gold highlight,
 * so unfinished content is obvious anywhere it appears.
 */
export function PlaceholderText({ text }) {
  const parts = String(text).split(/(\[[^\]]+\])/g);
  return parts.map((part, i) =>
    part.startsWith('[') && part.endsWith(']') ? (
      <span key={i} className="placeholder-tag">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function IconTile({ icon: Icon, tone = 'emerald' }) {
  const tones = {
    emerald: 'bg-emerald/12 text-emerald',
    gold: 'bg-gold/12 text-gold',
  };
  return (
    <span className={`inline-flex size-11 shrink-0 items-center justify-center rounded-2xl ${tones[tone]}`}>
      <Icon className="size-5" aria-hidden="true" />
    </span>
  );
}
