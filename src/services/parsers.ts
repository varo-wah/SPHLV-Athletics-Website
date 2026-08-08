import { CsvRow } from "./googleSheets";
import {
  DivisionTab,
  GenderTab,
  MatchResult,
  MatchStatus,
  SheetSport,
  SportTab,
  TournamentTab,
} from "../types";

export interface PageConfig {
  pageId: string;
  sport: SheetSport;
  sportKey: SportTab;
  level: DivisionTab;
  genderGroup: GenderTab;
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
  sport: SheetSport;
  sportKey: SportTab;
  level: DivisionTab;
  genderGroup: GenderTab;
  tournament: TournamentTab;
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

export interface SheetMatch {
  id: string;
  sourceId: string;
  teamId: string;
  pageId: string;
  sport: SheetSport;
  sportKey: SportTab;
  level: DivisionTab;
  genderGroup: GenderTab;
  tournament: TournamentTab;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  opponent: string;
  locationType: "Home" | "Away" | "Neutral" | "TBD" | "";
  venue: string;
  status: MatchStatus;
  result: MatchResult;
  homeScore: number | null;
  awayScore: number | null;
  scoreFor: number | null;
  scoreAgainst: number | null;
  notes: string;

  set1For: number | null;
  set1Against: number | null;
  set2For: number | null;
  set2Against: number | null;
  set3For: number | null;
  set3Against: number | null;
}

export interface ResultSourceMetadata {
  id: string;
  teamId: string;
  displayName: string;
  sport: SheetSport;
  sportKey: SportTab;
  level: DivisionTab;
  genderGroup: GenderTab;
}

export interface ParsedResultRows {
  matches: SheetMatch[];
  invalidRowCount: number;
  duplicateRowCount: number;
}

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function get(row: CsvRow, ...keys: string[]): string {
  const actualKeys = Object.keys(row);

  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key].trim() !== "") {
      return row[key].trim();
    }
  }

  for (const targetKey of keys) {
    const normalizedTarget = normalizeKey(targetKey);

    const actualKey = actualKeys.find((key) => {
      return normalizeKey(key) === normalizedTarget;
    });

    if (
      actualKey &&
      row[actualKey] !== undefined &&
      row[actualKey] !== null &&
      row[actualKey].trim() !== ""
    ) {
      return row[actualKey].trim();
    }
  }

  return "";
}

function num(value: string): number | null {
  if (!value || value.trim() === "") {
    return null;
  }

  const cleaned = value.replace(/[^\d.-]/g, "");

  if (!cleaned) {
    return null;
  }

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function bool(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v === "yes" || v === "true" || v === "1" || v === "active" || v === "y";
}

function normalizeSport(value: string): SheetSport {
  const v = value.trim().toLowerCase();

  if (v.includes("basket")) return "Basketball";
  if (v.includes("volley")) return "Volleyball";
  if (v.includes("badminton")) return "Badminton";
  if (v.includes("track")) return "Track & Field";

  return "Soccer";
}

export function sportToKey(sport: SheetSport): SportTab {
  return sport === "Track & Field" ? "TrackAndField" : sport;
}

function normalizeLevel(value: string): DivisionTab {
  const v = value.trim().toLowerCase();

  if (v.includes("smp") || v.includes("middle") || v.includes("junior")) {
    return "SMP";
  }

  return "SMA";
}

function normalizeGender(value: string): GenderTab {
  const v = value.trim().toLowerCase();

  if (v.includes("girl")) return "Girls";
  if (v.includes("combined") || v.includes("mixed") || v.includes("both")) return "Combined";

  return "Boys";
}

function normalizeTournament(value: string): TournamentTab {
  const v = value.trim().toLowerCase();

  if (v.includes("jaac")) return "JAAC";
  if (v.includes("sph")) return "SPH Cup";
  if (v.includes("acsc")) return "ACSC";
  if (v.includes("season") || v.includes("league")) return "Season";

  return "Other";
}

function normalizeStatus(value: string, hasScore = false): MatchStatus {
  const v = value.trim().toLowerCase();

  if (v.includes("live")) return "Live";
  if (v.includes("finish") || v.includes("done") || v.includes("complete")) return "Finished";
  if (v.includes("postpone") || v.includes("cancel")) return "Postponed";
  if (hasScore) return "Finished";

  return "Upcoming";
}

function normalizeResult(value: string): MatchResult {
  const v = value.trim().toLowerCase();

  if (v === "w" || v === "win" || v === "won") return "W";
  if (v === "l" || v === "loss" || v === "lost") return "L";
  if (v === "d" || v === "draw" || v === "tie" || v === "t") return "D";

  return "";
}

function normalizeLocation(value: string): SheetMatch["locationType"] {
  const v = value.trim().toLowerCase();

  if (v.includes("home")) return "Home";
  if (v.includes("away")) return "Away";
  if (v.includes("neutral")) return "Neutral";
  if (v.includes("tbd")) return "TBD";

  return "";
}

function makePageId(
  sport: SheetSport,
  level: DivisionTab,
  genderGroup: GenderTab
): string {
  return `${level}-${genderGroup}-${sport}`
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const RESULT_MONTHS: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

function isoDate(year: number, month: number, day: number): string | null {
  const value = new Date(year, month - 1, day);
  if (
    value.getFullYear() !== year ||
    value.getMonth() !== month - 1 ||
    value.getDate() !== day
  ) {
    return null;
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function normalizeResultDate(value: string): string | null {
  const cleaned = value.trim();
  if (!cleaned) return null;

  const isoMatch = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    return isoDate(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3]));
  }

  const namedMonthMatch = cleaned.match(/^(\d{1,2})[-\s]([A-Za-z]{3,9})[-\s](\d{4})$/);
  if (namedMonthMatch) {
    const month = RESULT_MONTHS[namedMonthMatch[2].toLowerCase()];
    return month
      ? isoDate(Number(namedMonthMatch[3]), month, Number(namedMonthMatch[1]))
      : null;
  }

  return null;
}

function strictScore(value: string): number | null {
  const cleaned = value.trim();
  if (!/^\d{1,3}$/.test(cleaned)) return null;

  const parsed = Number(cleaned);
  return parsed >= 0 && parsed <= 999 ? parsed : null;
}

function normalizedTeamName(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isSphLvTeam(value: string): boolean {
  return normalizedTeamName(value) === "sphlv";
}

function resultFor(scoreFor: number, scoreAgainst: number): MatchResult {
  if (scoreFor > scoreAgainst) return "W";
  if (scoreFor < scoreAgainst) return "L";
  return "D";
}

export function parseResultRows(
  rows: CsvRow[],
  source: ResultSourceMetadata
): ParsedResultRows {
  const matchesByKey = new Map<string, SheetMatch>();
  let invalidRowCount = 0;
  let duplicateRowCount = 0;

  rows.forEach((row) => {
    const date = normalizeResultDate(get(row, "Date"));
    const time = get(row, "Time");
    const venue = get(row, "Location");
    const homeTeam = get(row, "Home Team");
    const awayTeam = get(row, "Away Team");
    const homeScore = strictScore(get(row, "Home Score"));
    const awayScore = strictScore(get(row, "Away Score"));
    const homeIsSphLv = isSphLvTeam(homeTeam);
    const awayIsSphLv = isSphLvTeam(awayTeam);

    const valid =
      date !== null &&
      homeTeam !== "" &&
      awayTeam !== "" &&
      normalizedTeamName(homeTeam) !== normalizedTeamName(awayTeam) &&
      homeScore !== null &&
      awayScore !== null &&
      homeIsSphLv !== awayIsSphLv;

    if (!valid) {
      invalidRowCount += 1;
      return;
    }

    const scoreFor = homeIsSphLv ? homeScore : awayScore;
    const scoreAgainst = homeIsSphLv ? awayScore : homeScore;
    const opponent = homeIsSphLv ? awayTeam : homeTeam;
    const matchKey = [
      source.id,
      date,
      normalizedTeamName(homeTeam),
      normalizedTeamName(awayTeam),
    ].join("-");

    if (matchesByKey.has(matchKey)) {
      duplicateRowCount += 1;
    }

    matchesByKey.set(matchKey, {
      id: matchKey,
      sourceId: source.id,
      teamId: source.teamId,
      pageId: source.teamId,
      sport: source.sport,
      sportKey: source.sportKey,
      level: source.level,
      genderGroup: source.genderGroup,
      tournament: "Other",
      date,
      time,
      homeTeam,
      awayTeam,
      opponent,
      locationType: homeIsSphLv ? "Home" : "Away",
      venue,
      status: "Finished",
      result: resultFor(scoreFor, scoreAgainst),
      homeScore,
      awayScore,
      scoreFor,
      scoreAgainst,
      notes: "",
      set1For: null,
      set1Against: null,
      set2For: null,
      set2Against: null,
      set3For: null,
      set3Against: null,
    });
  });

  return {
    matches: [...matchesByKey.values()],
    invalidRowCount,
    duplicateRowCount,
  };
}

export function parsePageConfig(rows: CsvRow[]): PageConfig[] {
  return rows
    .map((row) => {
      const sport = normalizeSport(get(row, "Sport"));
      const level = normalizeLevel(get(row, "Level", "Division"));
      const genderGroup = normalizeGender(get(row, "Gender Group", "Gender", "Group"));
      const pageId =
        get(row, "Page ID", "PageId", "Team ID", "TeamId", "TeamID") ||
        makePageId(sport, level, genderGroup);

      return {
        pageId,
        sport,
        sportKey: sportToKey(sport),
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
    })
    .filter((page) => page.active);
}

export function parseStandings(rows: CsvRow[], fallbackSport: SheetSport): Standing[] {
  return rows
    .map((row, index) => {
      const sport = normalizeSport(get(row, "Sport") || fallbackSport);
      const level = normalizeLevel(get(row, "Level", "Division"));
      const genderGroup = normalizeGender(get(row, "Gender Group", "Gender", "Group"));
      const tournament = normalizeTournament(get(row, "Tournament", "League", "Competition"));
      const pageId =
        get(row, "Page ID", "PageId", "Team ID", "TeamId", "TeamID") ||
        makePageId(sport, level, genderGroup);

      const wins = num(get(row, "Wins", "Win", "W", "Won"));
      const draws = num(get(row, "Draws", "Draw", "D", "Ties", "Tie", "T"));
      const losses = num(get(row, "Losses", "Loss", "L", "Lost"));

      const forValue = num(
        get(row, "For", "Goals For", "GF", "Points For", "PF", "Score For")
      );

      const againstValue = num(
        get(row, "Against", "Goals Against", "GA", "Points Against", "PA", "Score Against")
      );

      const manualDifference = num(
        get(row, "Difference", "Goal Difference", "GD", "Point Difference", "PD")
      );

      return {
        id: get(row, "Standing ID", "StandingId", "ID") || `${pageId}-standing-${index + 1}`,
        pageId,
        sport,
        sportKey: sportToKey(sport),
        level,
        genderGroup,
        tournament,
        rank: num(get(row, "Rank", "#", "Position", "No", "No.")) ?? index + 1,
        team: get(row, "Team", "School", "Name", "TEAM", "School Name") || "TBD",
        wins,
        draws,
        losses,
        points:
          num(get(row, "Points", "Pts", "PCT", "PT", "Total Points")) ??
          (wins !== null && draws !== null ? wins * 3 + draws : null),
        forValue,
        againstValue,
        difference:
          manualDifference ??
          (forValue !== null && againstValue !== null ? forValue - againstValue : null),
        notes: get(row, "Notes"),
      };
    })
    .filter((standing) => standing.team !== "TBD");
}

export function parseMatches(rows: CsvRow[], fallbackSport: SheetSport): SheetMatch[] {
  return rows
    .map((row, index) => {
      const sport = normalizeSport(get(row, "Sport") || fallbackSport);
      const level = normalizeLevel(get(row, "Level", "Division"));
      const genderGroup = normalizeGender(get(row, "Gender Group", "Gender", "Group"));

      const pageId =
        get(row, "Page ID", "PageId", "Team ID", "TeamId", "TeamID") ||
        makePageId(sport, level, genderGroup);

      const scoreFor = num(
        get(
          row,
          "LV Goals",
          "LV Points",
          "LV Score",
          "Score For",
          "Goals For",
          "Points For",
          "PF",
          "For",
          "Home Score"
        )
      );

      const scoreAgainst = num(
        get(
          row,
          "Opponent Goals",
          "Opponent Points",
          "Opponent Score",
          "Score Against",
          "Goals Against",
          "Points Against",
          "PA",
          "Against",
          "Away Score"
        )
      );

      const hasScore = scoreFor !== null && scoreAgainst !== null;
      const result = normalizeResult(get(row, "Result", "Outcome"));

      const locationType = normalizeLocation(get(row, "Location Type", "Location", "Home/Away"));
      const opponent = get(row, "Opponent", "Against", "Opponent Team", "Team", "School") || "TBD";
      const homeTeam = locationType === "Away" ? opponent : "SPH LV";
      const awayTeam = locationType === "Away" ? "SPH LV" : opponent;

      return {
        id: get(row, "Match ID", "MatchId", "ID") || `${pageId}-match-${index + 1}`,
        sourceId: "legacy-match-feed",
        teamId: pageId,
        pageId,
        sport,
        sportKey: sportToKey(sport),
        level,
        genderGroup,
        tournament: normalizeTournament(get(row, "Tournament", "League", "Competition")),
        date: get(row, "Date", "Match Date"),
        time: get(row, "Time", "Match Time"),
        homeTeam,
        awayTeam,
        opponent,
        locationType,
        venue: get(row, "Venue / Field", "Venue / Court", "Venue", "Place", "Field", "Court", "Gym"),
        status: normalizeStatus(get(row, "Status"), hasScore),
        result,
        homeScore: locationType === "Away" ? scoreAgainst : scoreFor,
        awayScore: locationType === "Away" ? scoreFor : scoreAgainst,
        scoreFor,
        scoreAgainst,
        notes: get(row, "Notes"),

        set1For: num(get(row, "Set 1 For", "Set1 For")),
        set1Against: num(get(row, "Set 1 Against", "Set1 Against")),
        set2For: num(get(row, "Set 2 For", "Set2 For")),
        set2Against: num(get(row, "Set 2 Against", "Set2 Against")),
        set3For: num(get(row, "Set 3 For", "Set3 For")),
        set3Against: num(get(row, "Set 3 Against", "Set3Against")),
      };
    })
    .filter((match) => match.id && match.opponent !== "TBD");
}
