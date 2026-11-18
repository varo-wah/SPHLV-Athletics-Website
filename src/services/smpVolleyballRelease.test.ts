import assert from 'node:assert/strict';
import test from 'node:test';
import { isLaunchTeamSelection, isVisibleScheduleEvent, TEAM_DIRECTORY } from '../config/launchSports';
import { SMP_VOLLEYBALL_SCHEDULE } from '../data/smpVolleyballSchedule2026';
import { homeUpcomingFixtures } from '../utils/homeUpcomingPresentation';
import { rosterForTeam } from '../data/teamRosters';
import { parseRoute, parseScheduleQuery } from './navigation';
import { reviewedSchedule } from './reviewedSchedule';
import { consolidateSharedScheduleEvents, eventMatchesTeamFilter, teamCodeForSchedule } from './schedulePresentation';

test('SMP volleyball routes and directory are public and separate from varsity', () => {
  for (const gender of ['Boys', 'Girls'] as const) {
    const id = `volleyball-smp-${gender.toLowerCase()}`;
    assert.ok(isLaunchTeamSelection('Volleyball', 'SMP', gender));
    assert.equal(parseRoute(`#/teams/${id}`).team?.id, id);
    assert.ok(rosterForTeam(id)?.players.length, 'Confirmed SMP roster is available');
  }
  assert.equal(TEAM_DIRECTORY.find(group => group.key === 'Volleyball-SMP')?.teams.length, 2);
  assert.ok(TEAM_DIRECTORY.find(group => group.key === 'Volleyball-SMA')?.teams.every(team => team.division === 'SMA'));
});

test('reviewed SMP schedule is public on first load and refresh without stale-year duplicates', () => {
  const first = SMP_VOLLEYBALL_SCHEDULE[0];
  const once = reviewedSchedule([{ ...first, id: 'old-feed', date: '2025-11-03' }]);
  for (const events of [once, reviewedSchedule(once), reviewedSchedule(once, true)]) {
    const smp = events.filter(event => event.sportKey === 'Volleyball' && event.level === 'SMP' && event.season === 'Season 2');
    assert.deepEqual(smp, SMP_VOLLEYBALL_SCHEDULE);
    assert.ok(smp.every(event => isVisibleScheduleEvent(event.season, event.sportKey!, event.team)));
    assert.equal(new Set(smp.map(event => event.id)).size, smp.length);
  }
  assert.equal(isVisibleScheduleEvent('Season 1', 'Volleyball', 'SMP Boys Volleyball'), false);
});

test('SMP schedule filters preserve the correct division including combined boys and girls sessions', () => {
  const events = consolidateSharedScheduleEvents(SMP_VOLLEYBALL_SCHEDULE);
  for (const code of ['SMPBV', 'SMPGV'] as const) {
    assert.equal(parseScheduleQuery(`season=Season+2&team=${code}&scope=practices`, ['Season 1', 'Season 2'], 'Season 2').team, code);
    assert.ok(events.some(event => eventMatchesTeamFilter(event, code)));
    assert.ok(events.every(event => !eventMatchesTeamFilter(event, 'VBV') && !eventMatchesTeamFilter(event, 'VGV')));
  }
  assert.equal(teamCodeForSchedule('SMP Boys & Girls Volleyball'), 'SMPBV/SMPGV');
});

test('multi-school session does not manufacture an opponent pairing on Home', () => {
  const session = SMP_VOLLEYBALL_SCHEDULE.find(event => event.pairingsPending)!;
  assert.ok(session);
  const cards = homeUpcomingFixtures([session]);
  assert.equal(cards.length, 1);
  assert.equal(cards[0].opponent, 'PAIRINGS PENDING');
  assert.equal(cards[0].time, null);
});
