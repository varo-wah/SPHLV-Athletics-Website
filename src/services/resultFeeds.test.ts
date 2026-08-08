import assert from "node:assert/strict";
import test from "node:test";
import { ResultSheetSource } from "../config/sheets";
import { CsvRow } from "./googleSheets";
import { loadResultFeeds } from "./resultFeeds";

const sources: ResultSheetSource[] = [
  {
    id: "source-a",
    teamId: "soccer-sma-boys",
    displayName: "Varsity Boys Soccer",
    sport: "Soccer",
    sportKey: "Soccer",
    level: "SMA",
    genderGroup: "Boys",
    url: "https://docs.google.com/spreadsheets/a?output=csv",
  },
  {
    id: "source-b",
    teamId: "soccer-sma-girls",
    displayName: "Varsity Girls Soccer",
    sport: "Soccer",
    sportKey: "Soccer",
    level: "SMA",
    genderGroup: "Girls",
    url: "https://docs.google.com/spreadsheets/b?output=csv",
  },
];

test("one failed result feed preserves cached rows without suppressing healthy feeds", async () => {
  const cachedRows: CsvRow[] = [{ Date: "05-Aug-2026" }];
  const freshRows: CsvRow[] = [{ Date: "06-Aug-2026" }];
  const cache = new Map<string, CsvRow[]>([["source-b", cachedRows]]);

  const loaded = await loadResultFeeds(
    sources,
    async (url) => {
      if (url.includes("/b?")) throw new Error("temporary failure");
      return freshRows;
    },
    cache
  );

  assert.deepEqual(loaded[0].rows, freshRows);
  assert.equal(loaded[0].failed, false);
  assert.equal(loaded[1].failed, true);
  assert.equal(loaded[1].fromCache, true);
  assert.deepEqual(loaded[1].rows, cachedRows);
});
