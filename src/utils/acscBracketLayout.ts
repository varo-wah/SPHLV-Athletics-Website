import type { AcscBracketEdge, AcscBracketLane } from '../data/acscBrackets2026';

export const CARD_WIDTH = 230;
export const CARD_HEIGHT = 144;
export const COLUMN_GAP = 64;
export const EDGE = 20;
export const TOP = 44;
const ROW_STEP = 180;
const ROUTE_STEP = 16;

export function bracketLayout(lane: AcscBracketLane) {
  const rowCount = Math.max(1, ...lane.rounds.map(round => round.matchIds.length));
  const positions = new Map<string, { x: number; y: number }>();
  lane.rounds.forEach((round, column) => round.matchIds.forEach((id, index) => {
    const row = lane.rowByMatchId?.[id] ?? ((index + 0.5) * rowCount / round.matchIds.length - 0.5);
    positions.set(id, { x: EDGE + column * (CARD_WIDTH + COLUMN_GAP), y: TOP + row * ROW_STEP });
  }));
  const bottom = Math.max(TOP + CARD_HEIGHT, ...[...positions.values()].map(position => position.y + CARD_HEIGHT));
  let outerRoutes = 0;
  const paths: (AcscBracketEdge & { d: string })[] = [];
  for (const edge of lane.edges) {
    const from = positions.get(edge.from);
    const to = positions.get(edge.to);
    if (!from || !to) continue;
    const start = from.x + CARD_WIDTH;
    const end = to.x;
    const sourceY = from.y + CARD_HEIGHT / 2 + (edge.outcome === 'winner' ? -5 : 5);
    const destinationY = to.y + CARD_HEIGHT / 2;
    let d: string;
    if (to.x - from.x > CARD_WIDTH + COLUMN_GAP) {
      // A direct elbow can pass through intervening cards. Descend in the
      // source gutter, cross below every card, then rise in the target gutter.
      const gutterInset = COLUMN_GAP * (edge.outcome === 'winner' ? 0.25 : 0.5);
      const sourceGutter = start + gutterInset;
      const destinationGutter = end - gutterInset;
      const routeY = bottom + EDGE + outerRoutes++ * ROUTE_STEP;
      d = `M ${start} ${sourceY} H ${sourceGutter} V ${routeY} H ${destinationGutter} V ${destinationY} H ${end}`;
    } else {
      const mid = start + (end - start) * (edge.outcome === 'winner' ? 0.42 : 0.65);
      d = `M ${start} ${sourceY} H ${mid} V ${destinationY} H ${end}`;
    }
    paths.push({ ...edge, d });
  }
  return {
    positions,
    width: EDGE * 2 + lane.rounds.length * CARD_WIDTH + Math.max(0, lane.rounds.length - 1) * COLUMN_GAP,
    height: bottom + EDGE + (outerRoutes ? EDGE + (outerRoutes - 1) * ROUTE_STEP : 0),
    paths,
  };
}
