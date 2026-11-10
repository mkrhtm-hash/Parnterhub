import { useId, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/*
 * Looping motion graphics for the four service cards. Pure SVG in the theme colours, so they
 * stay sharp at any size and work in dark and light mode. They only play while on screen and
 * show a still frame for visitors who prefer reduced motion.
 */

const blue = 'var(--blue)';
const green = 'var(--green)';
const red = 'var(--red)';
const line = 'var(--line)';
const ink = 'var(--ink)';
const muted = 'var(--muted)';
const card = 'var(--glass-solid)';

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

/** The panel: drifting coloured light, a fine dot grid and shared filters and gradients. */
function Frame({ innerRef, play, label, children }) {
  const id = useId().replace(/:/g, '');
  const drift = (dx, dy, dur) => (play ? { animate: { x: [0, dx, 0], y: [0, dy, 0] }, transition: { duration: dur, repeat: Infinity, ease: 'easeInOut' } } : {});
  return (
    <div ref={innerRef} className="overflow-hidden rounded-2xl border border-line" style={{ background: 'linear-gradient(160deg, var(--glass-hi), transparent 75%)' }}>
      <svg viewBox="0 0 400 180" role="img" aria-label={label} className="block w-full font-sans" shapeRendering="geometricPrecision">
        <defs>
          <pattern id={`${id}-dots`} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.9" fill={line} />
          </pattern>
          <filter id={`${id}-blur`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="26" /></filter>
          <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.28" /></filter>
          <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id={`${id}-bg`} x1="0" x2="1"><stop offset="0" stopColor={blue} /><stop offset="1" stopColor={green} /></linearGradient>
          <linearGradient id={`${id}-gr`} x1="0" x2="1"><stop offset="0" stopColor={green} /><stop offset="1" stopColor={red} /></linearGradient>
          <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.14" /><stop offset="0.5" stopColor="#fff" stopOpacity="0" /></linearGradient>
        </defs>
        <motion.circle cx="70" cy="40" r="70" fill={blue} opacity="0.22" filter={`url(#${id}-blur)`} {...drift(40, 30, 9)} />
        <motion.circle cx="330" cy="150" r="70" fill={green} opacity="0.18" filter={`url(#${id}-blur)`} {...drift(-50, -25, 11)} />
        <rect width="400" height="180" fill={`url(#${id}-dots)`} />
        {children(id)}
      </svg>
    </div>
  );
}

const Tick = ({ r = 9, color = green }) => (
  <g>
    <circle r={r} fill={color} />
    <path d={`M${-r * 0.45} 0 L${-r * 0.1} ${r * 0.36} L${r * 0.5} ${-r * 0.36}`} fill="none" stroke="#fff" strokeWidth={r * 0.24} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

/** A small glassy card with a sheen across its top half. */
const Glass = ({ id, x, y, w, h, r = 10, stroke = line }) => (
  <g filter={`url(#${id}-shadow)`}>
    <rect x={x} y={y} width={w} height={h} rx={r} fill={card} stroke={stroke} />
    <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h / 2} rx={r} fill={`url(#${id}-sheen)`} />
  </g>
);

/* 1. Broker selection: a scanner sweeps the field; three cards lift, glow and make the short list. */
function Selection() {
  const D = 6.5;
  const { ref, loop, play } = useLoop(D);
  const cards = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({ i, x: 72 + (i % 3) * 88, y: 14 + Math.floor(i / 3) * 44 }));
  const picked = [1, 3, 8];
  const reach = (x) => Math.min(0.42, 0.42 * Math.max(0, x + 37 - 40) / 330);
  return (
    <Frame innerRef={ref} play={play} label="A scanner sweeps across a grid of brokers. Three lift, glow and get a tick, and a badge shows three matches.">
      {(id) => (
        <>
          <defs>
            <linearGradient id={`${id}-beam`} x1="0" x2="1">
              <stop offset="0" stopColor={blue} stopOpacity="0" />
              <stop offset="0.85" stopColor={blue} stopOpacity="0.28" />
              <stop offset="1" stopColor={blue} stopOpacity="0.75" />
            </linearGradient>
          </defs>
          {cards.map(({ i, x, y }) => {
            const isPick = picked.includes(i);
            const t = reach(x);
            const colour = [blue, green, red][i % 3];
            const body = (
              <>
                <Glass id={id} x={x} y={y} w={76} h={34} r={9} />
                <circle cx={x + 15} cy={y + 17} r="7.5" fill={colour} />
                <circle cx={x + 15} cy={y + 17} r="7.5" fill={`url(#${id}-sheen)`} />
                <rect x={x + 28} y={y + 11} width="38" height="4.5" rx="2.25" fill={muted} opacity="0.6" />
                <rect x={x + 28} y={y + 20} width="26" height="4.5" rx="2.25" fill={muted} opacity="0.35" />
              </>
            );
            if (!isPick) {
              return (
                <motion.g key={i} {...loop({ opacity: [1, 1, 0.35, 0.35, 1] }, [0, 0.44, 0.5, 0.9, 0.97], { opacity: 0.35 })}>{body}</motion.g>
              );
            }
            return (
              <motion.g key={i} {...loop({ y: [0, 0, -5, -5, 0] }, [0, t, t + 0.05, 0.9, 0.97], { y: -5 })}>
                <motion.rect x={x - 2} y={y - 2} width="80" height="38" rx="11" fill="none" stroke={green} strokeWidth="2.5" filter={`url(#${id}-glow)`}
                  {...loop({ opacity: [0, 0, 1, 1, 0] }, [0, t, t + 0.04, 0.9, 0.97], { opacity: 1 })} />
                {body}
                <motion.g style={{ originX: '50%', originY: '50%' }} {...loop({ scale: [0, 0, 1.25, 1, 1, 0] }, [0, t, t + 0.04, t + 0.08, 0.9, 0.97], { scale: 1 })}>
                  <g transform={`translate(${x + 74} ${y + 2})`}><Tick r={8} /></g>
                </motion.g>
              </motion.g>
            );
          })}
          <motion.g {...loop({ x: [0, 330, 330], opacity: [0, 1, 0] }, [0, 0.42, 0.48], { x: 330, opacity: 0 }, 'linear')}>
            <rect x="0" y="6" width="40" height="140" fill={`url(#${id}-beam)`} />
            <rect x="38" y="6" width="2.5" height="140" rx="1.25" fill={blue} filter={`url(#${id}-glow)`} />
          </motion.g>
          <motion.g style={{ originX: '50%', originY: '50%' }} {...loop({ opacity: [0, 0, 1, 1, 0], scale: [0.8, 0.8, 1, 1, 0.8] }, [0, 0.52, 0.58, 0.9, 0.97], { opacity: 1, scale: 1 })}>
            <rect x="148" y="150" width="104" height="24" rx="12" fill={`url(#${id}-bg)`} filter={`url(#${id}-glow)`} />
            <text x="200" y="166.5" fontSize="12.5" fontWeight="700" fill="#fff" textAnchor="middle">3 matches</text>
          </motion.g>
        </>
      )}
    </Frame>
  );
}

/* 2. Account opening: documents slide in and get ticked off while a gradient progress bar fills. */
function Opening() {
  const D = 7;
  const { ref, loop, play } = useLoop(D);
  const docs = [
    { label: 'ID', t: 0.04, x: 26, y: 26, rot: -7, color: blue },
    { label: 'Address', t: 0.24, x: 60, y: 36, rot: 2, color: green },
    { label: 'Questions', t: 0.44, x: 94, y: 46, rot: -2, color: red },
  ];
  const steps = [['ID', 0.16], ['Address', 0.36], ['Questions', 0.56]];
  return (
    <Frame innerRef={ref} play={play} label="Identity, address and questionnaire documents slide in and are ticked off while a progress bar fills, ending with account ready.">
      {(id) => (
        <>
          {docs.map(({ label, t, x, y, rot, color }) => (
            <motion.g key={label} {...loop({ x: [-170, -170, 0, 0, -170], opacity: [0, 0, 1, 1, 0] }, [0, t, t + 0.1, 0.9, 0.98], { x: 0, opacity: 1 })}>
              <g transform={`translate(${x} ${y}) rotate(${rot} 58 42)`}>
                <Glass id={id} x={0} y={0} w={116} h={84} r={11} />
                <path d="M0 11 a11 11 0 0 1 11 -11 h94 a11 11 0 0 1 11 11 v7 h-116 Z" fill={color} />
                <path d="M0 11 a11 11 0 0 1 11 -11 h94 a11 11 0 0 1 11 11 v7 h-116 Z" fill={`url(#${id}-sheen)`} />
                <text x="10" y="13" fontSize="9" fontWeight="700" fill="#fff" letterSpacing="0.5">{label.toUpperCase()}</text>
                {label === 'ID' ? (
                  <g transform="translate(25 50)">
                    <circle r="15" fill={color} opacity="0.18" />
                    <circle cy="-4" r="5.5" fill={color} />
                    <path d="M-9 10 Q0 -1 9 10 Z" fill={color} />
                  </g>
                ) : (
                  <rect x="12" y="34" width="24" height="28" rx="4" fill={color} opacity="0.18" />
                )}
                <rect x="48" y="36" width="54" height="5" rx="2.5" fill={muted} opacity="0.55" />
                <rect x="48" y="48" width="40" height="5" rx="2.5" fill={muted} opacity="0.35" />
                <rect x="48" y="60" width="46" height="5" rx="2.5" fill={muted} opacity="0.35" />
              </g>
            </motion.g>
          ))}
          <Glass id={id} x={250} y={18} w={132} h={108} r={14} />
          {steps.map(([label, t], i) => (
            <g key={label} transform={`translate(272 ${42 + i * 30})`}>
              <circle r="10" fill="none" stroke={line} strokeWidth="2" />
              <motion.g style={{ originX: '50%', originY: '50%' }} {...loop({ scale: [0, 0, 1.2, 1, 1, 0] }, [0, t, t + 0.04, t + 0.07, 0.9, 0.98], { scale: 1 })}>
                <Tick r={10} />
              </motion.g>
              <text x="20" y="4.5" fontSize="13" fontWeight="500" fill={ink}>{label}</text>
            </g>
          ))}
          <motion.g style={{ originX: '50%', originY: '50%' }} {...loop({ opacity: [0, 0, 1, 1, 0], scale: [0.85, 0.85, 1, 1, 0.85] }, [0, 0.62, 0.68, 0.9, 0.97], { opacity: 1, scale: 1 })}>
            <rect x="262" y="136" width="108" height="22" rx="11" fill={`url(#${id}-bg)`} filter={`url(#${id}-glow)`} />
            <text x="316" y="151" fontSize="12" fontWeight="700" fill="#fff" textAnchor="middle">Account ready</text>
          </motion.g>
          <rect x="26" y="164" width="214" height="7" rx="3.5" fill={line} />
          <motion.rect x="26" y="164" width="214" height="7" rx="3.5" fill={`url(#${id}-bg)`} style={{ originX: 0 }} filter={`url(#${id}-glow)`}
            {...loop({ scaleX: [0, 0, 0.33, 0.33, 0.66, 0.66, 1, 1, 0] }, [0, 0.12, 0.18, 0.32, 0.38, 0.52, 0.58, 0.9, 0.98], { scaleX: 1 })} />
        </>
      )}
    </Frame>
  );
}

/* 3. Trading conditions: the chart is revealed left to right, a glowing marker riding the price. */
function Conditions() {
  const D = 6;
  const { ref, loop, play } = useLoop(D);
  const pts = [[24, 124], [48, 110], [70, 118], [94, 92], [118, 100], [142, 74], [164, 84], [188, 60], [212, 70], [238, 46]];
  const ask = `M${pts.map(([x, y]) => `${x} ${y}`).join(' L')}`;
  const bid = `M${pts.map(([x, y]) => `${x} ${y + 11}`).join(' L')}`;
  const area = `${ask} L238 168 L24 168 Z`;
  const band = `${ask} L${[...pts].reverse().map(([x, y]) => `${x} ${y + 11}`).join(' L')} Z`;
  const candles = [[40, 96, 140], [70, 104, 146], [100, 80, 128], [130, 86, 120], [160, 64, 112], [190, 52, 98], [220, 42, 90]];
  const tTip = (x) => 0.55 * ((x - 24) / (238 - 24));
  const bars = [['Spread', blue, [0.35, 0.8, 0.5, 0.35]], ['Comm.', green, [0.6, 0.4, 0.75, 0.6]], ['Swap', red, [0.25, 0.55, 0.3, 0.25]]];
  return (
    <Frame innerRef={ref} play={play} label="A price chart is revealed from left to right with a glowing marker on the price, the gap to the bid line shaded as the spread, beside bars for spread, commission and swap costs.">
      {(id) => (
        <>
          <defs>
            <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={blue} stopOpacity="0.35" /><stop offset="1" stopColor={blue} stopOpacity="0" /></linearGradient>
            <clipPath id={`${id}-reveal`}>
              <motion.rect x="18" y="0" width="232" height="180" style={{ originX: 0 }} {...loop({ scaleX: [0, 1, 1, 0] }, [0, 0.55, 0.92, 1], { scaleX: 1 })} />
            </clipPath>
            {bars.map(([label, colour]) => (
              <linearGradient key={label} id={`${id}-bar-${label.replace('.', '')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={colour} /><stop offset="1" stopColor={colour} stopOpacity="0.45" /></linearGradient>
            ))}
          </defs>
          {[46, 80, 114, 148].map((y) => <path key={y} d={`M18 ${y} H252`} stroke={line} strokeDasharray="2 5" />)}
          {candles.map(([x, top, bottom], i) => (
            <g key={x} opacity="0.22">
              <path d={`M${x} ${top - 8} V${bottom + 6}`} stroke={i % 3 === 1 ? red : green} strokeWidth="1.5" />
              <rect x={x - 5} y={top} width="10" height={bottom - top} rx="2" fill={i % 3 === 1 ? red : green} />
            </g>
          ))}
          <g clipPath={`url(#${id}-reveal)`}>
            <path d={area} fill={`url(#${id}-area)`} />
            <path d={band} fill={blue} opacity="0.2" />
            <path d={bid} fill="none" stroke={green} strokeWidth="2" strokeLinejoin="round" strokeDasharray="5 4" />
            <path d={ask} fill="none" stroke={blue} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" filter={`url(#${id}-glow)`} />
          </g>
          <motion.g {...loop(
            { x: [...pts.map(([x]) => x), 238, 238], y: [...pts.map(([, y]) => y), 46, 46], opacity: [...pts.map(() => 1), 1, 0] },
            [...pts.map(([x]) => tTip(x)), 0.92, 1],
            { x: 238, y: 46, opacity: 1 },
            'linear',
          )}>
            <circle r="9" fill={blue} opacity="0.25" />
            <circle r="4.5" fill="#fff" stroke={blue} strokeWidth="2.5" />
          </motion.g>
          <motion.g {...loop({ opacity: [0, 0, 1, 1, 0] }, [0, 0.58, 0.64, 0.9, 0.97], { opacity: 1 })}>
            <path d="M250 46 V57 M246 46 H254 M246 57 H254" stroke={ink} strokeWidth="1.5" />
            <rect x="208" y="20" width="56" height="18" rx="9" fill={card} stroke={line} />
            <text x="236" y="32.5" fontSize="10.5" fontWeight="700" fill={ink} textAnchor="middle">Spread</text>
          </motion.g>
          <Glass id={id} x={264} y={22} w={124} h={150} r={14} />
          {bars.map(([label, , h], i) => {
            const x = 276 + i * 38;
            return (
              <g key={label}>
                <rect x={x} y="36" width="22" height="108" rx="6" fill={line} />
                <motion.rect x={x} y="36" width="22" height="108" rx="6" fill={`url(#${id}-bar-${label.replace('.', '')})`} style={{ originY: 1 }}
                  {...loop({ scaleY: h }, [0, 0.33, 0.66, 1], { scaleY: h[0] })} />
                <text x={x + 11} y="160" fontSize="9" fontWeight="500" fill={muted} textAnchor="middle">{label}</text>
              </g>
            );
          })}
        </>
      )}
    </Frame>
  );
}

/** The engraved MK monogram from the site logo, as a nested SVG. */
function MkMark({ id, x, y, size }) {
  return (
    <svg x={x - size / 2} y={y - size / 2} width={size} height={size} viewBox="0 0 48 48" overflow="visible">
      <defs>
        <linearGradient id={`${id}-m`} gradientUnits="userSpaceOnUse" x1="12" y1="15" x2="26" y2="33"><stop offset="0" stopColor={blue} /><stop offset="1" stopColor={green} /></linearGradient>
        <linearGradient id={`${id}-k`} gradientUnits="userSpaceOnUse" x1="26" y1="15" x2="36" y2="33"><stop offset="0" stopColor={green} /><stop offset="1" stopColor={red} /></linearGradient>
      </defs>
      <g fill="none" strokeWidth="4.2" strokeLinecap="square" strokeLinejoin="miter" strokeMiterlimit="6">
        <g transform="translate(0 1)" stroke="#020611" opacity="0.45">
          <path d="M12 33 L12 15 L19 25 L26 15 L26 33" />
          <path d="M35 15 L26 25.5 M29.6 21.4 L36 33" />
        </g>
        <path d="M12 33 L12 15 L19 25 L26 15 L26 33" stroke={`url(#${id}-m)`} />
        <path d="M35 15 L26 25.5 M29.6 21.4 L36 33" stroke={`url(#${id}-k)`} />
        <g transform="translate(-0.5 -0.6)" stroke="#fff" strokeWidth="0.8" opacity="0.4">
          <path d="M12 33 L12 15 L19 25 L26 15 L26 33" />
          <path d="M35 15 L26 25.5 M29.6 21.4 L36 33" />
        </g>
      </g>
    </svg>
  );
}

/* 4. Ongoing support: you, MKPips and your broker, with messages travelling between you. */
function Support() {
  const D = 7;
  const { ref, loop, play } = useLoop(D);
  const you = [70, 100];
  const hub = [200, 66];
  const broker = [330, 100];
  const along = (a, b, t0, t1) => ({
    x: [a[0], a[0], a[0], b[0], b[0], b[0]],
    y: [a[1] - 46, a[1] - 46, a[1] - 46, b[1] - 46, b[1] - 46, b[1] - 46],
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
    <Frame innerRef={ref} play={play} label="You, MKPips and your broker are connected. A message travels from you to MKPips and on to the broker, and a reply comes back the same way.">
      {(id) => (
        <>
          <defs>
            {[['you', blue], ['hub', green], ['broker', red]].map(([k, c]) => (
              <radialGradient key={k} id={`${id}-${k}`} cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor={c} stopOpacity="0.35" /><stop offset="1" stopColor={c} stopOpacity="0.06" /></radialGradient>
            ))}
            <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={blue} /><stop offset="0.5" stopColor={green} /><stop offset="1" stopColor={red} /></linearGradient>
            <linearGradient id={`${id}-word`} x1="0" x2="1"><stop offset="0" stopColor={blue} /><stop offset="0.35" stopColor={blue} /><stop offset="1" stopColor={green} /></linearGradient>
          </defs>

          {[[you, hub, `url(#${id}-bg)`], [hub, broker, `url(#${id}-gr)`]].map(([a, b, stroke], i) => (
            <g key={i}>
              <path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} stroke={line} strokeWidth="5" strokeLinecap="round" />
              <motion.path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} stroke={stroke} strokeWidth="2.5" strokeDasharray="2 9" strokeLinecap="round"
                {...loop({ strokeDashoffset: [0, -44] }, [0, 1], { strokeDashoffset: 0 }, 'linear')} />
            </g>
          ))}

          {/* MKPips hub: pulse, a slowly turning ring and the engraved MK mark. */}
          <motion.circle cx={hub[0]} cy={hub[1]} r="30" fill="none" stroke={green} strokeWidth="2" style={{ originX: '50%', originY: '50%' }}
            {...loop({ scale: [1, 1.65, 1.65], opacity: [0.55, 0, 0] }, [0, 0.35, 1], { scale: 1, opacity: 0 }, 'easeOut')} />
          <g filter={`url(#${id}-shadow)`}>
            <circle cx={hub[0]} cy={hub[1]} r="30" fill={card} />
            <circle cx={hub[0]} cy={hub[1]} r="30" fill={`url(#${id}-hub)`} />
          </g>
          <g>
            {play && <animateTransform attributeName="transform" type="rotate" from={`0 ${hub[0]} ${hub[1]}`} to={`360 ${hub[0]} ${hub[1]}`} dur="14s" repeatCount="indefinite" />}
            <circle cx={hub[0]} cy={hub[1]} r="35" fill="none" stroke={`url(#${id}-ring)`} strokeWidth="2" strokeDasharray="40 14" strokeLinecap="round" />
            <circle cx={hub[0]} cy={hub[1] - 35} r="3" fill={blue} />
            <circle cx={hub[0] + 30.3} cy={hub[1] + 17.5} r="3" fill={green} />
            <circle cx={hub[0] - 30.3} cy={hub[1] + 17.5} r="3" fill={red} />
          </g>
          <MkMark id={id} x={hub[0]} y={hub[1]} size={46} />
          <text x={hub[0]} y={hub[1] + 56} fontSize="16" fontWeight="800" letterSpacing="-0.3" textAnchor="middle" fill={`url(#${id}-word)`}>MKPips</text>

          {/* You */}
          <g filter={`url(#${id}-shadow)`}>
            <circle cx={you[0]} cy={you[1]} r="24" fill={card} stroke={blue} strokeWidth="2" />
            <circle cx={you[0]} cy={you[1]} r="24" fill={`url(#${id}-you)`} />
          </g>
          <circle cx={you[0]} cy={you[1] - 6} r="6.5" fill={blue} />
          <path d={`M${you[0] - 11} ${you[1] + 12} Q${you[0]} ${you[1] - 2} ${you[0] + 11} ${you[1] + 12} Z`} fill={blue} />
          <text x={you[0]} y={you[1] + 42} fontSize="12" fontWeight="600" fill={ink} textAnchor="middle">You</text>

          {/* Your broker */}
          <g filter={`url(#${id}-shadow)`}>
            <circle cx={broker[0]} cy={broker[1]} r="24" fill={card} stroke={red} strokeWidth="2" />
            <circle cx={broker[0]} cy={broker[1]} r="24" fill={`url(#${id}-broker)`} />
          </g>
          <g fill={red}>
            <path d={`M${broker[0] - 12} ${broker[1] - 5} L${broker[0]} ${broker[1] - 13} L${broker[0] + 12} ${broker[1] - 5} Z`} />
            {[-8, -2.5, 3].map((dx) => <rect key={dx} x={broker[0] + dx} y={broker[1] - 3} width="4" height="12" rx="1" />)}
            <rect x={broker[0] - 12} y={broker[1] + 10} width="24" height="3" rx="1.5" />
          </g>
          <text x={broker[0]} y={broker[1] + 42} fontSize="12" fontWeight="600" fill={ink} textAnchor="middle">Your broker</text>

          {legs.map(({ x, y, opacity, times, color }, i) => (
            <motion.g key={i} {...loop({ x, y, opacity }, times, { x: you[0], y: you[1] - 46, opacity: 0 })}>
              <g filter={`url(#${id}-glow)`}>
                <rect x="-18" y="-11" width="36" height="22" rx="11" fill={color} />
                <path d="M-4 10 L0 16 L4 10 Z" fill={color} />
              </g>
              {[-7.5, 0, 7.5].map((cx) => <circle key={cx} cx={cx} cy="0" r="2.3" fill="#fff" />)}
            </motion.g>
          ))}
          <motion.g style={{ originX: '50%', originY: '50%' }} {...loop({ scale: [0, 0, 1.25, 1, 0] }, [0, 0.93, 0.96, 0.98, 1], { scale: 0 })}>
            <g transform={`translate(${you[0] + 20} ${you[1] - 20})`}><Tick r={9} /></g>
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
