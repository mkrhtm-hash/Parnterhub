import { useId } from 'react';
import { Link } from 'react-router-dom';

export function HubMark({ className = 'size-7' }) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--emerald)" />
          <stop offset="1" stopColor="var(--gold)" />
        </linearGradient>
      </defs>
      <path d="M16 16 6 6M16 16l10-8M16 16 6 26M16 16l10 10" stroke={`url(#${id})`} strokeWidth="2" strokeLinecap="round" />
      <g fill={`url(#${id})`}>
        <circle cx="6" cy="6" r="3" />
        <circle cx="26" cy="8" r="3" />
        <circle cx="6" cy="26" r="3" />
        <circle cx="26" cy="26" r="3" />
        <circle cx="16" cy="16" r="5" />
      </g>
    </svg>
  );
}

export default function Logo({ className = '' }) {
  return (
    <Link to="/" aria-label="Partnerhub home" className={`inline-flex min-h-11 items-center gap-2 ${className}`}>
      <HubMark />
      <span className="text-brand font-display text-xl font-bold tracking-tight">Partnerhub</span>
    </Link>
  );
}
