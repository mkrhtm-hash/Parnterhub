import { getSql } from './_lib/db.js';
import { route } from './_lib/handler.js';

/** Public site content: company details, legal text, regulators, countries, learning resources and form options. */
export default route({
  GET: async (_req, res) => {
    const sql = getSql();
    const [content, tiers, regulators, countries, learning] = await Promise.all([
      sql`SELECT key, value FROM site_content`,
      sql`SELECT id, name, label, summary FROM regulator_tiers ORDER BY id`,
      sql`SELECT code, name, jurisdiction, tier, register_url, segregation, negative_balance, compensation
          FROM regulators ORDER BY tier, code`,
      sql`SELECT code, name, home_regulator FROM countries ORDER BY sort_order`,
      sql`SELECT id, kind, title, summary, topics, level, length_label, url, starts_at
          FROM learning_resources WHERE published ORDER BY sort_order, title`,
    ]);

    return res.status(200).json({
      ...Object.fromEntries(content.map((row) => [row.key, row.value])),
      regulatorTiers: tiers,
      regulators: Object.fromEntries(
        regulators.map((r) => [
          r.code,
          {
            code: r.code,
            name: r.name,
            jurisdiction: r.jurisdiction,
            tier: r.tier,
            registerUrl: r.register_url,
            segregation: r.segregation,
            negativeBalance: r.negative_balance,
            compensation: r.compensation,
          },
        ]),
      ),
      learning: learning.map(({ length_label: lengthLabel, starts_at: startsAt, ...item }) => ({ ...item, lengthLabel, startsAt })),
      countries: countries.map((c) => ({ code: c.code, name: c.name, homeRegulator: c.home_regulator ?? undefined })),
    });
  },
});
