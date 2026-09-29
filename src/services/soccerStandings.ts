import { parseLeagueStandings } from './leagueStandings';
export function parseSoccerStandings(matrix: readonly (readonly unknown[])[], gender: 'Boys' | 'Girls') {
  return parseLeagueStandings(matrix, 'Soccer', gender);
}
