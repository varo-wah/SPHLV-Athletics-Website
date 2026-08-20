import test from 'node:test';
import assert from 'node:assert/strict';
import { SheetMatch } from '../services/parsers';
import {
  formatTeamName,
  presentResultTeams,
  resultOutcomeLabel,
  teamLogoForName,
} from './teamGamePresentation';

const match: SheetMatch = {
  id: 'result-1', sourceId: 'source', teamId: 'team', pageId: 'team',
  sport: 'Soccer', sportKey: 'Soccer', level: 'SMA', genderGroup: 'Boys', tournament: 'Season',
  date: '2026-08-15', time: '09:00', homeTeam: 'KV', awayTeam: 'SPH LV', opponent: 'KV',
  locationType: 'Away', venue: 'KV', status: 'Finished', result: 'W',
  homeScore: 0, awayScore: 2, scoreFor: 2, scoreAgainst: 0, notes: '',
  set1For: null, set1Against: null, set2For: null, set2Against: null, set3For: null, set3Against: null,
};

test('formats SPH consistently and resolves supplied result logos', () => {
  assert.equal(formatTeamName('SPH LV'), 'SPH-LV');
  assert.equal(formatTeamName('LV'), 'SPH-LV');
  assert.equal(teamLogoForName('SPH-LV')?.includes('lv.jpeg'), true);
  assert.equal(teamLogoForName('KV')?.includes('kv.jpeg'), true);
  assert.equal(teamLogoForName('BSJ')?.includes('bsj.jpeg'), true);
  assert.equal(teamLogoForName('STL')?.includes('ssl.jpeg'), true);
  assert.equal(teamLogoForName('SMK 31'), null);
});

test('presents the away team first and the home team second with an @ prefix', () => {
  const [away, home] = presentResultTeams(match);
  assert.deepEqual(
    [away.name, away.score, away.winner, home.name, home.score, home.winner],
    ['SPH-LV', 2, true, '@ KV', 0, false],
  );
});

test('expands compact result codes into readable outcomes', () => {
  assert.equal(resultOutcomeLabel('W'), 'Win');
  assert.equal(resultOutcomeLabel('L'), 'Loss');
  assert.equal(resultOutcomeLabel('D'), 'Draw');
});
