/**
 * Collects every English string the site shows, so it can be translated.
 *
 *   node scripts/i18n-extract.js [site URL]
 *
 * Sources: t('...') and ti('...') calls, wording in data arrays (src/data, page constants, eBooks),
 * words inside eBook diagram text, and database content read from <site URL>/api/site and /api/brokers
 * (default http://localhost:5174, the local preview).
 *
 * Writes src/i18n/source.json ({ hash: English }) and reports, for each language, how many strings
 * still have no translation. It also lists any visible JSX text that is not wrapped in t().
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hash, isSkipped } from '../src/i18n/core.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BASE = process.argv[2] ?? 'http://localhost:5174';
const LANGS = ['ur', 'ar'];
// Internal pages stay in English.
const EXCLUDE = [/pages[\\/]Admin\.jsx$/, /[\\/]i18n[\\/]/, /services[\\/]leads\.js$/];

const found = new Map(); // English -> first source
const add = (text, where) => {
  if (typeof text !== 'string' || !/\p{L}/u.test(text)) return;
  if (!found.has(text)) found.set(text, where);
};

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return files(p);
    return /\.(jsx?|mjs)$/.test(name) && !EXCLUDE.some((re) => re.test(p)) ? [p] : [];
  });
}

/** A small lexer: string literals with their position, skipping comments and template literals. */
function literals(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i < 0) break; continue; }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i) + 2; continue; }
    if (c === '`') { let j = i + 1; while (j < src.length && src[j] !== '`') j += src[j] === '\\' ? 2 : 1; i = j + 1; continue; }
    if (c === "'" || c === '"') {
      let j = i + 1;
      let s = '';
      while (j < src.length && src[j] !== c && src[j] !== '\n') {
        if (src[j] === '\\') { s += src[j + 1]; j += 2; } else { s += src[j]; j += 1; }
      }
      out.push({ start: i, end: j + 1, text: s });
      i = j + 1;
      continue;
    }
    i += 1;
  }
  return out;
}

/** Ranges of t(...) and ti(...) argument lists. */
function callRanges(src) {
  const ranges = [];
  const re = /(?<![\w.$])(?:t|ti|T)\(/g;
  let m;
  while ((m = re.exec(src))) {
    let depth = 1;
    let j = m.index + m[0].length;
    let quote = null;
    for (; j < src.length && depth > 0; j++) {
      const ch = src[j];
      if (quote) { if (ch === '\\') j++; else if (ch === quote) quote = null; continue; }
      if (ch === "'" || ch === '"' || ch === '`') quote = ch;
      else if (ch === '(') depth++;
      else if (ch === ')') depth--;
    }
    ranges.push([m.index, j]);
  }
  return ranges;
}

const classLike = (s) => {
  const tokens = s.trim().split(/\s+/);
  return tokens.every((tok) => /^[!\-a-z0-9:[\]/.%_#()&,>=*~+@'"]+$/.test(tok)) && tokens.some((tok) => /[-:[]/.test(tok));
};
const looksLikeText = (s) => {
  if (/^(https?:|\/|#|\.\/|\.\.\/|mailto:)/.test(s) || s.includes('${')) return false;
  if (/\d/.test(s) && /^[MLHVCSQTAZmlhvcsqtaz0-9.,\s-]+$/.test(s)) return false; // SVG path data
  if (/\s/.test(s.trim()) && /\p{L}/u.test(s) && !classLike(s)) return true;
  return /^[A-Z][A-Za-z'’.&-]*[a-z.)]$/.test(s) && s.length > 2;
};

const unwrapped = [];
for (const file of [...files(join(ROOT, 'src')), ...files(join(ROOT, 'shared'))]) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  const src = readFileSync(file, 'utf8');
  const ranges = callRanges(src);
  const inCall = (pos) => ranges.some(([a, b]) => pos > a && pos < b);
  for (const lit of literals(src)) {
    const before = src.slice(Math.max(0, lit.start - 40), lit.start);
    if (/\b(import|from|className=|class=|require\()\s*$/.test(before) || /from\s*$/.test(before)) continue;
    if (inCall(lit.start)) add(lit.text, rel);
    else if (looksLikeText(lit.text)) add(lit.text, `${rel} (data)`);
  }
  if (file.endsWith('.jsx')) {
    // JSX text between tags. In the diagrams, <T> and <tspan> translate their words, so these become strings to translate.
    const jsxText = /(?<=>)([^<>{}\n]*\p{L}[^<>{}\n]*)(?=<|\{)/gu;
    let m;
    while ((m = jsxText.exec(src))) {
      const text = m[1];
      const diagram = rel.endsWith('EbookDiagrams.jsx');
      // Skips fragments of code that the pattern catches by mistake. Diagram labels such as "Stop out (e.g. 50%)" end in a bracket, so only obvious code is skipped there.
      if (!text.trim() || /=>|&&|\|\|/.test(text) || (!diagram && /\?\s|\)\s*$|^\s*\)/.test(text))) continue;
      if (diagram) add(text, `${rel} (diagram)`);
      else unwrapped.push(`${rel}: ${text.trim()}`);
    }
  }
}

// Single lowercase words shown on screen, which the text check above skips because they look like identifiers.
['gain', 'loss', 'accepted', 'declined', 'eBook', 'eBooks', 'page {n}', 'FAQ'].forEach((w) => add(w, 'extra'));

// Database content.
const walk = (value, where) => {
  if (typeof value === 'string') {
    if (!/^(https?:|\/|mailto:)/.test(value) && !/^[^\s@]+@[^\s@]+$/.test(value)) add(value, where);
  } else if (Array.isArray(value)) value.forEach((v) => walk(v, where));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) if (!isSkipped(k, v)) walk(v, `${where}.${k}`);
  }
};
for (const path of ['/api/site', '/api/brokers']) {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  walk(await res.json(), `db${path.replace('/api', '')}`);
}

// Collisions would make two strings share one translation.
const byHash = new Map();
for (const text of found.keys()) {
  const h = hash(text);
  if (byHash.has(h) && byHash.get(h) !== text) throw new Error(`Hash collision: ${JSON.stringify(text)} and ${JSON.stringify(byHash.get(h))}`);
  byHash.set(h, text);
}

const source = Object.fromEntries([...found.keys()].map((text) => [hash(text), text]));
writeFileSync(join(ROOT, 'src/i18n/source.json'), `${JSON.stringify(source, null, 1)}\n`);
const where = Object.fromEntries([...found.entries()].map(([text, w]) => [hash(text), w]));
writeFileSync(join(ROOT, 'src/i18n/source-where.json'), `${JSON.stringify(where, null, 1)}\n`);

console.log(`${found.size} English strings, ${[...found.keys()].join(' ').length} characters`);
for (const lang of LANGS) {
  const file = join(ROOT, `src/i18n/${lang}.json`);
  const dict = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
  const missing = Object.keys(source).filter((h) => !dict[h]);
  const stale = Object.keys(dict).filter((h) => !source[h]);
  console.log(`${lang}: ${Object.keys(source).length - missing.length} translated, ${missing.length} missing, ${stale.length} no longer used`);
}
if (unwrapped.length) console.log(`\nJSX text not wrapped in t():\n  ${[...new Set(unwrapped)].join('\n  ')}`);
