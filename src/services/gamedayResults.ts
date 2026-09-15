import { GAMEDAY_UPDATES } from '../data/gamedayUpdates';
import { parseResultRows, type ResultSourceMetadata, type SheetMatch } from './parsers';

function opponentKey(value: string): string {
  const key = value.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['nh', 'nhs', 'nationalhigh', 'nationalhighschool'].includes(key)) return 'nationalhigh';
  return key === 'kv' || key === 'sphkv' ? 'sphkv' : key;
}

/** Keep reviewed additions across cache refreshes; published result scores win. */
export function mergeGameDayResults(matches: SheetMatch[], sources: ResultSourceMetadata[]): SheetMatch[] {
  const result = [...matches];
  for (const update of GAMEDAY_UPDATES) {
    const index = result.findIndex((match) => match.teamId === update.teamId
      && match.date === update.date && opponentKey(match.opponent) === opponentKey(update.opponent));
    if (index >= 0) {
      const match = result[index];
      if (match.scoreFor === update.scoreFor && match.scoreAgainst === update.scoreAgainst) {
        result[index] = { ...match, ...update.details };
      }
      continue;
    }
    const source = sources.find((item) => item.teamId === update.teamId);
    if (!source || !update.newFixture) continue;
    const parsed = parseResultRows([{
      Date: update.date, Time: update.newFixture.time, Location: update.newFixture.venue,
      'Home Team': 'SPH LV', 'Away Team': update.opponent,
      'Home Score': String(update.scoreFor), 'Away Score': String(update.scoreAgainst),
    }], source).matches[0];
    if (parsed) result.push({ ...parsed, ...update.details, locationType: update.newFixture.locationType ?? parsed.locationType });
  }
  return result;
}
