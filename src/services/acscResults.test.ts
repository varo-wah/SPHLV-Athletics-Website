import assert from 'node:assert/strict';
import test from 'node:test';
import { RESULT_SHEET_SOURCES } from '../config/sheets';
import { ACSC_COMPETITION_RESULTS, acscMatchFinished } from '../data/acscCompetitionResults2026';
import { acscSchoolForName } from '../data/acscSchools';
import type { AcscCompetitionSnapshot } from '../data/acscCompetitionTypes';
import { ACSC_BOYS_VOLLEYBALL_SCHEDULE } from '../data/acscBoysVolleyball2026';
import { OCTOBER_20_UPDATES } from '../data/october20Updates';
import { acscGameDayUpdates, mergeAcscCompetitionSchedule } from './acscResults';
import { mergeAcscSoccerSchedule, mergeAcscVolleyballSchedule } from './acscSchedule';
import { mergeGameDayResults } from './gamedayResults';

test('calendar merges retain completed fixtures once without treating unreported past scores as upcoming', () => {
  const initial = mergeAcscVolleyballSchedule(mergeAcscSoccerSchedule([]));
  const alias = initial.find(event => event.id === 'acsc-volleyball-girls-2026-round-robin-ics-hk')!;
  assert.ok(alias);
  const source = initial.map(event => event === alias ? { ...event, id: 'published-hk', opponent: 'ICS-HK' } : event);
  const merged = mergeAcscCompetitionSchedule(source);
  assert.equal(merged.length, initial.length);
  assert.equal(merged.filter(event => event.status === 'Finished').length, merged.length);
  assert.equal(new Set(merged.map(event => event.id)).size, merged.length);
  assert.deepEqual(mergeAcscCompetitionSchedule(merged), merged);
  const quarterfinal = merged.find(event => event.id === 'acsc-volleyball-girls-2026-quarterfinal')!;
  assert.equal(quarterfinal.status, 'Finished');
  assert.ok(quarterfinal.resultScore);
  const unreported = merged.find(event => event.id === 'acsc-volleyball-boys-2026-seeding')!;
  assert.equal(unreported.status, 'Finished');
  assert.equal(unreported.resultScore, undefined);
  assert.match(unreported.details!, /Score unreported/);
});

for (const snapshot of ACSC_COMPETITION_RESULTS) {
  test(`${snapshot.teamId}: verified scores reconcile with complete or explicitly partial pool coverage`, () => {
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
        assert.equal(row.played, row.wins + (row.draws ?? 0) + row.losses, `${context}: published record total`);
        if (pool.complete || row.played === scores.length) {
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
        } else {
          assert.ok(scores.length < row.played && wins <= row.wins && draws <= (row.draws ?? 0) && losses <= row.losses,
            `${context}: partial scores cannot contradict the official final record`);
        }
        // Published points must reconcile with the published record even when one exact score is withheld.
        if (row.points !== undefined) assert.equal(row.points, 3 * row.wins + (row.draws ?? 0), `${context}: points`);
      }
    }
  });
}

test('the final snapshot imports only the 22 SPH fixtures with confirmed scores', () => {
  const completedCounts = ACSC_COMPETITION_RESULTS.map(snapshot => [snapshot.teamId, snapshot.matches.filter(acscMatchFinished).length]);
  assert.deepEqual(completedCounts, [
    ['soccer-sma-boys', 21], ['volleyball-sma-girls', 40], ['volleyball-sma-boys', 20],
  ]);
  assert.equal(ACSC_COMPETITION_RESULTS.flatMap(snapshot => snapshot.matches.filter(acscMatchFinished)).length, 81);
  const updates = acscGameDayUpdates();
  assert.equal(updates.length, 22);
  assert.deepEqual(ACSC_COMPETITION_RESULTS.map(snapshot => updates.filter(update => update.teamId === snapshot.teamId).length), [6, 10, 6]);
  assert.equal(new Set(updates.map(update => update.fixtureId)).size, 22);

  const unfinishedIds = new Set(ACSC_COMPETITION_RESULTS.flatMap(snapshot => snapshot.matches
    .filter(match => !acscMatchFinished(match)).map(match => match.fixtureId ?? match.id)));
  assert.ok(unfinishedIds.size > 0);
  assert.ok(updates.every(update => !unfinishedIds.has(update.fixtureId!)));
  const matches = mergeGameDayResults([], RESULT_SHEET_SOURCES, updates);
  assert.equal(matches.length, 22);
  assert.ok(matches.every(match => match.status === 'Finished' && match.tournament === 'ACSC'));
  assert.ok(matches.some(match => /quarterfinal|placement/i.test(match.matchType ?? '')));
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
      const decisionFor = own === opponent && official.penalties ? (home ? official.penalties.homeScore : official.penalties.awayScore) : own!;
      const decisionAgainst = own === opponent && official.penalties ? (home ? official.penalties.awayScore : official.penalties.homeScore) : opponent!;
      assert.equal(result.result, decisionFor > decisionAgainst ? 'W' : decisionFor < decisionAgainst ? 'L' : 'D', official.id);
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
  assert.equal(merged.length, 22);
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
  assert.equal(merged.length, previous.length + 22);
  assert.deepEqual(merged.slice(0, previous.length), untouched);
  assert.deepEqual(previous, untouched, 'the input array and result objects remain unchanged');
  assert.deepEqual(mergeGameDayResults(merged, RESULT_SHEET_SOURCES, updates), merged);

  const morrison = merged.find(match => match.reviewedFixtureId === 'acsc-soccer-2026-pool-morrison')!;
  const corrected = { ...morrison, scoreFor: 6, homeScore: 6, statLeaders: ['Later published correction'], highlights: [] };
  assert.deepEqual(mergeGameDayResults([corrected], RESULT_SHEET_SOURCES, updates)[0], corrected);
});


test('shootouts preserve regulation scores and use SPH orientation for both official team orders', () => {
  const base = ACSC_COMPETITION_RESULTS.find(snapshot => snapshot.sport === 'Soccer')!;
  for (const sphHome of [true, false]) {
    const snapshot: AcscCompetitionSnapshot = { ...base, matches: [{
      id: `shootout-${sphHome}`, fixtureId: 'shootout-fixture', date: '2026-10-24', time: '08:00',
      stage: 'Placement', kind: 'playoff', home: sphHome ? 'SPH' : 'YISS', away: sphHome ? 'YISS' : 'SPH',
      homeScore: 1, awayScore: 1, penalties: { homeScore: 4, awayScore: 3 },
    }] };
    const updates = acscGameDayUpdates([snapshot]);
    const result = mergeGameDayResults([], RESULT_SHEET_SOURCES, updates)[0];
    assert.deepEqual([result.scoreFor, result.scoreAgainst], [1, 1]);
    assert.deepEqual(result.penalties, sphHome ? { scoreFor: 4, scoreAgainst: 3 } : { scoreFor: 3, scoreAgainst: 4 });
    assert.equal(result.result, sphHome ? 'W' : 'L');
    const calendarBase = { ...ACSC_BOYS_VOLLEYBALL_SCHEDULE[0], id: 'shootout-fixture', tournamentId: snapshot.tournamentId };
    const calendar = mergeAcscCompetitionSchedule([calendarBase], [snapshot])[0];
    assert.equal(calendar.resultScore, sphHome ? '1–1 (4–3 on penalties)' : '1–1 (3–4 on penalties)');
  }
});

test('tournament completion closes missing-score calendar entries without manufacturing result records', () => {
  const original = ACSC_COMPETITION_RESULTS.find(snapshot => snapshot.teamId === 'volleyball-sma-boys')!;
  const base = ACSC_BOYS_VOLLEYBALL_SCHEDULE[0];
  const snapshot: AcscCompetitionSnapshot = { ...original, complete: false, matches: [{
    id: 'unreported', fixtureId: base.id, date: base.date!, time: base.time!, stage: 'Seeding', kind: 'playoff',
    home: 'YISS', away: 'SPH', homeScore: null, awayScore: null,
  }] };
  const active = mergeAcscCompetitionSchedule([base], [snapshot])[0];
  assert.equal(active.status, 'Scheduled');
  assert.match(active.sourceUrl!, /2PACX-1vQsDXP08RM7U5AG1/);
  const concluded = { ...snapshot, complete: true };
  const closed = mergeAcscCompetitionSchedule([base], [concluded])[0];
  assert.equal(closed.status, 'Finished');
  assert.equal(closed.resultScore, undefined);
  assert.match(closed.details!, /Score unreported/);
  assert.equal(closed.sourceUrl, snapshot.sourceUrl);
  assert.deepEqual(acscGameDayUpdates([concluded]), []);
  const partial = { ...concluded, matches: [{ ...concluded.matches[0], homeScore: 2 }] };
  assert.deepEqual(acscGameDayUpdates([partial]), [], 'one published side cannot create a score');
});

test('a second same-day game cannot replace an already identified fixture against the same opponent', () => {
  const original = ACSC_COMPETITION_RESULTS.find(snapshot => snapshot.teamId === 'volleyball-sma-boys')!;
  const first = { ...ACSC_BOYS_VOLLEYBALL_SCHEDULE[0], id: 'pool-game', opponent: 'YISS' };
  const common = { date: first.date!, time: null, home: 'SPH', away: 'YISS', homeScore: null, awayScore: null };
  const snapshot: AcscCompetitionSnapshot = { ...original, matches: [
    { ...common, id: 'pool-game', stage: 'Round-robin', kind: 'pool' },
    { ...common, id: 'second-game', stage: 'Seeding', kind: 'playoff' },
  ] };
  const merged = mergeAcscCompetitionSchedule([first], [snapshot]);
  assert.deepEqual(merged.map(event => event.id), ['pool-game', 'second-game']);
  assert.deepEqual(mergeAcscCompetitionSchedule(merged, [snapshot]), merged);
});
