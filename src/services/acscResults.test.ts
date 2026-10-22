import assert from 'node:assert/strict';
import test from 'node:test';
import { RESULT_SHEET_SOURCES } from '../config/sheets';
import { ACSC_COMPETITION_RESULTS, acscMatchFinished } from '../data/acscCompetitionResults2026';
import { acscSchoolForName } from '../data/acscSchools';
import { OCTOBER_20_UPDATES } from '../data/october20Updates';
import { acscGameDayUpdates, mergeAcscCompetitionSchedule } from './acscResults';
import { mergeAcscSoccerSchedule, mergeAcscVolleyballSchedule } from './acscSchedule';
import { mergeGameDayResults } from './gamedayResults';

test('calendar merges mark 15 completed fixtures once and preserve schedule links for unplayed games', () => {
  const initial = mergeAcscVolleyballSchedule(mergeAcscSoccerSchedule([]));
  const alias = initial.find(event => event.id === 'acsc-volleyball-girls-2026-round-robin-ics-hk')!;
  assert.ok(alias);
  const source = initial.map(event => event === alias ? { ...event, id: 'published-hk', opponent: 'ICS-HK' } : event);
  const merged = mergeAcscCompetitionSchedule(source);
  assert.equal(merged.length, initial.length);
  assert.equal(merged.filter(event => event.status === 'Finished').length, 15);
  assert.equal(new Set(merged.map(event => event.id)).size, merged.length);
  assert.deepEqual(mergeAcscCompetitionSchedule(merged), merged);
  const quarterfinal = merged.find(event => event.id === 'acsc-volleyball-girls-2026-quarterfinal')!;
  assert.equal(quarterfinal.status, 'Scheduled');
  assert.equal(quarterfinal.resultScore, undefined);
  assert.match(quarterfinal.sourceUrl!, /2PACX-1vTmw83IXsQ1Bx8cEpDl0CfDfbbYccDVwwQSqiuePxXyxTPhaECEoMEONTHdCE0WU9T91NJJZfPBHpMz/);
});

for (const snapshot of ACSC_COMPETITION_RESULTS) {
  test(`${snapshot.teamId}: every pool standing reconciles with its completed matches`, () => {
    const completedPool = snapshot.matches.filter(match => match.kind === 'pool' && acscMatchFinished(match));
    for (const pool of snapshot.pools) {
      const schools = new Set<string>(pool.rows.map(row => row.school));
      const matches = completedPool.filter(match => schools.has(match.home) && schools.has(match.away));
      const pairs = matches.map(match => [match.home, match.away].sort().join('/'));
      assert.equal(new Set(pairs).size, matches.length, `${pool.name}: duplicate pool opponent pairing`);
      if (pool.complete) {
        assert.equal(matches.length, schools.size * (schools.size - 1) / 2, `${pool.name}: complete round robin`);
      }

      for (const row of pool.rows) {
        const scores = matches.filter(match => match.home === row.school || match.away === row.school)
          .map(match => match.home === row.school
            ? [match.homeScore!, match.awayScore!] : [match.awayScore!, match.homeScore!]);
        const wins = scores.filter(([own, opponent]) => own > opponent).length;
        const draws = scores.filter(([own, opponent]) => own === opponent).length;
        const losses = scores.filter(([own, opponent]) => own < opponent).length;
        const context = `${pool.name}: ${row.school}`;
        assert.deepEqual(
          { played: row.played, wins: row.wins, draws: row.draws ?? 0, losses: row.losses },
          { played: scores.length, wins, draws, losses }, context,
        );
        if (row.forValue !== undefined) {
          assert.equal(row.forValue, scores.reduce((total, [own]) => total + own, 0), `${context}: goals/sets for`);
        }
        if (row.againstValue !== undefined) {
          assert.equal(row.againstValue, scores.reduce((total, [, opponent]) => total + opponent, 0), `${context}: goals/sets against`);
        }
        // Both published point tables award three points per win; soccer also awards one for a draw.
        if (row.points !== undefined) assert.equal(row.points, 3 * wins + draws, `${context}: points`);
      }
    }
  });
}

test('the reviewed snapshot contains 58 official results and adds only the 15 completed SPH fixtures', () => {
  const completedCounts = ACSC_COMPETITION_RESULTS.map(snapshot => [snapshot.teamId, snapshot.matches.filter(acscMatchFinished).length]);
  assert.deepEqual(completedCounts, [
    ['soccer-sma-boys', 12], ['volleyball-sma-girls', 28], ['volleyball-sma-boys', 18],
  ]);
  assert.equal(ACSC_COMPETITION_RESULTS.flatMap(snapshot => snapshot.matches.filter(acscMatchFinished)).length, 58);
  const updates = acscGameDayUpdates();
  assert.equal(updates.length, 15);
  assert.deepEqual(ACSC_COMPETITION_RESULTS.map(snapshot => updates.filter(update => update.teamId === snapshot.teamId).length), [3, 7, 5]);
  assert.equal(new Set(updates.map(update => update.fixtureId)).size, 15);

  const unfinishedIds = new Set(ACSC_COMPETITION_RESULTS.flatMap(snapshot => snapshot.matches
    .filter(match => !acscMatchFinished(match)).map(match => match.fixtureId ?? match.id)));
  assert.ok(unfinishedIds.size > 0);
  assert.ok(updates.every(update => !unfinishedIds.has(update.fixtureId!)));
  const matches = mergeGameDayResults([], RESULT_SHEET_SOURCES, updates);
  assert.equal(matches.length, 15);
  assert.ok(matches.every(match => match.status === 'Finished' && match.tournament === 'ACSC'));
  assert.ok(matches.every(match => !/quarterfinal|semifinal|placement|championship|playoff/i.test(match.matchType ?? '')));
  assert.deepEqual(mergeGameDayResults(matches, RESULT_SHEET_SOURCES, updates), matches);
});

test('neutral results retain SPH score and set-point orientation for either official home/away order', () => {
  const matches = mergeGameDayResults([], RESULT_SHEET_SOURCES, acscGameDayUpdates());
  const sourceOrders = new Set<string>();
  for (const snapshot of ACSC_COMPETITION_RESULTS) {
    for (const official of snapshot.matches.filter(match => acscMatchFinished(match) && (match.home === 'SPH' || match.away === 'SPH'))) {
      const home = official.home === 'SPH';
      sourceOrders.add(home ? 'home' : 'away');
      const result = matches.find(match => match.teamId === snapshot.teamId && match.reviewedFixtureId === (official.fixtureId ?? official.id));
      assert.ok(result, official.id);
      const own = home ? official.homeScore : official.awayScore;
      const opponent = home ? official.awayScore : official.homeScore;
      assert.deepEqual([result.scoreFor, result.scoreAgainst], [own, opponent], official.id);
      assert.equal(result.result, own! > opponent! ? 'W' : own! < opponent! ? 'L' : 'D', official.id);
      assert.equal(result.locationType, 'Neutral', official.id);
      assert.equal(acscSchoolForName(result.opponent)?.code, home ? official.away : official.home, official.id);
      const sphShownHome = acscSchoolForName(result.homeTeam)?.code === 'SPH';
      assert.deepEqual([result.homeScore, result.awayScore], sphShownHome ? [own, opponent] : [opponent, own], official.id);
      if (official.setScores) {
        const expected = official.setScores.map(score => {
          const [first, second] = score.split(/[–-]/).map(Number);
          return home ? [first, second] : [second, first];
        });
        assert.deepEqual(result.setScores?.map(score => score.split(/[–-]/).map(Number)), expected, official.id);
        assert.equal(expected.filter(([ownPoints, opponentPoints]) => ownPoints > opponentPoints).length, own, `${official.id}: sets won`);
        assert.equal(expected.filter(([ownPoints, opponentPoints]) => ownPoints < opponentPoints).length, opponent, `${official.id}: sets lost`);
      }
    }
  }
  assert.deepEqual([...sourceOrders].sort(), ['away', 'home']);
  const hongKong = matches.find(match => match.reviewedFixtureId === 'acsc-soccer-2026-pool-ics-hk')!;
  assert.deepEqual([hongKong.scoreFor, hongKong.scoreAgainst, hongKong.result], [0, 4, 'L']);
});

test('published school aliases reconcile without duplicates or mixing boys and girls fixtures', () => {
  const updates = acscGameDayUpdates();
  const generated = mergeGameDayResults([], RESULT_SHEET_SOURCES, updates);
  const aliases: Record<string, string> = {
    MORRISON: 'MAC', 'ICS-HK': 'ICS-HK', 'ICS-BKK': 'ICS BKK', GIS: 'GIS', FAITH: 'FA', DALAT: 'DIS', YISS: 'Yongsan',
  };
  const published = generated.map((match, index) => ({
    ...match, id: `published-acsc-${index}`, reviewedFixtureId: undefined, sourceFixtureId: undefined,
    opponent: aliases[acscSchoolForName(match.opponent)!.code],
  }));
  const merged = mergeGameDayResults(published, RESULT_SHEET_SOURCES, updates);
  assert.equal(merged.length, 15);
  assert.deepEqual(merged.map(match => match.id), published.map(match => match.id));
  assert.deepEqual(merged.map(match => match.reviewedFixtureId), generated.map(match => match.reviewedFixtureId));
  assert.deepEqual(merged.map(match => [match.teamId, match.scoreFor, match.scoreAgainst]), generated.map(match => [match.teamId, match.scoreFor, match.scoreAgainst]));
  assert.deepEqual(mergeGameDayResults(merged, RESULT_SHEET_SOURCES, updates), merged);
});

test('merging ACSC results preserves prior results and later published score corrections', () => {
  const previous = mergeGameDayResults([], RESULT_SHEET_SOURCES, OCTOBER_20_UPDATES);
  const untouched = structuredClone(previous);
  const updates = acscGameDayUpdates();
  const merged = mergeGameDayResults(previous, RESULT_SHEET_SOURCES, updates);
  assert.equal(merged.length, previous.length + 15);
  assert.deepEqual(merged.slice(0, previous.length), untouched);
  assert.deepEqual(previous, untouched, 'the input array and result objects remain unchanged');
  assert.deepEqual(mergeGameDayResults(merged, RESULT_SHEET_SOURCES, updates), merged);

  const morrison = merged.find(match => match.reviewedFixtureId === 'acsc-soccer-2026-pool-morrison')!;
  const corrected = { ...morrison, scoreFor: 6, homeScore: 6, statLeaders: ['Later published correction'], highlights: [] };
  assert.deepEqual(mergeGameDayResults([corrected], RESULT_SHEET_SOURCES, updates)[0], corrected);
});
