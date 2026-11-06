import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { GIRLS_VOLLEYBALL_JAAC_SEMIFINAL } from '../data/girlsVolleyballJaac2026';
import { parseCsvMatrix } from './googleSheets';
import { parseMasterScheduleSeason } from './masterScheduleParser';
import { mergeReviewedGirlsVolleyballSchedule } from './reviewedGirlsVolleyballSchedule';
import { mergeReviewedJaacSchedule } from './reviewedJaacSchedule';
import { reviewedSchedule } from './reviewedSchedule';

const master = parseMasterScheduleSeason('Season 1', parseCsvMatrix(
  readFileSync(new URL('../data/master-schedule-season-1.csv', import.meta.url), 'utf8'),
));
const team = GIRLS_VOLLEYBALL_JAAC_SEMIFINAL.team;

test('the revised girls volleyball plan replaces practice and stale generic JAAC slots without changing other teams', () => {
  const merged = mergeReviewedGirlsVolleyballSchedule(master);
  const corrected = merged.filter(event => event.team === team && ['2026-10-30', '2026-10-31', '2026-11-07'].includes(event.date ?? ''));
  assert.deepEqual(corrected, [GIRLS_VOLLEYBALL_JAAC_SEMIFINAL]);
  assert.equal(corrected[0].date, '2026-10-30');
  assert.equal(corrected[0].eventText, 'JAAC semifinal');
  assert.equal(corrected[0].time, '16:00');
  assert.equal(corrected[0].location, 'SPH-LV');
  assert.equal(corrected[0].opponent, 'BSJ');
  assert.equal(corrected[0].status, 'Finished');
  assert.equal(corrected[0].resultScore, '3–0');
  assert.match(corrected[0].details!, /25–15, 25–23, 25–23/);
  assert.match(corrected[0].sourceUrl!, /1CmZD971NC11x7IcoRFCpQTWmvnVMWWGwPUT_J5tHhHQ/);
  assert.deepEqual(merged.filter(event => event.team !== team), master.filter(event => event.team !== team));
  const unaffectedGirls = master.filter(event => event.team === team && !['2026-10-30', '2026-10-31', '2026-11-07'].includes(event.date ?? ''));
  assert.deepEqual(merged.filter(event => event.team === team && !['2026-10-30', '2026-10-31', '2026-11-07'].includes(event.date ?? '')), unaffectedGirls);
  assert.deepEqual(mergeReviewedGirlsVolleyballSchedule(merged), merged);
});

test('a later explicit semifinal retains its published opponent, time, venue and identity', () => {
  const published = { ...GIRLS_VOLLEYBALL_JAAC_SEMIFINAL, id: 'published-girls-semi', team: 'SMA Girls Volleyball', opponent: 'BSJ', time: '15:30', location: 'BSJ', details: 'Later confirmed semifinal details.' };
  const merged = mergeReviewedGirlsVolleyballSchedule([published]);
  assert.deepEqual(merged, [published]);
  assert.deepEqual(mergeReviewedGirlsVolleyballSchedule(merged), merged);
});

test('explicit later final fixtures are preserved instead of being treated as old generic placeholders', () => {
  const confirmedFinal = { ...GIRLS_VOLLEYBALL_JAAC_SEMIFINAL, id: 'published-girls-final', date: '2026-11-07', eventText: 'JAAC final: LV vs ACS', opponent: 'ACS', time: '09:00', location: 'SPH LV', details: 'Final date confirmed by the published schedule.' };
  const merged = mergeReviewedGirlsVolleyballSchedule([confirmedFinal]);
  assert.equal(merged[0], confirmedFinal);
  assert.equal(merged.length, 2);
});

test('the reserve weekend becomes an optional staff friendly and preserves explicitly scheduled fixtures', () => {
  const nov7 = master.filter(event => event.date === '2026-11-07');
  const girlsSoccer = nov7.find(event => event.team === 'Varsity Girls Soccer')!;
  const explicit = { ...girlsSoccer, eventText: 'Friendly vs STL', opponent: 'STL' };
  const remaining = mergeReviewedJaacSchedule([...nov7, explicit]).filter(event => event.date === '2026-11-07');
  assert.deepEqual(remaining.map(event => [event.team, event.eventText]), [
    ['Varsity Girls Soccer', 'Friendly vs STL'],
    ['Varsity Boys Soccer', 'Exhibition: SMA boys vs teachers and staff'],
  ]);
  const friendly = remaining[1];
  assert.deepEqual([friendly.eventType, friendly.time, friendly.location], ['Home Game', '15:00', 'Main Field']);
});

test('the JAAC date correction is repeatable and includes every dated postseason result', () => {
  const merged = mergeReviewedJaacSchedule(master);
  assert.deepEqual(mergeReviewedJaacSchedule(merged), merged);
  const playoffs = merged.filter(event => event.status === 'Finished' && event.eventText.includes('JAAC'));
  assert.equal(playoffs.length, 9); // 8 playoff matches plus the Oct 27 boys league match.
  assert.ok(playoffs.some(event => event.date === '2026-11-03' && event.team === 'Varsity Girls Soccer' && event.resultScore === '2–1'));
  assert.deepEqual(playoffs.filter(event => event.date === '2026-10-31' && event.team === 'Varsity Boys Volleyball')
    .map(event => [event.opponent, event.resultScore]).sort(), [['GJS', '0–3'], ['STL', '3–1']]);
  assert.ok(!playoffs.some(event => event.team === 'SMP Girls Basketball')); // Only a reporting date is known.
  assert.ok(merged.some(event => event.team === 'Varsity Boys Soccer' && event.date === '2026-11-02' && event.eventType === 'Practice'));
  assert.ok(!merged.some(event => event.team === 'Varsity Boys Soccer' && /third place/i.test(event.eventText)));
});

test('the initial and refreshed schedule use the same reviewed Season 1 fixtures', () => {
  const fallback = reviewedSchedule(master);
  const additionalSeason = { ...master[0], season: 'Season 2', id: 'test-other-season', eventText: 'Unrelated training' };
  const refreshed = reviewedSchedule([...master, additionalSeason], false);
  assert.deepEqual(fallback, refreshed);
  assert.ok(!refreshed.includes(additionalSeason));
  assert.ok(reviewedSchedule([...master, additionalSeason], true).includes(additionalSeason));
  assert.ok(!fallback.some(event => event.eventText === 'ACSC @ YISS'));
  assert.ok(fallback.some(event => event.eventText === 'ACSC Swimming: Meet session 1'));
});
