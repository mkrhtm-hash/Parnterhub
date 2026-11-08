/**
 * Local stand-in for Vercel's functions. It loads the same files in /api that Vercel
 * will use, so nothing changes at deploy time. It is not used in production.
 */
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import express from 'express';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const apiDir = join(root, 'api');
const PORT = 3101;

if (existsSync(join(root, '.env'))) process.loadEnvFile(join(root, '.env'));

/** Finds route files, and skips names starting with "_" as Vercel does. */
function findRoutes(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('_')) return [];
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return findRoutes(full);
    return entry.name.endsWith('.js') ? [full] : [];
  });
}

const app = express();
app.use(express.json({ limit: '32kb' }));

for (const file of findRoutes(apiDir)) {
  const path = `/api/${relative(apiDir, file).split(sep).join('/').replace(/\.js$/, '').replace(/(^|\/)index$/, '')}`;
  const { default: handler } = await import(pathToFileURL(file).href);
  app.all(path, (req, res) => handler(req, res));
  console.log(`[api] ${path}`);
}

app.use('/api', (_req, res) => res.status(404).json({ error: 'not_found', message: 'That API route does not exist.' }));

// Malformed or oversized request bodies.
app.use((error, _req, res, _next) => {
  res.status(error.status ?? 500).json({ error: 'bad_request', message: 'That request could not be read.' });
});

const server = app.listen(PORT, '127.0.0.1', () => console.log(`[api] Ready on http://127.0.0.1:${PORT}`));
server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `[api] Port ${PORT} is already in use. Close whatever is using it and try again.` : error);
  process.exit(1);
});
