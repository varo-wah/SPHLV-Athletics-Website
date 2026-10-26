import assert from 'node:assert/strict';
import test from 'node:test';
import { ACSC_BRACKETS, acscBracketForTeam } from '../data/acscBrackets2026';
import { acscResultsForTeam } from '../data/acscCompetitionResults2026';
import type { AcscCompetitionMatch } from '../data/acscCompetitionTypes';

function resultSchool(match: AcscCompetitionMatch, outcome: 'winner' | 'loser'): string | undefined {
  if (match.homeScore === null || match.awayScore === null) return undefined;
  const homeScore = match.homeScore === match.awayScore ? match.penalties?.homeScore : match.homeScore;
  const awayScore = match.homeScore === match.awayScore ? match.penalties?.awayScore : match.awayScore;
  if (homeScore === undefined || awayScore === undefined || homeScore === awayScore) return undefined;
  const homeWon = homeScore > awayScore;
  return homeWon === (outcome === 'winner') ? match.home : match.away;
}

for (const definition of ACSC_BRACKETS) {
  test(`${definition.teamId}: bracket references each reviewed playoff once and routes verified winners/losers correctly`, () => {
    const snapshot = acscResultsForTeam(definition.teamId);
    assert.ok(snapshot);
    const matches = new Map(snapshot.matches.map(match => [match.id, match]));
    const ids = definition.lanes.flatMap(lane => lane.rounds.flatMap(round => round.matchIds));
    assert.equal(new Set(ids).size, ids.length, 'a fixture must not appear twice in the visual bracket');
    assert.deepEqual([...ids].sort(), snapshot.matches.filter(match => match.kind === 'playoff').map(match => match.id).sort());

    for (const lane of definition.lanes) {
      const roundById = new Map(lane.rounds.flatMap((round, index) => round.matchIds.map(id => [id, index] as const)));
      assert.equal(new Set(lane.edges.map(edge => `${edge.from}:${edge.to}:${edge.outcome}`)).size, lane.edges.length);
      for (const edge of lane.edges) {
        assert.ok(roundById.has(edge.from) && roundById.has(edge.to), 'both connector ends must be visible in the lane');
        assert.ok(roundById.get(edge.from)! < roundById.get(edge.to)!, 'progression must go forward, not form a cycle');
        const source = matches.get(edge.from)!;
        const target = matches.get(edge.to)!;
        const advancingSchool = resultSchool(source, edge.outcome);
        if (advancingSchool) assert.ok([target.home, target.away].includes(advancingSchool), `${edge.outcome} of ${source.id} must appear in ${target.id}`);
        else assert.ok([source.home, source.away].some(school => [target.home, target.away].includes(school)), 'unscored named pairings must still share a participant');
      }
      for (const [id] of roundById) {
        const incoming = lane.edges.filter(edge => edge.to === id);
        const schools = incoming.map(edge => resultSchool(matches.get(edge.from)!, edge.outcome));
        if (incoming.length === 2 && schools.every(Boolean)) {
          const target = matches.get(id)!;
          assert.deepEqual([...schools].sort(), [target.home, target.away].sort(), 'both actual participants must match their feeders');
        }
      }
      for (const [id, row] of Object.entries(lane.rowByMatchId ?? {})) {
        assert.ok(roundById.has(id));
        assert.ok(Number.isFinite(row) && row >= 0);
      }
    }
  });
}

for (const teamId of ['soccer-sma-boys', 'volleyball-sma-girls']) {
  test(`${teamId}: one complete bracket keeps all eight teams connected through three four-match stages`, () => {
    const bracket = acscBracketForTeam(teamId)!;
    assert.equal(bracket.lanes.length, 1, 'championship and consolation must remain in one connected view');
    const lane = bracket.lanes[0];
    assert.deepEqual(lane.rounds.map(round => round.matchIds.length), [4, 4, 4]);
    const matches = new Map(acscResultsForTeam(teamId)!.matches.map(match => [match.id, match]));
    const participants = (ids: string[]) => ids.flatMap(id => {
      const match = matches.get(id)!;
      return [match.home, match.away];
    }).sort();
    const schools = participants(lane.rounds[0].matchIds);
    assert.equal(new Set(schools).size, 8);

    for (const [roundIndex, round] of lane.rounds.entries()) {
      assert.deepEqual(participants(round.matchIds), schools, 'every team must appear exactly once in each stage');
      for (const id of round.matchIds) {
        const incoming = lane.edges.filter(edge => edge.to === id);
        assert.equal(incoming.length, roundIndex === 0 ? 0 : 2, 'later matches need both visible feeder paths');
        const outgoing = lane.edges.filter(edge => edge.from === id);
        if (roundIndex === lane.rounds.length - 1) {
          assert.equal(outgoing.length, 0, 'placement matches end the bracket');
          continue;
        }
        assert.deepEqual(outgoing.map(edge => edge.outcome).sort(), ['loser', 'winner'], 'both winner and loser must continue, including quarterfinal losers');
        for (const edge of outgoing) {
          assert.ok(lane.rounds[roundIndex + 1].matchIds.includes(edge.to), 'each path must reach the next visible stage');
          const school = resultSchool(matches.get(id)!, edge.outcome);
          assert.ok(school, 'the source result must confirm the advancing participant');
          const target = matches.get(edge.to)!;
          assert.ok([target.home, target.away].includes(school), `${school} must continue from ${id} to its actual next match`);
        }
      }
    }
  });
}

test('boys volleyball keeps its exhibition separate and never invents missing playoff scores', () => {
  const bracket = acscBracketForTeam('volleyball-sma-boys')!;
  const exhibition = bracket.lanes.find(lane => lane.id === 'exhibition')!;
  assert.deepEqual(exhibition.rounds.flatMap(round => round.matchIds), ['acsc-bvb-2026-playoff-exhibition']);
  assert.deepEqual(exhibition.edges, []);
  const matches = acscResultsForTeam(bracket.teamId)!.matches.filter(match => match.kind === 'playoff');
  assert.ok(matches.every(match => match.homeScore === null && match.awayScore === null));
  assert.equal(acscBracketForTeam('basketball-smp-boys'), undefined);
});

test('soccer shootout winners feed the championship path rather than the regulation draw', () => {
  const snapshot = acscResultsForTeam('soccer-sma-boys')!;
  assert.equal(resultSchool(snapshot.matches.find(match => match.id === 'acsc-soccer-2026-q4')!, 'winner'), 'FAITH');
  assert.equal(resultSchool(snapshot.matches.find(match => match.id === 'acsc-soccer-2026-g6')!, 'winner'), 'GIS');
});
