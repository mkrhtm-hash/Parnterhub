import { neon } from '@neondatabase/serverless';

let sql;

/** The only place the app opens the database. Files in /api run on the server, never in the browser. */
export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    const error = new Error('DATABASE_URL is not set');
    error.code = 'NO_DATABASE_URL';
    throw error;
  }
  sql ??= neon(url);
  return sql;
}
