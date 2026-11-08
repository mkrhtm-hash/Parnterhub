import { Suspense, useEffect, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import Footer from './Footer';
import CookieBanner from './CookieBanner';
import WhatsAppButton from './WhatsAppButton';

export default function Layout() {
  const { pathname, hash } = useLocation();
  const outlet = useOutlet();
  const mainRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Moves keyboard and screen reader users to the new page, without doing so on first load.
    if (firstRender.current) firstRender.current = false;
    else mainRef.current?.focus({ preventScroll: true });
  }, [pathname, hash]);

  useEffect(() => {
    if (!hash) return undefined;
    // Waits for the page transition before scrolling to a section such as /#faq.
    const timer = setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 320);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[80] -translate-y-20 rounded-full bg-emerald px-4 py-2 text-sm font-semibold text-on-accent focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="ambient" aria-hidden="true" />
      <Navbar />
      <main id="main" ref={mainRef} tabIndex={-1} className="outline-none">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Suspense fallback={<div className="min-h-screen" />}>{outlet}</Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <MobileNav />
      <WhatsAppButton />
      <CookieBanner />
    </>
  );
}
