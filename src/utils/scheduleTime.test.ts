import assert from 'node:assert/strict';
import test from 'node:test';
import { scheduleTimeLabel, scheduleTimestamp } from './scheduleTime';

test('Hong Kong fixtures display both clocks and sort by the same instant', () => {
  const hk = { date: '2026-10-21', time: '09:00', timeZone: 'Asia/Hong_Kong' };
  const bangkok = { date: '2026-10-21', time: '08:00', timeZone: 'Asia/Bangkok' };
  assert.equal(scheduleTimeLabel(hk), '09:00 HKT · 08:00 WIB');
  assert.equal(scheduleTimestamp(hk), scheduleTimestamp(bangkok));
  assert.ok(scheduleTimestamp(hk) < scheduleTimestamp({ ...bangkok, time: '08:30' }));
  assert.match(scheduleTimeLabel(bangkok), /Bangkok \/ Jakarta \(UTC\+7\)/);
});

test('conditional times remain unset and sort after timed games on the same day', () => {
  const event = { date: '2026-10-23', time: null, timeZone: 'Asia/Hong_Kong' };
  assert.equal(scheduleTimeLabel(event), 'Time to be confirmed');
  assert.ok(scheduleTimestamp(event) > scheduleTimestamp({ ...event, time: '16:00' }));
});

test('Seoul swimming sessions display Korea and Jakarta clocks without shifting the instant', () => {
  const seoul = { date: '2026-10-29', time: '14:30', timeZone: 'Asia/Seoul' };
  assert.equal(scheduleTimeLabel(seoul), '14:30 KST · 12:30 WIB');
  assert.equal(scheduleTimestamp(seoul), Date.parse('2026-10-29T05:30:00Z'));
  assert.equal(scheduleTimestamp(seoul), scheduleTimestamp({ ...seoul, time: '12:30', timeZone: 'Asia/Jakarta' }));
});
