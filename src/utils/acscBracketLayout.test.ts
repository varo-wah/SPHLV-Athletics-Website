import assert from 'node:assert/strict';
import test from 'node:test';
import { ACSC_BRACKETS, acscBracketForTeam } from '../data/acscBrackets2026';
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
      const layout = bracketLayout(lane);
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

test('standard knockout rounds preserve centered cards and compact elbow routes', () => {
  const lane = acscBracketForTeam('soccer-sma-boys')!.lanes[0];
  const layout = bracketLayout(lane);
  assert.deepEqual(layout.positions.get('acsc-soccer-2026-q1'), { x: 20, y: 44 });
  assert.deepEqual(layout.positions.get('acsc-soccer-2026-g6'), { x: 314, y: 134 });
  assert.equal(layout.width, 858);
  assert.equal(layout.height, 748);
  assert.equal(layout.paths[0].d, 'M 250 111 H 276.88 V 206 H 314');
  assert.ok(layout.paths.every(path => pathPoints(path.d).length === 4));
});
