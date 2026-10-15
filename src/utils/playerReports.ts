import type { SheetMatch } from '../services/parsers';

export interface PlayerReport {
  id: string;
  date: string;
  opponents: string[];
  competition: string;
  stats: string[];
  sharedReport: boolean;
}

// Isa's published award pairs this short name with her official roster name.
const CONFIRMED_ALIASES: Record<string, Record<string, string>> = {
  'soccer-sma-girls': { isa: 'Isabelle Chendra' },
};

function normalizeName(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\([^)]*\)/g, '').replace(/#\s*\d+/g, '')
    .toLocaleLowerCase().replace(/[^a-z\s'-]/g, '').replace(/\s+/g, ' ').trim();
}

/** Only attribute exact names, confirmed aliases, or a unique first name. */
export function resolveReportedPlayer(name: string, roster: readonly string[], teamId: string): string | undefined {
  const key = normalizeName(name);
  if (!key) return undefined;
  const exact = roster.find(player => normalizeName(player) === key);
  if (exact) return exact;
  const alias = CONFIRMED_ALIASES[teamId]?.[key];
  if (alias && roster.includes(alias)) return alias;
  if (key.includes(' ')) return undefined;
  const candidates = roster.filter(player => normalizeName(player).split(' ')[0] === key);
  return candidates.length === 1 ? candidates[0] : undefined;
}

/** Preserve reported values and scope instead of inferring incomplete season totals. */
export function reportsForPlayer(player: string, roster: readonly string[], teamId: string, matches: readonly SheetMatch[]): PlayerReport[] {
  const reports = new Map<string, PlayerReport>();
  for (const match of matches) {
    if (match.teamId !== teamId) continue;
    const stats = (match.statLeaders ?? []).flatMap(line => {
      const parts = line.match(/^(.+?)(?:\s+[—–-]\s+|:\s*)(.+)$/);
      return parts && resolveReportedPlayer(parts[1], roster, teamId) === player ? [parts[2].trim()] : [];
    });
    const uniqueStats = [...new Set(stats)];
    if (!uniqueStats.length) continue;
    const sharedReport = [...(match.statLeaders ?? []), ...(match.highlights ?? [])]
      .some(line => /without opponent attribution|doubleheader ace highlights/i.test(line));
    const id = `${match.date}|${sharedReport ? 'doubleheader' : match.opponent}|${[...uniqueStats].sort().join('|')}`;
    const previous = reports.get(id);
    if (previous) {
      if (!previous.opponents.includes(match.opponent)) previous.opponents.push(match.opponent);
      continue;
    }
    reports.set(id, {
      id, date: match.date, opponents: [match.opponent],
      competition: match.matchType || match.tournament,
      stats: uniqueStats, sharedReport,
    });
  }
  return [...reports.values()].sort((a, b) => b.date.localeCompare(a.date));
}
