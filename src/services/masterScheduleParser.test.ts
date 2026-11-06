import assert from 'node:assert/strict';
import test from 'node:test';
import { parseMasterScheduleSeason } from './masterScheduleParser';

test('corrects the known August 22 SMP boys basketball fixture to GJS only', () => {
  const matrix = [
    ['SPH SPORTS 2026-27 MASTER SCHEDULE'],
    [],
    [],
    ['Day', 'Date', 'SMP Boys Basketball', 'SMP Girls Basketball'],
    ['Sat', '22-Aug', 'GJS/ACS @LV', 'GJS/ACS @LV'],
  ];

  const events = parseMasterScheduleSeason('Season 1', matrix);
  const boys = events.find((event) => event.team === 'SMP Boys Basketball');
  const girls = events.find((event) => event.team === 'SMP Girls Basketball');

  assert.equal(boys?.eventText, 'GJS @ LV');
  assert.equal(boys?.opponent, 'GJS');
  assert.equal(boys?.raw, 'GJS/ACS @LV');
  assert.equal(girls?.eventText, 'GJS/ACS @LV');
});

test('recognizes a shared LV and KV trip as an away game', () => {
  const matrix = [
    ['SPH SPORTS 2026-27 MASTER SCHEDULE'],
    [],
    [],
    ['Day', 'Date', 'Varsity Boys Soccer'],
    ['Sat', '5-Sep', 'LV/KV @ GJS'],
  ];

  const event = parseMasterScheduleSeason('Season 1', matrix)
    .find((item) => item.team === 'Varsity Boys Soccer');

  assert.equal(event?.eventType, 'Away Game');
  assert.equal(event?.opponent, 'GJS');
  assert.equal(event?.location, 'GJS');
});


test('weekday dates follow the academic year declared by each tab, including the January rollover', () => {
  const schedule = (title: string) => [
    ['Season 3', '', title], [], [], ['', '', 'Varsity Girls Soccer'],
    ['Sat', '8-Nov', 'SPH-LV @ BSJ'], ['Sat', '14-Feb', 'SPH-LV @ GJS'],
  ];
  const dates = (title: string) => parseMasterScheduleSeason('Season 3', schedule(title)).map(event => event.date);
  assert.deepEqual(dates('SPH SPORTS 2025-2026 MASTER SCHEDULE'), ['2025-11-08', '2026-02-14']);
  assert.deepEqual(dates('SPH SPORTS 2026-27 MASTER SCHEDULE'), ['2026-11-08', '2027-02-14']);
  assert.deepEqual(dates('SPH SPORTS MASTER SCHEDULE'), []);
});
