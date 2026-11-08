import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useCookies } from '../../context/CookieContext';
import { useSiteData } from '../../context/SiteDataContext';

export default function WhatsAppButton() {
  const { open } = useCookies();
  const company = useSiteData().data?.company;
  // Hidden while the cookie banner is open, because they share the same corner on small screens.
  if (open || !company) return null;
  const href = `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(company.whatsappMessage)}`;
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Partnerhub on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.07 }}
      className="fixed right-4 z-30 grid size-13 place-items-center rounded-full bg-[#128c5e] text-white shadow-xl bottom-[calc(4.75rem+env(safe-area-inset-bottom))] lg:right-6 lg:bottom-6"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
    </motion.a>
  );
}
