export const SHEET_URLS = {
  pageConfig:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHaYs7n4UH_LqQPwGlDJzBlO8LQP0VXvX-l4uB-jvj_240jNrtBZmaXohGj5j7rg/pub?gid=154179347&single=true&output=csv",

  soccerMatches: "PASTE_SOCCER_MATCHES_CSV_LINK_HERE",

  soccerStandings:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHaYs7n4UH_LqQPwGlDJzBlO8LQP0VXvX-l4uB-jvj_240jNrtBZmaXohGj5j7rg/pub?gid=730352135&single=true&output=csv",

  basketballMatches: "PASTE_BASKETBALL_MATCHES_CSV_LINK_HERE",
  basketballStandings: "PASTE_BASKETBALL_STANDINGS_CSV_LINK_HERE",

  volleyballMatches: "PASTE_VOLLEYBALL_MATCHES_CSV_LINK_HERE",
  volleyballStandings: "PASTE_VOLLEYBALL_STANDINGS_CSV_LINK_HERE",

  badmintonMatches: "PASTE_BADMINTON_MATCHES_CSV_LINK_HERE",
  badmintonStandings: "PASTE_BADMINTON_STANDINGS_CSV_LINK_HERE",

  trackResults: "PASTE_TRACKFIELD_RESULTS_CSV_LINK_HERE",
  trackTeamScores: "PASTE_TRACKFIELD_TEAMSCORES_CSV_LINK_HERE",
};

export function hasValidSheetUrl(url: string): boolean {
  return Boolean(url) && !url.startsWith("PASTE_") && url.includes("output=csv");
}
