import assert from 'node:assert/strict';
import test from 'node:test';
import { SMP_VOLLEYBALL_SCHEDULE } from '../data/smpVolleyballSchedule2026';

test('SMP volleyball preserves team-specific practices and does not invent sessions in blank cells', () => {
  assert.equal(SMP_VOLLEYBALL_SCHEDULE.length, 40);
  assert.equal(new Set(SMP_VOLLEYBALL_SCHEDULE.map(event => event.id)).size, 40);
  assert.equal(SMP_VOLLEYBALL_SCHEDULE.some(event => event.date === '2026-11-09'), false);
  const first = SMP_VOLLEYBALL_SCHEDULE.filter(event => event.date === '2026-11-02');
  assert.deepEqual(first.map(event => [event.genderGroup, event.location]), [
    ['Boys', 'Gym 1'], ['Girls', 'Covered / outdoor court'],
  ]);
  assert.ok(SMP_VOLLEYBALL_SCHEDULE.every(event => event.season === 'Season 2' && event.level === 'SMP'));
  assert.ok(SMP_VOLLEYBALL_SCHEDULE.every(event => event.date! >= '2026-11-02' && event.date! <= '2026-12-15'));
  assert.ok(SMP_VOLLEYBALL_SCHEDULE.every(event => !event.resultScore && event.status !== 'Finished'));
});

test('the four scheduled game sessions preserve confirmed details without assuming pairings or start times', () => {
  for (const gender of ['Boys', 'Girls']) {
    const games = SMP_VOLLEYBALL_SCHEDULE.filter(event => event.genderGroup === gender && event.eventType !== 'Practice');
    assert.deepEqual(games.map(event => [event.date, event.eventType, event.opponent ?? null, event.time ?? null]), [
      ['2026-11-17', 'Home Game', 'STL', null],
      ['2026-11-28', 'Away Game', 'ACG', null],
      ['2026-12-05', 'Home Game', 'BSJ', '08:00'],
      ['2026-12-12', 'Away Game', null, null],
    ]);
    assert.equal(games[3].location, 'GJS');
    assert.match(games[3].details!, /Individual pairings and start times are to be confirmed/);
  }
});
