import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

// An engraved MK monogram inside a globe. The M's right leg is also the K's stem.
// Three partner nodes (blue, green, red) circle the globe on a connected orbit.
const M_PATH = 'M12 33 L12 15 L19 25 L26 15 L26 33';
const K_PATH = 'M35 15 L26 25.5 M29.6 21.4 L36 33';
const ORBIT_R = 21.5;
const NODES = [
  { angle: -90, color: 'var(--blue)' },
  { angle: 30, color: 'var(--green)' },
  { angle: 150, color: 'var(--red)' },
];
const at = (angle) => {
  const r = (angle * Math.PI) / 180;
  return { x: 24 + ORBIT_R * Math.cos(r), y: 24 + ORBIT_R * Math.sin(r) };
};

// Short arcs that link each node to the next, so the ring reads as a connected network.
const links = NODES.map(({ angle }, i) => {
  const from = at(angle + 14);
  const to = at(NODES[(i + 1) % NODES.length].angle - 14 + (i === NODES.length - 1 ? 360 : 0));
  return `M${from.x.toFixed(2)} ${from.y.toFixed(2)} A${ORBIT_R} ${ORBIT_R} 0 0 1 ${to.x.toFixed(2)} ${to.y.toFixed(2)}`;
});

function Letters({ id, draw }) {
  const stroke = { fill: 'none', strokeWidth: 3.8, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 6 };
  const Path = draw ? motion.path : 'path';
  const anim = (delay) => (draw ? { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 0.9, delay, ease: 'easeInOut' } } : {});
  return (
    <>
      {/* Cut shadow: sits a little lower so the letters look carved into the face. */}
      <g transform="translate(0 0.9)" opacity="0.55">
        <Path d={M_PATH} stroke="#020611" {...stroke} {...anim(0)} />
        <Path d={K_PATH} stroke="#020611" {...stroke} {...anim(0.35)} />
      </g>
      <Path d={M_PATH} stroke={`url(#${id}-m)`} {...stroke} {...anim(0)} />
      <Path d={K_PATH} stroke={`url(#${id}-k)`} {...stroke} {...anim(0.35)} />
      {/* Bevel highlight along the top edge of each stroke. */}
      <g transform="translate(-0.45 -0.6)" opacity="0.35">
        <Path d={M_PATH} stroke="#ffffff" {...stroke} strokeWidth="0.7" {...anim(0.1)} />
        <Path d={K_PATH} stroke="#ffffff" {...stroke} strokeWidth="0.7" {...anim(0.45)} />
      </g>
    </>
  );
}

function Orbit() {
  return (
    <>
      {links.map((d, i) => (
        <path key={d} d={d} fill="none" stroke={NODES[i].color} strokeWidth="1.1" strokeLinecap="round" opacity="0.75" />
      ))}
      {NODES.map(({ angle, color }) => {
        const { x, y } = at(angle);
        return (
          <g key={angle}>
            <circle cx={x} cy={y} r="3.3" fill={color} opacity="0.25" />
            <circle cx={x} cy={y} r="2.1" fill={color} />
          </g>
        );
      })}
    </>
  );
}

export function LogoMark({ className = 'size-8' }) {
  const id = useId().replace(/:/g, '');
  const reduced = useReducedMotion();

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-m`} gradientUnits="userSpaceOnUse" x1="12" y1="15" x2="26" y2="33">
          <stop offset="0" stopColor="var(--blue)" />
          <stop offset="1" stopColor="var(--green)" />
        </linearGradient>
        <linearGradient id={`${id}-k`} gradientUnits="userSpaceOnUse" x1="26" y1="15" x2="36" y2="33">
          <stop offset="0" stopColor="var(--green)" />
          <stop offset="1" stopColor="var(--red)" />
        </linearGradient>
        <radialGradient id={`${id}-face`} cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="var(--blue)" stopOpacity="0.24" />
          <stop offset="1" stopColor="var(--blue)" stopOpacity="0.04" />
        </radialGradient>
      </defs>

      {/* Globe: face, outline, two meridians and two parallels. */}
      <circle cx="24" cy="24" r="17.5" fill={`url(#${id}-face)`} stroke="var(--blue)" strokeOpacity="0.55" strokeWidth="0.9" />
      <g fill="none" stroke="var(--blue)" strokeOpacity="0.28" strokeWidth="0.6">
        <ellipse cx="24" cy="24" rx="7.5" ry="17.5" />
        <ellipse cx="24" cy="24" rx="14" ry="17.5" />
        <path d="M8.2 16.5 Q24 21 39.8 16.5 M8.2 31.5 Q24 27 39.8 31.5" />
      </g>

      <g>
        {!reduced && <animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="24s" repeatCount="indefinite" />}
        <Orbit />
      </g>

      <Letters id={id} draw={!reduced} />
    </svg>
  );
}

export default function Logo({ className = '' }) {
  return (
    <Link to="/" aria-label="MKPips home" className={`inline-flex min-h-11 items-center gap-2 ${className}`}>
      <LogoMark />
      <span className="text-brand font-display text-xl font-bold tracking-tight">MKPips</span>
    </Link>
  );
}
