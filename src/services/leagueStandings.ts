import type { Standing } from './parsers';

export type LeagueSport = 'Soccer' | 'Volleyball' | 'Basketball';
type Matrix = readonly (readonly unknown[])[];
type Score = [number, number];

const text = (value: unknown) => String(value ?? '').trim();

function readLeagueTable(matrix: Matrix) {
  const header = matrix.find(row => row.some(cell => text(cell) === 'Points') && row.some(cell => text(cell) === 'SPH-LV'));
  const pointsColumn = header?.findIndex(cell => text(cell) === 'Points') ?? -1;
  const seedColumn = header?.findIndex(cell => text(cell) === 'Seed') ?? -1;
  const teams = header?.slice(1, pointsColumn).map(text) ?? [];
  if (pointsColumn < 3 || !teams.includes('SPH-LV') || teams.some(team => !team) || new Set(teams).size !== teams.length) {
    throw new Error('Invalid standings header');
  }
  const rows = teams.map(team => {
    const row = matrix.find(cells => text(cells[0]) === team);
    if (!row) throw new Error(`Missing standings row: ${team}`);
    return row;
  });
  return { pointsColumn, seedColumn, teams, rows };
}

function readScore(value: unknown, sport: LeagueSport): Score | null {
  const cell = text(value);
  if (!cell || /^[-–—]$/.test(cell)) return null;
  const score = cell.match(/^(\d+)\s*[-–]\s*(\d+)(?:\s*\(forfeit\))?$/i);
  if (!score) throw new Error(`Invalid ${sport.toLowerCase()} score: ${cell}`);
  return [Number(score[1]), Number(score[2])];
}

function matchupScore(rows: Matrix, i: number, j: number, sport: LeagueSport): Score | null {
  const score = readScore(rows[i][j + 1], sport);
  const reverse = readScore(rows[j][i + 1], sport);
  if (score && reverse && (score[0] !== reverse[1] || score[1] !== reverse[0])) {
    throw new Error('Conflicting reciprocal standings scores');
  }
  return score ?? (reverse ? [reverse[1], reverse[0]] : null);
}

function readInteger(value: unknown): number | null {
  const cell = text(value);
  if (!cell) return null;
  if (!/^\d+$/.test(cell)) throw new Error(`Invalid standings value: ${cell}`);
  return Number(cell);
}

/** Some workbooks have a separate position table. Use it only if complete and consistent with the ladder. */
function readPublishedRanks(matrix: Matrix, table: ReturnType<typeof readLeagueTable>) {
  const { teams, rows, pointsColumn, seedColumn } = table;
  const seeds = rows.map(row => readInteger(row[seedColumn]));
  const publishedSeeds = seeds.filter((rank): rank is number => rank !== null);
  if (publishedSeeds.some(rank => rank < 1 || rank > teams.length) || new Set(publishedSeeds).size !== publishedSeeds.length) {
    throw new Error('Invalid standings seeds');
  }

  const positionHeader = matrix.findIndex(row => text(row[0]) === 'Position' && text(row[1]) === 'School');
  if (positionHeader < 0) return seeds;

  const key = (value: unknown) => text(value).replace(/[ -]/g, '').toUpperCase();
  const positions = matrix.slice(positionHeader + 1);
  const ranks = teams.map((team, i) => {
    const entry = positions.find(row => key(row[1]) === key(team));
    const rank = Number(entry?.[0]);
    if (!Number.isInteger(rank) || rank < 1 || rank > teams.length || (seeds[i] !== null && seeds[i] !== rank)) return null;
    if (!text(entry?.[2]) || Number(entry?.[2]) !== Number(rows[i][pointsColumn])) return null;
    return rank;
  });
  return ranks.every(rank => rank !== null) && new Set(ranks).size === teams.length ? ranks : seeds;
}

export function parseLeagueStandings(matrix: Matrix, sport: LeagueSport, gender: 'Boys' | 'Girls'): Standing[] {
  const table = readLeagueTable(matrix);
  const ranks = readPublishedRanks(matrix, table);
  const level = sport === 'Basketball' ? 'SMP' : 'SMA';
  return table.teams.map((team, i) => {
    let wins = 0, draws = 0, losses = 0, forValue = 0, againstValue = 0;
    for (let j = 0; j < table.teams.length; j++) {
      if (i === j) continue;
      const score = matchupScore(table.rows, i, j, sport);
      if (!score) continue;
      const [own, other] = score;
      forValue += own;
      againstValue += other;
      if (own > other) wins++;
      else if (own === other) draws++;
      else losses++;
    }
    const computedPoints = wins * (sport === 'Soccer' ? 3 : 2) + draws;
    const points = readInteger(table.rows[i][table.pointsColumn]) ?? computedPoints;
    return {
      id: `official-${sport}-${level}-${gender}-${team}`.toLowerCase(), pageId: `${sport}-${level}-${gender}`.toLowerCase(),
      sport, sportKey: sport, level, genderGroup: gender, tournament: 'Season', rank: ranks[i], team,
      wins, draws, losses, points, forValue, againstValue, difference: forValue - againstValue,
      notes: points === computedPoints ? '' : `The league lists ${points} points. The match scores imply ${computedPoints}.`,
    };
  });
}

export function parseLeagueMatchups(matrix: Matrix, sport: LeagueSport) {
  const { teams, rows } = readLeagueTable(matrix);
  const matchups = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const score = matchupScore(rows, i, j, sport);
      if (score) matchups.push({ teamA: teams[i], teamB: teams[j], scoreA: score[0], scoreB: score[1] });
    }
  }
  return matchups;
}
