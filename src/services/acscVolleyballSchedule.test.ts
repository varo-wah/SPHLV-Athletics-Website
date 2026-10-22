import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { ACSC_BOYS_VOLLEYBALL_SCHEDULE } from '../data/acscBoysVolleyball2026';
import { ACSC_GIRLS_VOLLEYBALL_SCHEDULE } from '../data/acscGirlsVolleyball2026';
import { acscSchoolForName } from '../data/acscSchools';
import { parseCsvMatrix } from './googleSheets';
import { parseMasterScheduleSeason } from './masterScheduleParser';
import { mergeAcscVolleyballSchedule } from './acscSchedule';
import { eventMatchesTeamFilter, scheduleFixtureLines } from './schedulePresentation';

const master = parseMasterScheduleSeason('Season 1', parseCsvMatrix(
  readFileSync(new URL('../data/master-schedule-season-1.csv', import.meta.url), 'utf8'),
));
const added = [...ACSC_BOYS_VOLLEYBALL_SCHEDULE, ...ACSC_GIRLS_VOLLEYBALL_SCHEDULE];

test('replaces the two volleyball arrival placeholders and preserves other events', () => {
  const merged = mergeAcscVolleyballSchedule(master);
  const placeholders = master.filter(event => event.date === '2026-10-20' && /^ACSC @ (HK|BKK)$/.test(event.eventText));
  assert.equal(placeholders.length, 2);
  assert.equal(merged.length, master.length - 2 + 18);
  assert.deepEqual(merged.filter(event => !event.tournamentId), master.filter(event => !placeholders.includes(event)));
  assert.equal(new Set(added.map(event => event.id)).size, 18);
  assert.ok(added.every(event => event.date !== '2026-10-20'));
});

test('source-verified opponents stay separate from conditional slots', () => {
  assert.deepEqual(ACSC_BOYS_VOLLEYBALL_SCHEDULE.filter(event => event.opponent).map(event => [event.date, event.time, event.opponent]), [
    ['2026-10-21', '09:00', 'YISS'], ['2026-10-21', '12:00', 'Faith'],
    ['2026-10-21', '14:00', 'Grace'], ['2026-10-22', '09:30', 'Dalat'],
    ['2026-10-22', '13:30', 'ICS Hong Kong'], ['2026-10-23', '10:00', 'ICS Bangkok'],
  ]);
  assert.deepEqual(ACSC_GIRLS_VOLLEYBALL_SCHEDULE.filter(event => event.opponent).map(event => [event.date, event.time, event.opponent]), [
    ['2026-10-21', '08:30', 'Dalat'], ['2026-10-21', '10:30', 'ICS Hong Kong'],
    ['2026-10-21', '14:30', 'ICS Bangkok'], ['2026-10-22', '08:30', 'YISS'],
    ['2026-10-22', '10:30', 'Grace'], ['2026-10-22', '14:30', 'Faith'],
    ['2026-10-22', '16:30', 'Morrison'], ['2026-10-23', '18:00', 'Morrison'],
  ]);
  for (const event of added) {
    assert.ok(eventMatchesTeamFilter(event, event.genderGroup === 'Boys' ? 'VBV' : 'VGV'));
    assert.equal(scheduleFixtureLines(event).length, 1, 'conditional slot notes must not become extra games');
    if (event.opponent) assert.ok(acscSchoolForName(event.opponent), `Missing verified logo for ${event.opponent}`);
  }
  assert.ok(!ACSC_BOYS_VOLLEYBALL_SCHEDULE.some(event => event.opponent === 'Morrison'));
});

test('merges are idempotent and preserve a later fixture time and venue across aliases', () => {
  const initial = mergeAcscVolleyballSchedule([]);
  assert.deepEqual(mergeAcscVolleyballSchedule(initial), initial);
  const hk = initial.find(event => event.genderGroup === 'Girls' && event.opponent === 'ICS Hong Kong')!;
  const revised = { ...hk, id: 'updated-published-fixture', opponent: 'ICS-HK', time: '11:00', location: 'Court 1' };
  const merged = mergeAcscVolleyballSchedule([revised, ...initial.filter(event => event !== hk)]);
  assert.equal(merged.length, 18);
  assert.equal(merged[0].time, '11:00');
  assert.equal(merged[0].location, 'Court 1');
  assert.equal(merged[0].tournamentId, hk.tournamentId);
  assert.deepEqual(mergeAcscVolleyballSchedule(merged), merged);
});

test('does not remove an actual arrival-day opponent or an unrelated ACSC team', () => {
  const base = ACSC_BOYS_VOLLEYBALL_SCHEDULE[0];
  const events = [
    { ...base, id: 'actual-game', date: '2026-10-20', eventText: 'ACSC vs YISS' },
    { ...base, id: 'smp', team: 'SMP Boys Volleyball', level: 'SMP' as const, date: '2026-10-20', opponent: null, eventText: 'ACSC @ HK' },
  ];
  assert.deepEqual(mergeAcscVolleyballSchedule(events).slice(0, 2), events);
});
