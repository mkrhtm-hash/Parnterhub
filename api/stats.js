import { getSql } from './_lib/db.js';
import { route } from './_lib/handler.js';

/** Real counts for the hero. They change as soon as brokers are added or removed. */
export default route({
  GET: async (_req, res) => {
    const sql = getSql();
    const [row] = await sql`
      SELECT (SELECT count(*)::int FROM brokers) AS partners,
             (SELECT count(DISTINCT r.jurisdiction)::int
                FROM broker_licences l JOIN regulators r ON r.code = l.regulator_code) AS jurisdictions,
             (SELECT COALESCE(bool_or(is_sample), false) FROM brokers) AS using_sample_data,
             (SELECT (value ->> 'yearsExperience')::int FROM site_content WHERE key = 'company') AS years`;

    return res.status(200).json({
      years: row.years ?? 0,
      partners: row.partners,
      jurisdictions: row.jurisdictions,
      usingSampleData: row.using_sample_data,
    });
  },
});
