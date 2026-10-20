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

/** Rank one sport/division/gender table by wins divided by games played. */
export function rankStandings(rows: readonly Standing[]) {
  const sorted = rows.map(presentStanding).sort((a, b) => compareResults(a, b) || a.row.team.localeCompare(b.row.team));
  return sorted.map((entry, index) => {
    const firstMatchingIndex = sorted.findIndex(candidate => compareResults(candidate, entry) === 0);
    return {
      ...entry,
      rank: firstMatchingIndex + 1,
      isTied: sorted.some((candidate, candidateIndex) => candidateIndex !== index && compareResults(candidate, entry) === 0),
    };
  });
}
