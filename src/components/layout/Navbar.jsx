import { NavLink } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import ThemeToggle from './ThemeToggle';

export const mainLinks = [
  { to: '/services', label: 'Services' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/broker-match', label: 'Broker Match' },
  { to: '/partners', label: 'Partners' },
  { to: '/learning', label: 'Learning' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[var(--glass-solid)] backdrop-blur-xl">
      <div className="shell flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {mainLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${isActive ? 'bg-blue/12 text-blue' : 'text-muted hover:text-ink'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden lg:block">
            <Button to="/book" className="!min-h-10 !px-4 !py-2">
              <CalendarDays className="size-4" aria-hidden="true" />
              Book a call
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
