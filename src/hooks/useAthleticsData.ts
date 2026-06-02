import { useEffect, useState } from "react";
import { SHEET_URLS } from "../config/sheets";
import { CsvRow, fetchCsvRows } from "../services/googleSheets";
import {
  Standing,
  SheetMatch as SyncedMatch,
  parseMatches,
  parseStandings,
} from "../services/parsers";

export interface AthleticsData {
  standings: Standing[];
  matches: SyncedMatch[];
  rawStandingRows: CsvRow[];
  rawMatchRows: CsvRow[];

  // Backward compatibility
  pages: any[];
  soccerStandings: Standing[];
  soccerMatches: SyncedMatch[];
}

export interface AthleticsDataState {
  data: AthleticsData;
  loading: boolean;
  error: string | null;
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
  const [state, setState] = useState<AthleticsDataState>({
    data: EMPTY_DATA,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setState({
          data: EMPTY_DATA,
          loading: true,
          error: null,
        });

        const [matchRows, standingRows] = await Promise.all([
          fetchCsvRows(SHEET_URLS.soccerMatches),
          fetchCsvRows(SHEET_URLS.soccerStandings),
        ]);

        const matches = parseMatches(matchRows, "Soccer");
        const standings = parseStandings(standingRows, "Soccer");

        console.log("RAW SOCCER MATCH ROWS:", matchRows);
        console.log("PARSED SOCCER MATCHES:", matches);
        console.log("RAW SOCCER STANDING ROWS:", standingRows);
        console.log("PARSED SOCCER STANDINGS:", standings);

        if (!cancelled) {
          setState({
            data: {
              standings,
              matches,
              rawStandingRows: standingRows,
              rawMatchRows: matchRows,
              pages: [],
              soccerStandings: standings,
              soccerMatches: matches,
            },
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error("Google Sheets sync failed:", error);

        if (!cancelled) {
          setState({
            data: EMPTY_DATA,
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to load Google Sheets data",
          });
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
