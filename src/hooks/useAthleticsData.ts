import { useCallback, useEffect, useRef, useState } from "react";
import {
  MASTER_SCHEDULE_URLS,
  RESULT_SHEET_SOURCES,
  SHEET_URLS,
  hasValidSheetUrl,
} from "../config/sheets";
import {
  CsvRow,
  fetchCsvMatrix,
  fetchCsvRows,
  parseCsvMatrix,
} from "../services/googleSheets";
import { ScheduleEvent } from "../data/scheduleTypes";
import seasonOneMasterScheduleCsv from "../data/master-schedule-season-1.csv?raw";
import { parseMasterScheduleSeason } from "../services/masterScheduleParser";
import {
  Standing,
  SheetMatch,
  parseResultRows,
  parseStandings,
} from "../services/parsers";
import { loadResultFeeds } from "../services/resultFeeds";

export interface ResultSourceState {
  sourceId: string;
  teamId: string;
  displayName: string;
  configured: boolean;
  failed: boolean;
  fromCache: boolean;
  invalidRowCount: number;
  duplicateRowCount: number;
}

export interface AthleticsData {
  standings: Standing[];
  matches: SheetMatch[];

  rawSoccerMatchRows: CsvRow[];
  rawSoccerStandingRows: CsvRow[];
  rawBasketballMatchRows: CsvRow[];
  rawBasketballStandingRows: CsvRow[];
  rawMasterScheduleRows: string[][][];
  masterScheduleErrorCount: number;
  resultSourceStates: ResultSourceState[];
  resultsErrorCount: number;
  invalidResultRowCount: number;
  duplicateResultRowCount: number;

  pages: unknown[];

  soccerMatches: SheetMatch[];
  soccerStandings: Standing[];

  basketballMatches: SheetMatch[];
  basketballStandings: Standing[];

  volleyballMatches: SheetMatch[];
  masterScheduleEvents: ScheduleEvent[];
}

export interface AthleticsDataState {
  data: AthleticsData;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  warning: string | null;
  lastUpdated: string | null;
  refresh: () => Promise<void>;
}

const EMPTY_DATA: AthleticsData = {
  standings: [],
  matches: [],

  rawSoccerMatchRows: [],
  rawSoccerStandingRows: [],
  rawBasketballMatchRows: [],
  rawBasketballStandingRows: [],
  rawMasterScheduleRows: [],
  masterScheduleErrorCount: 0,
  resultSourceStates: RESULT_SHEET_SOURCES.map((source) => ({
    sourceId: source.id,
    teamId: source.teamId,
    displayName: source.displayName,
    configured: hasValidSheetUrl(source.url),
    failed: false,
    fromCache: false,
    invalidRowCount: 0,
    duplicateRowCount: 0,
  })),
  resultsErrorCount: 0,
  invalidResultRowCount: 0,
  duplicateResultRowCount: 0,

  pages: [],

  soccerMatches: [],
  soccerStandings: [],

  basketballMatches: [],
  basketballStandings: [],

  volleyballMatches: [],
  masterScheduleEvents: [],
};

async function fetchRowsSafely(url: string, label: string) {
  if (!hasValidSheetUrl(url)) {
    return { rows: [] as CsvRow[], failed: false };
  }

  try {
    return { rows: await fetchCsvRows(url), failed: false };
  } catch (error) {
    console.warn(`${label} sync failed:`, error);
    return { rows: [] as CsvRow[], failed: true };
  }
}

export function useAthleticsData(): AthleticsDataState {
  const [data, setData] = useState<AthleticsData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const hasLoadedOnce = useRef(false);
  const resultRowsCache = useRef(new Map<string, CsvRow[]>());

  const refresh = useCallback(async () => {
    try {
      if (!hasLoadedOnce.current) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError(null);
      setWarning(null);

      const configuredResultSources = RESULT_SHEET_SOURCES.filter((source) => (
        hasValidSheetUrl(source.url)
      ));

      const masterScheduleResultsPromise = Promise.all(
        MASTER_SCHEDULE_URLS.map(async (sheet) => {
          if (sheet.season === "Season 1") {
            return {
              season: sheet.season,
              matrix: parseCsvMatrix(seasonOneMasterScheduleCsv),
              failed: false,
            };
          }

          try {
            return {
              season: sheet.season,
              matrix: await fetchCsvMatrix(sheet.url),
              failed: false,
            };
          } catch (error) {
            console.warn(`Master schedule sync failed for ${sheet.season}:`, error);
            return {
              season: sheet.season,
              matrix: [] as string[][],
              failed: true,
            };
          }
        })
      );

      const [
        loadedResultFeeds,
        soccerStandingFeed,
        basketballStandingFeed,
        masterScheduleResults,
      ] = await Promise.all([
        loadResultFeeds(configuredResultSources, fetchCsvRows, resultRowsCache.current),
        fetchRowsSafely(SHEET_URLS.soccerStandings, "Soccer standings"),
        fetchRowsSafely(SHEET_URLS.basketballStandings, "Basketball standings"),
        masterScheduleResultsPromise,
      ]);

      const parsedBySource = new Map(
        loadedResultFeeds.map((feed) => [
          feed.source.id,
          parseResultRows(feed.rows, feed.source),
        ])
      );

      const matches = loadedResultFeeds.flatMap((feed) => (
        parsedBySource.get(feed.source.id)?.matches ?? []
      ));
      const soccerMatches = matches.filter((match) => match.sportKey === "Soccer");
      const basketballMatches = matches.filter((match) => match.sportKey === "Basketball");
      const volleyballMatches = matches.filter((match) => match.sportKey === "Volleyball");

      const soccerStandings = parseStandings(soccerStandingFeed.rows, "Soccer");
      const basketballStandings = parseStandings(
        basketballStandingFeed.rows,
        "Basketball"
      );
      const standings = [...soccerStandings, ...basketballStandings];

      const masterScheduleEvents = masterScheduleResults.flatMap((result) => (
        parseMasterScheduleSeason(result.season, result.matrix)
      ));
      const masterScheduleErrorCount = masterScheduleResults.filter((result) => result.failed).length;
      const loadedFeedById = new Map(loadedResultFeeds.map((feed) => [feed.source.id, feed]));
      const resultSourceStates = RESULT_SHEET_SOURCES.map((source) => {
        const feed = loadedFeedById.get(source.id);
        const parsed = parsedBySource.get(source.id);
        return {
          sourceId: source.id,
          teamId: source.teamId,
          displayName: source.displayName,
          configured: hasValidSheetUrl(source.url),
          failed: feed?.failed ?? false,
          fromCache: feed?.fromCache ?? false,
          invalidRowCount: parsed?.invalidRowCount ?? 0,
          duplicateRowCount: parsed?.duplicateRowCount ?? 0,
        };
      });

      const resultsErrorCount = resultSourceStates.filter((source) => source.failed).length;
      const invalidResultRowCount = resultSourceStates.reduce(
        (total, source) => total + source.invalidRowCount,
        0
      );
      const duplicateResultRowCount = resultSourceStates.reduce(
        (total, source) => total + source.duplicateRowCount,
        0
      );
      const unconfiguredResultCount = resultSourceStates.filter((source) => !source.configured).length;

      const warningParts: string[] = [];
      if (unconfiguredResultCount > 0) {
        warningParts.push(`${unconfiguredResultCount} result sheet${unconfiguredResultCount === 1 ? " is" : "s are"} awaiting publication.`);
      }
      if (resultsErrorCount > 0) {
        warningParts.push(`${resultsErrorCount} result feed${resultsErrorCount === 1 ? "" : "s"} failed; cached data is shown where available.`);
      }
      if (invalidResultRowCount > 0) {
        warningParts.push(`${invalidResultRowCount} invalid result row${invalidResultRowCount === 1 ? " was" : "s were"} ignored.`);
      }
      if (masterScheduleErrorCount > 0) {
        warningParts.push(`${masterScheduleErrorCount} master schedule season${masterScheduleErrorCount === 1 ? "" : "s"} failed to sync.`);
      }
      if (soccerStandingFeed.failed || basketballStandingFeed.failed) {
        warningParts.push("One or more standings feeds failed to sync.");
      }

      const rawSoccerMatchRows = loadedResultFeeds
        .filter((feed) => feed.source.sportKey === "Soccer")
        .flatMap((feed) => feed.rows);
      const rawBasketballMatchRows = loadedResultFeeds
        .filter((feed) => feed.source.sportKey === "Basketball")
        .flatMap((feed) => feed.rows);

      const nextData: AthleticsData = {
        standings,
        matches,

        rawSoccerMatchRows,
        rawSoccerStandingRows: soccerStandingFeed.rows,
        rawBasketballMatchRows,
        rawBasketballStandingRows: basketballStandingFeed.rows,
        rawMasterScheduleRows: masterScheduleResults.map((result) => result.matrix),
        masterScheduleErrorCount,
        resultSourceStates,
        resultsErrorCount,
        invalidResultRowCount,
        duplicateResultRowCount,

        pages: [],

        soccerMatches,
        soccerStandings,

        basketballMatches,
        basketballStandings,

        volleyballMatches,
        masterScheduleEvents,
      };

      console.log("REFRESHED ATHLETICS DATA:", {
        matches: matches.length,
        configuredResultSources: configuredResultSources.length,
        resultsErrorCount,
        invalidResultRowCount,
        soccerStandings: soccerStandings.length,
        basketballStandings: basketballStandings.length,
        masterScheduleEvents: masterScheduleEvents.length,
        masterScheduleErrorCount,
        updatedAt: new Date().toLocaleTimeString(),
      });

      setData(nextData);
      setWarning(warningParts.length > 0 ? warningParts.join(" ") : null);
      setLastUpdated(new Date().toLocaleTimeString());
      hasLoadedOnce.current = true;
    } catch (err) {
      console.error("Google Sheets sync failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load Google Sheets data"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const intervalId = window.setInterval(() => {
      refresh();
    }, 60000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [refresh]);

  return {
    data,
    loading,
    refreshing,
    error,
    warning,
    lastUpdated,
    refresh,
  };
}
