import assert from 'node:assert/strict';
import test from 'node:test';
import type { SheetMatch } from '../services/parsers';
import { matchRecap } from './matchRecap';

const match: SheetMatch = {
  id: 'recap-test', sourceId: 'source', teamId: 'team', pageId: 'team',
  sport: 'Basketball', sportKey: 'Basketball', level: 'SMA', genderGroup: 'Boys', tournament: 'JAAC',
  date: '2026-11-12', time: '', homeTeam: 'SPH LV', awayTeam: 'BSJ', opponent: 'BSJ',
  locationType: 'Home', venue: '', status: 'Finished', result: 'W',
  homeScore: 60, awayScore: 50, scoreFor: 60, scoreAgainst: 50, notes: '',
  set1For: null, set1Against: null, set2For: null, set2Against: null, set3For: null, set3Against: null,
};

test('uses the supplied opening highlight as the recap for every team sport', () => {
  const highlights = ['Opening report from the source.', 'Additional reported detail.'];
  for (const sport of ['Basketball', 'Soccer', 'Volleyball', 'Badminton'] as const) {
    assert.equal(matchRecap({ ...match, sportKey: sport, sport, highlights }), highlights[0]);
  }
  assert.deepEqual(highlights, ['Opening report from the source.', 'Additional reported detail.']);
});

test('retains the existing volleyball summary when no written recap is supplied', () => {
  const volleyball = { ...match, sport: 'Volleyball' as const, sportKey: 'Volleyball' as const, scoreFor: 3, scoreAgainst: 0 };
  assert.equal(matchRecap(volleyball), 'SPH-LV beat BSJ 3–0 in straight sets.');
  assert.equal(matchRecap({ ...volleyball, highlights: ['Reported match summary.'] }), 'Reported match summary.');
  assert.equal(matchRecap({ ...volleyball, scoreFor: null, scoreAgainst: null }), undefined);
});

test('does not invent a basketball or soccer recap from score, statistics, or notes alone', () => {
  for (const sport of ['Basketball', 'Soccer'] as const) {
    assert.equal(matchRecap({ ...match, sportKey: sport, sport, highlights: [], statLeaders: ['Player: 10 points'], notes: 'Internal source note' }), undefined);
  }
});
