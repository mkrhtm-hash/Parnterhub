const joinList = (items) => {
  if (items.length < 2) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
};

/**
 * Scores brokers using only the visitor's answers and the data from the database.
 * Compensation is not an input.
 *
 * Country and deposit are hard limits. Everything else affects the ranking and,
 * when a broker falls short, appears as something for the visitor to check.
 *
 * Returns { status, results }, where status is 'matched', 'no-country' or 'no-fit'.
 */
export function findMatches(answers, { brokers, countries, regulators, options }) {
  const { depositRanges, instruments, priorities } = options;
  const labelFor = (id) => instruments.find((i) => i.id === id)?.label ?? id;
  const { country, experience, instruments: wanted, platform, deposit, priorities: wantedPriorities } = answers;

  const inCountry = brokers.filter((b) => b.availableIn.includes(country));
  if (inCountry.length === 0) return { status: 'no-country', results: [] };

  // A null maximum means the range has no upper limit.
  const budget = depositRanges.find((d) => d.id === deposit)?.max ?? Infinity;
  const home = countries.find((c) => c.code === country);

  const results = inCountry
    .filter((b) => b.minDeposit <= budget)
    .filter((b) => b.instruments.some((i) => wanted.includes(i)))
    .map((broker) => {
      let score = 0;
      const why = [];
      const checks = [];

      const local = home?.homeRegulator && broker.licences.find((l) => l.regulator === home.homeRegulator);
      if (local) {
        score += 30;
        why.push(`It lists a licence from ${local.regulator}, the regulator most relevant to where you live in this sample set.`);
      }

      if (broker.platforms.includes(platform)) {
        score += 25;
        why.push(`It offers ${platform}, your preferred platform.`);
      } else {
        checks.push(`It does not offer ${platform}. It offers ${joinList(broker.platforms)} instead.`);
      }

      const covered = wanted.filter((i) => broker.instruments.includes(i));
      const missing = wanted.filter((i) => !broker.instruments.includes(i));
      score += (covered.length / wanted.length) * 20;
      if (missing.length === 0) {
        why.push(`It covers everything you want to trade: ${joinList(wanted.map(labelFor))}.`);
      } else {
        why.push(`It covers ${joinList(covered.map(labelFor))}.`);
        checks.push(`It does not list ${joinList(missing.map(labelFor))}.`);
      }

      wantedPriorities.forEach((id) => {
        if (broker.strengths.includes(id)) {
          score += 10;
          const priority = priorities.find((p) => p.id === id);
          why.push(`You asked for ${priority.label.toLowerCase()}, and ${priority.reason}.`);
        }
      });

      if (broker.suitedTo.includes(experience)) {
        score += 8;
      } else if (experience === 'professional' || experience === 'experienced') {
        checks.push('It is set up mainly for newer traders, so check that its pricing and tools suit how you trade.');
      } else {
        checks.push('It is set up for more experienced traders, so ask what support is available at your level.');
      }

      const tier = Math.max(...broker.licences.map((l) => regulators[l.regulator].tier));
      if (tier === 3) {
        checks.push('One of its licences is offshore. Confirm which entity would hold your account, because protections differ.');
      }

      return { broker, score, why, checks };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r, index) => ({
      ...r,
      rank: index + 1,
      // A broker that falls short on something the visitor asked for is never labelled a strong fit.
      fit: r.score >= 65 && r.checks.length === 0 ? 'Strong fit' : r.score >= 40 ? 'Good fit' : 'Partial fit',
    }));

  return { status: results.length ? 'matched' : 'no-fit', results };
}
