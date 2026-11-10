import { Compass } from 'lucide-react';
import Button from '../components/ui/Button';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta('Page not found');
  return (
    <section className="shell pt-16 text-center md:pt-28">
      <Compass className="mx-auto size-12 text-blue" aria-hidden="true" />
      <h1 className="mt-6 text-3xl font-semibold md:text-5xl">This page has moved or never existed.</h1>
      <p className="mt-3 text-muted">Let's get you back on track.</p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Button to="/">Back to home</Button>
        <Button to="/broker-match" variant="ghost">Find My Broker Match</Button>
      </div>
    </section>
  );
}
