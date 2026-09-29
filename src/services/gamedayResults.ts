import { GAMEDAY_UPDATES } from '../data/gamedayUpdates';
import { parseResultRows, type ResultSourceMetadata, type SheetMatch } from './parsers';

function opponentKey(value: string): string {
  const key = value.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['nh', 'nhs', 'nationalhigh', 'nationalhighschool'].includes(key)) return 'nationalhigh';
  if (['stl', 'ssl', 'stlaurensia', 'santalaurensia'].includes(key)) return 'stl';
  return key === 'kv' || key === 'sphkv' ? 'sphkv' : key;
}

function applyDetails(match: SheetMatch, details: typeof GAMEDAY_UPDATES[number]['details']): SheetMatch {
  const merged = { ...match, ...details };
  if (merged.penalties && merged.scoreFor === merged.scoreAgainst) {
    merged.result = merged.penalties.scoreFor > merged.penalties.scoreAgainst ? 'W' : 'L';
  }
  return merged;
}

/** Keep reviewed additions across cache refreshes; published result scores win. */
export function mergeGameDayResults(matches: SheetMatch[], sources: ResultSourceMetadata[]): SheetMatch[] {
  const result = [...matches];
  for (const update of GAMEDAY_UPDATES) {
    const index = result.findIndex((match) => match.teamId === update.teamId
      && match.date === update.date && opponentKey(match.opponent) === opponentKey(update.opponent));
    if (index >= 0) {
      let match = result[index];
      if (update.replacesScore && match.scoreFor === update.replacesScore.scoreFor && match.scoreAgainst === update.replacesScore.scoreAgainst) {
        const home = match.homeTeam.replace(/[^a-z]/gi, '').toLowerCase() === 'sphlv';
        match = { ...match, scoreFor: update.scoreFor, scoreAgainst: update.scoreAgainst,
          homeScore: home ? update.scoreFor : update.scoreAgainst, awayScore: home ? update.scoreAgainst : update.scoreFor,
          result: update.scoreFor > update.scoreAgainst ? 'W' : update.scoreFor < update.scoreAgainst ? 'L' : 'D' };
      }
      if (match.scoreFor === update.scoreFor && match.scoreAgainst === update.scoreAgainst) {
        result[index] = applyDetails(match, update.details);
      }
      continue;
    }
    const source = sources.find((item) => item.teamId === update.teamId);
    if (!source || !update.newFixture) continue;
    const parsed = parseResultRows([{
      Date: update.date, Time: update.newFixture.time, Location: update.newFixture.venue,
      'Home Team': update.newFixture.locationType === 'Away' ? update.opponent : 'SPH LV',
      'Away Team': update.newFixture.locationType === 'Away' ? 'SPH LV' : update.opponent,
      'Home Score': String(update.newFixture.locationType === 'Away' ? update.scoreAgainst : update.scoreFor),
      'Away Score': String(update.newFixture.locationType === 'Away' ? update.scoreFor : update.scoreAgainst),
    }], source).matches[0];
    if (parsed) result.push(applyDetails({ ...parsed, locationType: update.newFixture.locationType ?? parsed.locationType }, update.details));
  }
  return result;
}
