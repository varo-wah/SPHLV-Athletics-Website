import { useEffect, useState } from "react";
import { SHEET_URLS } from "../config/sheets";
import { fetchCsvRows } from "../services/googleSheets";
import {
  PageConfig,
  Standing,
  parsePageConfig,
  parseStandings,
} from "../services/parsers";

interface AthleticsData {
  pages: PageConfig[];
  soccerStandings: Standing[];
}

interface AthleticsDataState {
  data: AthleticsData;
  loading: boolean;
  error: string | null;
}

const EMPTY_DATA: AthleticsData = {
  pages: [],
  soccerStandings: [],
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

        const [pageConfigRows, soccerStandingRows] = await Promise.all([
          fetchCsvRows(SHEET_URLS.pageConfig),
          fetchCsvRows(SHEET_URLS.soccerStandings),
        ]);

        const data: AthleticsData = {
          pages: parsePageConfig(pageConfigRows),
          soccerStandings: parseStandings(soccerStandingRows, "Soccer"),
        };

        if (!cancelled) {
          setState({
            data,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error(error);

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
