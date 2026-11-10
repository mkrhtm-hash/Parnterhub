import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react';

const ToastContext = createContext(null);

const styles = {
  success: { Icon: CircleCheck, color: 'text-blue' },
  info: { Icon: Info, color: 'text-green' },
  error: { Icon: TriangleAlert, color: 'text-danger' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => setToasts((all) => all.filter((t) => t.id !== id)), []);

  const toast = useCallback(
    (message, type = 'success') => {
      const id = ++nextId.current;
      setToasts((all) => [...all.slice(-2), { id, message, type }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 top-20 z-[70] flex flex-col items-center gap-2 md:top-24 md:right-6 md:left-auto md:w-96"
      >
        <AnimatePresence>
          {toasts.map(({ id, message, type }) => {
            const { Icon, color } = styles[type];
            return (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, y: -14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="pointer-events-auto flex w-full items-start gap-3 rounded-2xl border border-line p-4 text-sm shadow-xl"
                style={{ background: 'var(--glass-solid)' }}
              >
                <Icon className={`mt-0.5 size-5 shrink-0 ${color}`} aria-hidden="true" />
                <p className="flex-1 leading-relaxed">{message}</p>
                <button type="button" onClick={() => dismiss(id)} aria-label="Dismiss message" className="text-faint hover:text-ink">
                  <X className="size-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
