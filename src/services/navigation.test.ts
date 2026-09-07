import assert from 'node:assert/strict';
import test from 'node:test';
import { parseRoute, parseScheduleQuery } from './navigation';

test('direct routes restore all pages and approved teams', () => {
  for (const page of ['home', 'schedule', 'teams', 'standings', 'news', 'login']) {
    assert.equal(parseRoute(`#/${page}`).tab.toLowerCase(), page);
  }
  assert.equal(parseRoute('#/teams/soccer-sma-boys').team?.id, 'soccer-sma-boys');
});
test('unknown routes and unavailable teams have safe destinations', () => {
  assert.equal(parseRoute('#/unknown').tab, 'Home');
  assert.equal(parseRoute('#/teams/nonexistent').tab, 'Teams');
  assert.equal(parseRoute('#/teams/soccer-smp-boys').tab, 'Teams');
  assert.equal(parseRoute('#/teams/soccer-smp-boys', true).tab, 'TeamPage');
  assert.equal(parseRoute('#/teams/%zz').tab, 'Teams');
});
test('schedule query restores filters and defaults invalid values', () => {
  assert.deepEqual(parseScheduleQuery('season=Season+2&team=VBS&scope=practices&view=calendar', ['Season 1', 'Season 2'], 'Season 1'), { season: 'Season 2', team: 'VBS', scope: 'practices', view: 'calendar' });
  assert.deepEqual(parseScheduleQuery('season=Season+2&team=bad&scope=bad&view=bad', ['Season 1'], 'Season 1'), { season: 'Season 1', team: 'All', scope: 'games', view: 'list' });
});
