export const SHEET_URLS = {
  soccerMatches:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHaYs7n4UH_LqQPwGlDJzBlO8LQP0VXvX-l4uB-jvj_240jNrtBZmaXohGj5j7rg/pub?gid=154179347&single=true&output=csv",

  soccerStandings:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHaYs7n4UH_LqQPwGlDJzBlO8LQP0VXvX-l4uB-jvj_240jNrtBZmaXohGj5j7rg/pub?gid=730352135&single=true&output=csv",

  basketballMatches: "",

  basketballStandings: "",
};

export function hasValidSheetUrl(url: string): boolean {
  return (
    Boolean(url) &&
    !url.startsWith("PASTE_") &&
    url.startsWith("https://docs.google.com/spreadsheets/") &&
    url.includes("output=csv")
  );
}
