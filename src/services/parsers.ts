import { CsvRow } from "./googleSheets";

export type Sport =
  | "Soccer"
  | "Basketball"
  | "Volleyball"
  | "Badminton"
  | "Track & Field";

export type Level = "SMP" | "SMA";
export type GenderGroup = "Boys" | "Girls" | "Combined";
export type Tournament = "JAAC" | "SPH Cup" | "ACSC" | "Season" | "Other";

export interface PageConfig {
  pageId: string;
  sport: Sport;
  level: Level;
  genderGroup: GenderGroup;
  displayName: string;
  shortName: string;
  active: boolean;
  showJAAC: boolean;
  showSPHCup: boolean;
  showACSC: boolean;
}

export interface Standing {
  id: string;
  pageId: string;
  sport: Sport;
  level: Level;
  genderGroup: GenderGroup;
  tournament: Tournament;
  rank: number | null;
  team: string;
  wins: number | null;
  draws: number | null;
  losses: number | null;
  points: number | null;
  forValue: number | null;
  againstValue: number | null;
  difference: number | null;
  notes: string;
}

function get(row: CsvRow, ...keys: string[]): string {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== "") {
      return row[key].trim();
    }
  }
  return "";
}

function num(value: string): number | null {
  if (!value) return null;
  const parsed = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function bool(value: string): boolean {
  const v = value.toLowerCase().trim();
  return v === "yes" || v === "true" || v === "1" || v === "active";
}

function normalizeSport(value: string): Sport {
  const v = value.toLowerCase();

  if (v.includes("basket")) return "Basketball";
  if (v.includes("volley")) return "Volleyball";
  if (v.includes("badminton")) return "Badminton";
  if (v.includes("track")) return "Track & Field";

  return "Soccer";
}

function normalizeLevel(value: string): Level {
  const v = value.toLowerCase();
  if (v.includes("sma") || v.includes("varsity")) return "SMA";
  return "SMP";
}

function normalizeGender(value: string): GenderGroup {
  const v = value.toLowerCase();
  if (v.includes("girl")) return "Girls";
  if (v.includes("combined") || v.includes("mixed") || v.includes("both")) {
    return "Combined";
  }
  return "Boys";
}

function normalizeTournament(value: string): Tournament {
  const v = value.toLowerCase();

  if (v.includes("jaac")) return "JAAC";
  if (v.includes("sph")) return "SPH Cup";
  if (v.includes("acsc")) return "ACSC";
  if (v.includes("season")) return "Season";

  return "Other";
}

function makePageId(sport: Sport, level: Level, genderGroup: GenderGroup): string {
  return `${level}-${genderGroup}-${sport}`
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function parsePageConfig(rows: CsvRow[]): PageConfig[] {
  return rows.map((row, index) => {
    const sport = normalizeSport(get(row, "Sport"));
    const level = normalizeLevel(get(row, "Level", "Division"));
    const genderGroup = normalizeGender(get(row, "Gender Group", "Gender"));
    const pageId =
      get(row, "Page ID", "PageId", "Team ID", "TeamId") ||
      makePageId(sport, level, genderGroup);

    return {
      pageId,
      sport,
      level,
      genderGroup,
      displayName:
        get(row, "Display Name", "Team Name", "Name") ||
        `${level} ${genderGroup === "Combined" ? "" : genderGroup} ${sport}`
          .replace(/\s+/g, " ")
          .trim(),
      shortName:
        get(row, "Short Name", "Short") ||
        `${level} ${genderGroup}`.replace(/\s+/g, " ").trim(),
      active: get(row, "Active") ? bool(get(row, "Active")) : true,
      showJAAC: bool(get(row, "Show JAAC", "JAAC")),
      showSPHCup: bool(get(row, "Show SPH Cup", "SPH Cup", "Show SPHCup")),
      showACSC: bool(get(row, "Show ACSC", "ACSC")),
    };
  }).filter((page) => page.active);
}

export function parseStandings(rows: CsvRow[], fallbackSport: Sport): Standing[] {
  return rows.map((row, index) => {
    const sport = normalizeSport(get(row, "Sport") || fallbackSport);
    const level = normalizeLevel(get(row, "Level", "Division"));
    const genderGroup = normalizeGender(get(row, "Gender Group", "Gender"));
    const tournament = normalizeTournament(get(row, "Tournament"));

    const pageId =
      get(row, "Page ID", "PageId", "Team ID", "TeamId") ||
      makePageId(sport, level, genderGroup);

    const forValue = num(
      get(row, "For", "Goals For", "GF", "Points For", "PF", "Sets For", "SF")
    );

    const againstValue = num(
      get(row, "Against", "Goals Against", "GA", "Points Against", "PA", "Sets Against", "SA")
    );

    const manualDifference = num(
      get(row, "Difference", "Goal Difference", "GD", "Point Difference", "PD")
    );

    return {
      id: get(row, "Standing ID", "ID") || `${pageId}-standing-${index + 1}`,
      pageId,
      sport,
      level,
      genderGroup,
      tournament,
      rank: num(get(row, "Rank", "#")),
      team: get(row, "Team", "School", "Name") || "TBD",
      wins: num(get(row, "Wins", "W")),
      draws: num(get(row, "Draws", "D")),
      losses: num(get(row, "Losses", "L")),
      points: num(get(row, "Points", "Pts")),
      forValue,
      againstValue,
      difference:
        manualDifference ??
        (forValue !== null && againstValue !== null
          ? forValue - againstValue
          : null),
      notes: get(row, "Notes"),
    };
  }).filter((standing) => standing.team !== "TBD");
}
