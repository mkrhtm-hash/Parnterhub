import {
  BriefcaseBusiness, Check, ClipboardCheck, LifeBuoy, MessagesSquare, Scale, ShieldCheck, Signal, TrendingUp, Wallet, X,
} from 'lucide-react';

// One icon per line of the "We do" and "We don't" lists (wording in src/data/staticContent.js).
const icons = {
  'Explain your broker options in plain English': MessagesSquare,
  'Check licences and country availability': ShieldCheck,
  'Compare spreads, commissions and platforms': Scale,
  'Support you through account opening': ClipboardCheck,
  'Help escalate issues with your broker': LifeBuoy,
  'Manage funds': BriefcaseBusiness,
  'Hold client money': Wallet,
  'Give trading signals': Signal,
  'Promise returns': TrendingUp,
};

/**
 * A "We do" (kind="do") or "We don't" (kind="dont") list: each line has its own icon in a tinted
 * tile, with a small tick or cross badge so the meaning never depends on colour alone.
 */
export default function StanceList({ items, kind, large = false }) {
  const doing = kind === 'do';
  const Badge = doing ? Check : X;
  return (
    <ul className={`grid ${large ? 'gap-4' : 'gap-3 text-sm'}`}>
      {items.map((item) => {
        const Icon = icons[item] ?? Badge;
        return (
          <li key={item} className="flex items-center gap-3">
            <span className={`relative grid shrink-0 place-items-center rounded-xl ${large ? 'size-11' : 'size-9'} ${doing ? 'bg-blue/12 text-blue' : 'bg-red/12 text-red'}`} aria-hidden="true">
              <Icon className={large ? 'size-5' : 'size-[18px]'} />
              <span className={`absolute -right-1 -bottom-1 grid size-4 place-items-center rounded-full ring-2 ring-[var(--bg-2)] ${doing ? 'bg-blue' : 'bg-red'}`}>
                <Badge className="size-2.5 text-white" strokeWidth={3.5} />
              </span>
            </span>
            <span className="leading-snug">{item}</span>
          </li>
        );
      })}
    </ul>
  );
}
