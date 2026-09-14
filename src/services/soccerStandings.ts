import type { Standing } from './parsers';

// The official workbook is a score matrix, not a conventional standings table.
export function parseSoccerStandings(matrix: readonly (readonly unknown[])[], gender: 'Boys' | 'Girls'): Standing[] {
  const header = matrix[1]?.slice(1, 10).map(String);
  if (!header || header.length !== 9 || !header.includes('SPH-LV') || new Set(header).size !== 9) {
    throw new Error('Invalid soccer standings header');
  }
  return header.map((team, index) => {
    const row = matrix.find((cells, i) => i > 1 && cells[0] === team);
    if (!row) throw new Error(`Missing soccer standings row: ${team}`);
    let wins = 0, draws = 0, losses = 0, forValue = 0, againstValue = 0;
    header.forEach((opponent, column) => {
      const value = String(row[column + 1] ?? '').trim();
      if (opponent === team || !value) return;
      const score = value.match(/^(\d+)\s*[-–]\s*(\d+)$/);
      if (!score) throw new Error(`Invalid soccer score: ${team} vs ${opponent}`);
      const own = Number(score[1]), other = Number(score[2]);
      forValue += own;
      againstValue += other;
      if (own > other) wins++;
      else if (own === other) draws++;
      else losses++;
    });
    const points = wins * 3 + draws;
    const publishedPoints = String(row[10] ?? '').trim();
    if (publishedPoints && Number(publishedPoints) !== points) {
      throw new Error(`Soccer points disagree with scores: ${team}`);
    }
    return {
      id: `official-soccer-sma-${gender}-${team}`.toLowerCase(),
      pageId: `soccer-sma-${gender}`.toLowerCase(),
      sport: 'Soccer', sportKey: 'Soccer', level: 'SMA', genderGroup: gender,
      tournament: 'Season', rank: index + 1, team,
      wins, draws, losses, points, forValue, againstValue,
      difference: forValue - againstValue,
      notes: 'Official 26/27 soccer standings',
    };
  });
}
