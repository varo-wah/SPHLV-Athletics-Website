import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parseCsvMatrix } from './googleSheets';
import { parseMasterScheduleSeason } from './masterScheduleParser';

const sourcePath = new URL('../data/master-schedule-season-1.csv', import.meta.url);
const sourceText = readFileSync(sourcePath, 'utf8');
const seasonOneEvents = parseMasterScheduleSeason('Season 1', parseCsvMatrix(sourceText));

test('bundled Season 1 master schedule parses the complete validated CSV', () => {
  assert.equal(seasonOneEvents.length, 315);
  assert.equal(seasonOneEvents[0]?.date, '2026-07-31');
  assert.equal(seasonOneEvents.at(-1)?.date, '2026-11-14');
  assert.equal(new Set(seasonOneEvents.map((event) => event.team)).size, 11);
});

test('bundled Season 1 master schedule contains the revised key fixtures', () => {
  const hasFixture = (team: string, date: string, eventText: string) => (
    seasonOneEvents.some((event) => (
      event.team === team
      && event.date === date
      && event.eventText === eventText
    ))
  );

  assert.equal(hasFixture('Varsity Boys Soccer', '2026-08-15', 'SMK 31 @LV 08:00'), true);
  assert.equal(hasFixture('Varsity Boys Volleyball', '2026-08-15', 'LV @ KV 09:00'), true);
  assert.equal(hasFixture('SMP Boys Basketball', '2026-08-22', 'ACS-A @LV-A 08:00 ACS-B @LV-B 09:15'), true);
  assert.equal(hasFixture('SMP Girls Basketball', '2026-08-22', 'ACS @LV 08:00'), true);
});

test('bundled Season 1 master schedule has no duplicate or malformed events', () => {
  const keys = seasonOneEvents.map((event) => (
    [event.date, event.team, event.eventText].join('|')
  ));

  assert.equal(new Set(keys).size, seasonOneEvents.length);
  assert.equal(seasonOneEvents.every((event) => (
    Boolean(event.date && event.team && event.eventText)
  )), true);
});
