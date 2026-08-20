import { jaacSchoolForName } from '../data/jaacSchools';
import { SheetMatch } from '../services/parsers';

function normalizedTeamKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function formatTeamName(value: string) {
  const normalized = normalizedTeamKey(value);
  return /^(?:lv|sph|sphlv|sekolahpelitaharapan)$/.test(normalized)
    ? 'SPH-LV'
    : value.trim().toUpperCase();
}

export function teamLogoForName(value: string | null | undefined) {
  return jaacSchoolForName(value)?.logo ?? null;
}

export function resultOutcomeLabel(result: SheetMatch['result']) {
  if (result === 'W') return 'Win';
  if (result === 'L') return 'Loss';
  if (result === 'D') return 'Draw';
  return 'Final';
}

export interface PresentedResultTeam {
  name: string;
  score: number | null;
  logo: string | null;
  winner: boolean;
  home: boolean;
}

export function presentResultTeams(match: SheetMatch): [PresentedResultTeam, PresentedResultTeam] {
  const homeWon = match.homeScore !== null
    && match.awayScore !== null
    && match.homeScore > match.awayScore;
  const awayWon = match.homeScore !== null
    && match.awayScore !== null
    && match.awayScore > match.homeScore;

  return [
    {
      name: formatTeamName(match.awayTeam),
      score: match.awayScore,
      logo: teamLogoForName(match.awayTeam),
      winner: awayWon,
      home: false,
    },
    {
      name: `@ ${formatTeamName(match.homeTeam)}`,
      score: match.homeScore,
      logo: teamLogoForName(match.homeTeam),
      winner: homeWon,
      home: true,
    },
  ];
}
