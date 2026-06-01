export interface Player {
  id: string;
  name: string;
  grade: string;
  jersey: string;
  position: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  accent: string;
  country?: string;
  roster?: Player[];
  photo?: string;
  rosterImage?: string;
}

export type MatchStage = 'APR-7' | 'APR-8' | 'APR-9' | 'APR-10' | 'APR-11';
export type AppTab = 'Home' | 'Schedule' | 'News' | 'ACSC' | 'TeamPage' | 'Teams';
export type SportTab = 'Basketball' | 'Volleyball' | 'Soccer' | 'Badminton' | 'TrackAndField' | 'Swimming';
export type DivisionTab = 'SMP' | 'Varsity';
export type GenderTab = 'Boys' | 'Girls';
export type MatchStatus = 'Upcoming' | 'Live' | 'Finished';

export interface TournamentEvent {
  id: string;
  type: 'event';
  title: string;
  date: string;
  displayDate: string;
  time: string;
  groupDate: string;
  stage: MatchStage;
  venue?: string;
}

export interface Match {
  id: string;
  type?: 'match';
  homeTeam?: Team;
  awayTeam?: Team;
  homeTeamPlaceholder?: string;
  awayTeamPlaceholder?: string;
  date: string;
  displayDate: string;
  time: string;
  groupDate: string;
  stage: MatchStage;
  status: MatchStatus;
  venue?: string;
  competitionLabel?: string;
  homeScore?: number;
  awayScore?: number;
  aggregateText?: string;
  minuteText?: string;
  featured?: boolean;
}

export type ScheduleItem = Match | TournamentEvent;

export interface BracketMatch {
  id: string;
  homeTeam?: Team;
  awayTeam?: Team;
  homeTeamPlaceholder?: string;
  awayTeamPlaceholder?: string;
  homeScore?: number;
  awayScore?: number;
  aggregateText?: string;
  dateLabel?: string;
  winnerId?: string;
}

export interface BracketRound {
  id: string;
  title: string;
  matches: BracketMatch[];
}
