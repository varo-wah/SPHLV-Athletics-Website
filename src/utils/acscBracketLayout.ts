import type { AcscBracketEdge, AcscBracketLane } from '../data/acscBrackets2026';
import type { AcscCompetitionMatch } from '../data/acscCompetitionTypes';
import { acscSchoolForName } from '../data/acscSchools';

export const CARD_WIDTH = 230;
export const CARD_HEIGHT = 144;
export const COLUMN_GAP = 128;
export const EDGE = 20;
export const TOP = 44;
const ROW_STEP = 180;
const ROUTE_STEP = 16;
const PORT_STUB = 6;
const TRACK_MARGIN = PORT_STUB + 6;
const ARM_STEP = 4.25;
const schoolKey = (name: string) => acscSchoolForName(name)?.code ?? name.trim().toUpperCase();

export function bracketLayout(lane: AcscBracketLane, matches?: Map<string, AcscCompetitionMatch>) {
  const rowCount = Math.max(1, ...lane.rounds.map(round => round.matchIds.length));
  const positions = new Map<string, { x: number; y: number }>();
  const columns = new Map<string, number>();
  lane.rounds.forEach((round, column) => round.matchIds.forEach((id, index) => {
    const row = lane.rowByMatchId?.[id] ?? ((index + 0.5) * rowCount / round.matchIds.length - 0.5);
    positions.set(id, { x: EDGE + column * (CARD_WIDTH + COLUMN_GAP), y: TOP + row * ROW_STEP });
    columns.set(id, column);
  }));
  const gutterTracks = new Map<number, string[]>();
  const reserveTrack = (column: number, key: string) => gutterTracks.set(column, [...(gutterTracks.get(column) ?? []), key]);
  lane.edges.forEach((edge, index) => {
    const fromColumn = columns.get(edge.from);
    const toColumn = columns.get(edge.to);
    if (fromColumn === undefined || toColumn === undefined) return;
    if (toColumn - fromColumn > 1) {
      reserveTrack(fromColumn, `${index}:source`);
      reserveTrack(toColumn - 1, `${index}:destination`);
    } else {
      reserveTrack(fromColumn, `${index}:direct`);
    }
  });
  const trackX = (column: number, key: string) => {
    const tracks = gutterTracks.get(column)!;
    return EDGE + column * (CARD_WIDTH + COLUMN_GAP) + CARD_WIDTH
      + TRACK_MARGIN + (COLUMN_GAP - TRACK_MARGIN * 2) * (tracks.indexOf(key) + 1) / (tracks.length + 1);
  };
  const armOffset = (column: number, key: string) => {
    const tracks = gutterTracks.get(column)!;
    return (tracks.indexOf(key) - (tracks.length - 1) / 2) * ARM_STEP;
  };
  const bottom = Math.max(TOP + CARD_HEIGHT, ...[...positions.values()].map(position => position.y + CARD_HEIGHT));
  let outerRoutes = 0;
  const paths: (AcscBracketEdge & { d: string })[] = [];
  for (const [index, edge] of lane.edges.entries()) {
    const from = positions.get(edge.from);
    const to = positions.get(edge.to);
    if (!from || !to) continue;
    const start = from.x + CARD_WIDTH;
    const end = to.x;
    const fromColumn = columns.get(edge.from)!;
    const toColumn = columns.get(edge.to)!;
    const sourceMatch = matches?.get(edge.from);
    const destinationMatch = matches?.get(edge.to);
    const sourceSchools = sourceMatch ? [schoolKey(sourceMatch.home), schoolKey(sourceMatch.away)] : [];
    const destinationSchools = destinationMatch ? [schoolKey(destinationMatch.home), schoolKey(destinationMatch.away)] : [];
    const sharedSchools = sourceMatch && destinationMatch
      ? [...new Set(sourceSchools.filter(school => destinationSchools.includes(school)))]
      : [];
    const sharedSchool = sharedSchools.length === 1 ? sharedSchools[0] : null;
    const sourceY = from.y + (sharedSchool ? sourceSchools[0] === sharedSchool ? 50 : 86
      : CARD_HEIGHT / 2 + (edge.outcome === 'winner' ? -8 : 8));
    const destinationY = to.y + (sharedSchool ? destinationSchools[0] === sharedSchool ? 50 : 86 : CARD_HEIGHT / 2);
    const sourceStub = start + PORT_STUB;
    const destinationStub = end - PORT_STUB;
    let d: string;
    if (to.x - from.x > CARD_WIDTH + COLUMN_GAP) {
      // A direct elbow can pass through intervening cards. Descend in the
      // source gutter, cross below every card, then rise in the target gutter.
      const sourceGutter = trackX(fromColumn, `${index}:source`);
      const destinationGutter = trackX(toColumn - 1, `${index}:destination`);
      const sourceArmY = sourceY + armOffset(fromColumn, `${index}:source`);
      const destinationArmY = destinationY + armOffset(toColumn - 1, `${index}:destination`);
      const routeY = bottom + EDGE + outerRoutes++ * ROUTE_STEP;
      d = `M ${start} ${sourceY} H ${sourceStub} V ${sourceArmY} H ${sourceGutter} V ${routeY} H ${destinationGutter} V ${destinationArmY} H ${destinationStub} V ${destinationY} H ${end}`;
    } else {
      const mid = trackX(fromColumn, `${index}:direct`);
      // Preserve exact team-row ports, then separate the horizontal arms too:
      // different teams can occupy the same y-coordinate in adjacent columns.
      const offset = armOffset(fromColumn, `${index}:direct`);
      d = `M ${start} ${sourceY} H ${sourceStub} V ${sourceY + offset} H ${mid} V ${destinationY + offset} H ${destinationStub} V ${destinationY} H ${end}`;
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
