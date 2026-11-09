import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

// The M is one route through the five service steps, in the order a client moves through them.
const steps = [
  { label: 'Your goals', x: 5, y: 26 },
  { label: 'Regulation check', x: 9.5, y: 7 },
  { label: 'Trading conditions', x: 16, y: 18 },
  { label: 'Account opening', x: 22.5, y: 7 },
  { label: 'Ongoing support', x: 27, y: 26 },
];
const route = `M${steps.map(({ x, y }) => `${x} ${y}`).join(' L')}`;

const LOOP_SECONDS = 8;
const ENTRANCE_SECONDS = 1.4;
const TRAVEL_START = 0.05;
const TRAVEL_END = 0.55;

// Where each step falls in the loop, so the pip keeps a steady speed along the route.
const distances = steps.reduce((sum, step, i) => {
  if (i === 0) return [0];
  return [...sum, sum[i - 1] + Math.hypot(step.x - steps[i - 1].x, step.y - steps[i - 1].y)];
}, []);
const arrivals = distances.map((d) => TRAVEL_START + (TRAVEL_END - TRAVEL_START) * (d / distances[distances.length - 1]));

const loop = { duration: LOOP_SECONDS, repeat: Infinity, ease: 'linear', delay: ENTRANCE_SECONDS };
const pipPath = { ...loop, times: [0, ...arrivals, 1] };

function Step({ x, y, index, fill }) {
  const at = arrivals[index];
  return (
    <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.16, duration: 0.35, ease: 'backOut' }}>
      <motion.circle
        cx={x}
        cy={y}
        r="2.8"
        fill={fill}
        animate={{ scale: [1, 1, 1.35, 1, 1] }}
        transition={{ ...loop, times: [0, at - 0.03, at, at + 0.05, 1] }}
      />
    </motion.g>
  );
}

export function LogoMark({ className = 'size-7' }) {
  const id = useId();
  const reduced = useReducedMotion();
  const stroke = `url(#${id})`;
  const fill = stroke;

  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="5" y1="7" x2="27" y2="26">
          <stop offset="0" stopColor="var(--emerald)" />
          <stop offset="1" stopColor="var(--gold)" />
        </linearGradient>
      </defs>

      {reduced ? (
        <>
          <path d={route} fill="none" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          {steps.map(({ label, x, y }) => (
            <circle key={label} cx={x} cy={y} r="2.8" fill={fill} />
          ))}
        </>
      ) : (
        <>
          <motion.path
            d={route}
            fill="none"
            stroke={stroke}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
          {steps.map(({ label, x, y }, index) => (
            <Step key={label} x={x} y={y} index={index} fill={fill} />
          ))}
          <motion.circle
            r="1"
            fill="#ffffff"
            initial={{ cx: steps[0].x, cy: steps[0].y, opacity: 0 }}
            animate={{
              cx: [steps[0].x, ...steps.map((s) => s.x), steps[4].x],
              cy: [steps[0].y, ...steps.map((s) => s.y), steps[4].y],
              opacity: [0, 1, 1, 0, 0],
            }}
            transition={{
              cx: pipPath,
              cy: pipPath,
              opacity: { ...loop, times: [0, TRAVEL_START, TRAVEL_END, TRAVEL_END + 0.05, 1] },
            }}
          />
        </>
      )}
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
