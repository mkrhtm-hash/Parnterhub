import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CalendarDays, CircleHelp, Compass, Ellipsis, GraduationCap, Handshake, House, Layers, ListChecks, Network, UserRound, X } from 'lucide-react';

const primary = [
  { to: '/', label: 'Home', Icon: House, end: true },
  { to: '/broker-match', label: 'Match', Icon: Compass },
  { to: '/partners', label: 'Partners', Icon: Handshake },
  { to: '/book', label: 'Book', Icon: CalendarDays },
];

const more = [
  { to: '/services', label: 'Services', Icon: Layers },
  { to: '/how-it-works', label: 'How It Works', Icon: ListChecks },
  { to: '/learning', label: 'Learning', Icon: GraduationCap },
  { to: '/partner-with-us', label: 'Partner with us', Icon: Network },
  { to: '/about', label: 'About', Icon: UserRound },
  { to: '/risk-disclosure', label: 'Risk Disclosure', Icon: BookOpen },
  { to: '/#faq', label: 'FAQ', Icon: CircleHelp },
];

const tabClass = (active) =>
  `flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${active ? 'text-blue' : 'text-muted'}`;

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => setOpen(false), [pathname, hash]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.nav
              aria-label="More pages"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="fixed inset-x-3 z-50 rounded-3xl border border-line p-3 shadow-2xl lg:hidden"
              style={{ background: 'var(--glass-solid)', bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
            >
              <ul className="grid grid-cols-2 gap-1">
                {more.map(({ to, label, Icon }) => (
                  <li key={to}>
                    <NavLink to={to} className="flex min-h-12 items-center gap-2.5 rounded-2xl px-3 text-sm font-medium hover:bg-blue/10">
                      <Icon className="size-4 text-blue" aria-hidden="true" />
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <nav
        aria-label="Primary mobile"
        className="fixed inset-x-0 bottom-0 z-50 flex border-t border-line backdrop-blur-xl lg:hidden"
        style={{ background: 'var(--glass-solid)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {primary.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => tabClass(isActive && !open)}>
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
        <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className={tabClass(open)}>
          {open ? <X className="size-5" aria-hidden="true" /> : <Ellipsis className="size-5" aria-hidden="true" />}
          More
        </button>
      </nav>
    </>
  );
}
