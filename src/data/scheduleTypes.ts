export type ScheduleEventType =
  | 'Practice'
  | 'Home Game'
  | 'Away Game'
  | 'Tournament'
  | 'Holiday'
  | 'Other';

export interface ScheduleEvent {
  id: string;
  season: string;
  week: string | null;
  date: string | null;
  day: string | null;
  team: string;
  sportKey?: import('../types').SportTab;
  sport?: import('../types').SheetSport;
  level?: import('../types').DivisionTab;
  genderGroup?: import('../types').GenderTab;
  eventText: string;
  eventType: ScheduleEventType;
  location?: string | null;
  opponent?: string | null;
  /** A multi-school session whose individual fixtures have not been published. */
  pairingsPending?: boolean;
  time?: string | null;
  timeZone?: string;
  details?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  tournamentId?: string;
  status?: 'Scheduled' | 'Finished';
  /** SPH score first, for verified completed tournament fixtures. */
  resultScore?: string;
  raw: string;
}

export interface ScheduleData {
  sourceFile: string;
  generatedAt: string;
  seasons: string[];
  eventTypes: ScheduleEventType[];
  events: ScheduleEvent[];
  warnings: string[];
}
