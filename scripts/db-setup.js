/** Creates the tables and adds starting data. Safe to run repeatedly. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
if (existsSync(join(root, '.env'))) process.loadEnvFile(join(root, '.env'));

/** Splits a SQL file into statements, ignoring semicolons inside text and comments. */
function splitStatements(source) {
  const statements = [];
  let current = '';
  let inString = false;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (!inString && char === '-' && source[i + 1] === '-') {
      while (i < source.length && source[i] !== '\n') i += 1;
      current += '\n';
    } else if (char === "'") {
      inString = !inString;
      current += char;
    } else if (char === ';' && !inString) {
      if (current.trim()) statements.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) statements.push(current.trim());
  return statements;
}

const sql = neon(process.env.DATABASE_URL);

try {
  for (const file of ['schema.sql', 'seed.sql']) {
    const statements = splitStatements(readFileSync(join(root, 'db', file), 'utf8'));
    for (const statement of statements) await sql.query(statement);
    console.log(`${file}: ran ${statements.length} statements`);
  }

  console.log('\nRow counts:');
  for (const table of ['regulator_tiers', 'regulators', 'countries', 'brokers', 'broker_licences', 'site_content', 'consultations']) {
    const [{ count }] = await sql.query(`SELECT count(*)::int AS count FROM ${table}`);
    console.log(`  ${table.padEnd(16)} ${count}`);
  }
  console.log('\nDatabase is ready. Start the app with: npm run dev');
} catch (error) {
  console.error(`\nCould not set up the database: ${error.message}`);
  console.error('Check that DATABASE_URL in .env is the full connection string from the Neon dashboard.');
  process.exit(1);
}
