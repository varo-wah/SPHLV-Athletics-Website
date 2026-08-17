import assert from "node:assert/strict";
import test from "node:test";
import { parseSheetCachePayload } from "./googleSheets";

test("accepts a valid build-time Sheets cache", () => {
  const payload = parseSheetCachePayload({
    version: 1,
    generatedAt: "2026-08-17T00:00:00.000Z",
    sources: {
      "https://docs.google.com/spreadsheets/example?output=csv": {
        label: "Example",
        csv: "Date,Home Team,Home Score,Away Team,Away Score\n",
      },
    },
  });

  assert.equal(payload.version, 1);
  assert.equal(Object.keys(payload.sources).length, 1);
});

test("rejects malformed cache entries", () => {
  assert.throws(() => parseSheetCachePayload({
    version: 1,
    generatedAt: "2026-08-17T00:00:00.000Z",
    sources: { invalid: { label: "Missing CSV" } },
  }), /Invalid Sheets cache entry/);
});
