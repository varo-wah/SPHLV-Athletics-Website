export const SHEET_URLS = {
  soccerMatches:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHaYs7n4UH_LqQPwGlDJzBlO8LQP0VXvX-l4uB-jvj_240jNrtBZmaXohGj5j7rg/pub?gid=154179347&single=true&output=csv",

  soccerStandings:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHaYs7n4UH_LqQPwGlDJzBlO8LQP0VXvX-l4uB-jvj_240jNrtBZmaXohGj5j7rg/pub?gid=730352135&single=true&output=csv",

  basketballMatches: "",

  basketballStandings: "",
};

export const MASTER_SCHEDULE_URLS = [
  {
    season: "Season 1",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQN3pbSoFSwKAOPx4ifplCAWQP6GYR1Hav_lIiVGI8WUQz7QlVWkx9CxXETFT2Opg/pub?gid=391829670&single=true&output=csv",
  },
  {
    season: "Season 2",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQN3pbSoFSwKAOPx4ifplCAWQP6GYR1Hav_lIiVGI8WUQz7QlVWkx9CxXETFT2Opg/pub?gid=221072207&single=true&output=csv",
  },
  {
    season: "Season 3",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQN3pbSoFSwKAOPx4ifplCAWQP6GYR1Hav_lIiVGI8WUQz7QlVWkx9CxXETFT2Opg/pub?gid=1926756358&single=true&output=csv",
  },
  {
    season: "Season 4",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQN3pbSoFSwKAOPx4ifplCAWQP6GYR1Hav_lIiVGI8WUQz7QlVWkx9CxXETFT2Opg/pub?gid=619430022&single=true&output=csv",
  },
];

export function hasValidSheetUrl(url: string): boolean {
  return (
    Boolean(url) &&
    !url.startsWith("PASTE_") &&
    url.startsWith("https://docs.google.com/spreadsheets/") &&
    url.includes("output=csv")
  );
}
