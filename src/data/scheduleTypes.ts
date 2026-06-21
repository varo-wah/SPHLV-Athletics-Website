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
  time?: string | null;
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
