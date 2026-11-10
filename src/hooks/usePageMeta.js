import { useEffect } from 'react';

const setMeta = (selector, content) => document.querySelector(selector)?.setAttribute('content', content);

/** Sets the browser tab title and the search and social description for a page. Pass false to leave them alone. */
export function usePageMeta(title, description) {
  useEffect(() => {
    if (title === false) return; // The page that embeds this component sets its own title.
    const full = title ? `${title} | MKPips` : 'MKPips | Find a regulated FX and CFD broker with expert guidance';
    document.title = full;
    setMeta('meta[property="og:title"]', full);
    setMeta('meta[name="twitter:title"]', full);
    if (description) {
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[name="twitter:description"]', description);
    }
  }, [title, description]);
}
