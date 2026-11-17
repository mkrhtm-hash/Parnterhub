import { NavLink } from 'react-router-dom';
import { CalendarDays, CircleUserRound } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import ThemeToggle from './ThemeToggle';
import LanguageSwitch from './LanguageSwitch';
import { useT } from '../../i18n/I18nContext';

export const mainLinks = [
  { to: '/services', label: 'Services' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/broker-match', label: 'Broker Match' },
  { to: '/partners', label: 'Partners' },
  { to: '/learning', label: 'Learning' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const t = useT();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[var(--glass-solid)] backdrop-blur-xl">
      <div className="shell flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Logo />
        <nav aria-label={t('Main')} className="hidden items-center gap-1 lg:flex">
          {mainLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${isActive ? 'bg-blue/12 text-blue' : 'text-muted hover:text-ink'}`
              }
            >
              {t(label)}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <ThemeToggle />
          <NavLink
            to="/account"
            aria-label={t('My Journey')}
            title={t('My Journey')}
            className={({ isActive }) => `hidden size-10 place-items-center rounded-full border border-line transition-colors lg:grid ${isActive ? 'bg-blue/12 text-blue' : 'text-muted hover:text-ink'}`}
          >
            <CircleUserRound className="size-5" aria-hidden="true" />
          </NavLink>
          <div className="hidden lg:block">
            <Button to="/book" className="!min-h-10 !px-4 !py-2">
              <CalendarDays className="size-4" aria-hidden="true" />
              {t('Book a call')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
