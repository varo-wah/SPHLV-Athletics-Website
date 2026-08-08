import assert from "node:assert/strict";
import test from "node:test";
import { parseCsv } from "./googleSheets";
import { ResultSourceMetadata, parseResultRows } from "./parsers";

const soccerSource: ResultSourceMetadata = {
  id: "varsity-boys-soccer-results",
  teamId: "soccer-sma-boys",
  displayName: "Varsity Boys Soccer",
  sport: "Soccer",
  sportKey: "Soccer",
  level: "SMA",
  genderGroup: "Boys",
};

test("parseCsv recognizes the seven-column manager result format", () => {
  const rows = parseCsv([
    "SPH LV Varsity Boys Soccer Results,,,,,,",
    "Enter completed matches only,,,,,,",
    ",,,,,,",
    "Date,Time,Location,Home Team,Home Score,Away Team,Away Score",
    "06-Aug-2026,15:30,LV Field,SPH LV,3,JIS,1",
  ].join("\n"));

  assert.equal(rows.length, 1);
  assert.equal(rows[0]["Home Team"], "SPH LV");
  assert.equal(rows[0]["Away Score"], "1");
});

test("parses home, away, draw, and zero-score results relative to SPH LV", () => {
  const parsed = parseResultRows([
    { Date: "06-Aug-2026", Time: "3:30 PM", Location: "LV Field", "Home Team": "SPH LV", "Home Score": "3", "Away Team": "JIS", "Away Score": "1" },
    { Date: "07-Aug-2026", Time: "4:00 PM", Location: "BSJ", "Home Team": "BSJ", "Home Score": "2", "Away Team": "SPH LV", "Away Score": "0" },
    { Date: "2026-08-08", Time: "", Location: "", "Home Team": "SPH LV", "Home Score": "0", "Away Team": "ACS", "Away Score": "0" },
  ], soccerSource);

  assert.equal(parsed.invalidRowCount, 0);
  assert.deepEqual(parsed.matches.map((match) => match.result), ["W", "L", "D"]);
  assert.equal(parsed.matches[1].opponent, "BSJ");
  assert.equal(parsed.matches[1].scoreFor, 0);
  assert.equal(parsed.matches[1].scoreAgainst, 2);
  assert.equal(parsed.matches[2].homeScore, 0);
});

test("rejects incomplete, malformed, ambiguous, and invalid-date rows", () => {
  const parsed = parseResultRows([
    { Date: "06-Aug-2026", "Home Team": "SPH LV", "Home Score": "", "Away Team": "JIS", "Away Score": "1" },
    { Date: "06-Aug-2026", "Home Team": "SPH LV", "Home Score": "3-1", "Away Team": "JIS", "Away Score": "1" },
    { Date: "06-Aug-2026", "Home Team": "SPH LV", "Home Score": "1", "Away Team": "SPH-LV", "Away Score": "1" },
    { Date: "08/06/2026", "Home Team": "SPH LV", "Home Score": "1", "Away Team": "JIS", "Away Score": "1" },
    { Date: "06-Aug-2026", "Home Team": "LV", "Home Score": "1", "Away Team": "JIS", "Away Score": "1" },
  ], soccerSource);

  assert.equal(parsed.matches.length, 0);
  assert.equal(parsed.invalidRowCount, 5);
});

test("deduplicates a repeated match and keeps the last valid score", () => {
  const parsed = parseResultRows([
    { Date: "06-Aug-2026", "Home Team": "SPH LV", "Home Score": "1", "Away Team": "JIS", "Away Score": "1" },
    { Date: "06-Aug-2026", "Home Team": "SPH LV", "Home Score": "2", "Away Team": "JIS", "Away Score": "1" },
  ], soccerSource);

  assert.equal(parsed.matches.length, 1);
  assert.equal(parsed.duplicateRowCount, 1);
  assert.equal(parsed.matches[0].homeScore, 2);
  assert.equal(parsed.matches[0].result, "W");
});

test("source metadata isolates otherwise identical team result rows", () => {
  const row = { Date: "06-Aug-2026", "Home Team": "SPH LV", "Home Score": "2", "Away Team": "JIS", "Away Score": "1" };
  const girlsSource: ResultSourceMetadata = {
    ...soccerSource,
    id: "varsity-girls-soccer-results",
    teamId: "soccer-sma-girls",
    displayName: "Varsity Girls Soccer",
    genderGroup: "Girls",
  };

  const boys = parseResultRows([row], soccerSource).matches[0];
  const girls = parseResultRows([row], girlsSource).matches[0];

  assert.notEqual(boys.id, girls.id);
  assert.equal(boys.teamId, "soccer-sma-boys");
  assert.equal(girls.teamId, "soccer-sma-girls");
});
