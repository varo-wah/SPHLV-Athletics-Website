import type { SheetMatch } from '../services/parsers';
import { volleyballRecap } from './volleyballRecaps';

/** Show the supplied report for any sport, retaining the existing volleyball score summary fallback. */
export function matchRecap(match: SheetMatch): string | undefined {
  return match.highlights?.[0] || volleyballRecap(match);
}
