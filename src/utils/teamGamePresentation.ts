import { TEAM_ASSETS } from '../data';
import { SheetMatch } from '../services/parsers';

const TEAM_LOGO_ALIASES: Array<{ pattern: RegExp; logo: string }> = [
  { pattern: /^(?:lv|sph|sphlv|sekolahpelitaharapan)$/, logo: TEAM_ASSETS.sph },
  { pattern: /^(?:gjs|globaljayaschool)$/, logo: TEAM_ASSETS.icsbk },
  { pattern: /^(?:jis|jakartainterculturalschool)$/, logo: TEAM_ASSETS.icshk },
  { pattern: /^(?:bsj|britishschooljakarta)$/, logo: TEAM_ASSETS.fa },
  { pattern: /^acs$/, logo: TEAM_ASSETS.yiss },
  { pattern: /^acg$/, logo: TEAM_ASSETS.gis },
  { pattern: /^(?:stl|santalaurensia)$/, logo: TEAM_ASSETS.dalat },
  { pattern: /^ais$/, logo: TEAM_ASSETS.mac },
];

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
  if (!value) return null;
  const normalized = normalizedTeamKey(value);
  return TEAM_LOGO_ALIASES.find(({ pattern }) => pattern.test(normalized))?.logo || null;
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
