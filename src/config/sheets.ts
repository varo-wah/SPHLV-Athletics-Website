export const SHEET_URLS = {
  soccerMatches:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHaYs7n4UH_LqQPwGlDJzBlO8LQP0VXvX-l4uB-jvj_240jNrtBZmaXohGj5j7rg/pub?gid=154179347&single=true&output=csv",

  soccerStandings:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHaYs7n4UH_LqQPwGlDJzBlO8LQP0VXvX-l4uB-jvj_240jNrtBZmaXohGj5j7rg/pub?gid=730352135&single=true&output=csv",

  basketballMatches:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHaYs7n4UH_LqQPwGlDJzBlO8LQP0VXvX-l4uB-jvj_240jNrtBZmaXohGj5j7rg/pub?gid=800029411&single=true&output=csv",

  basketballStandings: "PASTE_BASKETBALL_STANDINGS_CSV_LINK_HERE",
};

export function hasValidSheetUrl(url: string): boolean {
  return Boolean(url) && !url.startsWith("PASTE_") && url.includes("output=csv");
}
