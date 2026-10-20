import { GAMEDAY_UPDATES, type GameDayUpdate } from '../data/gamedayUpdates';
import type { ResultSourceMetadata, SheetMatch } from './parsers';

function opponentKey(value: string): string {
  const key = value.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['nh', 'nhs', 'nationalhigh', 'nationalhighschool'].includes(key)) return 'nationalhigh';
  if (['stl', 'ssl', 'stlaurensia', 'santalaurensia'].includes(key)) return 'stl';
  return key === 'kv' || key === 'sphkv' ? 'sphkv' : key;
}

function applyIdentity(match: SheetMatch, update: GameDayUpdate): SheetMatch {
  return {
    ...match,
    ...(!match.date && update.date ? { date: update.date } : {}),
    ...(update.reportedDate ? { reportedDate: update.reportedDate } : {}),
    ...(update.fixtureId ? { reviewedFixtureId: update.fixtureId } : {}),
  };
}

function applyDetails(match: SheetMatch, update: GameDayUpdate): SheetMatch {
  const merged = { ...applyIdentity(match, update), ...update.details };
  if (merged.penalties && merged.scoreFor === merged.scoreAgainst) {
    merged.result = merged.penalties.scoreFor > merged.penalties.scoreAgainst ? 'W' : 'L';
  }
  return merged;
}

function sameFixtureGroup(match: Pick<SheetMatch, 'teamId' | 'date' | 'opponent'>, update: GameDayUpdate) {
  return match.teamId === update.teamId && match.date === update.date
    && opponentKey(match.opponent) === opponentKey(update.opponent);
}

function reviewedMatchIndex(matches: SheetMatch[], update: GameDayUpdate, updates: GameDayUpdate[]): number {
  if (update.fixtureId) {
    const exactIndex = matches.findIndex(match => match.teamId === update.teamId
      && (match.reviewedFixtureId === update.fixtureId || match.sourceFixtureId === update.fixtureId));
    if (exactIndex >= 0) return exactIndex;
  }
  // An undated report cannot be reconciled to an arbitrary dated match by score alone.
  // Once its actual date is confirmed, the normal date/opponent matching applies.
  if (!update.date) return -1;

  const candidates = matches.map((match, index) => ({ match, index })).filter(({ match }) => (
    sameFixtureGroup(match, update)
    && (!match.reviewedFixtureId || match.reviewedFixtureId === update.fixtureId)
  ));
  const sameScore = candidates.filter(({ match }) => match.scoreFor === update.scoreFor && match.scoreAgainst === update.scoreAgainst);
  if (sameScore.length === 1) return sameScore[0].index;
  const sameStage = candidates.filter(({ match }) => update.details.matchType && match.matchType === update.details.matchType);
  if (sameStage.length === 1) return sameStage[0].index;
  // A later correction still belongs to a uniquely identified fixture. Multiple
  // same-day games require a matching score, stage, or explicit fixture ID.
  return candidates.length === 1 && updates.filter(item => sameFixtureGroup(item, update)).length === 1
    ? candidates[0].index : -1;
}

function createReviewedFixture(update: GameDayUpdate, source: ResultSourceMetadata): SheetMatch | null {
  const fixture = update.newFixture;
  if (!fixture || (!update.date && (!update.reportedDate || !update.fixtureId))) return null;
  const home = fixture.locationType !== 'Away';
  const homeTeam = home ? 'SPH LV' : update.opponent;
  const awayTeam = home ? update.opponent : 'SPH LV';
  const id = update.fixtureId
    ? `${source.id}-reviewed-${update.fixtureId}`
    : [source.id, update.date, homeTeam, awayTeam].map(value => value.toLowerCase().replace(/[^a-z0-9-]/g, '')).join('-');
  return applyDetails({
    id, sourceId: source.id, teamId: source.teamId, pageId: source.teamId,
    sport: source.sport, sportKey: source.sportKey, level: source.level, genderGroup: source.genderGroup,
    tournament: 'Other', date: update.date, time: fixture.time, homeTeam, awayTeam, opponent: update.opponent,
    locationType: fixture.locationType ?? 'Home', venue: fixture.venue, status: 'Finished',
    result: update.scoreFor > update.scoreAgainst ? 'W' : update.scoreFor < update.scoreAgainst ? 'L' : 'D',
    homeScore: home ? update.scoreFor : update.scoreAgainst, awayScore: home ? update.scoreAgainst : update.scoreFor,
    scoreFor: update.scoreFor, scoreAgainst: update.scoreAgainst, notes: '',
    set1For: null, set1Against: null, set2For: null, set2Against: null, set3For: null, set3Against: null,
  }, update);
}

/** Keep reviewed additions across cache refreshes; published result scores win. */
export function mergeGameDayResults(
  matches: SheetMatch[],
  sources: ResultSourceMetadata[],
  updates: GameDayUpdate[] = GAMEDAY_UPDATES,
): SheetMatch[] {
  const result = [...matches];
  for (const update of updates) {
    const index = reviewedMatchIndex(result, update, updates);
    if (index >= 0) {
      let match = result[index];
      if (update.replacesScore && match.scoreFor === update.replacesScore.scoreFor && match.scoreAgainst === update.replacesScore.scoreAgainst) {
        const home = match.homeTeam.replace(/[^a-z]/gi, '').toLowerCase() === 'sphlv';
        match = { ...match, scoreFor: update.scoreFor, scoreAgainst: update.scoreAgainst,
          homeScore: home ? update.scoreFor : update.scoreAgainst, awayScore: home ? update.scoreAgainst : update.scoreFor,
          result: update.scoreFor > update.scoreAgainst ? 'W' : update.scoreFor < update.scoreAgainst ? 'L' : 'D' };
      }
      if (match.scoreFor === update.scoreFor && match.scoreAgainst === update.scoreAgainst) {
        result[index] = applyDetails(match, update);
      } else {
        // Keep fixture provenance when a published score changes, without
        // reattaching statistics or highlights from the superseded score.
        result[index] = applyIdentity(match, update);
      }
      continue;
    }
    const source = sources.find(item => item.teamId === update.teamId);
    if (!source) continue;
    const fixture = createReviewedFixture(update, source);
    if (fixture) result.push(fixture);
  }
  return result;
}
