import type { AcscSchoolCode } from './acscSchools';

export interface AcscPoolRow {
  school: AcscSchoolCode;
  rank: number | null;
  played: number;
  wins: number;
  draws?: number;
  losses: number;
  points?: number;
  forValue?: number;
  againstValue?: number;
}

export interface AcscCompetitionMatch {
  id: string;
  /** Existing SPH schedule ID, where one is already published. */
  fixtureId?: string;
  date: string;
  time: string | null;
  stage: string;
  kind: 'pool' | 'playoff';
  /** A school code or an explicit conditional bracket label. */
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  venue?: string;
  notes?: string;
  /** Set points in home-team order, only when verified. */
  setScores?: string[];
  /** SPH-specific scorers, only when verified. */
  statLeaders?: string[];
  /** Shootout score, separate from the regulation score. */
  penalties?: { homeScore: number; awayScore: number };
}

export interface AcscCompetitionSnapshot {
  tournamentId: string;
  teamId: string;
  sport: 'Soccer' | 'Volleyball';
  verifiedAt: string;
  sourceUrl: string;
  sourceLabel: string;
  timeZone: 'Asia/Bangkok' | 'Asia/Hong_Kong';
  summary: string;
  caveat?: string;
  /** The tournament has concluded; missing scores remain unreported, never inferred. */
  complete?: boolean;
  finalPlacements?: { school: AcscSchoolCode; rank: number }[];
  awards?: { school: AcscSchoolCode; label: string; recipient?: string }[];
  pools: { name: string; complete: boolean; rows: AcscPoolRow[] }[];
  matches: AcscCompetitionMatch[];
}
