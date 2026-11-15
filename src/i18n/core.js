/** Shared by the site (I18nContext.jsx) and scripts/i18n-extract.js. No React here. */

/** FNV-1a, base 36. The same function runs in scripts/i18n-extract.js. */
export function hash(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

export const fill = (text, vars) => (vars ? text.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? String(vars[name]) : m)) : text);

// Keys whose values are identifiers, links or codes, never shown as words. Deep translation leaves them alone
// when they hold a string or a list of strings (a list of objects, such as options.instruments, is still translated).
export const SKIP = new Set(['id', 'code', 'key', 'url', 'href', 'to', 'kind', 'logo', 'regulator', 'homeRegulator', 'registerUrl', 'verifyUrl',
  'number', 'entity', 'address', 'legalEntityName', 'registeredAddress', 'registrationNumber', 'platforms', 'instruments', 'availableIn', 'strengths', 'suitedTo', 'startsAt', 'email', 'phone', 'whatsappNumber', 'value', 'diagram', 'icon', 'tone']);

export const isSkipped = (key, v) => SKIP.has(key) && (typeof v !== 'object' || v === null || (Array.isArray(v) && v.every((x) => typeof x !== 'object')));

export function deepTranslate(value, dict) {
  if (typeof value === 'string') return dict[hash(value)] ?? value;
  if (Array.isArray(value)) return value.map((v) => deepTranslate(v, dict));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = isSkipped(k, v) ? v : deepTranslate(v, dict);
    return out;
  }
  return value;
}
