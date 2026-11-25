import test from 'node:test';
import assert from 'node:assert/strict';
import { SEASON_TWO_STANDINGS, SEASON_TWO_RESULTS, SEASON_TWO_FIXTURES } from '../data/seasonTwoLeague';
import { mergeGameDayResults } from './gamedayResults';
import { REVIEWED_RESULT_SOURCES } from '../config/sheets';
import { SMP_VOLLEYBALL_SCHEDULE } from '../data/smpVolleyballSchedule2026';
import { homeUpcomingFixtures } from '../utils/homeUpcomingPresentation';
import { reviewedSchedule } from './reviewedSchedule';

test('Season 2 workbook results agree with each team ladder and survive repeated merging', () => {
  const expected = [['basketball-sma-boys',63,38],['basketball-sma-girls',32,64],['volleyball-smp-boys',2,0],['volleyball-smp-girls',1,2]] as const;
  const matches = mergeGameDayResults([], REVIEWED_RESULT_SOURCES, SEASON_TWO_RESULTS);
  assert.equal(matches.length, 6);
  assert.equal(mergeGameDayResults(matches, REVIEWED_RESULT_SOURCES, SEASON_TWO_RESULTS).length, 6);
  for (const [id, own, other] of expected) {
    const match = matches.find(m => m.teamId === id && m.opponent === 'STL')!;
    assert.deepEqual([match.scoreFor,match.scoreAgainst],[own,other]);
    const row = SEASON_TWO_STANDINGS.find(r => r.pageId === id && r.team === 'SPH-LV')!;
    const teamMatches = matches.filter(m => m.teamId === id);
    assert.deepEqual([row.forValue,row.againstValue,row.wins,row.losses], [
      teamMatches.reduce((n,m) => n + m.scoreFor!,0), teamMatches.reduce((n,m) => n + m.scoreAgainst!,0),
      teamMatches.filter(m => m.scoreFor! > m.scoreAgainst!).length, teamMatches.filter(m => m.scoreFor! < m.scoreAgainst!).length,
    ]);
    assert.equal(row.rank,null, 'Unfilled seeds and alphabetical placeholder positions are not official ranks');
  }
  assert.deepEqual(matches.find(m => m.teamId === 'volleyball-smp-boys')?.setScores,['25–20','25–16']);
});
test('November 28 SMP volleyball uses all three JAAC home fixtures on first load and refresh', () => {
  const date = '2026-11-28';
  const forDate = (events: ReturnType<typeof reviewedSchedule>) => events
    .filter(f => f.sportKey === 'Volleyball' && f.level === 'SMP' && f.date === date);
  const staleFeed = SMP_VOLLEYBALL_SCHEDULE.filter(f => f.date === date);
  const firstLoad = reviewedSchedule([]);
  const refreshed = reviewedSchedule([...firstLoad, ...staleFeed]);
  for (const schedule of [firstLoad, refreshed]) {
    const fixtures = forDate(schedule);
    assert.equal(new Set(fixtures.map(f => f.id)).size, 3);
    assert.deepEqual(homeUpcomingFixtures(fixtures).map(({ event, opponent, time }) =>
      [time, event.genderGroup, opponent, event.location, event.eventType, event.status, event.resultScore]
    ).sort(), [
      ['08:00', 'Girls', 'ACG', 'SPH-LV', 'Home Game', 'Scheduled', undefined],
      ['09:00', 'Boys', 'ACG', 'SPH-LV', 'Home Game', 'Scheduled', undefined],
      ['10:00', 'Girls', 'ACS', 'SPH-LV', 'Home Game', 'Scheduled', undefined],
    ]);
  }
  assert.equal(SEASON_TWO_FIXTURES.filter(f => f.status === 'Finished').length, 6);
});

test('November 21 BSJ scores use SPH perspective and finish both scheduled fixtures', () => {
  for (const [gender,own,other] of [['boys',43,51],['girls',57,32]] as const) {
    const id = `basketball-sma-${gender}`;
    const result = SEASON_TWO_RESULTS.find(r => r.teamId === id && r.date === '2026-11-21')!;
    assert.deepEqual([result.opponent,result.scoreFor,result.scoreAgainst],['BSJ',own,other]);
    const fixture = SEASON_TWO_FIXTURES.find(f => f.id === result.fixtureId)!;
    assert.deepEqual([fixture.status,fixture.resultScore],['Finished',`${own}–${other}`]);
    const standing = SEASON_TWO_STANDINGS.find(r => r.pageId === id && r.team === 'SPH-LV')!;
    assert.deepEqual([standing.wins,standing.losses,standing.points],[1,1,2]);
  }
});
