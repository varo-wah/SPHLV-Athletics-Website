import { DivisionTab, GenderTab, SheetSport, SportTab } from "../types";

export const SHEET_URLS = {
  soccerStandings:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHaYs7n4UH_LqQPwGlDJzBlO8LQP0VXvX-l4uB-jvj_240jNrtBZmaXohGj5j7rg/pub?gid=730352135&single=true&output=csv",
  basketballStandings: "",
};

export interface ResultSheetSource {
  id: string;
  teamId: string;
  displayName: string;
  sport: SheetSport;
  sportKey: SportTab;
  level: DivisionTab;
  genderGroup: GenderTab;
  url: string;
}

export const RESULT_SHEET_SOURCES: ResultSheetSource[] = [
  {
    id: "varsity-boys-soccer-results",
    teamId: "soccer-sma-boys",
    displayName: "Varsity Boys Soccer",
    sport: "Soccer",
    sportKey: "Soccer",
    level: "SMA",
    genderGroup: "Boys",
    url:
      import.meta.env?.VITE_RESULTS_VARSITY_BOYS_SOCCER_URL ||
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0jh3cOOnVhd9sg5pncQj13lSfUGwgrMcLlIfpPiQDrQsuPcS47f8wudp2Qw07-PspFB2zhycRizS5/pub?gid=112607129&single=true&output=csv",
  },
  {
    id: "varsity-girls-soccer-results",
    teamId: "soccer-sma-girls",
    displayName: "Varsity Girls Soccer",
    sport: "Soccer",
    sportKey: "Soccer",
    level: "SMA",
    genderGroup: "Girls",
    url:
      import.meta.env?.VITE_RESULTS_VARSITY_GIRLS_SOCCER_URL ||
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTUV3YgK_ldw2OVJBXd0f4-VmYft-ehEUJy_TKTD-ixqp1SNvmMICI2ocBCv6xitW5zK8YE3jYYx7u3/pub?gid=9663500&single=true&output=csv",
  },
  {
    id: "varsity-boys-volleyball-results",
    teamId: "volleyball-sma-boys",
    displayName: "Varsity Boys Volleyball",
    sport: "Volleyball",
    sportKey: "Volleyball",
    level: "SMA",
    genderGroup: "Boys",
    url:
      import.meta.env?.VITE_RESULTS_VARSITY_BOYS_VOLLEYBALL_URL ||
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQrsC426ef6aL_NfCXxLDsyefD10nr1-O9CIRO7NmJcmDYoLvg2QQiM_eQBGpHmhJiDf10YiK7WC0Ka/pub?gid=509668703&single=true&output=csv",
  },
  {
    id: "varsity-girls-volleyball-results",
    teamId: "volleyball-sma-girls",
    displayName: "Varsity Girls Volleyball",
    sport: "Volleyball",
    sportKey: "Volleyball",
    level: "SMA",
    genderGroup: "Girls",
    url:
      import.meta.env?.VITE_RESULTS_VARSITY_GIRLS_VOLLEYBALL_URL ||
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQjXdbnF2g-pXwAsfi2JNN2xe_j257g5UXupRUVPWNfcKbfABM-Xe9BivT-g-CqlTzxw8BxKi5LfFR_/pub?gid=128005016&single=true&output=csv",
  },
  {
    id: "smp-boys-basketball-results",
    teamId: "basketball-smp-boys",
    displayName: "SMP Boys Basketball",
    sport: "Basketball",
    sportKey: "Basketball",
    level: "SMP",
    genderGroup: "Boys",
    url:
      import.meta.env?.VITE_RESULTS_SMP_BOYS_BASKETBALL_URL ||
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJIYHg_IjXk6RtIWOnzu_BJIFH_vJwbmtqhKfMdeLG_eXbebGyXmCs1RO3O_7SDFf58ssujGoVYFQO/pub?gid=101753695&single=true&output=csv",
  },
  {
    id: "smp-girls-basketball-results",
    teamId: "basketball-smp-girls",
    displayName: "SMP Girls Basketball",
    sport: "Basketball",
    sportKey: "Basketball",
    level: "SMP",
    genderGroup: "Girls",
    url:
      import.meta.env?.VITE_RESULTS_SMP_GIRLS_BASKETBALL_URL ||
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vR-VujFtPTda8EIyfCYBx6WcaJmVl6Whxehi7mT-rQacVhyp6FHS0ftzZYi4nY58Q5pnURN447k3VPL/pub?gid=1684291518&single=true&output=csv",
  },
];

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
