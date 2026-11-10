import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Clock } from 'lucide-react';
import { Reveal } from './Primitives';

/**
 * Numbered steps joined by a line that draws in as it scrolls into view.
 * row: steps sit side by side on large screens (up to 5); otherwise one column.
 * Each step: { Icon, title, meta?, text?, learn?: string[], learnLabel?, tag?, cta?: { label, to } }
 */
export default function Pathway({ steps, row = false, label }) {
  const reduced = useReducedMotion();
  const drawn = (axis) => (reduced ? {} : { initial: { [axis]: 0 }, whileInView: { [axis]: 1 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 1.1, ease: 'easeInOut' } });
  const cols = { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' }[steps.length];

  return (
    <ol aria-label={label} className={`relative grid gap-5 ${row ? `${cols} lg:gap-4` : 'mx-auto max-w-3xl md:gap-6'}`}>
      {/* Down the left on small screens (and always in a column). */}
      <span aria-hidden="true" className={`absolute top-6 bottom-6 left-6 w-0.5 rounded bg-line ${row ? 'lg:hidden' : 'md:left-7'}`} />
      <motion.span aria-hidden="true" {...drawn('scaleY')} style={{ originY: 0 }} className={`absolute top-6 bottom-6 left-6 w-0.5 rounded bg-gradient-to-b from-blue via-green to-red ${row ? 'lg:hidden' : 'md:left-7'}`} />
      {/* Across the top on large screens. */}
      {row && (
        <>
          <span aria-hidden="true" className="absolute top-6 right-[10%] left-[10%] hidden h-0.5 rounded bg-line lg:block" />
          <motion.span aria-hidden="true" {...drawn('scaleX')} style={{ originX: 0 }} className="absolute top-6 right-[10%] left-[10%] hidden h-0.5 rounded bg-gradient-to-r from-blue via-green to-red lg:block" />
        </>
      )}

      {steps.map(({ Icon, title, meta, text, learn, learnLabel = 'You will learn', tag, cta }, i) => (
        <Reveal as="li" key={title} delay={i * 0.07} className={`relative pl-16 ${row ? 'lg:flex lg:flex-col lg:pl-0' : 'md:pl-20'}`}>
          <span className={`bg-brand absolute top-0 left-0 z-10 grid size-12 place-items-center rounded-full font-display text-lg font-semibold ring-4 ring-bg ${row ? 'lg:relative lg:mx-auto' : 'md:size-14'}`}>
            {i + 1}
          </span>
          <div className={`glass lift flex h-full flex-col p-5 md:p-6 ${row ? 'lg:mt-5' : ''}`}>
            <div className="flex items-start justify-between gap-3">
              <Icon className="size-6 text-blue" aria-hidden="true" />
              {tag && <span className="rounded-full bg-green/12 px-2.5 py-0.5 text-[11px] font-semibold text-green">{tag}</span>}
            </div>
            <h3 className="mt-3 text-lg font-semibold leading-snug">{title}</h3>
            {meta && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
                <Clock className="size-3.5 shrink-0" aria-hidden="true" />
                {meta}
              </p>
            )}
            {text && <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>}
            {learn && (
              <>
                <p className="mt-4 text-xs font-semibold">{learnLabel}</p>
                <ul className="mt-2 grid gap-1.5 text-sm text-muted">
                  {learn.map((item) => (
                    <li key={item} className="flex gap-2 leading-snug">
                      <Check className="mt-0.5 size-4 shrink-0 text-green" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {cta && (
              <Link to={cta.to} className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-sm font-semibold text-blue">
                {cta.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
