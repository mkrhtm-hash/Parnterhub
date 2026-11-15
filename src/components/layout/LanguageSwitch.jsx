import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Languages } from 'lucide-react';
import { languages, useI18n } from '../../i18n/I18nContext';

/** English, Urdu or Arabic. Urdu and Arabic switch the whole site to right-to-left. */
export default function LanguageSwitch() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (e.type === 'keydown' ? e.key === 'Escape' : !ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  const current = languages.find((l) => l.code === lang);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('Language: {name}. Change language', { name: current.label })}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 items-center gap-1.5 rounded-full border border-line bg-[var(--glass)] px-3 text-sm font-medium text-ink transition-colors hover:border-blue/60"
      >
        <Languages className="size-[18px]" aria-hidden="true" />
        <span className="hidden sm:inline">{current.label}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute end-0 top-full z-50 mt-2 w-44 rounded-2xl border border-line p-1.5 shadow-2xl"
            style={{ background: 'var(--glass-solid)' }}
          >
            {languages.map((l) => (
              <li key={l.code} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={l.code === lang}
                  lang={l.code}
                  dir={l.dir}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-xl px-3 text-start text-sm font-medium hover:bg-blue/10 ${l.code === lang ? 'text-blue' : ''}`}
                >
                  {l.label}
                  {l.code === lang && <Check className="size-4" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
