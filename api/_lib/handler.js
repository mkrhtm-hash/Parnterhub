const UNAVAILABLE = {
  error: 'database_unavailable',
  message: 'We cannot reach our database right now. Please try again in a moment.',
};

// Five-character codes are Postgres errors, so the connection itself worked.
const isSqlError = (error) => /^[0-9A-Z]{5}$/.test(error?.code ?? '');

function report(res, error) {
  // Undefined table: the database is reachable, but `npm run db:setup` has not been run.
  if (error?.code === '42P01') {
    console.error('[api] Database tables are missing. Run: npm run db:setup');
    return res.status(503).json(UNAVAILABLE);
  }
  console.error(`[api] ${error?.code ?? 'error'}: ${error?.message}`);
  if (isSqlError(error)) {
    return res.status(500).json({ error: 'server_error', message: 'Something went wrong on our side. Please try again.' });
  }
  return res.status(503).json(UNAVAILABLE);
}

/** Wraps a route with method checks and friendly errors. `methods` looks like { GET: fn }. */
export function route(methods) {
  return async (req, res) => {
    const run = methods[req.method];
    if (!run) {
      res.setHeader('Allow', Object.keys(methods).join(', '));
      return res.status(405).json({ error: 'method_not_allowed', message: 'That method is not supported here.' });
    }
    try {
      return await run(req, res);
    } catch (error) {
      return report(res, error);
    }
  };
}
