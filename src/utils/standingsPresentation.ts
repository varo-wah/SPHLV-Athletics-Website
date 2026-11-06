import type { Standing } from '../services/parsers';

export function standingsShowDraws(sport: string): boolean {
  return sport === 'Soccer';
}

export function standingsRecordLabel(wins: number, draws: number, losses: number, sport: string): string {
  return standingsShowDraws(sport) ? `${wins}W · ${draws}D · ${losses}L` : `${wins}W · ${losses}L`;
}

export function formatWinPercentage(value: number | null): string {
  return value === null ? '—' : `${(value * 100).toFixed(1)}%`;
}

function presentStanding(row: Standing, idx: number) {
  const wins = row.wins ?? 0;
  const draws = standingsShowDraws(row.sportKey) ? row.draws ?? 0 : 0;
  const losses = row.losses ?? 0;
  const gp = wins + draws + losses;
  return {
    row, idx, wins, draws, losses, gp,
    pts: row.points ?? wins * (row.sportKey === 'Soccer' ? 3 : 2) + draws,
    goalsFor: row.forValue ?? 0,
    diff: row.difference ?? (row.forValue !== null && row.againstValue !== null ? row.forValue - row.againstValue : 0),
    winPercentage: gp > 0 ? wins / gp : null,
  };
}

type PresentedStanding = ReturnType<typeof presentStanding>;

function compareResults(a: PresentedStanding, b: PresentedStanding): number {
  // An unplayed record has no percentage; keep it below every played record.
  if (!a.gp || !b.gp) return Number(Boolean(b.gp)) - Number(Boolean(a.gp));
  // Compare the exact ratios so rounded display percentages never create a tie.
  return b.wins * a.gp - a.wins * b.gp
    || b.diff - a.diff
    || b.goalsFor - a.goalsFor
    || b.wins - a.wins;
}

// Respect the league's published positions. Fill any unseeded places using the usual win-percentage order.
export function rankStandings(rows: readonly Standing[]) {
  const entries = rows.map(presentStanding);
  const published = new Map<number, PresentedStanding | null>();
  for (const entry of entries) {
    const position = entry.row.rank;
    if (position == null || !Number.isInteger(position) || position < 1 || position > entries.length) continue;
    // A duplicate position cannot identify which team belongs in that slot.
    published.set(position, published.has(position) ? null : entry);
  }
  const seeded = new Set(published.values());
  const unseeded = entries.filter(entry => !seeded.has(entry))
    .sort((a, b) => compareResults(a, b) || a.row.team.localeCompare(b.row.team));
  let unseededIndex = 0;
  const ordered = entries.map((_, index) => published.get(index + 1) ?? unseeded[unseededIndex++]);
  let rank = 0;
  return ordered.map((entry, index) => {
    const previous = ordered[index - 1];
    const next = ordered[index + 1];
    const tiedWith = (other: PresentedStanding | undefined) => Boolean(other && !seeded.has(entry) && !seeded.has(other) && compareResults(entry, other) === 0);
    if (!tiedWith(previous)) rank = index + 1;
    return { ...entry, rank, isTied: tiedWith(previous) || tiedWith(next) };
  });
}
