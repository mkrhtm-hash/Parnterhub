import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { PlaceholderText } from './Primitives';

function Item({ q, a, open, onToggle }) {
  const id = useId();
  return (
    <div className="border-b border-line last:border-b-0">
      <h3 className="text-base font-medium md:text-lg">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-7"
        >
          {q}
          <ChevronDown className={`size-5 shrink-0 text-blue transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 leading-relaxed text-muted md:px-7 md:pb-6">
              <PlaceholderText text={a} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="glass overflow-hidden">
      {items.map((item, i) => (
        <Item key={item.q} {...item} open={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
      ))}
    </div>
  );
}
