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
  rawStandingRows: CsvRow[];
  rawMatchRows: CsvRow[];

  pages: any[];
  soccerStandings: Standing[];
  soccerMatches: SheetMatch[];
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
  rawStandingRows: [],
  rawMatchRows: [],
  pages: [],
  soccerStandings: [],
  soccerMatches: [],
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

      const [matchRows, standingRows] = await Promise.all([
        fetchCsvRows(SHEET_URLS.soccerMatches),
        fetchCsvRows(SHEET_URLS.soccerStandings),
      ]);

      const matches = parseMatches(matchRows, "Soccer");
      const standings = parseStandings(standingRows, "Soccer");

      const nextData: AthleticsData = {
        standings,
        matches,
        rawStandingRows: standingRows,
        rawMatchRows: matchRows,
        pages: [],
        soccerStandings: standings,
        soccerMatches: matches,
      };

      console.log("REFRESHED GOOGLE SHEETS DATA:", {
        rawMatchRows: matchRows.length,
        parsedMatches: matches.length,
        rawStandingRows: standingRows.length,
        parsedStandings: standings.length,
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
