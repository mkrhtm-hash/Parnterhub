/**
 * Runs before `npm run dev` and `npm run db:setup`.
 * Generates JWT_SECRET if it is missing, and stops with instructions if DATABASE_URL is.
 */
import { randomBytes } from 'node:crypto';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const envPath = join(dirname(fileURLToPath(import.meta.url)), '..', '.env');

const readEnv = () => (existsSync(envPath) ? readFileSync(envPath, 'utf8') : '');
const valueOf = (name) => readEnv().match(new RegExp(`^${name}=(.*)$`, 'm'))?.[1]?.trim() ?? '';

if (!existsSync(envPath)) writeFileSync(envPath, 'DATABASE_URL=\n');

if (!valueOf('JWT_SECRET')) {
  const secret = randomBytes(48).toString('base64url');
  if (/^JWT_SECRET=.*$/m.test(readEnv())) {
    writeFileSync(envPath, readEnv().replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${secret}`));
  } else {
    appendFileSync(envPath, `${readEnv().endsWith('\n') ? '' : '\n'}JWT_SECRET=${secret}\n`);
  }
  console.log('Generated a new JWT_SECRET and saved it to .env');
}

const url = process.env.DATABASE_URL || valueOf('DATABASE_URL').replace(/^["']|["']$/g, '');

if (!/^postgres(ql)?:\/\//.test(url)) {
  console.error(`
${url ? 'DATABASE_URL in .env does not look like a Postgres connection string.' : 'DATABASE_URL is missing, so Partnerhub cannot start yet.'}

Where to get it:
  1. Go to https://console.neon.tech and sign in. A free account is fine.
  2. Open your project, or create one.
  3. On the project dashboard, click the "Connect" button.
  4. Copy the connection string. It starts with postgresql://
     If you see a "psql" command, copy only the part inside the quotes.
  5. Paste it into the .env file in this folder, on one line:
     DATABASE_URL=postgresql://...
  6. Run: npm run db:setup
  7. Run: npm run dev
`);
  process.exit(1);
}
