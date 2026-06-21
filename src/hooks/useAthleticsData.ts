import { useCallback, useEffect, useRef, useState } from "react";
import { MASTER_SCHEDULE_URLS, SHEET_URLS } from "../config/sheets";
import { CsvRow, fetchCsvMatrix, fetchCsvRows } from "../services/googleSheets";
import { ScheduleEvent } from "../data/scheduleTypes";
import { parseMasterScheduleSeason } from "../services/masterScheduleParser";
import {
  Standing,
  SheetMatch,
  parseMatches,
  parseStandings,
} from "../services/parsers";

export interface AthleticsData {
  standings: Standing[];
  matches: SheetMatch[];

  rawSoccerMatchRows: CsvRow[];
  rawSoccerStandingRows: CsvRow[];
  rawBasketballMatchRows: CsvRow[];
  rawBasketballStandingRows: CsvRow[];
  rawMasterScheduleRows: string[][][];
  masterScheduleErrorCount: number;

  pages: any[];

  soccerMatches: SheetMatch[];
  soccerStandings: Standing[];

  basketballMatches: SheetMatch[];
  basketballStandings: Standing[];

  masterScheduleEvents: ScheduleEvent[];
}

export interface AthleticsDataState {
  data: AthleticsData;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
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

  pages: [],

  soccerMatches: [],
  soccerStandings: [],

  basketballMatches: [],
  basketballStandings: [],

  masterScheduleEvents: [],
};

export function useAthleticsData(): AthleticsDataState {
  const [data, setData] = useState<AthleticsData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const hasLoadedOnce = useRef(false);

  const refresh = useCallback(async () => {
    try {
      if (!hasLoadedOnce.current) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError(null);

      const masterScheduleResultsPromise = Promise.all(
        MASTER_SCHEDULE_URLS.map(async (sheet) => {
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
        soccerMatchRows,
        soccerStandingRows,
        basketballMatchRows,
        basketballStandingRows,
        masterScheduleResults,
      ] = await Promise.all([
        fetchCsvRows(SHEET_URLS.soccerMatches),
        fetchCsvRows(SHEET_URLS.soccerStandings),
        fetchCsvRows(SHEET_URLS.basketballMatches),
        fetchCsvRows(SHEET_URLS.basketballStandings),
        masterScheduleResultsPromise,
      ]);

      const soccerMatches = parseMatches(soccerMatchRows, "Soccer");
      const soccerStandings = parseStandings(soccerStandingRows, "Soccer");

      const basketballMatches = parseMatches(basketballMatchRows, "Basketball");
      const basketballStandings = parseStandings(basketballStandingRows, "Basketball");
      const masterScheduleEvents = masterScheduleResults.flatMap((result) => {
        return parseMasterScheduleSeason(result.season, result.matrix);
      });
      const masterScheduleErrorCount = masterScheduleResults.filter((result) => result.failed).length;

      const matches = [
        ...soccerMatches,
        ...basketballMatches,
      ];

      const standings = [
        ...soccerStandings,
        ...basketballStandings,
      ];

      const nextData: AthleticsData = {
        standings,
        matches,

        rawSoccerMatchRows: soccerMatchRows,
        rawSoccerStandingRows: soccerStandingRows,
        rawBasketballMatchRows: basketballMatchRows,
        rawBasketballStandingRows: basketballStandingRows,
        rawMasterScheduleRows: masterScheduleResults.map((result) => result.matrix),
        masterScheduleErrorCount,

        pages: [],

        soccerMatches,
        soccerStandings,

        basketballMatches,
        basketballStandings,

        masterScheduleEvents,
      };

      console.log("REFRESHED ATHLETICS DATA:", {
        soccerMatches: soccerMatches.length,
        soccerStandings: soccerStandings.length,
        basketballMatches: basketballMatches.length,
        basketballStandings: basketballStandings.length,
        masterScheduleEvents: masterScheduleEvents.length,
        masterScheduleErrorCount,
        allMatches: matches.length,
        allStandings: standings.length,
        updatedAt: new Date().toLocaleTimeString(),
      });

      setData(nextData);
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
    }, 20000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [refresh]);

  return {
    data,
    loading,
    refreshing,
    error,
    lastUpdated,
    refresh,
  };
}
