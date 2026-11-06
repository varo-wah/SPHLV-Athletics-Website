import assert from 'node:assert/strict';
import test from 'node:test';
import { VARSITY_BASKETBALL_SCHEDULE } from '../data/varsityBasketballSchedule2026';
import { isLaunchTeamSelection, isVisibleScheduleEvent } from '../config/launchSports';
import { reviewedSchedule } from './reviewedSchedule';
import { consolidateSharedScheduleEvents, eventMatchesTeamFilter, isGameScheduleEvent, scheduleFixtureLines } from './schedulePresentation';

test('varsity basketball shows the reviewed workbook dates on initial load and refresh for both teams', () => {
  const first = VARSITY_BASKETBALL_SCHEDULE[0];
  const stale = { ...first, id: 'old-google-row', date: '2025-11-03' };
  for (const prototype of [false, true]) {
    const current = reviewedSchedule([stale, first], prototype).filter(event => event.season === 'Season 2');
    assert.deepEqual(current, VARSITY_BASKETBALL_SCHEDULE);
    assert.equal(new Set(current.map(event => event.id)).size, 42);
    for (const gender of ['Boys', 'Girls'] as const) {
      assert.ok(isLaunchTeamSelection('Basketball', 'SMA', gender));
      const games = current.filter(event => event.genderGroup === gender && isGameScheduleEvent(event));
      assert.ok(games.every(event => event.level === 'SMA' && isVisibleScheduleEvent(event.season, event.sportKey!, event.team)));
      assert.deepEqual(games.map(event => [event.date, event.opponent, event.time ?? null]), [
        ...(gender === 'Boys' ? [['2026-11-06', 'Dragons Club', '17:00']] : []),
        ['2026-11-20', 'STL', null], ['2026-11-21', 'BSJ', null],
        ['2026-12-05', 'ACS/ACG', '09:00'], ['2026-12-12', 'KV/GJS', null],
      ]);
    }
  }
});

test('both team filters retain shared multi-school sessions once with only the published start time', () => {
  const games = consolidateSharedScheduleEvents(VARSITY_BASKETBALL_SCHEDULE.filter(isGameScheduleEvent));
  assert.equal(games.length, 5);
  assert.equal(games.filter(event => eventMatchesTeamFilter(event, 'VBB')).length, 5);
  assert.equal(games.filter(event => eventMatchesTeamFilter(event, 'VGB')).length, 4);
  assert.deepEqual(scheduleFixtureLines(games.find(event => event.date === '2026-12-05')!), [
    { label: 'ACS/ACG at SPH-LV', time: '09:00' },
  ]);
});
