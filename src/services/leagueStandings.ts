import type { Standing } from './parsers';

export type LeagueSport = 'Soccer' | 'Volleyball' | 'Basketball';

/** Team columns end at Points; the league can add or remove schools mid-season. */
export function parseLeagueStandings(matrix: readonly (readonly unknown[])[], sport: LeagueSport, gender: 'Boys' | 'Girls'): Standing[] {
  const header = matrix.find(row => row.some(cell => String(cell).trim() === 'Points'));
  const pointsColumn = header?.findIndex(cell => String(cell).trim() === 'Points') ?? -1;
  const teams = header?.slice(1, pointsColumn).map(cell => String(cell ?? '').trim()) ?? [];
  if (pointsColumn < 3 || !teams.includes('SPH-LV') || teams.some(t => !t) || new Set(teams).size !== teams.length) {
    throw new Error('Invalid standings header');
  }
  return teams.map((team, index) => {
    const row = matrix.find(cells => cells[0] === team);
    if (!row) throw new Error(`Missing standings row: ${team}`);
    let wins = 0, draws = 0, losses = 0, forValue = 0, againstValue = 0;
    teams.forEach((opponent, column) => {
      if (opponent === team) return;
      let value = String(row[column + 1] ?? '').trim();
      // Some league rows omit the losing side of an otherwise recorded fixture.
      const reverse = String(matrix.find(cells => cells[0] === opponent)?.[index + 1] ?? '').trim();
      if (!value && /^\d+\s*[-–]\s*\d+$/.test(reverse)) value = reverse.split(/[-–]/).reverse().join('-');
      if (!value) return;
      const score = value.match(/^(\d+)\s*[-–]\s*(\d+)$/);
      if (!score) throw new Error(`Invalid ${sport.toLowerCase()} score: ${team} vs ${opponent}`);
      const own = Number(score[1]), other = Number(score[2]);
      forValue += own; againstValue += other;
      if (own > other) wins++; else if (own === other) draws++; else losses++;
    });
    const points = wins * (sport === 'Soccer' ? 3 : 2) + draws;
    const publishedPoints = String(row[pointsColumn] ?? '').trim();
    if (publishedPoints && Number(publishedPoints) !== points) throw new Error(`Standings points disagree with scores: ${team}`);
    const level = sport === 'Basketball' ? 'SMP' : 'SMA';
    return { id: `official-${sport}-${level}-${gender}-${team}`.toLowerCase(), pageId: `${sport}-${level}-${gender}`.toLowerCase(),
      sport, sportKey: sport, level, genderGroup: gender, tournament: 'Season', rank: index + 1, team,
      wins, draws, losses, points, forValue, againstValue, difference: forValue - againstValue, notes: `Official 26/27 ${sport.toLowerCase()} standings` };
  });
}
