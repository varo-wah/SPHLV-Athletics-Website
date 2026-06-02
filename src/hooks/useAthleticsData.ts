import { useCallback, useEffect, useRef, useState } from "react";
import { SHEET_URLS } from "../config/sheets";
import { CsvRow, fetchCsvRows } from "../services/googleSheets";
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

  pages: any[];

  soccerMatches: SheetMatch[];
  soccerStandings: Standing[];

  basketballMatches: SheetMatch[];
  basketballStandings: Standing[];
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

  pages: [],

  soccerMatches: [],
  soccerStandings: [],

  basketballMatches: [],
  basketballStandings: [],
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

      const [
        soccerMatchRows,
        soccerStandingRows,
        basketballMatchRows,
        basketballStandingRows,
      ] = await Promise.all([
        fetchCsvRows(SHEET_URLS.soccerMatches),
        fetchCsvRows(SHEET_URLS.soccerStandings),
        fetchCsvRows(SHEET_URLS.basketballMatches),
        fetchCsvRows(SHEET_URLS.basketballStandings),
      ]);

      const soccerMatches = parseMatches(soccerMatchRows, "Soccer");
      const soccerStandings = parseStandings(soccerStandingRows, "Soccer");

      const basketballMatches = parseMatches(basketballMatchRows, "Basketball");
      const basketballStandings = parseStandings(basketballStandingRows, "Basketball");

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

        pages: [],

        soccerMatches,
        soccerStandings,

        basketballMatches,
        basketballStandings,
      };

      console.log("REFRESHED ATHLETICS DATA:", {
        soccerMatches: soccerMatches.length,
        soccerStandings: soccerStandings.length,
        basketballMatches: basketballMatches.length,
        basketballStandings: basketballStandings.length,
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
