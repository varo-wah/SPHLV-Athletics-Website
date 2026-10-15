import assert from 'node:assert/strict';
import test from 'node:test';
import { ScheduleEvent } from '../data/scheduleTypes';
import { chronologicalScheduleDays, readableFixtureLabel, scheduleDayStatus } from './scheduleTimeline';

function event(id: string, date: string | null, time: string | null): ScheduleEvent {
  return { id, date, time, season: 'Season 1', week: 'Week 9', day: '', team: 'Varsity Boys Soccer', sport: 'Soccer', eventText: 'LV @ BSJ', eventType: 'Away Game', raw: 'LV @ BSJ' };
}

test('timeline sorts dates and 12/24-hour times, with undated events last', () => {
  const events = [event('undated', null, null), event('pm', '2026-10-15', '3:30 pm'), event('future', '2026-10-16', '09:00'), event('past', '2026-10-14', '10:00'), event('am', '2026-10-15', '9:00 am'), event('no-time', '2026-10-15', null), event('noon', '2026-10-15', '12:00 pm')];
  const days = chronologicalScheduleDays(events);
  assert.deepEqual(days.map(day => day.key), ['2026-10-14', '2026-10-15', '2026-10-16', 'undated']);
  assert.deepEqual(days[1].events.map(item => item.id), ['am', 'noon', 'pm', 'no-time']);
  assert.equal(events[0].id, 'undated');
});

test('date markers describe today, past and future without claiming live play', () => {
  assert.equal(scheduleDayStatus('2026-10-15', '2026-10-15'), 'today');
  assert.equal(scheduleDayStatus('2026-10-14', '2026-10-15'), 'past');
  assert.equal(scheduleDayStatus('2026-10-16', '2026-10-15'), 'upcoming');
  assert.equal(scheduleDayStatus(null, '2026-10-15'), 'undated');
});

test('fixture display expands both shared and individual team codes without altering opponent names', () => {
  assert.equal(readableFixtureLabel('BSJ at VBS/VGS'), 'BSJ at Boys & Girls Soccer');
  assert.equal(readableFixtureLabel('SMP-BB at JIS'), 'SMP Boys Basketball at JIS');
  assert.equal(readableFixtureLabel('VGV at STL'), 'Girls Volleyball at STL');
  assert.equal(readableFixtureLabel('SMK-31 vs PGRI-83'), 'SMK-31 vs PGRI-83');
});
