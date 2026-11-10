import { useId, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/*
 * Looping motion graphics for the four service cards. Pure SVG in the theme colours,
 * so they work in dark and light mode. They only play while on screen, and show a
 * still frame for visitors who prefer reduced motion.
 */

const blue = 'var(--blue)';
const green = 'var(--green)';
const red = 'var(--red)';
const line = 'var(--line)';
const ink = 'var(--ink)';
const muted = 'var(--muted)';
const card = 'var(--glass-hi)';

/** Keyframes on a shared loop when playing; a still value otherwise. */
function useLoop(duration) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-10% 0px' });
  const reduced = useReducedMotion();
  const play = inView && !reduced;
  const loop = (frames, times, still, ease = 'easeInOut') =>
    play
      ? { animate: frames, transition: { duration, times, repeat: Infinity, ease } }
      : { animate: still, transition: { duration: 0.3 } };
  return { ref, loop, play };
}

function Frame({ innerRef, label, children }) {
  const id = useId().replace(/:/g, '');
  return (
    <div ref={innerRef} className="overflow-hidden rounded-2xl border border-line" style={{ background: 'linear-gradient(160deg, var(--glass-hi), transparent 70%)' }}>
      <svg viewBox="0 0 400 180" role="img" aria-label={label} className="block w-full font-sans">
        <defs>
          <pattern id={`${id}-dots`} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill={line} />
          </pattern>
        </defs>
        <rect width="400" height="180" fill={`url(#${id}-dots)`} />
        {children(id)}
      </svg>
    </div>
  );
}

const Check = ({ x, y, r = 9, color = green }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={color} />
    <path d={`M${-r * 0.45} 0 L${-r * 0.1} ${r * 0.35} L${r * 0.5} ${-r * 0.35}`} fill="none" stroke="var(--bg)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

/* 1. Broker selection: a scanner sweeps the field and picks a checked short list. */
function Selection() {
  const D = 6.5;
  const { ref, loop } = useLoop(D);
  const cards = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({ i, x: 65 + (i % 3) * 95, y: 22 + Math.floor(i / 3) * 50 }));
  const picked = [1, 3, 8];
  const passT = (x) => 0.42 * ((x + 40 - 40) / 330);
  return (
    <Frame innerRef={ref} label="A scanner sweeps across a grid of brokers and highlights three that make the short list.">
      {(id) => (
        <>
          <defs>
            <linearGradient id={`${id}-beam`} x1="0" x2="1">
              <stop offset="0" stopColor={blue} stopOpacity="0" />
              <stop offset="0.8" stopColor={blue} stopOpacity="0.35" />
              <stop offset="1" stopColor={blue} stopOpacity="0.9" />
            </linearGradient>
          </defs>
          {cards.map(({ i, x, y }) => {
            const isPick = picked.includes(i);
            const t = Math.min(0.4, passT(x));
            return (
              <g key={i}>
                <rect x={x} y={y} width="80" height="38" rx="9" fill={card} stroke={line} />
                <circle cx={x + 15} cy={y + 19} r="7" fill={[blue, green, red][i % 3]} opacity="0.75" />
                <rect x={x + 28} y={y + 12} width="40" height="5" rx="2.5" fill={muted} opacity="0.55" />
                <rect x={x + 28} y={y + 22} width="28" height="5" rx="2.5" fill={muted} opacity="0.35" />
                {isPick ? (
                  <>
                    <motion.rect x={x} y={y} width="80" height="38" rx="9" fill="none" stroke={green} strokeWidth="2"
                      {...loop({ opacity: [0, 0, 1, 1, 0] }, [0, t, t + 0.04, 0.9, 0.97], { opacity: 1 })} />
                    <motion.g style={{ originX: '50%', originY: '50%' }}
                      {...loop({ scale: [0, 0, 1.2, 1, 1, 0] }, [0, t, t + 0.04, t + 0.08, 0.9, 0.97], { scale: 1 })}>
                      <Check x={x + 78} y={y + 2} r={8} />
                    </motion.g>
                  </>
                ) : (
                  <motion.rect x={x - 1} y={y - 1} width="82" height="40" rx="10" fill="var(--bg-2)"
                    {...loop({ opacity: [0, 0, 0.6, 0.6, 0] }, [0, 0.44, 0.5, 0.9, 0.97], { opacity: 0.6 })} />
                )}
              </g>
            );
          })}
          <motion.g {...loop({ x: [0, 330, 330], opacity: [0, 1, 0] }, [0, 0.42, 0.48], { x: 330, opacity: 0 }, 'linear')}>
            <rect x="0" y="10" width="40" height="160" fill={`url(#${id}-beam)`} />
            <rect x="38" y="10" width="2" height="160" fill={blue} />
          </motion.g>
        </>
      )}
    </Frame>
  );
}

/* 2. Account opening: documents slide in while a three-step progress bar fills. */
function Opening() {
  const D = 7;
  const { ref, loop } = useLoop(D);
  const docs = [
    { label: 'ID', t: 0.04, x: 40, y: 34, rot: -6, color: blue },
    { label: 'Address', t: 0.24, x: 70, y: 44, rot: 3, color: green },
    { label: 'Questions', t: 0.44, x: 100, y: 54, rot: -2, color: red },
  ];
  const steps = [['ID', 0.16], ['Address', 0.36], ['Questions', 0.56]];
  return (
    <Frame innerRef={ref} label="Identity, address and questionnaire documents slide in one by one as a three-step progress bar fills, ending with account ready.">
      {() => (
        <>
          {docs.map(({ label, t, x, y, rot, color }) => (
            <motion.g key={label} {...loop({ x: [-160, -160, 0, 0, -160], opacity: [0, 0, 1, 1, 0] }, [0, t, t + 0.1, 0.9, 0.98], { x: 0, opacity: 1 })}>
              <g transform={`translate(${x} ${y}) rotate(${rot} 55 40)`}>
                <rect width="110" height="80" rx="10" fill={card} stroke={line} />
                <rect width="110" height="16" rx="8" fill={color} opacity="0.85" />
                <rect y="8" width="110" height="8" fill={color} opacity="0.85" />
                {label === 'ID' ? <circle cx="24" cy="46" r="13" fill={muted} opacity="0.4" /> : <rect x="12" y="30" width="22" height="22" rx="4" fill={muted} opacity="0.3" />}
                <rect x="46" y="34" width="50" height="5" rx="2.5" fill={muted} opacity="0.5" />
                <rect x="46" y="46" width="38" height="5" rx="2.5" fill={muted} opacity="0.35" />
                <rect x="46" y="58" width="44" height="5" rx="2.5" fill={muted} opacity="0.35" />
              </g>
            </motion.g>
          ))}
          {steps.map(([label, t], i) => (
            <g key={label} transform={`translate(262 ${40 + i * 34})`}>
              <circle r="10" fill="none" stroke={line} strokeWidth="2" />
              <motion.g style={{ originX: '50%', originY: '50%' }} {...loop({ scale: [0, 0, 1.15, 1, 1, 0] }, [0, t, t + 0.04, t + 0.07, 0.9, 0.98], { scale: 1 })}>
                <Check x={0} y={0} r={10} />
              </motion.g>
              <text x="20" y="4.5" fontSize="13" fill={ink}>{label}</text>
            </g>
          ))}
          <rect x="40" y="152" width="320" height="8" rx="4" fill={line} />
          <motion.rect x="40" y="152" width="320" height="8" rx="4" fill={green} style={{ originX: 0 }}
            {...loop({ scaleX: [0, 0, 0.33, 0.33, 0.66, 0.66, 1, 1, 0] }, [0, 0.12, 0.18, 0.32, 0.38, 0.52, 0.58, 0.9, 0.98], { scaleX: 1 })} />
          <motion.g {...loop({ opacity: [0, 0, 1, 1, 0], y: [6, 6, 0, 0, 6] }, [0, 0.62, 0.68, 0.9, 0.97], { opacity: 1, y: 0 })}>
            <rect x="262" y="126" width="100" height="20" rx="10" fill={green} opacity="0.16" />
            <text x="312" y="140" fontSize="11.5" fontWeight="600" fill={green} textAnchor="middle">Account ready</text>
          </motion.g>
        </>
      )}
    </Frame>
  );
}

/* 3. Trading conditions: a live price with its bid/ask spread band, beside cost bars. */
function Conditions() {
  const D = 6;
  const { ref, loop } = useLoop(D);
  const pts = [[30, 120], [55, 108], [78, 116], [102, 92], [126, 98], [150, 74], [172, 82], [196, 60], [220, 68], [244, 48]];
  const ask = `M${pts.map(([x, y]) => `${x} ${y}`).join(' L')}`;
  const bid = `M${pts.map(([x, y]) => `${x} ${y + 12}`).join(' L')}`;
  const band = `${ask} L${[...pts].reverse().map(([x, y]) => `${x} ${y + 12}`).join(' L')} Z`;
  const bars = [['Spread', blue, [0.35, 0.8, 0.5, 0.35]], ['Comm.', green, [0.6, 0.4, 0.75, 0.6]], ['Swap', red, [0.25, 0.55, 0.3, 0.25]]];
  return (
    <Frame innerRef={ref} label="A price line draws itself with the bid and ask lines forming a spread band, next to bars for spread, commission and swap costs that rise and fall.">
      {() => (
        <>
          {[50, 85, 120, 155].map((y) => <path key={y} d={`M24 ${y} H252`} stroke={line} strokeDasharray="3 5" />)}
          <motion.path d={band} fill={blue} {...loop({ opacity: [0, 0, 0.16, 0.16, 0] }, [0, 0.5, 0.6, 0.9, 0.98], { opacity: 0.16 })} />
          <motion.path d={ask} fill="none" stroke={blue} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
            {...loop({ pathLength: [0, 1, 1, 0], opacity: [1, 1, 1, 0] }, [0, 0.55, 0.92, 1], { pathLength: 1, opacity: 1 })} />
          <motion.path d={bid} fill="none" stroke={green} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="5 4"
            {...loop({ pathLength: [0, 0, 1, 1, 0], opacity: [1, 1, 1, 1, 0] }, [0, 0.03, 0.58, 0.92, 1], { pathLength: 1, opacity: 1 })} />
          <motion.g {...loop({ opacity: [0, 0, 1, 1, 0] }, [0, 0.58, 0.64, 0.9, 0.97], { opacity: 1 })}>
            <path d="M252 48 V60" stroke={ink} strokeWidth="1.5" />
            <path d="M248 48 H256 M248 60 H256" stroke={ink} strokeWidth="1.5" />
            <text x="244" y="34" fontSize="11.5" fontWeight="600" fill={ink} textAnchor="middle">Spread</text>
          </motion.g>
          {bars.map(([label, color, h], i) => {
            const x = 288 + i * 32;
            return (
              <g key={label}>
                <rect x={x} y="40" width="20" height="110" rx="5" fill={line} />
                <motion.rect x={x} y="40" width="20" height="110" rx="5" fill={color} opacity="0.9" style={{ originY: 1 }}
                  {...loop({ scaleY: h }, [0, 0.33, 0.66, 1], { scaleY: h[0] })} />
                <text x={x + 10} y="168" fontSize="9.5" fill={muted} textAnchor="middle">{label}</text>
              </g>
            );
          })}
        </>
      )}
    </Frame>
  );
}

/* 4. Ongoing support: you, MKPips and your broker, with messages going back and forth. */
function Support() {
  const D = 7;
  const { ref, loop } = useLoop(D);
  const you = [70, 95];
  const hub = [200, 60];
  const broker = [330, 95];
  const Node = ({ at: [x, y], color, label, children }) => (
    <g transform={`translate(${x} ${y})`}>
      <circle r="26" fill={card} stroke={color} strokeWidth="2" />
      {children}
      <text y="44" fontSize="12" fill={ink} textAnchor="middle" fontWeight="600">{label}</text>
    </g>
  );
  const Bubble = ({ color }) => (
    <g>
      <rect x="-17" y="-11" width="34" height="22" rx="11" fill={color} />
      {[-7, 0, 7].map((cx) => <circle key={cx} cx={cx} cy="0" r="2.2" fill="var(--bg)" />)}
    </g>
  );
  const along = (a, b, t0, t1) => ({
    x: [a[0], a[0], a[0], b[0], b[0], b[0]],
    y: [a[1] - 30, a[1] - 30, a[1] - 30, b[1] - 30, b[1] - 30, b[1] - 30],
    opacity: [0, 0, 1, 1, 0, 0],
    times: [0, t0, t0 + 0.02, t1, t1 + 0.03, 1],
  });
  const legs = [
    { ...along(you, hub, 0.02, 0.22), color: blue },
    { ...along(hub, broker, 0.3, 0.5), color: blue },
    { ...along(broker, hub, 0.56, 0.74), color: green },
    { ...along(hub, you, 0.78, 0.94), color: green },
  ];
  return (
    <Frame innerRef={ref} label="You, MKPips and your broker are connected. A message travels from you to MKPips and on to the broker, and a reply comes back the same way.">
      {() => (
        <>
          {[[you, hub], [hub, broker]].map(([a, b], i) => (
            <motion.path key={i} d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} stroke={i ? green : blue} strokeWidth="2" strokeDasharray="6 6" opacity="0.7"
              {...loop({ strokeDashoffset: [0, -48] }, [0, 1], { strokeDashoffset: 0 }, 'linear')} />
          ))}
          <motion.circle cx={hub[0]} cy={hub[1]} r="26" fill="none" stroke={blue} strokeWidth="2" style={{ originX: '50%', originY: '50%' }}
            {...loop({ scale: [1, 1.7, 1.7], opacity: [0.6, 0, 0] }, [0, 0.35, 1], { scale: 1, opacity: 0 }, 'easeOut')} />
          <Node at={you} color={blue} label="You">
            <circle cy="-7" r="7" fill={blue} opacity="0.85" />
            <path d="M-12 13 Q0 -2 12 13 Z" fill={blue} opacity="0.85" />
          </Node>
          <Node at={hub} color={green} label="MKPips">
            <path d="M-12 10 L-12 -9 L-4 3 L4 -9 L4 10 M13 -9 L4 1.5 M7.5 -2.5 L13.5 10" fill="none" stroke={green} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          </Node>
          <Node at={broker} color={red} label="Your broker">
            <rect x="-11" y="-6" width="22" height="16" rx="2" fill="none" stroke={red} strokeWidth="2.5" />
            <path d="M-14 -6 L0 -15 L14 -6" fill="none" stroke={red} strokeWidth="2.5" strokeLinejoin="round" />
          </Node>
          {legs.map(({ x, y, opacity, times, color }, i) => (
            <motion.g key={i} {...loop({ x, y, opacity }, times, { x: you[0], y: you[1] - 30, opacity: 0 })}>
              <Bubble color={color} />
            </motion.g>
          ))}
          <motion.g style={{ originX: '50%', originY: '50%' }} {...loop({ scale: [0, 0, 1.2, 1, 0] }, [0, 0.93, 0.96, 0.98, 1], { scale: 0 })}>
            <Check x={you[0] + 22} y={you[1] - 20} r={9} />
          </motion.g>
        </>
      )}
    </Frame>
  );
}

const scenes = { selection: Selection, opening: Opening, conditions: Conditions, support: Support };

export default function ServiceMotion({ name }) {
  const Scene = scenes[name];
  return Scene ? <Scene /> : null;
}
