import type { AcscCompetitionSnapshot } from './acscCompetitionTypes';

// Official live slides reviewed October 23; see docs/acsc-soccer-results-20261023.md.
export const ACSC_SOCCER_RESULTS: AcscCompetitionSnapshot = {
  "tournamentId": "acsc-soccer-boys-2026",
  "teamId": "soccer-sma-boys",
  "sport": "Soccer",
  "verifiedAt": "2026-10-23T05:36:21+07:00",
  "sourceUrl": "https://acscconference.com/boys-soccer/",
  "sourceLabel": "Official ACSC pool results, standings and playoff bracket",
  "timeZone": "Asia/Bangkok",
  "summary": "SPH finished third in Pool A with 4 points (1 win, 1 draw, 1 loss). The quarterfinal against Grace is scheduled for October 23 at 08:00 on Field 2.",
  "caveat": "The official sources have not posted quarterfinal scores. SPH’s 15:00 semifinal or placement match still depends on the result against Grace.",
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
      "homeScore": null,
      "awayScore": null,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1",
      "notes": "Result not yet published in the official schedule at this review."
    },
    {
      "id": "acsc-soccer-2026-q2",
      "date": "2026-10-23",
      "time": "08:00",
      "stage": "Quarterfinal Q2",
      "kind": "playoff",
      "home": "GIS",
      "away": "SPH",
      "homeScore": null,
      "awayScore": null,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2",
      "notes": "Result not yet published in the official schedule at this review.",
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
      "homeScore": null,
      "awayScore": null,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1",
      "notes": "Result not yet published in the official schedule at this review."
    },
    {
      "id": "acsc-soccer-2026-q4",
      "date": "2026-10-23",
      "time": "09:30",
      "stage": "Quarterfinal Q4",
      "kind": "playoff",
      "home": "YISS",
      "away": "FAITH",
      "homeScore": null,
      "awayScore": null,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2",
      "notes": "Result not yet published in the official schedule at this review."
    },
    {
      "id": "acsc-soccer-2026-g5",
      "date": "2026-10-23",
      "time": "15:00",
      "stage": "Placement semifinal G5",
      "kind": "playoff",
      "home": "Loser Q1",
      "away": "Loser Q2",
      "homeScore": null,
      "awayScore": null,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1",
      "notes": "Pairing depends on the quarterfinal results."
    },
    {
      "id": "acsc-soccer-2026-g6",
      "date": "2026-10-23",
      "time": "15:00",
      "stage": "Semifinal G6",
      "kind": "playoff",
      "home": "Winner Q1",
      "away": "Winner Q2",
      "homeScore": null,
      "awayScore": null,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2",
      "notes": "Pairing depends on the quarterfinal results."
    },
    {
      "id": "acsc-soccer-2026-g7",
      "date": "2026-10-23",
      "time": "16:30",
      "stage": "Placement semifinal G7",
      "kind": "playoff",
      "home": "Loser Q3",
      "away": "Loser Q4",
      "homeScore": null,
      "awayScore": null,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1",
      "notes": "Pairing depends on the quarterfinal results."
    },
    {
      "id": "acsc-soccer-2026-g8",
      "date": "2026-10-23",
      "time": "16:30",
      "stage": "Semifinal G8",
      "kind": "playoff",
      "home": "Winner Q3",
      "away": "Winner Q4",
      "homeScore": null,
      "awayScore": null,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2",
      "notes": "Pairing depends on the quarterfinal results."
    },
    {
      "id": "acsc-soccer-2026-g9",
      "date": "2026-10-24",
      "time": "08:00",
      "stage": "5th-place match",
      "kind": "playoff",
      "home": "Winner G5",
      "away": "Winner G7",
      "homeScore": null,
      "awayScore": null,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2",
      "notes": "Pairing depends on Friday’s playoff results."
    },
    {
      "id": "acsc-soccer-2026-g10",
      "date": "2026-10-24",
      "time": "08:00",
      "stage": "7th-place match",
      "kind": "playoff",
      "home": "Loser G5",
      "away": "Loser G7",
      "homeScore": null,
      "awayScore": null,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1",
      "notes": "Pairing depends on Friday’s playoff results."
    },
    {
      "id": "acsc-soccer-2026-g11",
      "date": "2026-10-24",
      "time": "09:30",
      "stage": "3rd-place match",
      "kind": "playoff",
      "home": "Loser G6",
      "away": "Loser G8",
      "homeScore": null,
      "awayScore": null,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 1",
      "notes": "Pairing depends on Friday’s playoff results."
    },
    {
      "id": "acsc-soccer-2026-final",
      "date": "2026-10-24",
      "time": "09:30",
      "stage": "Final",
      "kind": "playoff",
      "home": "Winner G6",
      "away": "Winner G8",
      "homeScore": null,
      "awayScore": null,
      "venue": "Grace International School, Chiang Mai, Thailand · Field 2",
      "notes": "Pairing depends on Friday’s playoff results."
    }
  ]
};
