import assert from 'node:assert/strict';
import test from 'node:test';
import { mergeGameDayResults } from './gamedayResults';
import type { ResultSourceMetadata } from './parsers';

const sources: ResultSourceMetadata[] = [{ id: 'girls', teamId: 'soccer-sma-girls', displayName: 'Girls', sport: 'Soccer', sportKey: 'Soccer', level: 'SMA', genderGroup: 'Girls' }];

test('adds only confirmed new fixtures and remains idempotent', () => {
  const matches = mergeGameDayResults([], sources);
  assert.equal(matches.length, 2);
  assert.deepEqual(matches.map(m => [m.opponent, m.scoreFor, m.scoreAgainst]), [['SPH-KV', 2, 2], ['JIS', 3, 0]]);
  assert.deepEqual(mergeGameDayResults(matches, sources), matches);
});

test('recognizes a later published fixture with an opponent alias without duplicating it', () => {
  const fixtures = mergeGameDayResults([], sources);
  const published = { ...fixtures[0], id: 'published-kv', opponent: 'KV', time: '08:10' };
  const matches = mergeGameDayResults([published], sources);
  assert.equal(matches.length, 2);
  assert.equal(matches[0].id, 'published-kv');
  assert.equal(matches[0].time, '08:10');
});

test('preserves a corrected published score and does not attach conflicting reviewed stats', () => {
  const fixture = mergeGameDayResults([], sources)[0];
  const corrected = { ...fixture, scoreFor: 3, homeScore: 3, statLeaders: ['Corrected source stats'], highlights: [] };
  assert.deepEqual(mergeGameDayResults([corrected], sources)[0], corrected);
});
