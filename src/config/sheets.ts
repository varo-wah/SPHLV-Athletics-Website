import { DivisionTab, GenderTab, SheetSport, SportTab } from "../types";
import sheetSources from "./sheetSources.json";

export const SHEET_URLS = {
  soccerStandings: sheetSources.standings.soccer,
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

export const MASTER_SCHEDULE_URLS = sheetSources.masterSchedules;

export function hasValidSheetUrl(url: string): boolean {
  return (
    Boolean(url) &&
    !url.startsWith("PASTE_") &&
    url.startsWith("https://docs.google.com/spreadsheets/") &&
    url.includes("output=csv")
  );
}
