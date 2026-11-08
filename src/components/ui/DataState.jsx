import { DatabaseZap, RotateCcw } from 'lucide-react';
import Button from './Button';
import { useSiteData } from '../../context/SiteDataContext';

export function Skeleton({ className = '' }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl bg-line ${className}`} />;
}

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`glass grid gap-3 p-6 ${className}`}>
      <Skeleton className="size-11 !rounded-2xl" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading" className="shell min-h-screen pt-10 md:pt-20">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-4 h-12 w-full max-w-xl" />
      <Skeleton className="mt-4 h-5 w-full max-w-2xl" />
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

export function DataError({ compact = false }) {
  const { retry } = useSiteData();
  return (
    <div role="alert" className={`glass mx-auto max-w-2xl text-center ${compact ? 'p-6' : 'p-8 md:p-12'}`}>
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gold/12 text-gold">
        <DatabaseZap className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-semibold md:text-2xl">We cannot reach our database right now</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">This part of the site needs live data. Nothing is wrong on your side, so please try again in a moment.</p>
      <Button variant="ghost" className="mt-6" onClick={retry}>
        <RotateCcw className="size-4" aria-hidden="true" />
        Try again
      </Button>
    </div>
  );
}

/** Shows a page once its data has loaded, with a skeleton before that and a clear message on failure. */
export function DataGate({ children }) {
  const { status } = useSiteData();
  if (status === 'loading') return <PageSkeleton />;
  if (status === 'error') {
    return (
      <div className="shell min-h-[50vh] pt-12 md:pt-24">
        <DataError />
      </div>
    );
  }
  return children;
}
