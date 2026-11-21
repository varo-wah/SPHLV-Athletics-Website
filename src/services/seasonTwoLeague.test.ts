import test from 'node:test';
import assert from 'node:assert/strict';
import { SEASON_TWO_STANDINGS, SEASON_TWO_RESULTS, SEASON_TWO_FIXTURES } from '../data/seasonTwoLeague';
import { mergeGameDayResults } from './gamedayResults';
import { REVIEWED_RESULT_SOURCES } from '../config/sheets';

test('Season 2 workbook results agree with each team ladder and survive repeated merging', () => {
  const expected = [['basketball-sma-boys',63,38],['basketball-sma-girls',32,64],['volleyball-smp-boys',2,0],['volleyball-smp-girls',1,2]] as const;
  const matches = mergeGameDayResults([], REVIEWED_RESULT_SOURCES, SEASON_TWO_RESULTS);
  assert.equal(matches.length, 4);
  assert.equal(mergeGameDayResults(matches, REVIEWED_RESULT_SOURCES, SEASON_TWO_RESULTS).length, 4);
  for (const [id, own, other] of expected) {
    const match = matches.find(m => m.teamId === id)!;
    assert.deepEqual([match.scoreFor,match.scoreAgainst],[own,other]);
    const row = SEASON_TWO_STANDINGS.find(r => r.pageId === id && r.team === 'SPH-LV')!;
    assert.deepEqual([row.forValue,row.againstValue,row.wins,row.losses],[own,other,own>other?1:0,own<other?1:0]);
    assert.equal(row.rank,null, 'Unfilled seeds and alphabetical placeholder positions are not official ranks');
  }
  assert.deepEqual(matches.find(m => m.teamId === 'volleyball-smp-boys')?.setScores,['25–20','25–16']);
});
test('official fixtures resolve girls extra ACS game and multi-school pairings without inventing start times', () => {
  const girls = SEASON_TWO_FIXTURES.filter(f => f.sportKey === 'Volleyball' && f.genderGroup === 'Girls' && f.date === '2026-11-28');
  assert.deepEqual(girls.map(f => [f.opponent,f.time]),[['ACG',''],['ACS','']]);
  assert.equal(SEASON_TWO_FIXTURES.filter(f => f.status === 'Finished').length,4);
});
