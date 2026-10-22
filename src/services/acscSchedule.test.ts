import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { ACSC_SOCCER_2026, ACSC_SOCCER_SCHEDULE } from '../data/acscSoccer2026';
import { parseCsvMatrix } from './googleSheets';
import { parseMasterScheduleSeason } from './masterScheduleParser';
import { mergeAcscSoccerSchedule } from './acscSchedule';
import { eventMatchesTeamFilter, scheduleFixtureLines } from './schedulePresentation';

const master = parseMasterScheduleSeason('Season 1', parseCsvMatrix(
  readFileSync(new URL('../data/master-schedule-season-1.csv', import.meta.url), 'utf8'),
));
const isAcscFixture = (event: { id: string }) => event.id.startsWith('acsc-soccer-2026-');

test('replaces only the boys soccer arrival placeholder with six tournament fixtures', () => {
  const merged = mergeAcscSoccerSchedule(master);
  const fixtures = merged.filter(isAcscFixture);
  assert.equal(fixtures.length, 6);
  assert.equal(new Set(fixtures.map(event => event.id)).size, 6);
  const placeholder = master.find(event => event.team === 'Varsity Boys Soccer'
    && event.date === '2026-10-20' && event.eventText === 'ACSC @ Grace');
  assert.ok(placeholder, 'the source contains the arrival-day placeholder');
  assert.deepEqual(merged.filter(event => !isAcscFixture(event)), master.filter(event => event !== placeholder));
  assert.ok(!fixtures.some(event => event.date === '2026-10-20'));
  assert.ok(fixtures.every(event => event.eventType === 'Tournament'
    && event.timeZone === 'Asia/Bangkok' && event.sourceUrl === ACSC_SOCCER_2026.scheduleUrl));
});

test('uses verified pool fields and Grace quarterfinal without claiming a semifinal place', () => {
  const known = ACSC_SOCCER_SCHEDULE.filter(event => event.opponent);
  assert.deepEqual(known.map(event => [event.date, event.time, event.opponent]), [
    ['2026-10-21', '08:00', 'Morrison'],
    ['2026-10-21', '15:00', 'ICS Hong Kong'],
    ['2026-10-22', '15:00', 'YISS'],
    ['2026-10-23', '08:00', 'Grace'],
  ]);
  assert.ok(known.slice(0, 2).every(event => event.location?.endsWith('Field 2')));
  assert.equal(known[2].location, `${ACSC_SOCCER_2026.venue} · Field 1`);
  assert.equal(known[3].location, `${ACSC_SOCCER_2026.venue} · Field 2`);
  assert.equal(known[3].id, 'acsc-soccer-2026-quarterfinal');
  assert.match(known[3].eventText, /quarterfinal Q2/);
  assert.deepEqual(ACSC_SOCCER_2026.poolTeams, ['SPH', 'YISS', 'Morrison', 'ICS Hong Kong']);
  const conditional = ACSC_SOCCER_SCHEDULE.filter(event => !event.opponent);
  assert.deepEqual(conditional.map(event => [event.date, event.time]), [
    ['2026-10-23', '15:00'],
    ['2026-10-24', null],
  ]);
  assert.match(conditional[0].details ?? '', /If SPH beats Grace/);
  assert.match(conditional[0].details ?? '', /Otherwise: placement match/);
  assert.ok(conditional.every(event => /depend|await/i.test(event.details ?? '')));
});

test('repeated merges are idempotent and preserve later published opponent aliases', () => {
  const fixtures = mergeAcscSoccerSchedule([]);
  assert.deepEqual(mergeAcscSoccerSchedule(fixtures), fixtures);
  const updatedIcs = { ...fixtures[1], id: 'published-ics-hk', opponent: 'ICS-HK', time: '15:30', location: 'Updated field' };
  const merged = mergeAcscSoccerSchedule([updatedIcs, ...fixtures.filter(event => event.id !== fixtures[1].id)]);
  assert.equal(merged.length, 6);
  assert.equal(merged[0], updatedIcs);
  assert.deepEqual(mergeAcscSoccerSchedule(merged), merged);
});

test('does not remove non-ACSC soccer entries or other teams’ October 20 ACSC entries', () => {
  const original = ACSC_SOCCER_SCHEDULE[0];
  const unrelated = [
    { ...original, id: 'soccer-training', date: '2026-10-20', opponent: null, eventText: 'Practice Main Field' },
    { ...original, id: 'volleyball-acsc', date: '2026-10-20', opponent: null, team: 'SMA Boys Volleyball', sportKey: 'Volleyball' as const, sport: 'Volleyball' as const, eventText: 'ACSC @ HK' },
    { ...original, id: 'soccer-confirmed', date: '2026-10-20', eventText: 'ACSC vs Morrison' },
  ];
  assert.deepEqual(mergeAcscSoccerSchedule(unrelated).slice(0, unrelated.length), unrelated);
});

test('retains the production Varsity team name and VBS filter and only confirmed slot times', () => {
  assert.ok(ACSC_SOCCER_SCHEDULE.every(event => event.team === 'Varsity Boys Soccer'
    && event.season === 'Season 1' && event.sportKey === 'Soccer'));
  assert.ok(ACSC_SOCCER_SCHEDULE.every(event => eventMatchesTeamFilter(event, 'VBS')));
  assert.ok(ACSC_SOCCER_SCHEDULE.every(event => !eventMatchesTeamFilter(event, 'VGS')));
  const conditional = ACSC_SOCCER_SCHEDULE.filter(event => !event.opponent);
  for (const event of conditional) {
    assert.deepEqual(scheduleFixtureLines(event), [{ label: event.eventText, time: event.time ?? null }]);
  }
});
