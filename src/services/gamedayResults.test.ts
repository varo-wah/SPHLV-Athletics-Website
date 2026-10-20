import assert from 'node:assert/strict';
import test from 'node:test';
import { mergeGameDayResults } from './gamedayResults';
import { OCTOBER_20_UPDATES } from '../data/october20Updates';
import type { ResultSourceMetadata } from './parsers';

const sources: ResultSourceMetadata[] = [{ id: 'girls', teamId: 'soccer-sma-girls', displayName: 'Girls', sport: 'Soccer', sportKey: 'Soccer', level: 'SMA', genderGroup: 'Girls' }];

test('adds only confirmed new fixtures and remains idempotent', () => {
  const matches = mergeGameDayResults([], sources);
  assert.equal(matches.length, 6);
  assert.deepEqual(matches.filter(m => ['SPH-KV', 'JIS'].includes(m.opponent)).map(m => [m.opponent, m.scoreFor, m.scoreAgainst]), [['SPH-KV', 2, 2], ['JIS', 3, 0]]);
  assert.deepEqual(mergeGameDayResults(matches, sources), matches);
});

test('recognizes a later published fixture with an opponent alias without duplicating it', () => {
  const fixtures = mergeGameDayResults([], sources);
  const published = { ...fixtures.find(m => m.opponent === 'SPH-KV')!, id: 'published-kv', opponent: 'KV', time: '08:10' };
  const matches = mergeGameDayResults([published], sources);
  assert.equal(matches.length, 6);
  assert.equal(matches[0].id, 'published-kv');
  assert.equal(matches[0].time, '08:10');
});

test('preserves a corrected published score and does not attach conflicting reviewed stats', () => {
  const fixture = mergeGameDayResults([], sources).find(m => m.opponent === 'SPH-KV')!;
  const corrected = { ...fixture, scoreFor: 3, homeScore: 3, statLeaders: ['Corrected source stats'], highlights: [] };
  assert.deepEqual(mergeGameDayResults([corrected], sources)[0], corrected);
});

test('adds National High results once and recognizes the full school name from a later feed', () => {
  const basketballSources: ResultSourceMetadata[] = ['Boys', 'Girls'].map(gender => ({
    id: `basketball-${gender}`, teamId: `basketball-smp-${gender.toLowerCase()}`, displayName: gender,
    sport: 'Basketball', sportKey: 'Basketball', level: 'SMP', genderGroup: gender as 'Boys' | 'Girls',
  }));
  const matches = mergeGameDayResults([], basketballSources).filter(m => m.opponent === 'National High');
  assert.deepEqual(matches.map(m => [m.scoreFor, m.scoreAgainst]), [[91, 20], [43, 9]]);
  const published = { ...matches[0], id: 'published-national', opponent: 'National High School' };
  const merged = mergeGameDayResults([published, matches[1]], basketballSources).filter(m => /National High/.test(m.opponent));
  assert.equal(merged.length, 2);
  assert.equal(merged[0].id, 'published-national');
  assert.equal(merged[1].locationType, 'TBD');
});

test('keeps regulation scores separate from the semifinal shootout and preserves subsequent corrections', () => {
  const boys: ResultSourceMetadata[] = [{ ...sources[0], id: 'boys', teamId: 'soccer-sma-boys', genderGroup: 'Boys' }];
  const matches = mergeGameDayResults([], boys).filter(m => m.matchType?.startsWith('SPH Cup'));
  assert.deepEqual(matches.map(m => [m.opponent, m.scoreFor, m.scoreAgainst, m.result]), [
    ['SMK-31', 1, 0, 'W'], ['PGRI-83', 1, 1, 'W'], ['SLH Moria', 1, 4, 'L'],
  ]);
  assert.deepEqual(matches[1].penalties, { scoreFor: 4, scoreAgainst: 3 });
  assert.deepEqual(mergeGameDayResults(matches, boys).filter(m => m.matchType?.startsWith('SPH Cup')), matches);
  const corrected = { ...matches[1], scoreFor: 0, homeScore: 0, result: 'L' as const, penalties: undefined, highlights: [] };
  assert.deepEqual(mergeGameDayResults([corrected], boys)[0], corrected);
});

test('applies the confirmed BSJ correction and preserves later different published scores', () => {
  const boys: ResultSourceMetadata[] = [{ ...sources[0], id: 'boys-basketball', teamId: 'basketball-smp-boys', sport: 'Basketball', sportKey: 'Basketball', level: 'SMP', genderGroup: 'Boys' }];
  const matches = mergeGameDayResults([], boys);
  const bsj = matches.find(m => m.date === '2026-09-26' && m.opponent === 'BSJ')!;
  assert.equal(bsj.scoreFor, 69);
  const published = { ...bsj, scoreFor: 67, homeScore: 67 };
  assert.equal(mergeGameDayResults([published], boys)[0].scoreFor, 69);
  const later = { ...bsj, scoreFor: 70, homeScore: 70 };
  assert.equal(mergeGameDayResults([later], boys)[0].scoreFor, 70);
  assert.deepEqual(mergeGameDayResults(matches, boys), matches);
});

test('retains Cup classification and October set scores across repeated feed merges', () => {
  const volleyballSources: ResultSourceMetadata[] = ['Boys', 'Girls'].map(gender => ({
    id: `volleyball-${gender}`, teamId: `volleyball-sma-${gender.toLowerCase()}`, displayName: gender,
    sport: 'Volleyball', sportKey: 'Volleyball', level: 'SMA', genderGroup: gender as 'Boys' | 'Girls',
  }));
  const matches = mergeGameDayResults([], volleyballSources);
  const cup = matches.filter(m => m.teamId === 'volleyball-sma-girls' && m.matchType === 'SPH Cup');
  assert.equal(cup.length, 4);
  assert.equal(cup.filter(m => m.result === 'W').length, 3);
  const bsj = matches.filter(m => m.date === '2026-10-02' && m.opponent === 'BSJ');
  assert.deepEqual(bsj.map(m => [m.scoreFor, m.scoreAgainst, m.setScores]), [
    [2, 0, ['25–16', '25–23']], [2, 0, ['25–18', '25–14']],
  ]);
  assert.ok(bsj.every(m => m.locationType === 'TBD'));
  assert.deepEqual(mergeGameDayResults(matches, volleyballSources), matches);
  const published = { ...cup[3], id: 'published-cup-stl', opponent: 'STL' };
  const refreshed = mergeGameDayResults([published], volleyballSources);
  assert.equal(refreshed.filter(m => m.date === '2026-09-29' && m.teamId === 'volleyball-sma-girls' && /STL|Laurensia/.test(m.opponent)).length, 1);
  assert.equal(refreshed[0].id, 'published-cup-stl');
});

const allSources: ResultSourceMetadata[] = ['Soccer', 'Basketball', 'Volleyball'].flatMap(sport => ['Boys', 'Girls'].map(gender => ({
  id: `${sport}-${gender}`, teamId: `${sport.toLowerCase()}-${sport === 'Basketball' ? 'smp' : 'sma'}-${gender.toLowerCase()}`,
  displayName: `${gender} ${sport}`, sport: sport as 'Soccer' | 'Basketball' | 'Volleyball',
  sportKey: sport as 'Soccer' | 'Basketball' | 'Volleyball', level: sport === 'Basketball' ? 'SMP' as const : 'SMA' as const,
  genderGroup: gender as 'Boys' | 'Girls',
})));

test('adds all 22 October-audit results plus the archived St John report without inventing match dates', () => {
  const matches = mergeGameDayResults([], allSources, OCTOBER_20_UPDATES);
  assert.equal(matches.length, 23);
  assert.equal(new Set(matches.map(m => m.id)).size, 23);
  const dated = matches.filter(m => m.date);
  const undated = matches.filter(m => !m.date);
  assert.equal(dated.length, 10);
  assert.equal(undated.length, 13);
  assert.ok(undated.every(m => m.reportedDate && m.reviewedFixtureId && m.status === 'Finished'));
  assert.ok(undated.every(m => m.time === '' && m.venue === '' && m.locationType === 'TBD'));
  assert.deepEqual(mergeGameDayResults(matches, allSources, OCTOBER_20_UPDATES), matches);
  assert.equal(matches.find(m => m.teamId === 'soccer-sma-boys' && m.opponent === 'ACS')?.date, '2026-10-17');
  assert.deepEqual(dated.filter(m => m.teamId === 'soccer-sma-girls').map(m => [m.date, m.opponent, m.scoreFor, m.scoreAgainst]), [
    ['2026-09-05', 'GJS', 6, 0], ['2026-10-02', 'BSJ', 0, 2], ['2026-10-13', 'ACS', 1, 0], ['2026-10-19', 'STL', 1, 2],
  ]);
});

test('keeps the two POPB games distinct, both before and after actual dates are confirmed', () => {
  const updates = OCTOBER_20_UPDATES.filter(update => update.teamId === 'volleyball-sma-boys' && update.opponent === 'POPB');
  const undated = mergeGameDayResults([], allSources, updates);
  assert.deepEqual(undated.map(m => [m.scoreFor, m.scoreAgainst]), [[2, 1], [2, 0]]);
  assert.equal(new Set(undated.map(m => m.id)).size, 2);
  const confirmed = updates.map(update => ({ ...update, date: '2026-10-17' }));
  const dated = mergeGameDayResults(undated, allSources, confirmed);
  assert.equal(dated.length, 2);
  assert.ok(dated.every(m => m.date === '2026-10-17'));
  const published = dated.map((match, index) => ({ ...match, id: `published-${index}`, reviewedFixtureId: undefined, matchType: '' }));
  const reconciled = mergeGameDayResults(published, allSources, confirmed);
  assert.equal(reconciled.length, 2);
  assert.deepEqual(reconciled.map(m => m.reviewedFixtureId), updates.map(update => update.fixtureId));
  assert.deepEqual(mergeGameDayResults(reconciled, allSources, confirmed), reconciled);
});

test('undated reports require explicit identity to reconcile with a dated feed result', () => {
  const update = OCTOBER_20_UPDATES.find(item => item.fixtureId === '2026-girls-basketball-cup-final')!;
  const [fixture] = mergeGameDayResults([], allSources, [update]);
  const published = { ...fixture, id: 'published-final', date: '2026-10-17' };
  const matched = mergeGameDayResults([published], allSources, [update]);
  assert.equal(matched.length, 1);
  assert.equal(matched[0].date, '2026-10-17');
  const unrelated = { ...published, reviewedFixtureId: undefined };
  assert.equal(mergeGameDayResults([unrelated], allSources, [update]).length, 2);
  const identified = { ...unrelated, sourceFixtureId: update.fixtureId };
  assert.equal(mergeGameDayResults([identified], allSources, [update]).length, 1);
});

test('retains confirmed fixture identity while withholding reviewed stats from a corrected score', () => {
  const update = OCTOBER_20_UPDATES.find(item => item.fixtureId === '2026-boys-basketball-cup-final')!;
  const [fixture] = mergeGameDayResults([], allSources, [update]);
  const published = { ...fixture, id: 'published-corrected-final', reviewedFixtureId: undefined, scoreFor: 44, homeScore: 44, statLeaders: ['Corrected stats'], highlights: [] };
  const [merged] = mergeGameDayResults([published], allSources, [update]);
  assert.equal(merged.scoreFor, 44);
  assert.equal(merged.reviewedFixtureId, update.fixtureId);
  assert.deepEqual(merged.statLeaders, ['Corrected stats']);
  assert.deepEqual(merged.highlights, []);
});

test('does not turn disputed player stats or unknown competitions into asserted facts', () => {
  const matches = mergeGameDayResults([], allSources, OCTOBER_20_UPDATES);
  const smp6 = matches.find(m => m.reviewedFixtureId === '2026-girls-basketball-cup-smp6')!;
  assert.ok(smp6.statLeaders?.every(stat => !/Hillary.*steal/i.test(stat)));
  const eduardo = matches.filter(m => m.statLeaders?.some(stat => /Eduardo/.test(stat)));
  assert.equal(eduardo.length, 2);
  assert.ok(eduardo.every(m => m.statLeaders?.some(stat => /Eduardo \(name as reported\)/.test(stat))));
  assert.ok(matches.filter(m => m.sportKey === 'Volleyball').every(m => m.tournament !== 'ACSC' && !m.matchType?.includes('ACSC')));
});
