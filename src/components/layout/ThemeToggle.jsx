import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useT } from '../../i18n/I18nContext';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  const t = useT();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t('Switch to light mode') : t('Switch to dark mode')}
      className="grid size-11 place-items-center overflow-hidden rounded-full border border-line bg-[var(--glass)] text-ink transition-colors hover:border-blue/60"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 14, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 40 }}
          transition={{ duration: 0.18 }}
        >
          {dark ? <Sun className="size-[18px]" aria-hidden="true" /> : <Moon className="size-[18px]" aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
