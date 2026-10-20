import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parseCsvMatrix } from './googleSheets';
import { parseMasterScheduleSeason } from './masterScheduleParser';
import { mergeReviewedCupSchedule } from './reviewedCupSchedule';

const master = parseMasterScheduleSeason('Season 1', parseCsvMatrix(
  readFileSync(new URL('../data/master-schedule-season-1.csv', import.meta.url), 'utf8'),
));
const isReviewed = (event: { id: string }) => event.id.startsWith('reviewed-schedule-');

test('replaces the generic boys Cup entry with four confirmed fixtures and preserves the rest', () => {
  const merged = mergeReviewedCupSchedule(master);
  const fixtures = merged.filter(isReviewed);
  assert.deepEqual(fixtures.map((event) => [event.date, event.opponent]), [
    ['2026-10-15', 'SMP Negeri 6'],
    ['2026-10-15', 'SDH DM'],
    ['2026-10-17', 'Tunas Muda'],
    ['2026-10-17', 'Citra Berkat'],
  ]);
  assert.equal(new Set(fixtures.map((event) => event.id)).size, 4);
  assert.ok(fixtures.every((event) => event.week === 'Week #12' && event.time === null));
  assert.ok(fixtures.every((event) => event.team === 'SMP Boys Basketball'));
  assert.match(fixtures[2].eventText, /semifinal/);
  assert.match(fixtures[3].eventText, /\bfinal/);
  assert.deepEqual(merged.filter((event) => !isReviewed(event)), master.filter((event) => !(
    event.team === 'SMP Boys Basketball' && event.date === '2026-10-15' && event.eventText === 'SPH Cup'
  )));
});

test('repeated merges stay idempotent and retain a later published fixture with an alias and time', () => {
  const fixtures = mergeReviewedCupSchedule([]);
  const published = { ...fixtures[0], id: 'published-cup-smp6', opponent: 'SMP 6', time: '15:30' };
  const merged = mergeReviewedCupSchedule([published, ...fixtures.slice(1)]);
  assert.equal(merged.length, 4);
  assert.equal(merged[0].id, 'published-cup-smp6');
  assert.equal(merged[0].time, '15:30');
  assert.deepEqual(mergeReviewedCupSchedule(merged), merged);
});

test('does not put undated girls reports onto the calendar or replace their existing entries', () => {
  const original = master.find((event) => event.team === 'SMP Girls Basketball')!;
  const girlsCup = { ...original, id: 'girls-cup-placeholder', date: '2026-10-15', eventText: 'SPH Cup', opponent: null };
  const merged = mergeReviewedCupSchedule([girlsCup]);
  assert.equal(merged.filter((event) => event.team === 'SMP Girls Basketball').length, 1);
  assert.equal(merged[0], girlsCup);
  assert.equal(merged.filter(isReviewed).length, 4);
});
