import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { GIRLS_VOLLEYBALL_JAAC_SEMIFINAL } from '../data/girlsVolleyballJaac2026';
import { parseCsvMatrix } from './googleSheets';
import { parseMasterScheduleSeason } from './masterScheduleParser';
import { mergeReviewedGirlsVolleyballSchedule } from './reviewedGirlsVolleyballSchedule';

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
  assert.equal(corrected[0].time, null);
  assert.equal(corrected[0].location, null);
  assert.equal(corrected[0].opponent, null);
  assert.match(corrected[0].details!, /final-round date is still awaiting confirmation/i);
  assert.equal(corrected[0].sourceUrl, undefined, 'a private Teams report must not receive an invented public link');
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
