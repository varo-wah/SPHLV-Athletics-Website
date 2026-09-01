import assert from 'node:assert/strict';
import test from 'node:test';
import { parseMasterScheduleSeason } from './masterScheduleParser';

test('corrects the known August 22 SMP boys basketball fixture to GJS only', () => {
  const matrix = [
    [],
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
    [],
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
