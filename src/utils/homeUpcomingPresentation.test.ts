import assert from 'node:assert/strict';
import test from 'node:test';
import { ScheduleEvent } from '../data/scheduleTypes';
import { homeUpcomingFixtures } from './homeUpcomingPresentation';

function event(overrides: Partial<ScheduleEvent>): ScheduleEvent {
  return {
    id: 'event-1',
    season: 'Season 1',
    week: 'Week 6',
    date: '2026-09-05',
    day: 'Sat',
    team: 'Varsity Boys & Girls Volleyball',
    sportKey: 'Volleyball',
    level: 'SMA',
    eventText: 'LV v ACS 08:00 ACS v GJS 09:00 LV v GJS 10:00',
    eventType: 'Home Game',
    location: 'LV',
    opponent: null,
    time: '08:00',
    raw: 'LV v ACS 08:00 ACS v GJS 09:00 LV v GJS 10:00',
    ...overrides,
  };
}

test('expands a cup day into separate LV fixtures and drops the neutral game', () => {
  assert.deepEqual(
    homeUpcomingFixtures([event({})]).map(({ opponent, teamCode, time }) => ({
      opponent,
      teamCode,
      time,
    })),
    [
      { opponent: 'ACS', teamCode: 'VBV/VGV', time: '08:00' },
      { opponent: 'GJS', teamCode: 'VBV/VGV', time: '10:00' },
    ],
  );
});

test('uses only the opponent name for home and away fixtures', () => {
  const fixtures = homeUpcomingFixtures([
    event({
      id: 'home',
      team: 'Varsity Boys Soccer',
      sportKey: 'Soccer',
      genderGroup: 'Boys',
      eventText: 'GJS @ LV 11:15',
      raw: 'GJS @ LV 11:15',
      opponent: 'GJS',
      time: '11:15',
    }),
    event({
      id: 'away',
      team: 'Varsity Girls Soccer',
      sportKey: 'Soccer',
      genderGroup: 'Girls',
      eventText: 'LV @ STL 15:30',
      raw: 'LV @ STL 15:30',
      opponent: 'STL',
      location: 'STL',
      eventType: 'Away Game',
      time: '15:30',
    }),
  ]);

  assert.deepEqual(fixtures.map(({ opponent, teamCode }) => ({ opponent, teamCode })), [
    { opponent: 'GJS', teamCode: 'VBS' },
    { opponent: 'SSL', teamCode: 'VGS' },
  ]);
});
