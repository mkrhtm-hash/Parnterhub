import { getSql } from './_lib/db.js';
import { route } from './_lib/handler.js';

export default route({
  GET: async (_req, res) => {
    const sql = getSql();
    const rows = await sql`
      SELECT b.*,
             COALESCE(
               (SELECT json_agg(json_build_object('regulator', l.regulator_code, 'number', l.licence_number) ORDER BY l.sort_order)
                FROM broker_licences l WHERE l.broker_id = b.id),
               '[]'::json
             ) AS licences
      FROM brokers b
      ORDER BY b.sort_order, b.name`;

    return res.status(200).json(
      rows.map((b) => ({
        id: b.id,
        name: b.name,
        isSample: b.is_sample,
        licences: b.licences,
        minDeposit: b.min_deposit,
        spreads: b.spreads,
        commission: b.commission,
        support: b.support,
        verifyUrl: b.verify_url ?? undefined,
        platforms: b.platforms,
        instruments: b.instruments,
        availableIn: b.available_in,
        strengths: b.strengths,
        suitedTo: b.suited_to,
        logo: b.logo ?? undefined,
        highlights: b.highlights ?? [],
      })),
    );
  },
});
