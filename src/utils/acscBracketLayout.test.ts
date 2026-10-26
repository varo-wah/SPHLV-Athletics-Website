import assert from 'node:assert/strict';
import test from 'node:test';
import { ACSC_BRACKETS, acscBracketForTeam } from '../data/acscBrackets2026';
import { acscResultsForTeam } from '../data/acscCompetitionResults2026';
import { bracketLayout, CARD_HEIGHT, CARD_WIDTH } from './acscBracketLayout';

type Point = { x: number; y: number };

function pathPoints(d: string): Point[] {
  const commands = [...d.matchAll(/([MHV])\s+(-?[\d.]+)(?:\s+(-?[\d.]+))?/g)];
  const points: Point[] = [];
  let point = { x: 0, y: 0 };
  for (const [, command, first, second] of commands) {
    point = command === 'M' ? { x: Number(first), y: Number(second) }
      : command === 'H' ? { ...point, x: Number(first) } : { ...point, y: Number(first) };
    points.push(point);
  }
  return points;
}

function intersectsCard(start: Point, end: Point, card: Point) {
  if (start.x === end.x) {
    return start.x > card.x && start.x < card.x + CARD_WIDTH
      && Math.max(start.y, end.y) > card.y && Math.min(start.y, end.y) < card.y + CARD_HEIGHT;
  }
  return start.y > card.y && start.y < card.y + CARD_HEIGHT
    && Math.max(start.x, end.x) > card.x && Math.min(start.x, end.x) < card.x + CARD_WIDTH;
}

test('boys M1 loser route reaches M9 without disappearing behind M5 or M7', () => {
  const lane = acscBracketForTeam('volleyball-sma-boys')!.lanes[0];
  const layout = bracketLayout(lane);
  const path = layout.paths.find(item => item.from === 'acsc-bvb-2026-playoff-1' && item.to === 'acsc-bvb-2026-playoff-9')!;
  assert.ok(path);
  const points = pathPoints(path.d);
  const bottom = Math.max(...[...layout.positions.values()].map(point => point.y + CARD_HEIGHT));
  assert.ok(points.some(point => point.y > bottom), 'route must pass below the cards');
  for (const game of [5, 7]) {
    const card = layout.positions.get(`acsc-bvb-2026-playoff-${game}`)!;
    for (let i = 1; i < points.length; i++) {
      assert.equal(intersectsCard(points[i - 1], points[i], card), false, `route overlaps M${game}`);
    }
  }
});

test('all bracket paths stay inside the canvas and avoid unrelated cards', () => {
  for (const definition of ACSC_BRACKETS) {
    for (const lane of definition.lanes) {
      const matches = new Map(acscResultsForTeam(definition.teamId)!.matches.map(match => [match.id, match]));
      const layout = bracketLayout(lane, matches);
      assert.equal(layout.paths.length, lane.edges.length);
      for (const path of layout.paths) {
        const points = pathPoints(path.d);
        for (const point of points) {
          assert.ok(point.x >= 0 && point.x <= layout.width && point.y >= 0 && point.y < layout.height);
        }
        for (const [id, card] of layout.positions) {
          if (id === path.from || id === path.to) continue;
          for (let i = 1; i < points.length; i++) {
            assert.equal(intersectsCard(points[i - 1], points[i], card), false, `${definition.teamId}: ${path.from} → ${path.to} intersects ${id}`);
          }
        }
      }
    }
  }
});

test('complete knockout bracket retains four cards in each of three columns', () => {
  const lane = acscBracketForTeam('soccer-sma-boys')!.lanes[0];
  const layout = bracketLayout(lane);
  assert.deepEqual(lane.rounds.map(round => round.matchIds.length), [4, 4, 4]);
  assert.deepEqual(layout.positions.get('acsc-soccer-2026-q1'), { x: 20, y: 44 });
  assert.deepEqual(layout.positions.get('acsc-soccer-2026-g6'), { x: 378, y: 44 });
  assert.deepEqual(layout.positions.get('acsc-soccer-2026-g5'), { x: 378, y: 404 });
  assert.deepEqual(layout.positions.get('acsc-soccer-2026-g10'), { x: 736, y: 584 });
  assert.equal(layout.width, 986);
  assert.equal(layout.height, 748);
  assert.ok(layout.paths.every(path => pathPoints(path.d).length === 8));
});

test('every connector gets separate vertical tracks, including skipped-column routes', () => {
  for (const definition of ACSC_BRACKETS) {
    for (const lane of definition.lanes) {
      const layout = bracketLayout(lane);
      const tracks: number[] = [];
      for (const path of layout.paths) {
        const points = pathPoints(path.d);
        // The first long vertical track follows the source port's short stub.
        tracks.push(points[3].x);
        if (points.length === 10) tracks.push(points[5].x);
      }
      assert.equal(new Set(tracks).size, tracks.length, `${definition.teamId}: connectors share a vertical trunk`);
    }
  }
});

test('quarterfinal loser follows the SPH team rows using names without requiring scores', () => {
  const lane = acscBracketForTeam('soccer-sma-boys')!.lanes[0];
  const matches = new Map(acscResultsForTeam('soccer-sma-boys')!.matches.map(match => [match.id, { ...match, homeScore: null, awayScore: null }]));
  const layout = bracketLayout(lane, matches);
  const path = layout.paths.find(item => item.from === 'acsc-soccer-2026-q2' && item.to === 'acsc-soccer-2026-g5')!;
  assert.equal(path.outcome, 'loser');
  const points = pathPoints(path.d);
  assert.deepEqual(points[0], { x: 250, y: 310 });
  assert.deepEqual(points.at(-1), { x: 378, y: 490 });
});

test('ambiguous shared participants retain neutral ports instead of assigning a team', () => {
  const lane = acscBracketForTeam('soccer-sma-boys')!.lanes[0];
  const matches = new Map(acscResultsForTeam('soccer-sma-boys')!.matches.map(match => [match.id, match]));
  const source = matches.get('acsc-soccer-2026-q2')!;
  const destination = matches.get('acsc-soccer-2026-g5')!;
  matches.set(destination.id, { ...destination, home: source.home, away: source.away });
  const layout = bracketLayout(lane, matches);
  const path = layout.paths.find(item => item.from === source.id && item.to === destination.id)!;
  const points = pathPoints(path.d);
  assert.deepEqual(points[0], { x: 250, y: 304 });
  assert.deepEqual(points.at(-1), { x: 378, y: 476 });
});

test('school aliases connect to the same team row', () => {
  const lane = acscBracketForTeam('soccer-sma-boys')!.lanes[0];
  const matches = new Map(acscResultsForTeam('soccer-sma-boys')!.matches.map(match => [match.id, match]));
  const source = matches.get('acsc-soccer-2026-q2')!;
  const destination = matches.get('acsc-soccer-2026-g6')!;
  matches.set(source.id, { ...source, home: 'GIS' });
  matches.set(destination.id, { ...destination, away: 'Grace International School' });
  const layout = bracketLayout(lane, matches);
  const path = layout.paths.find(item => item.from === source.id && item.to === destination.id)!;
  const points = pathPoints(path.d);
  assert.deepEqual(points[0], { x: 250, y: 274 });
  assert.deepEqual(points.at(-1), { x: 378, y: 130 });
});

test('unified brackets have no overlapping horizontal or vertical segments between edges', () => {
  const overlap = (a: Point, b: Point, c: Point, d: Point) => {
    if (a.y === b.y && c.y === d.y && a.y === c.y) {
      return Math.min(Math.max(a.x, b.x), Math.max(c.x, d.x)) > Math.max(Math.min(a.x, b.x), Math.min(c.x, d.x));
    }
    if (a.x === b.x && c.x === d.x && a.x === c.x) {
      return Math.min(Math.max(a.y, b.y), Math.max(c.y, d.y)) > Math.max(Math.min(a.y, b.y), Math.min(c.y, d.y));
    }
    return false;
  };
  for (const teamId of ['soccer-sma-boys', 'volleyball-sma-girls']) {
    const lane = acscBracketForTeam(teamId)!.lanes[0];
    const matches = new Map(acscResultsForTeam(teamId)!.matches.map(match => [match.id, match]));
    const paths = bracketLayout(lane, matches).paths;
    for (let i = 0; i < paths.length; i++) {
      for (let j = i + 1; j < paths.length; j++) {
        const first = pathPoints(paths[i].d);
        const second = pathPoints(paths[j].d);
        for (let a = 1; a < first.length; a++) {
          for (let b = 1; b < second.length; b++) {
            assert.equal(overlap(first[a - 1], first[a], second[b - 1], second[b]), false,
              `${teamId}: ${paths[i].from}→${paths[i].to} overlaps ${paths[j].from}→${paths[j].to}`);
          }
        }
      }
    }
  }
});
