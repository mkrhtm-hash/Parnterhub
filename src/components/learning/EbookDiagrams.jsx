import { ArrowRight, Check, FileText, Home, IdCard, PiggyBank, Receipt, Wallet, X } from 'lucide-react';

/*
 * Diagrams for the eBooks. Every number is a made-up round example that matches the text.
 * Colours come from the theme, so the diagrams work in dark mode, light mode and print.
 */

const ink = 'var(--ink)';
const muted = 'var(--muted)';
const line = 'var(--line)';
const blue = 'var(--blue)';
const green = 'var(--green)';
const red = 'var(--red)';

function Svg({ label, height, children }) {
  return (
    <svg viewBox={`0 0 400 ${height}`} role="img" aria-label={label} className="block w-full font-sans" style={{ maxHeight: `${height * 1.6}px` }}>
      {children}
    </svg>
  );
}

const T = ({ x, y, size = 12, fill = muted, weight = 400, anchor = 'start', children }) => (
  <text x={x} y={y} fontSize={size} fill={fill} fontWeight={weight} textAnchor={anchor}>{children}</text>
);

/* ---------- Generic layouts ---------- */

const toneClass = { blue: 'border-blue/45 bg-blue/8', green: 'border-green/45 bg-green/8', red: 'border-red/45 bg-red/8', plain: 'border-line bg-[var(--glass)]' };

/** Boxes in a row with arrows or symbols between them. Stacks on narrow screens. */
function Flow({ steps, ops = [] }) {
  return (
    <ol className="flex flex-col items-stretch gap-2 sm:flex-row">
      {steps.map((s, i) => (
        <li key={s.title} className="contents">
          {i > 0 && (
            <span aria-hidden="true" className="grid shrink-0 place-items-center text-lg font-semibold text-muted">
              {ops[i - 1] ?? <ArrowRight className="size-4 rotate-90 sm:rotate-0" />}
            </span>
          )}
          <div className={`flex-1 rounded-2xl border p-3.5 ${toneClass[s.tone ?? 'plain']}`}>
            {s.value && <p className="font-display text-xl font-semibold tabular-nums">{s.value}</p>}
            <p className={`${s.value ? 'mt-0.5 text-xs text-muted' : 'text-sm font-semibold'}`}>{s.title}</p>
            {s.text && <p className="mt-1 text-xs leading-relaxed text-muted">{s.text}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Two columns of yes/no points. */
function Compare({ columns }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {columns.map((col) => (
        <div key={col.title} className={`rounded-2xl border p-4 ${toneClass[col.tone]}`}>
          <p className="text-sm font-semibold">{col.title}</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {col.items.map(([good, text]) => (
              <li key={text} className="flex gap-2 leading-snug">
                {good ? <Check className="mt-0.5 size-4 shrink-0 text-green" aria-label="Yes" /> : <X className="mt-0.5 size-4 shrink-0 text-red" aria-label="No" />}
                <span className="text-muted">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Icon cards. One can be highlighted. */
function Cards({ cards }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map(({ Icon, title, text, tone = 'plain', tag }) => (
        <div key={title} className={`rounded-2xl border p-4 ${toneClass[tone]}`}>
          <div className="flex items-start justify-between gap-2">
            <Icon className={`size-6 ${tone === 'red' ? 'text-red' : tone === 'green' ? 'text-green' : 'text-blue'}`} aria-hidden="true" />
            {tag && <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone === 'red' ? 'bg-red/12 text-red' : 'bg-green/12 text-green'}`}>{tag}</span>}
          </div>
          <p className="mt-3 text-sm font-semibold">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{text}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- FX and CFD basics ---------- */

function LongShort() {
  const panel = (x, title, points, longGains) => (
    <g>
      <rect x={x} y="8" width="185" height="190" rx="14" fill="none" stroke={line} />
      <T x={x + 92.5} y="32" size={13} fill={ink} weight={600} anchor="middle">{title}</T>
      <polyline points={points} fill="none" stroke={blue} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={points.split(' ')[0].split(',')[0]} cy={points.split(' ')[0].split(',')[1]} r="4" fill={blue} />
      <T x={x + 92.5} y="160" size={12} fill={ink} anchor="middle">Long (bought): <tspan fill={longGains ? green : red} fontWeight="700">{longGains ? 'gain' : 'loss'}</tspan></T>
      <T x={x + 92.5} y="182" size={12} fill={ink} anchor="middle">Short (sold): <tspan fill={longGains ? red : green} fontWeight="700">{longGains ? 'loss' : 'gain'}</tspan></T>
    </g>
  );
  return (
    <Svg height={206} label="Two charts. When the price rises, a long position gains and a short position loses. When the price falls, a long position loses and a short position gains.">
      {panel(8, 'If the price rises', '25,128 50,115 70,121 95,98 120,103 145,78 180,58', true)}
      {panel(207, 'If the price falls', '224,58 249,71 269,65 294,88 319,83 344,108 379,128', false)}
    </Svg>
  );
}

function Quote() {
  return (
    <Svg height={210} label="EUR/USD quote. EUR is the base currency and USD the quote currency. You sell at the bid of 1.0850 and buy at the ask of 1.0851. The gap between them is the spread.">
      <T x={140} y={48} size={30} fill={blue} weight={700} anchor="middle">EUR</T>
      <T x={200} y={48} size={30} fill={muted} weight={300} anchor="middle">/</T>
      <T x={260} y={48} size={30} fill={green} weight={700} anchor="middle">USD</T>
      <T x={140} y={70} anchor="middle">Base currency</T>
      <T x={260} y={70} anchor="middle">Quote currency</T>
      <rect x="30" y="92" width="150" height="74" rx="14" fill={red} fillOpacity="0.08" stroke={red} strokeOpacity="0.5" />
      <T x={105} y={116} anchor="middle">You SELL at the bid</T>
      <T x={105} y={148} size={24} fill={ink} weight={700} anchor="middle">1.0850</T>
      <rect x="220" y="92" width="150" height="74" rx="14" fill={blue} fillOpacity="0.08" stroke={blue} strokeOpacity="0.5" />
      <T x={295} y={116} anchor="middle">You BUY at the ask</T>
      <T x={295} y={148} size={24} fill={ink} weight={700} anchor="middle">1.0851</T>
      <path d="M182 129 H218" stroke={muted} strokeDasharray="3 3" />
      <T x={200} y={196} size={12} fill={ink} anchor="middle">The gap is the <tspan fontWeight="700">spread</tspan>: 0.0001, or 1 pip</T>
    </Svg>
  );
}

function PipLadder() {
  const ticks = [['1.0880', 40], ['1.0870', 85], ['1.0860', 130], ['1.0850', 175]];
  const lots = [['Standard lot · 100,000', '$10', 175], ['Mini lot · 10,000', '$1', 17.5], ['Micro lot · 1,000', '$0.10', 3]];
  return (
    <Svg height={232} label="A price ladder from 1.0850 to 1.0880, a move of 30 pips. One pip on EUR/USD is worth 10 dollars on a standard lot, 1 dollar on a mini lot and 10 cents on a micro lot.">
      {ticks.map(([label, y]) => (
        <g key={label}>
          <T x={20} y={y + 4} size={12} fill={ink}>{label}</T>
          <path d={`M72 ${y} H118`} stroke={line} strokeDasharray="4 3" />
        </g>
      ))}
      <path d="M135 172 V48" stroke={green} strokeWidth="2.5" />
      <path d="M128 52 L135 40 L142 52 Z" fill={green} />
      <T x={146} y={104} size={13} fill={green} weight={700}>+30</T>
      <T x={146} y={120} size={11} fill={green}>pips</T>
      <T x={210} y={30} size={13} fill={ink} weight={600}>Value of 1 pip on EUR/USD</T>
      {lots.map(([label, value, w], i) => (
        <g key={label}>
          <T x={210} y={65 + i * 50}>{label}</T>
          <T x={390} y={65 + i * 50} size={12} fill={ink} weight={700} anchor="end">{value}</T>
          <rect x="210" y={72 + i * 50} width="180" height="10" rx="5" fill={line} />
          <rect x="210" y={72 + i * 50} width={w} height="10" rx="5" fill={blue} />
        </g>
      ))}
      <T x={20} y={220} size={12} fill={ink}>0.1 lots × 30 pips × $1 per pip = <tspan fontWeight="700">$30</tspan>, before costs</T>
    </Svg>
  );
}

function Leverage() {
  return (
    <Svg height={196} label="At 1:30 leverage, a position worth 10,850 dollars needs about 362 dollars of margin, one thirtieth of the position. Each pip still moves the account by 1 dollar.">
      <T x={20} y={26}>Position you control</T>
      <T x={380} y={26} size={13} fill={ink} weight={700} anchor="end">$10,850</T>
      <rect x="20" y="34" width="360" height="26" rx="7" fill={blue} fillOpacity="0.85" />
      <T x={20} y={92}>Margin you put up at 1:30</T>
      <T x={380} y={92} size={13} fill={ink} weight={700} anchor="end">$362</T>
      <rect x="20" y="100" width="360" height="26" rx="7" fill="none" stroke={line} strokeDasharray="4 3" />
      <rect x="20" y="100" width="12" height="26" rx="4" fill={green} />
      <T x={40} y={118} size={11}>1/30 of the position</T>
      <T x={20} y={156} size={13} fill={ink}>Each pip still moves your account by <tspan fontWeight="700">$1</tspan>.</T>
      <T x={20} y={178}>Gains and losses are worked out on the full $10,850.</T>
    </Svg>
  );
}

function MarginLevels() {
  const x = (pct) => 20 + pct * 1.2;
  return (
    <Svg height={176} label="Margin level scale from 0 to 300 percent. In this example the broker sends a margin call at 100 percent and closes positions, a stop out, at 50 percent. Levels differ by broker.">
      <defs>
        <linearGradient id="ml-grad" x1="0" x2="1">
          <stop offset="0" stopColor={red} />
          <stop offset="0.45" stopColor={blue} />
          <stop offset="1" stopColor={green} />
        </linearGradient>
      </defs>
      <T x={x(100)} y={30} size={11} fill={blue} weight={700} anchor="middle">Margin call (e.g. 100%)</T>
      <rect x="20" y="52" width="360" height="18" rx="9" fill="url(#ml-grad)" opacity="0.85" />
      <path d={`M${x(100)} 38 V82`} stroke={blue} strokeWidth="2" />
      <path d={`M${x(50)} 46 V100`} stroke={red} strokeWidth="2" />
      <T x={x(50)} y={114} size={11} fill={red} weight={700} anchor="middle">Stop out (e.g. 50%)</T>
      <T x={20} y={92} size={11}>0%</T>
      <T x={380} y={92} size={11} anchor="end">300%</T>
      <T x={380} y={44} size={11} fill={green} anchor="end">Healthy</T>
      <T x={20} y={146}>Margin level = equity ÷ margin used × 100.</T>
      <T x={20} y={164}>Each broker sets its own levels.</T>
    </Svg>
  );
}

function Costs() {
  const k = 22;
  return (
    <Svg height={190} label="Cost of one standard lot. Account A with a 1.2 pip spread and no commission costs 12 dollars. Account B with a 0.2 pip spread plus 7 dollars commission costs 9 dollars.">
      <T x={20} y={24}>Account A: 1.2 pip spread, no commission</T>
      <rect x="20" y="32" width={12 * k} height="24" rx="6" fill={blue} fillOpacity="0.85" />
      <T x={20 + 12 * k + 8} y={50} size={14} fill={ink} weight={700}>$12</T>
      <T x={20} y={88}>Account B: 0.2 pip spread + $7 commission</T>
      <rect x="20" y="96" width={2 * k} height="24" rx="6" fill={blue} fillOpacity="0.85" />
      <rect x={20 + 2 * k + 2} y="96" width={7 * k} height="24" rx="6" fill={green} fillOpacity="0.85" />
      <T x={20 + 9 * k + 10} y={114} size={14} fill={ink} weight={700}>$9</T>
      <rect x="20" y="148" width="10" height="10" rx="2" fill={blue} />
      <T x={36} y={157}>Spread</T>
      <rect x="90" y="148" width="10" height="10" rx="2" fill={green} />
      <T x={106} y={157}>Commission</T>
      <T x={20} y={180}>Cost of one standard lot, opened and closed</T>
    </Svg>
  );
}

function Orders() {
  const lvl = (y, color, title, note) => (
    <g>
      <path d={`M20 ${y} H280`} stroke={color} strokeWidth="1.5" strokeDasharray={color === blue ? undefined : '6 4'} />
      <T x={288} y={y - 2} size={13} fill={color} weight={700}>{title}</T>
      <T x={288} y={y + 14} size={11}>{note}</T>
    </g>
  );
  return (
    <Svg height={214} label="A buy trade. The entry is in the middle, a take-profit order sits above it to close the trade at a chosen gain, and a stop-loss order sits below it to limit the loss.">
      {lvl(40, green, 'Take-profit', 'your target')}
      {lvl(118, blue, 'Entry (buy)', 'where you opened')}
      {lvl(182, red, 'Stop-loss', 'limits the loss')}
      <polyline points="20,118 46,128 72,110 98,138 124,120 150,152 178,104 206,88 234,72 262,52 274,42" fill="none" stroke={ink} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.8" />
      <circle cx="20" cy="118" r="4.5" fill={blue} />
      <circle cx="274" cy="41" r="4.5" fill={green} />
    </Svg>
  );
}

function Gap() {
  return (
    <Svg height={196} label="A price gap. The market closes above your stop-loss and opens the next session well below it, so the trade closes at the first available price, past your stop.">
      <rect x="178" y="22" width="44" height="160" fill={line} opacity="0.6" />
      <T x={200} y={16} size={11} anchor="middle">Market closed</T>
      <path d="M20 108 H380" stroke={red} strokeWidth="1.5" strokeDasharray="6 4" />
      <T x={380} y={101} size={11} fill={red} weight={700} anchor="end">Your stop-loss</T>
      <polyline points="20,62 55,74 90,66 125,82 160,78 176,86" fill="none" stroke={ink} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.8" />
      <polyline points="226,150 262,144 298,160 336,150 380,156" fill="none" stroke={ink} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.8" />
      <circle cx="226" cy="150" r="5" fill={red} />
      <T x={388} y={182} fill={red} weight={600} anchor="end">Closed here, past your stop</T>
    </Svg>
  );
}

const RiskSizing = () => (
  <Flow
    ops={['÷', '=', '→']}
    steps={[
      { value: '$20', title: 'Most you will risk', tone: 'red' },
      { value: '25 pips', title: 'Distance to your stop', tone: 'plain' },
      { value: '$0.80', title: 'Allowed per pip', tone: 'blue' },
      { value: '0.08 lots', title: 'Your position size', tone: 'green' },
    ]}
  />
);

/* ---------- How to verify a broker's licence ---------- */

const LicenceCovers = () => (
  <Compare
    columns={[
      { title: 'What a licence usually means', tone: 'green', items: [[true, 'Client money held apart from the firm\'s own money'], [true, 'A complaints process you can use'], [true, 'Rules on capital and on how risk is described'], [true, 'A regulator that can act against the firm']] },
      { title: 'What it does not do', tone: 'red', items: [[false, 'Protect you from trading losses'], [false, 'Mean the regulator recommends the broker'], [false, 'Give the same protection in every country']] },
    ]}
  />
);

function BrandEntities() {
  const kids = [[4, green, 'Company A', 'Strong regulator'], [138, blue, 'Company B', 'Other regulator'], [272, red, 'Company C', 'Offshore, light']];
  return (
    <Svg height={206} label="One brand name at the top, with three companies beneath it. Company A has a strong regulator, Company B another regulator, and Company C is offshore with light rules.">
      <rect x="120" y="14" width="160" height="44" rx="14" fill={blue} fillOpacity="0.1" stroke={blue} strokeOpacity="0.6" />
      <T x={200} y={34} size={13} fill={ink} weight={700} anchor="middle">One brand name</T>
      <T x={200} y={50} size={11} anchor="middle">same logo, same app</T>
      {kids.map(([x, color, name, note]) => (
        <g key={name}>
          <path d={`M200 58 C200 95, ${x + 62} 95, ${x + 62} 124`} fill="none" stroke={color} strokeWidth="1.5" />
          <rect x={x} y="124" width="124" height="66" rx="14" fill={color} fillOpacity="0.08" stroke={color} strokeOpacity="0.6" />
          <T x={x + 62} y={150} size={14} fill={ink} weight={700} anchor="middle">{name}</T>
          <T x={x + 62} y={172} size={12} fill={color} weight={600} anchor="middle">{note}</T>
        </g>
      ))}
    </Svg>
  );
}

const RegisterSteps = () => (
  <Flow
    steps={[
      { title: 'Find the regulator', text: 'From the legal name in the client agreement', tone: 'blue' },
      { title: 'Search its register', text: 'By legal name or licence number' },
      { title: 'Check status', text: 'Authorised, not revoked or expired' },
      { title: 'Read permissions', text: 'Do they cover retail trading?' },
      { title: 'Match the details', text: 'Website, phone and address', tone: 'green' },
    ]}
  />
);

const TwoClients = () => (
  <Compare
    columns={[
      { title: 'Client A: placed with Company A', tone: 'green', items: [[true, 'Retail leverage limits'], [true, 'Negative balance protection'], [true, 'Local complaints route']] },
      { title: 'Client B: same app, placed with Company C', tone: 'red', items: [[false, 'Much higher leverage allowed'], [false, 'No negative balance protection'], [false, 'Harder to complain or recover money']] },
    ]}
  />
);

const Clone = () => (
  <Compare
    columns={[
      { title: 'The real firm, as shown on the register', tone: 'green', items: [[true, 'Name: as registered'], [true, 'Licence number: as registered'], [true, 'Website and phone: as listed'], [true, 'Pays into accounts in its own name']] },
      { title: 'A clone firm', tone: 'red', items: [[true, 'Name: copied, so it matches'], [true, 'Licence number: copied, so it matches'], [false, 'Website and phone: different'], [false, 'Asks for payment to another account']] },
    ]}
  />
);

const IfWrong = () => (
  <Flow
    steps={[
      { title: 'Stop paying', text: 'Even to "unlock" a withdrawal', tone: 'red' },
      { title: 'Keep records', text: 'Emails, chats and receipts' },
      { title: 'Call your bank', text: 'As quickly as you can' },
      { title: 'Report it', text: 'To the regulator and local authorities', tone: 'blue' },
    ]}
  />
);

/* ---------- Before you open your first account ---------- */

const MoneyBuckets = () => (
  <Cards
    cards={[
      { Icon: Receipt, title: 'Bills and essentials', text: 'Rent, food, school fees, loan payments.', tone: 'red', tag: 'Never' },
      { Icon: PiggyBank, title: 'Emergency savings', text: 'Money you would need if something went wrong.', tone: 'red', tag: 'Never' },
      { Icon: Wallet, title: 'Money you can afford to lose', text: 'Losing all of it would not change your life.', tone: 'green', tag: 'Only this' },
    ]}
  />
);

const KycDocs = () => (
  <Cards
    cards={[
      { Icon: IdCard, title: 'Proof of identity', text: 'Passport or national ID, in date and readable.' },
      { Icon: Home, title: 'Proof of address', text: 'A recent bill or bank statement with your name.' },
      { Icon: FileText, title: 'Sometimes: source of funds', text: 'Your job, income and where the deposit comes from.' },
    ]}
  />
);

const Appropriateness = () => (
  <Flow
    steps={[
      { title: 'Your honest answers', text: 'Knowledge, experience and finances', tone: 'blue' },
      { title: 'The broker\'s check', text: 'Is a complex product appropriate for you?' },
      { title: 'Possible outcomes', text: 'Go ahead, a warning, lower leverage, or a no', tone: 'green' },
    ]}
  />
);

const DemoPath = () => (
  <Flow
    steps={[
      { title: 'Demo account', text: 'Learn the platform with virtual money', tone: 'blue' },
      { title: 'Follow a plan', text: 'Write down every trade for a few weeks' },
      { title: 'Small live size', text: 'Only if you still want to, and can afford it' },
      { title: 'Review', text: 'Check your journal before changing anything', tone: 'green' },
    ]}
  />
);

const MoneyLoop = () => (
  <Flow
    steps={[
      { title: 'Your own bank account', text: 'In your name, not someone else\'s', tone: 'blue' },
      { title: 'Your trading account', text: 'With the licensed company you checked' },
      { title: 'Back to the same account', text: 'Withdrawals usually return the same way', tone: 'green' },
    ]}
  />
);

export const diagrams = {
  'long-short': LongShort,
  quote: Quote,
  'pip-ladder': PipLadder,
  leverage: Leverage,
  'margin-levels': MarginLevels,
  costs: Costs,
  orders: Orders,
  gap: Gap,
  'risk-sizing': RiskSizing,
  'licence-covers': LicenceCovers,
  'brand-entities': BrandEntities,
  'register-steps': RegisterSteps,
  'two-clients': TwoClients,
  clone: Clone,
  'if-wrong': IfWrong,
  'money-buckets': MoneyBuckets,
  'kyc-docs': KycDocs,
  appropriateness: Appropriateness,
  'demo-path': DemoPath,
  'money-loop': MoneyLoop,
};

/** A diagram with its caption. SVG diagrams sit on a card; the box layouts stand on their own. */
export default function EbookDiagram({ name, caption }) {
  const Diagram = diagrams[name];
  if (!Diagram) return null;
  const isSvg = ['long-short', 'quote', 'pip-ladder', 'leverage', 'margin-levels', 'costs', 'orders', 'gap', 'brand-entities'].includes(name);
  return (
    <figure data-diagram={name} className="mt-6 break-inside-avoid">
      <div className={isSvg ? '-mx-2 rounded-2xl border border-line bg-[var(--glass)] px-1.5 py-2 sm:mx-0 sm:p-5' : ''}>
        <Diagram />
      </div>
      {caption && <figcaption className="mt-2 text-center text-xs text-muted">{caption}</figcaption>}
    </figure>
  );
}

