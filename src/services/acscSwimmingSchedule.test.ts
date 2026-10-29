import assert from 'node:assert/strict';
import test from 'node:test';
import { ACSC_SWIMMING_SCHEDULE } from '../data/swimming';
import type { ScheduleEvent } from '../data/scheduleTypes';
import { mergeAcscSwimmingSchedule } from './acscSwimmingSchedule';
import { scheduleTimestamp } from '../utils/scheduleTime';

test('official swimming schedule covers five competition sessions, excluding arrivals and ceremonies', () => {
  assert.deepEqual(ACSC_SWIMMING_SCHEDULE.map(event => [event.date, event.time]), [
    ['2026-10-29', '14:30'], ['2026-10-30', '08:00'], ['2026-10-30', '14:30'],
    ['2026-10-31', '08:00'], ['2026-10-31', '14:00'],
  ]);
  assert.equal(new Set(ACSC_SWIMMING_SCHEDULE.map(event => event.id)).size, 5);
  assert.ok(ACSC_SWIMMING_SCHEDULE.every(event => event.timeZone === 'Asia/Seoul' && !event.resultScore));
  assert.equal(scheduleTimestamp(ACSC_SWIMMING_SCHEDULE[1]), Date.parse('2026-10-30T06:00:00+07:00'));
});

test('swimming merger replaces only the meet placeholder and preserves later verified session data', () => {
  const placeholder: ScheduleEvent = { ...ACSC_SWIMMING_SCHEDULE[0], id: 'master-swim-acsc', time: null, eventText: 'ACSC @ YISS' };
  const unrelated: ScheduleEvent = { ...placeholder, id: 'other-team', team: 'Varsity Boys Soccer' };
  const otherMeet: ScheduleEvent = { ...placeholder, id: 'earlier-meet', date: '2026-09-24' };
  const reportedRace: ScheduleEvent = { ...placeholder, id: 'new-race-report', eventText: 'ACSC Swimming: 100 m freestyle result', status: 'Finished' };
  const updated: ScheduleEvent = { ...ACSC_SWIMMING_SCHEDULE[1], time: '08:15', status: 'Finished' };
  const merged = mergeAcscSwimmingSchedule([placeholder, unrelated, otherMeet, reportedRace, updated]);
  assert.equal(merged.length, 8);
  assert.ok(!merged.some(event => event.id === placeholder.id));
  assert.ok(merged.includes(unrelated));
  assert.ok(merged.includes(otherMeet));
  assert.ok(merged.includes(reportedRace));
  assert.equal(merged.find(event => event.id === updated.id)?.time, '08:15');
  assert.equal(merged.find(event => event.id === updated.id)?.status, 'Finished');
  assert.deepEqual(mergeAcscSwimmingSchedule(merged), merged);
});
