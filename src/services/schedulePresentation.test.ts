import assert from 'node:assert/strict';
import test from 'node:test';
import { ScheduleEvent } from '../data/scheduleTypes';
import {
  consolidateSharedScheduleEvents,
  eventMatchesTeamFilter,
  isGameScheduleEvent,
} from './schedulePresentation';

function event(overrides: Partial<ScheduleEvent>): ScheduleEvent {
  return {
    id: 'event',
    season: 'Season 1',
    week: 'Week #2',
    date: '2026-08-12',
    day: 'Wed',
    team: 'SMP Boys Basketball',
    sportKey: 'Basketball',
    level: 'SMP',
    genderGroup: 'Boys',
    eventText: 'Practice Gym 2',
    eventType: 'Practice',
    location: 'Gym 2',
    opponent: null,
    time: '15:30',
    raw: 'Practice Gym 2',
    ...overrides,
  };
}

test('combines matching boys and girls practices into one display row', () => {
  const rows = consolidateSharedScheduleEvents([
    event({ id: 'boys' }),
    event({ id: 'girls', team: 'SMP Girls Basketball', genderGroup: 'Girls' }),
  ]);

  assert.equal(rows.length, 1);
  assert.equal(rows[0].team, 'SMP Boys & Girls Basketball');
  assert.equal(rows[0].genderGroup, undefined);
  assert.equal(eventMatchesTeamFilter(rows[0], 'SMPBB'), true);
  assert.equal(eventMatchesTeamFilter(rows[0], 'SMPGB'), true);
});

test('combines matching boys and girls games with gendered descriptions', () => {
  const rows = consolidateSharedScheduleEvents([
    event({ id: 'boys-game', eventType: 'Home Game', eventText: 'Boys vs AIS', raw: 'Boys vs AIS', opponent: 'AIS' }),
    event({ id: 'girls-game', team: 'SMP Girls Basketball', genderGroup: 'Girls', eventType: 'Home Game', eventText: 'Girls vs AIS', raw: 'Girls vs AIS', opponent: 'AIS' }),
  ]);

  assert.equal(rows.length, 1);
  assert.equal(rows[0].eventText, 'Boys & Girls vs AIS');
  assert.equal(isGameScheduleEvent(rows[0]), true);
});

test('removes a middle gender marker from a shared game description', () => {
  const rows = consolidateSharedScheduleEvents([
    event({ id: 'boys-game', team: 'Varsity Boys Volleyball', sportKey: 'Volleyball', level: 'SMA', eventType: 'Away Game', eventText: 'LV @ Boys KV', raw: 'LV @ Boys KV', opponent: 'KV' }),
    event({ id: 'girls-game', team: 'Varsity Girls Volleyball', genderGroup: 'Girls', sportKey: 'Volleyball', level: 'SMA', eventType: 'Away Game', eventText: 'LV @ Girls KV', raw: 'LV @ Girls KV', opponent: 'KV' }),
  ]);

  assert.equal(rows.length, 1);
  assert.equal(rows[0].eventText, 'LV @ KV');
  assert.equal(eventMatchesTeamFilter(rows[0], 'VBV'), true);
  assert.equal(eventMatchesTeamFilter(rows[0], 'VGV'), true);
});

test('keeps separate rows when venue, time, or opponent differs', () => {
  const rows = consolidateSharedScheduleEvents([
    event({ id: 'boys' }),
    event({ id: 'girls', team: 'SMP Girls Basketball', genderGroup: 'Girls', location: 'Gym 1' }),
    event({ id: 'girls-late', team: 'SMP Girls Basketball', genderGroup: 'Girls', time: '16:30' }),
    event({ id: 'girls-opponent', team: 'SMP Girls Basketball', genderGroup: 'Girls', opponent: 'AIS' }),
  ]);

  assert.equal(rows.length, 4);
});

test('games scope excludes practices and other schedule notes', () => {
  assert.equal(isGameScheduleEvent(event({ eventType: 'Away Game' })), true);
  assert.equal(isGameScheduleEvent(event({ eventType: 'Tournament' })), true);
  assert.equal(isGameScheduleEvent(event({ eventType: 'Practice' })), false);
  assert.equal(isGameScheduleEvent(event({ eventType: 'Other' })), false);
});
