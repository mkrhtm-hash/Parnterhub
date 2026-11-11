import { useId } from 'react';

/** A gold coin with a confident smile: used beside a broker's highlights. */
export default function SmileCoin({ className = 'size-10' }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-face`} cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset="0.45" stopColor="#f6c945" />
          <stop offset="1" stopColor="#c98a12" />
        </radialGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe48a" />
          <stop offset="0.5" stopColor="#b8780c" />
          <stop offset="1" stopColor="#ffd45c" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.8" floodColor="#7a4d00" floodOpacity="0.45" />
        </filter>
      </defs>
      <g filter={`url(#${id}-shadow)`}>
        <circle cx="24" cy="24" r="21" fill={`url(#${id}-rim)`} />
        <circle cx="24" cy="24" r="17.5" fill={`url(#${id}-face)`} />
        <circle cx="24" cy="24" r="17.5" fill="none" stroke="#a86f08" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="1.6 2.2" />
      </g>
      {/* Confident face: one relaxed eye, one wink, a lifted smile. */}
      <g fill="none" stroke="#6b4300" strokeWidth="2.4" strokeLinecap="round">
        <path d="M16.5 20.5 Q18.5 18.4 20.5 20.5" />
        <path d="M27.5 20.2 Q29.6 19.4 31.5 20.6" />
        <path d="M16.5 26.5 Q24.5 34.5 32 25" />
        <path d="M31 24.3 L32.6 25.6" />
      </g>
      <ellipse cx="17.5" cy="15.5" rx="5" ry="2.6" fill="#fff" opacity="0.45" transform="rotate(-30 17.5 15.5)" />
    </svg>
  );
}
