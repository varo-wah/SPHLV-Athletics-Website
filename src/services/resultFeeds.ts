import { ResultSheetSource } from "../config/sheets";
import { CsvRow } from "./googleSheets";

export interface LoadedResultFeed {
  source: ResultSheetSource;
  rows: CsvRow[];
  failed: boolean;
  fromCache: boolean;
}

export async function loadResultFeeds(
  sources: ResultSheetSource[],
  fetchRows: (url: string) => Promise<CsvRow[]>,
  cache: Map<string, CsvRow[]>
): Promise<LoadedResultFeed[]> {
  return Promise.all(
    sources.map(async (source) => {
      try {
        const rows = await fetchRows(source.url);
        cache.set(source.id, rows);
        return { source, rows, failed: false, fromCache: false };
      } catch (error) {
        console.warn(`Results sync failed for ${source.displayName}:`, error);
        const cachedRows = cache.get(source.id) ?? [];
        return {
          source,
          rows: cachedRows,
          failed: true,
          fromCache: cachedRows.length > 0,
        };
      }
    })
  );
}
