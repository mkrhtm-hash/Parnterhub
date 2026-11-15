import { createContext, Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { deepTranslate, fill, hash } from './core';

/**
 * Site languages. English is the source text: every other language is a dictionary keyed by
 * a short hash of the English string (see scripts/i18n-extract.js), so a missing entry simply shows English.
 */
export const languages = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ur', label: 'اردو', dir: 'rtl' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
];

const KEY = 'mkpips-lang';
const loaders = {
  ur: () => import('./ur.json'),
  ar: () => import('./ar.json'),
};
const fontUrls = {
  ur: 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap',
  ar: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap',
};

function initialLang() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (languages.some((l) => l.code === fromUrl)) return fromUrl;
    const saved = localStorage.getItem(KEY);
    if (languages.some((l) => l.code === saved)) return saved;
  } catch {
    /* Storage can be blocked; English is the default. */
  }
  return 'en';
}

export function loadFont(code) {
  const href = fontUrls[code];
  if (!href || document.querySelector(`link[data-lang-font="${code}"]`)) return;
  const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href });
  link.dataset.langFont = code;
  document.head.appendChild(link);
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  // requested: the language the visitor picked. lang: the one on screen, which changes once its words have loaded,
  // so the page never flashes English or flips direction before the translation is ready.
  const [requested, setRequested] = useState(initialLang);
  const [dicts, setDicts] = useState({});
  const lang = requested === 'en' || dicts[requested] ? requested : null;
  const [shown, setShown] = useState(lang);
  const current = lang ?? shown;

  useEffect(() => {
    loadFont(requested);
    try {
      localStorage.setItem(KEY, requested);
    } catch {
      /* The choice still applies for this visit. */
    }
    if (requested !== 'en' && !dicts[requested]) {
      loaders[requested]()
        .then((m) => setDicts((d) => ({ ...d, [requested]: m.default })))
        .catch(() => setRequested('en'));
    }
  }, [requested, dicts]);

  useEffect(() => {
    if (!lang) return;
    setShown(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = languages.find((l) => l.code === lang).dir;
  }, [lang]);

  const dict = current && current !== 'en' ? dicts[current] : null;
  const value = useMemo(() => {
    const t = (text, vars) => fill(dict?.[hash(text)] ?? text, vars);
    /** Like t, but {name} placeholders may be React elements such as links. */
    const ti = (text, nodes) =>
      t(text)
        .split(/(\{\w+\})/)
        .map((part, i) => {
          const m = /^\{(\w+)\}$/.exec(part);
          return <Fragment key={i}>{m && m[1] in nodes ? nodes[m[1]] : part}</Fragment>;
        });
    const tr = (data) => (dict && data ? deepTranslate(data, dict) : data);
    const code = current ?? 'en';
    return {
      lang: code,
      // For dates. Arabic keeps Latin digits so prices, times and dates match the rest of the site.
      locale: { en: 'en-GB', ur: 'ur-PK', ar: 'ar-u-nu-latn' }[code],
      dir: languages.find((l) => l.code === code).dir,
      setLang: (next) => setRequested(next),
      t,
      ti,
      tr,
    };
  }, [current, dict]);

  // First visit in Urdu or Arabic: wait for the words (a fraction of a second) rather than show English first.
  if (!current) return null;
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
export const useT = () => useContext(I18nContext).t;
