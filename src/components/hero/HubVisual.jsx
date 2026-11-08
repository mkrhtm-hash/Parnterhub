import { motion } from 'framer-motion';
import { ChartLine, Handshake, LifeBuoy, Scale, UserRound } from 'lucide-react';
import { HubMark } from '../ui/Logo';

// Positions are percentages of the visual, which keeps it fluid at any width.
const nodes = [
  { label: 'Your goals', Icon: UserRound, x: 50, y: 7 },
  { label: 'Regulation check', Icon: Scale, x: 83, y: 33 },
  { label: 'Trading conditions', Icon: ChartLine, x: 75, y: 88 },
  { label: 'Account opening', Icon: Handshake, x: 25, y: 88 },
  { label: 'Ongoing support', Icon: LifeBuoy, x: 17, y: 33 },
];

/** Shows the service as a hub. It contains no broker names, logos or figures. */
export default function HubVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[32rem]" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
        <defs>
          <linearGradient id="hub-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--emerald)" />
            <stop offset="1" stopColor="var(--gold)" />
          </linearGradient>
          <radialGradient id="hub-glow">
            <stop offset="0" stopColor="var(--emerald)" stopOpacity="0.34" />
            <stop offset="1" stopColor="var(--emerald)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="30" fill="url(#hub-glow)" />
        <circle cx="50" cy="50" r="39" fill="none" stroke="var(--line)" strokeWidth="0.25" strokeDasharray="0.8 1.4" />
        <circle cx="50" cy="50" r="23" fill="none" stroke="var(--line)" strokeWidth="0.25" />
        {nodes.map((n, i) => (
          <g key={n.label}>
            <path d={`M50 50 L${n.x} ${n.y}`} stroke="url(#hub-line)" strokeOpacity="0.35" strokeWidth="0.35" gradientUnits="userSpaceOnUse" />
            <motion.circle
              r="0.9"
              fill="var(--gold)"
              animate={{ cx: [50, n.x, 50], cy: [50, n.y, 50], opacity: [0, 1, 0] }}
              transition={{ duration: 7, delay: i * 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </g>
        ))}
      </svg>

      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="glass absolute top-1/2 left-1/2 flex size-[29%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 !rounded-full"
      >
        <HubMark className="size-9" />
        <span className="text-brand font-display text-sm font-semibold">Partnerhub</span>
      </motion.div>

      {nodes.map((n, i) => (
        <motion.div
          key={n.label}
          className="absolute"
          style={{ left: `${n.x}%`, top: `${n.y}%`, x: '-50%', y: '-50%' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, i % 2 ? 6 : -6, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-2 rounded-2xl border border-line px-3 py-2 text-xs font-medium whitespace-nowrap shadow-lg backdrop-blur-xl"
            style={{ background: 'var(--glass-solid)' }}
          >
            <n.Icon className="size-4 text-emerald" />
            {n.label}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
