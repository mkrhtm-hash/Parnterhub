import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookie } from 'lucide-react';
import Button from '../ui/Button';
import { useCookies } from '../../context/CookieContext';
import { useToast } from '../../context/ToastContext';
import { useT } from '../../i18n/I18nContext';

export default function CookieBanner() {
  const { open, decide } = useCookies();
  const toast = useToast();
  const t = useT();

  const choose = (value) => {
    decide(value);
    toast(value === 'accepted' ? t('Thanks. Your cookie choice is saved.') : t('Declined. Only essential browser storage will be used.'), 'info');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          role="region"
          aria-label={t('Cookie choice')}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed inset-x-3 z-[60] mx-auto max-w-xl rounded-3xl border border-line p-4 shadow-2xl bottom-[calc(4.25rem+env(safe-area-inset-bottom))] lg:end-6 lg:bottom-6 lg:start-auto lg:mx-0 lg:p-5"
          style={{ background: 'var(--glass-solid)' }}
        >
          <div className="flex gap-3">
            <Cookie className="mt-0.5 size-5 shrink-0 text-green" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-muted">
              {t('We use essential browser storage to run this site. Optional cookies would load only if you accept.')}{' '}
              <Link to="/cookies" className="font-medium text-ink underline underline-offset-2">{t('Cookie Policy')}</Link>
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="ghost" className="!min-h-11 !py-2" onClick={() => choose('declined')}>{t('Decline')}</Button>
            <Button className="!min-h-11 !py-2" onClick={() => choose('accepted')}>{t('Accept')}</Button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
