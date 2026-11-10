import { BookOpen, ChartCandlestick, ClipboardCheck, PlayCircle, ShieldCheck } from 'lucide-react';
import Pathway from '../ui/Pathway';
import { Reveal } from '../ui/Primitives';
import { expertSessions } from '../../../shared/expertSessions';

// Reading times assume about 200 words a minute; video times are the real lengths.
const steps = [
  {
    Icon: PlayCircle,
    title: 'Watch the four short videos',
    meta: '4 videos · about 4 minutes',
    learn: ['What a broker actually does', 'How CFDs work', 'Leverage, margin and trading costs'],
    cta: { label: 'Watch the videos', to: '/learning/videos' },
  },
  {
    Icon: BookOpen,
    title: 'Read FX and CFD basics',
    meta: '8 short pages · about 10 minutes',
    learn: ['Currency pairs, pips and lot sizes', 'Leverage and margin, with worked examples', 'Costs, orders and managing risk'],
    cta: { label: 'Read the eBook', to: '/learning/ebooks/fx-cfd-basics' },
  },
  {
    Icon: ShieldCheck,
    title: 'Check who you would deal with',
    meta: '6 short pages · about 5 minutes',
    learn: ['Finding the right regulator', 'Matching the company to your account', 'Spotting clone firms'],
    cta: { label: 'Read the eBook', to: '/learning/ebooks/verify-a-licence' },
  },
  {
    Icon: ClipboardCheck,
    title: 'Prepare before you deposit',
    meta: '6 short pages · about 5 minutes',
    learn: ['Money you can afford to lose', 'Documents and experience questions', 'Demo first, then deposits and withdrawals'],
    cta: { label: 'Read the eBook', to: '/learning/ebooks/before-your-first-account' },
  },
  {
    Icon: ChartCandlestick,
    title: 'Go deeper with a market expert',
    tag: 'Optional · paid',
    meta: `One-to-one call · from ${expertSessions[0].price} per session`,
    learn: ['Your own questions answered', 'A market of your choice explained', 'Costs and risk worked through'],
    cta: { label: 'Book a session', to: '/learning/market-expert' },
  },
];

export default function LearningPathway() {
  return (
    <>
      <Reveal className="mb-8 max-w-3xl">
        <h2 className="text-2xl font-semibold md:text-3xl">Your learning pathway</h2>
        <p className="mt-2 leading-relaxed text-muted">
          Five steps, in order. Steps 1 to 4 are free and take under half an hour in total. Step 5 is optional.
        </p>
      </Reveal>
      <Pathway row steps={steps} label="Learning pathway" />
    </>
  );
}
