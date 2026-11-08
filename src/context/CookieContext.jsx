import { createContext, useCallback, useContext, useState } from 'react';

const CookieContext = createContext(null);
const KEY = 'partnerhub-cookie-choice';

const readChoice = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export function CookieProvider({ children }) {
  const [choice, setChoice] = useState(readChoice);
  const [open, setOpen] = useState(() => !readChoice());

  const decide = useCallback((value) => {
    setChoice(value);
    setOpen(false);
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* Without storage the banner returns on the next visit, which is the safe outcome. */
    }
    // Load analytics or marketing scripts here, and only when value === 'accepted'.
  }, []);

  const reopen = useCallback(() => setOpen(true), []);

  return <CookieContext.Provider value={{ choice, open, decide, reopen }}>{children}</CookieContext.Provider>;
}

export const useCookies = () => useContext(CookieContext);
