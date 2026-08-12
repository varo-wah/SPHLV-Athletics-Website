import assert from 'node:assert/strict';
import test from 'node:test';
import { rosterForTeam, TEAM_ROSTERS } from '../data/teamRosters';

const expectedCounts: Record<string, number> = {
  'soccer-sma-boys': 24,
  'soccer-sma-girls': 21,
  'volleyball-sma-boys': 17,
  'volleyball-sma-girls': 15,
  'basketball-smp-girls': 24,
};

test('contains the five supplied team rosters with the verified player counts', () => {
  assert.equal(TEAM_ROSTERS.length, 5);

  for (const [teamId, count] of Object.entries(expectedCounts)) {
    assert.equal(rosterForTeam(teamId)?.players.length, count, teamId);
  }
});

test('keeps every player name non-empty and unique within a team', () => {
  for (const roster of TEAM_ROSTERS) {
    const normalizedNames = roster.players.map((name) => name.trim().toLocaleLowerCase());
    assert.ok(normalizedNames.every(Boolean), roster.teamId);
    assert.equal(new Set(normalizedNames).size, roster.players.length, roster.teamId);
  }
});

test('leaves the unsupplied SMP boys basketball roster pending', () => {
  assert.equal(rosterForTeam('basketball-smp-boys'), undefined);
});
