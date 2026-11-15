import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { fallbackCompliance } from '../data/staticContent';

const SiteDataContext = createContext(null);

async function getJson(path, signal) {
  const res = await fetch(path, { signal });
  if (!res.ok) throw new Error(`${path} returned ${res.status}`);
  return res.json();
}

/** Loads all public content from /api once, and shares it with every page. */
export function SiteDataProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', data: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    Promise.all([getJson('/api/site', signal), getJson('/api/brokers', signal), getJson('/api/stats', signal)])
      .then(([site, brokers, stats]) => setState({ status: 'ready', data: { ...site, brokers, stats } }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ status: 'error', data: null });
      });
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: 'loading', data: null });
    setAttempt((n) => n + 1);
  }, []);

  // Database text (FAQ, legal pages, broker notes and so on) shown in the visitor's language where a translation exists.
  const { tr } = useI18n();
  const data = useMemo(() => tr(state.data), [tr, state.data]);

  return <SiteDataContext.Provider value={{ ...state, data, raw: state.data, retry }}>{children}</SiteDataContext.Provider>;
}

export const useSiteData = () => useContext(SiteDataContext);

/** Required compliance wording, available even when the database is not. */
export function useCompliance() {
  const { data } = useSiteData();
  const { tr } = useI18n();
  return { ...tr(fallbackCompliance), ...data?.compliance };
}
