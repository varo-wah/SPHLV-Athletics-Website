import assert from 'node:assert/strict';
import test from 'node:test';
import { ScheduleEvent } from '../data/scheduleTypes';
import { SheetMatch } from '../services/parsers';
import { FavoriteTeam } from './teamFavorites';
import { buildFavoriteTeamSummaries } from './homePersonalization';

const favorite: FavoriteTeam = {
  key: 'Soccer-SMA-Boys',
  sport: 'Soccer',
  division: 'SMA',
  gender: 'Boys',
};

const scheduleEvent = (overrides: Partial<ScheduleEvent>): ScheduleEvent => ({
  id: 'event', season: 'Season 1', week: 'Week #4', date: '2026-08-22', day: 'Sat',
  team: 'Varsity Boys Soccer', sportKey: 'Soccer', sport: 'Soccer', level: 'SMA', genderGroup: 'Boys',
  eventText: 'SMA 17 @ LV', eventType: 'Home Game', location: 'LV', opponent: 'SMA 17', time: '08:00', raw: 'SMA 17 @ LV',
  ...overrides,
});

const resultMatch = (overrides: Partial<SheetMatch>): SheetMatch => ({
  id: 'match', sourceId: 'source', teamId: 'team', pageId: 'page', sport: 'Soccer', sportKey: 'Soccer',
  level: 'SMA', genderGroup: 'Boys', tournament: 'Season', date: '2026-08-15', time: '10:00',
  homeTeam: 'SPH LV', awayTeam: 'KV', opponent: 'KV', locationType: 'Home', venue: 'LV', status: 'Finished', result: 'W',
  homeScore: 2, awayScore: 0, scoreFor: 2, scoreAgainst: 0, notes: '',
  set1For: null, set1Against: null, set2For: null, set2Against: null, set3For: null, set3Against: null,
  ...overrides,
});

test('matches summaries by exact sport, division, and gender', () => {
  const [summary] = buildFavoriteTeamSummaries(
    [favorite],
    [
      scheduleEvent({ id: 'girls', genderGroup: 'Girls', date: '2026-08-19' }),
      scheduleEvent({ id: 'boys', date: '2026-08-22' }),
    ],
    [
      resultMatch({ id: 'volleyball', sport: 'Volleyball', sportKey: 'Volleyball', date: '2026-08-17' }),
      resultMatch({ id: 'soccer', date: '2026-08-15' }),
    ],
    '2026-08-18',
    () => true,
  );

  assert.equal(summary.nextEvent?.id, 'boys');
  assert.equal(summary.recentMatch?.id, 'soccer');
});

test('uses the nearest visible upcoming game and newest completed result', () => {
  const [summary] = buildFavoriteTeamSummaries(
    [favorite],
    [
      scheduleEvent({ id: 'later', date: '2026-08-29' }),
      scheduleEvent({ id: 'hidden', date: '2026-08-20' }),
      scheduleEvent({ id: 'next', date: '2026-08-22' }),
      scheduleEvent({ id: 'practice', date: '2026-08-18', eventType: 'Practice' }),
    ],
    [
      resultMatch({ id: 'older', date: '2026-08-10' }),
      resultMatch({ id: 'newest', date: '2026-08-17', scoreFor: 1, scoreAgainst: 0 }),
      resultMatch({ id: 'unfinished', date: '2026-08-18', status: 'Upcoming', scoreFor: null, scoreAgainst: null }),
    ],
    '2026-08-18',
    (event) => event.id !== 'hidden',
  );

  assert.equal(summary.nextEvent?.id, 'next');
  assert.equal(summary.recentMatch?.id, 'newest');
});
