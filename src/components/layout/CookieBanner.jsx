import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookie } from 'lucide-react';
import Button from '../ui/Button';
import { useCookies } from '../../context/CookieContext';
import { useToast } from '../../context/ToastContext';

export default function CookieBanner() {
  const { open, decide } = useCookies();
  const toast = useToast();

  const choose = (value) => {
    decide(value);
    toast(value === 'accepted' ? 'Thanks. Your cookie choice is saved.' : 'Declined. Only essential browser storage will be used.', 'info');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          role="region"
          aria-label="Cookie choice"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed inset-x-3 z-[60] mx-auto max-w-xl rounded-3xl border border-line p-4 shadow-2xl bottom-[calc(4.25rem+env(safe-area-inset-bottom))] lg:right-6 lg:bottom-6 lg:left-auto lg:mx-0 lg:p-5"
          style={{ background: 'var(--glass-solid)' }}
        >
          <div className="flex gap-3">
            <Cookie className="mt-0.5 size-5 shrink-0 text-green" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-muted">
              We use essential browser storage to run this site. Optional cookies would load only if you accept.{' '}
              <Link to="/cookies" className="font-medium text-ink underline underline-offset-2">Cookie Policy</Link>
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="ghost" className="!min-h-11 !py-2" onClick={() => choose('declined')}>Decline</Button>
            <Button className="!min-h-11 !py-2" onClick={() => choose('accepted')}>Accept</Button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
