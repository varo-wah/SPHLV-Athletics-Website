import type { AcscCompetitionSnapshot } from './acscCompetitionTypes';

// Official live slides reviewed October 26; see docs/acsc-soccer-results-20261026.md.
export const ACSC_SOCCER_RESULTS: AcscCompetitionSnapshot = {
  "tournamentId": "acsc-soccer-boys-2026",
  "teamId": "soccer-sma-boys",
  "sport": "Soccer",
  "verifiedAt": "2026-10-26T12:47:41+07:00",
  "sourceUrl": "https://acscconference.com/boys-soccer/",
  "sourceLabel": "Official ACSC results and elimination bracket",
  "timeZone": "Asia/Bangkok",
  "summary": "SPH finished seventh after beating Morrison 2–0 in the placement match. Overall: 2 wins, 1 draw and 3 losses.",
  "caveat": "The fifth-place score conflicts between official slides; championship and third-place scores are not published.",
  "pools": [
    {
      "name": "Pool A",
      "complete": true,
      "rows": [
        {
          "school": "ICS-HK",
          "rank": 1,
          "played": 3,
          "wins": 2,
          "draws": 1,
          "losses": 0,
          "points": 7,
          "forValue": 11,
          "againstValue": 2
        },
        {
          "school": "YISS",
          "rank": 2,
          "played": 3,
          "wins": 1,
          "draws": 2,
          "losses": 0,
          "points": 5,
          "forValue": 6,
          "againstValue": 3
        },
        {
          "school": "SPH",
          "rank": 3,
          "played": 3,
          "wins": 1,
          "draws": 1,
          "losses": 1,
          "points": 4,
          "forValue": 7,
          "againstValue": 9
        },
        {
          "school": "MORRISON",
          "rank": 4,
          "played": 3,
          "wins": 0,
          "draws": 0,
          "losses": 3,
          "points": 0,
          "forValue": 4,
          "againstValue": 14
        }
      ]
    },
    {
      "name": "Pool B",
      "complete": true,
      "rows": [
        {
          "school": "ICS-BKK",
          "rank": 1,
          "played": 3,
          "wins": 2,
          "draws": 1,
          "losses": 0,
          "points": 7,
          "forValue": 13,
          "againstValue": 3
        },
        {
          "school": "GIS",
          "rank": 2,
          "played": 3,
          "wins": 1,
          "draws": 2,
          "losses": 0,
          "points": 5,
          "forValue": 4,
          "againstValue": 3
        },
        {
          "school": "FAITH",
          "rank": 3,
          "played": 3,
          "wins": 1,
          "draws": 0,
          "losses": 2,
          "points": 3,
          "forValue": 3,
          "againstValue": 6
        },
        {
          "school": "DALAT",
          "rank": 4,
          "played": 3,
          "wins": 0,
          "draws": 1,
          "losses": 2,
          "points": 1,
          "forValue": 3,
          "againstValue": 11
        }
      ]
    }
  ],
  "matches": [
    {
      "id": "acsc-soccer-result-2026-10-21-yiss-ics-hk",
      "date": "2026-10-21",
      "time": "08:00",
      "stage": "Pool A",
      "kind": "pool",
      "home": "YISS",
      "away": "ICS-HK",
      "homeScore": 1,
      "awayScore": 1,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1"
    },
    {
      "id": "acsc-soccer-result-2026-10-21-sph-morrison",
      "date": "2026-10-21",
      "time": "08:00",
      "stage": "Pool A",
      "kind": "pool",
      "home": "SPH",
      "away": "MORRISON",
      "homeScore": 5,
      "awayScore": 3,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2",
      "fixtureId": "acsc-soccer-2026-pool-morrison",
      "statLeaders": [
        "Troy — 2 goals",
        "Tobin — 1 goal",
        "Ben — 1 goal",
        "Kenzo Stanley — 1 goal"
      ]
    },
    {
      "id": "acsc-soccer-result-2026-10-21-gis-dalat",
      "date": "2026-10-21",
      "time": "09:30",
      "stage": "Pool B",
      "kind": "pool",
      "home": "GIS",
      "away": "DALAT",
      "homeScore": 1,
      "awayScore": 1,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1"
    },
    {
      "id": "acsc-soccer-result-2026-10-21-ics-bkk-faith",
      "date": "2026-10-21",
      "time": "09:30",
      "stage": "Pool B",
      "kind": "pool",
      "home": "ICS-BKK",
      "away": "FAITH",
      "homeScore": 4,
      "awayScore": 0,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2"
    },
    {
      "id": "acsc-soccer-result-2026-10-21-morrison-yiss",
      "date": "2026-10-21",
      "time": "15:00",
      "stage": "Pool A",
      "kind": "pool",
      "home": "MORRISON",
      "away": "YISS",
      "homeScore": 0,
      "awayScore": 3,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1"
    },
    {
      "id": "acsc-soccer-result-2026-10-21-ics-hk-sph",
      "date": "2026-10-21",
      "time": "15:00",
      "stage": "Pool A",
      "kind": "pool",
      "home": "ICS-HK",
      "away": "SPH",
      "homeScore": 4,
      "awayScore": 0,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2",
      "fixtureId": "acsc-soccer-2026-pool-ics-hk"
    },
    {
      "id": "acsc-soccer-result-2026-10-21-faith-gis",
      "date": "2026-10-21",
      "time": "16:30",
      "stage": "Pool B",
      "kind": "pool",
      "home": "FAITH",
      "away": "GIS",
      "homeScore": 1,
      "awayScore": 2,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1"
    },
    {
      "id": "acsc-soccer-result-2026-10-21-dalat-ics-bkk",
      "date": "2026-10-21",
      "time": "16:30",
      "stage": "Pool B",
      "kind": "pool",
      "home": "DALAT",
      "away": "ICS-BKK",
      "homeScore": 2,
      "awayScore": 8,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2"
    },
    {
      "id": "acsc-soccer-result-2026-10-22-yiss-sph",
      "date": "2026-10-22",
      "time": "15:00",
      "stage": "Pool A",
      "kind": "pool",
      "home": "YISS",
      "away": "SPH",
      "homeScore": 2,
      "awayScore": 2,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1",
      "fixtureId": "acsc-soccer-2026-pool-yiss",
      "statLeaders": [
        "Yusang — 1 goal",
        "Kenzo — 1 goal (name as reported)"
      ]
    },
    {
      "id": "acsc-soccer-result-2026-10-22-morrison-ics-hk",
      "date": "2026-10-22",
      "time": "15:00",
      "stage": "Pool A",
      "kind": "pool",
      "home": "MORRISON",
      "away": "ICS-HK",
      "homeScore": 1,
      "awayScore": 6,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2"
    },
    {
      "id": "acsc-soccer-result-2026-10-22-gis-ics-bkk",
      "date": "2026-10-22",
      "time": "16:30",
      "stage": "Pool B",
      "kind": "pool",
      "home": "GIS",
      "away": "ICS-BKK",
      "homeScore": 1,
      "awayScore": 1,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1"
    },
    {
      "id": "acsc-soccer-result-2026-10-22-faith-dalat",
      "date": "2026-10-22",
      "time": "16:30",
      "stage": "Pool B",
      "kind": "pool",
      "home": "FAITH",
      "away": "DALAT",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2"
    },
    {
      "id": "acsc-soccer-2026-q1",
      "date": "2026-10-23",
      "time": "08:00",
      "stage": "Quarterfinal Q1",
      "kind": "playoff",
      "home": "ICS-HK",
      "away": "DALAT",
      "homeScore": 5,
      "awayScore": 1,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1"
    },
    {
      "id": "acsc-soccer-2026-q2",
      "date": "2026-10-23",
      "time": "08:00",
      "stage": "Quarterfinal Q2",
      "kind": "playoff",
      "home": "GIS",
      "away": "SPH",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2",
      "fixtureId": "acsc-soccer-2026-quarterfinal"
    },
    {
      "id": "acsc-soccer-2026-q3",
      "date": "2026-10-23",
      "time": "09:30",
      "stage": "Quarterfinal Q3",
      "kind": "playoff",
      "home": "ICS-BKK",
      "away": "MORRISON",
      "homeScore": 6,
      "awayScore": 0,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1"
    },
    {
      "id": "acsc-soccer-2026-q4",
      "date": "2026-10-23",
      "time": "09:30",
      "stage": "Quarterfinal Q4",
      "kind": "playoff",
      "home": "YISS",
      "away": "FAITH",
      "homeScore": 1,
      "awayScore": 1,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2",
      "penalties": {
        "homeScore": 2,
        "awayScore": 4
      }
    },
    {
      "id": "acsc-soccer-2026-g5",
      "date": "2026-10-23",
      "time": "15:00",
      "stage": "Placement semifinal G5",
      "kind": "playoff",
      "home": "DALAT",
      "away": "SPH",
      "homeScore": 1,
      "awayScore": 0,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2",
      "fixtureId": "acsc-soccer-2026-semifinal-placement"
    },
    {
      "id": "acsc-soccer-2026-g6",
      "date": "2026-10-23",
      "time": "15:00",
      "stage": "Semifinal G6",
      "kind": "playoff",
      "home": "ICS-HK",
      "away": "GIS",
      "homeScore": 2,
      "awayScore": 2,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1",
      "penalties": {
        "homeScore": 1,
        "awayScore": 3
      }
    },
    {
      "id": "acsc-soccer-2026-g7",
      "date": "2026-10-23",
      "time": "16:30",
      "stage": "Placement semifinal G7",
      "kind": "playoff",
      "home": "MORRISON",
      "away": "YISS",
      "homeScore": 0,
      "awayScore": 3,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2"
    },
    {
      "id": "acsc-soccer-2026-g8",
      "date": "2026-10-23",
      "time": "16:30",
      "stage": "Semifinal G8",
      "kind": "playoff",
      "home": "ICS-BKK",
      "away": "FAITH",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1"
    },
    {
      "id": "acsc-soccer-2026-g9",
      "date": "2026-10-24",
      "time": "08:00",
      "stage": "5th-place match",
      "kind": "playoff",
      "home": "DALAT",
      "away": "YISS",
      "homeScore": null,
      "awayScore": null,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1",
      "notes": "Dalat finished fifth. The official Day 4 schedule shows 4–2; the bracket shows 4–0. The score remains unconfirmed."
    },
    {
      "id": "acsc-soccer-2026-g10",
      "date": "2026-10-24",
      "time": "08:00",
      "stage": "7th-place match",
      "kind": "playoff",
      "home": "SPH",
      "away": "MORRISON",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2",
      "fixtureId": "acsc-soccer-2026-final-placement"
    },
    {
      "id": "acsc-soccer-2026-g11",
      "date": "2026-10-24",
      "time": "09:30",
      "stage": "3rd-place match",
      "kind": "playoff",
      "home": "ICS-HK",
      "away": "FAITH",
      "homeScore": null,
      "awayScore": null,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2",
      "notes": "The official bracket identifies Faith as the third-place winner; the score is not published."
    },
    {
      "id": "acsc-soccer-2026-final",
      "date": "2026-10-24",
      "time": "09:30",
      "stage": "Final",
      "kind": "playoff",
      "home": "GIS",
      "away": "ICS-BKK",
      "homeScore": null,
      "awayScore": null,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1",
      "notes": "The official bracket identifies ICS Bangkok as champion; the final score is not published."
    }
  ],
  "complete": true,
  "finalPlacements": [
    {
      "school": "ICS-BKK",
      "rank": 1
    },
    {
      "school": "GIS",
      "rank": 2
    },
    {
      "school": "FAITH",
      "rank": 3
    },
    {
      "school": "ICS-HK",
      "rank": 4
    },
    {
      "school": "DALAT",
      "rank": 5
    },
    {
      "school": "YISS",
      "rank": 6
    },
    {
      "school": "SPH",
      "rank": 7
    },
    {
      "school": "MORRISON",
      "rank": 8
    }
  ],
  "playerStats": {
    "label": "Reported ACSC player totals",
    "sourceLabel": "Mark Heil · GameDay Summaries · 26 October 2026",
    "reportedAt": "2026-10-26T19:14:00+07:00",
    "players": [
      { "name": "Troy Biantoro", "goals": 4 },
      { "name": "Tobin Soelystio", "goals": 1 },
      { "name": "Kenzo Stanley", "goals": 2 },
      { "name": "Ben Yulianto", "goals": 1 },
      { "name": "Yusang Chon", "goals": 1, "assists": 2 },
      { "name": "Deven", "assists": 1 }
    ]
  },
  "awards": [
    {
      "school": "SPH",
      "label": "All-Tournament Team",
      "recipient": "Solomon Schleper"
    }
  ]
};
