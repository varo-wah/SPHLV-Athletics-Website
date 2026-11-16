import { DivisionTab, GenderTab, SheetSport, SportTab } from "../types";
import sheetSources from "./sheetSources.json";

export const SHEET_URLS = {
  soccerStandings: sheetSources.standings.soccer,
  soccerBoysStandings: sheetSources.standings.soccerBoys,
  soccerGirlsStandings: sheetSources.standings.soccerGirls,
  basketballStandings: sheetSources.standings.basketball,
};

export interface ResultSheetSource {
  id: string;
  teamId: string;
  displayName: string;
  sport: SheetSport;
  sportKey: SportTab;
  level: DivisionTab;
  genderGroup: GenderTab;
  url: string;
}

const resultUrlOverrides: Record<string, string | undefined> = {
  VITE_RESULTS_VARSITY_BOYS_SOCCER_URL: import.meta.env?.VITE_RESULTS_VARSITY_BOYS_SOCCER_URL,
  VITE_RESULTS_VARSITY_GIRLS_SOCCER_URL: import.meta.env?.VITE_RESULTS_VARSITY_GIRLS_SOCCER_URL,
  VITE_RESULTS_VARSITY_BOYS_VOLLEYBALL_URL: import.meta.env?.VITE_RESULTS_VARSITY_BOYS_VOLLEYBALL_URL,
  VITE_RESULTS_VARSITY_GIRLS_VOLLEYBALL_URL: import.meta.env?.VITE_RESULTS_VARSITY_GIRLS_VOLLEYBALL_URL,
  VITE_RESULTS_SMP_BOYS_BASKETBALL_URL: import.meta.env?.VITE_RESULTS_SMP_BOYS_BASKETBALL_URL,
  VITE_RESULTS_SMP_GIRLS_BASKETBALL_URL: import.meta.env?.VITE_RESULTS_SMP_GIRLS_BASKETBALL_URL,
};

export const RESULT_SHEET_SOURCES: ResultSheetSource[] = sheetSources.results.map((source) => ({
  id: source.id,
  teamId: source.teamId,
  displayName: source.displayName,
  sport: source.sport as SheetSport,
  sportKey: source.sportKey as SportTab,
  level: source.level as DivisionTab,
  genderGroup: source.genderGroup as GenderTab,
  url: resultUrlOverrides[source.envKey] || source.url,
}));

// Reviewed GameDay reports can exist before a team has a connected results sheet.
// These identities are used for merging only, never for remote fetch/status checks.
export const REVIEWED_RESULT_SOURCES = [
  ...RESULT_SHEET_SOURCES,
  { id: 'reviewed-varsity-boys-basketball', teamId: 'basketball-sma-boys',
    displayName: 'Varsity Boys Basketball', sport: 'Basketball' as const,
    sportKey: 'Basketball' as const, level: 'SMA' as const, genderGroup: 'Boys' as const },
];

export const MASTER_SCHEDULE_URLS = sheetSources.masterSchedules;
export const SCHOOL_MASTER_SCHEDULE_URL = 'https://sphacid-my.sharepoint.com/:x:/g/personal/pe-lv_sph_ac_id/IQApbiLW2BKYSriawFHuP4m6Aa6EmT6xX_otnN_PWWLFWpY?e=Tn4JPh';

export function hasValidSheetUrl(url: string): boolean {
  return (
    Boolean(url) &&
    !url.startsWith("PASTE_") &&
    url.startsWith("https://docs.google.com/spreadsheets/") &&
    url.includes("output=csv")
  );
}

export const LEAGUE_STANDING_SOURCES = (['Soccer', 'Volleyball', 'Basketball'] as const).flatMap(sport =>
  (['Boys', 'Girls'] as const).map(gender => ({ sport, gender,
    url: sheetSources.standings[`${sport.toLowerCase()}${gender}` as keyof typeof sheetSources.standings],
  })));

// Official Season 2 workbooks shared by Mark Heil on 17 November 2026.
export const SENIOR_BASKETBALL_WORKBOOK_URL = 'https://docs.google.com/spreadsheets/d/1rno8atR4ZZDrC9tKZzFQm2a4zCRwNcQBz8MBKDiGSNc/edit?usp=sharing';
export const JUNIOR_VOLLEYBALL_WORKBOOK_URL = 'https://docs.google.com/spreadsheets/d/1Vbc2l77a8BtIECvEX1aTjklFZkglQEnUS255LP6dz4g/edit?usp=sharing';
