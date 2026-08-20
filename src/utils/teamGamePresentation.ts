import { jaacSchoolForName } from '../data/jaacSchools';
import { SheetMatch } from '../services/parsers';

function normalizedTeamKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function isSphLvTeam(value: string) {
  return /^(?:lv|sph|sphlv|sekolahpelitaharapan)$/.test(normalizedTeamKey(value));
}

const SPORT_ICONS: Record<SheetMatch['sportKey'], string> = {
  Soccer: '⚽️',
  Volleyball: '🏐',
  Basketball: '🏀',
  Badminton: '🏸',
  TrackAndField: '🏃',
};

export function sphResultTeamLabel(match: SheetMatch) {
  const division = match.level === 'SMA' ? 'V' : match.level;
  const gender = match.genderGroup === 'Combined' ? 'Mixed' : match.genderGroup;
  return `${SPORT_ICONS[match.sportKey]} ${division} ${gender}`;
}

export function formatTeamName(value: string) {
  return isSphLvTeam(value)
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
  sourceName: string;
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
  const ourTeamLabel = sphResultTeamLabel(match);
  const awayName = isSphLvTeam(match.awayTeam) ? ourTeamLabel : formatTeamName(match.awayTeam);
  const homeName = isSphLvTeam(match.homeTeam) ? ourTeamLabel : formatTeamName(match.homeTeam);

  return [
    {
      name: awayName,
      sourceName: match.awayTeam,
      score: match.awayScore,
      logo: teamLogoForName(match.awayTeam),
      winner: awayWon,
      home: false,
    },
    {
      name: `@ ${homeName}`,
      sourceName: match.homeTeam,
      score: match.homeScore,
      logo: teamLogoForName(match.homeTeam),
      winner: homeWon,
      home: true,
    },
  ];
}
