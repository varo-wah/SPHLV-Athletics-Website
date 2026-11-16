import assert from 'node:assert/strict';
import test from 'node:test';
import { isLaunchTeamSelection } from '../config/launchSports';
import {
  rosterForTeam,
  SMP_BOYS_BASKETBALL_SQUADS,
  TEAM_ROSTERS,
} from '../data/teamRosters';

const expectedCounts: Record<string, number> = {
  'basketball-sma-boys': 13,
  'basketball-sma-girls': 15,
  'soccer-sma-boys': 24,
  'soccer-sma-girls': 21,
  'volleyball-sma-boys': 17,
  'volleyball-sma-girls': 15,
  'basketball-smp-boys': 10,
  'basketball-smp-girls': 24,
};

test('contains the supplied team rosters with the verified player counts', () => {
  assert.equal(TEAM_ROSTERS.length, 8);

  for (const [teamId, count] of Object.entries(expectedCounts)) {
    assert.equal(rosterForTeam(teamId)?.players.length, count, teamId);
  }
});

test('makes the confirmed varsity boys basketball list available to its public team page', () => {
  assert.equal(isLaunchTeamSelection('Basketball', 'SMA', 'Boys'), true);
  const roster = rosterForTeam('basketball-sma-boys');
  assert.ok(roster);
  assert.deepEqual(roster.players, [
    'Evans Sudjatma', 'Sean Danuseputra', 'Ryu Honda', 'Brian Kang',
    'Coby Heil', 'Maxwell Go', 'Kiano Jauri', 'Mingze Lee',
    'Rayn Danuseputra', 'Neil Alianson', 'Jordan Jon Jr', 'Giovan Lim', 'Morgan Ongko',
  ]);
  assert.deepEqual(roster.players.map(name => roster.grades?.[name]), [12, 12, 12, 12, 11, 11, 10, 10, 10, 10, 10, 10, 12]);
  assert.match(roster.sourceNote ?? '', /15 Nov 2026/);
  assert.match(roster.sourceNote ?? '', /not jersey numbers/);
});

test('keeps every player name non-empty and unique within a team', () => {
  for (const roster of TEAM_ROSTERS) {
    const normalizedNames = roster.players.map((name) => name.trim().toLocaleLowerCase());
    assert.ok(normalizedNames.every(Boolean), roster.teamId);
    assert.equal(new Set(normalizedNames).size, roster.players.length, roster.teamId);
  }
});

test('stores every supplied SMP boys squad while Team A powers the current team page', () => {
  assert.equal(SMP_BOYS_BASKETBALL_SQUADS.A.length, 10);
  assert.equal(SMP_BOYS_BASKETBALL_SQUADS.B.length, 11);
  assert.equal(SMP_BOYS_BASKETBALL_SQUADS.C.length, 10);
  assert.deepEqual(rosterForTeam('basketball-smp-boys')?.players, SMP_BOYS_BASKETBALL_SQUADS.A);

  const allPlayers = Object.values(SMP_BOYS_BASKETBALL_SQUADS).flat();
  const normalizedNames = allPlayers.map((name) => name.trim().toLocaleLowerCase());
  assert.equal(new Set(normalizedNames).size, allPlayers.length);
});
