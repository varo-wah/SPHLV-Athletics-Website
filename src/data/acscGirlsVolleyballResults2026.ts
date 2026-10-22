import type { AcscCompetitionSnapshot } from './acscCompetitionTypes';

/** Verified against all 56 reciprocal pool cells and the official seeded bracket. */
export const ACSC_GIRLS_VOLLEYBALL_RESULTS: AcscCompetitionSnapshot = {
  "tournamentId": "acsc-volleyball-girls-2026",
  "teamId": "volleyball-sma-girls",
  "sport": "Volleyball",
  "verifiedAt": "2026-10-22T22:38:24.393396+00:00",
  "sourceUrl": "https://docs.google.com/presentation/d/e/2PACX-1vSLWBGWjob-QNBz7M9DLfXW0MOLF1jZMnP5IlPTKyaBJOkjjWqFWVLqCGz9KLupzGa8MBATe_J9x_BC/pub?start=false&loop=false&delayms=3000",
  "sourceLabel": "Official ACSC girls volleyball round-robin results",
  "timeZone": "Asia/Bangkok",
  "summary": "SPH finished the round robin in seventh place (2–5). The quarterfinal is against Morrison on October 23 at 18:00, Court 1.",
  "caveat": "Round-robin results are complete. Playoff results are not yet confirmed; semifinal and placement opponents remain conditional.",
  "pools": [
    {
      "name": "Round robin",
      "complete": true,
      "rows": [
        {
          "school": "ICS-BKK",
          "rank": 1,
          "played": 7,
          "wins": 7,
          "losses": 0,
          "forValue": 14,
          "againstValue": 2
        },
        {
          "school": "MORRISON",
          "rank": 2,
          "played": 7,
          "wins": 6,
          "losses": 1,
          "forValue": 12,
          "againstValue": 4
        },
        {
          "school": "YISS",
          "rank": 3,
          "played": 7,
          "wins": 4,
          "losses": 3,
          "forValue": 11,
          "againstValue": 7
        },
        {
          "school": "DALAT",
          "rank": 4,
          "played": 7,
          "wins": 4,
          "losses": 3,
          "forValue": 10,
          "againstValue": 6
        },
        {
          "school": "ICS-HK",
          "rank": 5,
          "played": 7,
          "wins": 3,
          "losses": 4,
          "forValue": 6,
          "againstValue": 10
        },
        {
          "school": "FAITH",
          "rank": 6,
          "played": 7,
          "wins": 2,
          "losses": 5,
          "forValue": 4,
          "againstValue": 11
        },
        {
          "school": "SPH",
          "rank": 7,
          "played": 7,
          "wins": 2,
          "losses": 5,
          "forValue": 5,
          "againstValue": 11
        },
        {
          "school": "GIS",
          "rank": 8,
          "played": 7,
          "wins": 0,
          "losses": 7,
          "forValue": 3,
          "againstValue": 14
        }
      ]
    }
  ],
  "matches": [
    {
      "id": "acsc-girls-volleyball-2026-2026-10-21-ics-bkk-ics-hk",
      "date": "2026-10-21",
      "time": "08:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "ICS-BKK",
      "away": "ICS-HK",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "setScores": [
        "25-10",
        "25-11"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-21-dalat-sph",
      "date": "2026-10-21",
      "time": "08:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "DALAT",
      "away": "SPH",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "fixtureId": "acsc-volleyball-girls-2026-round-robin-dalat",
      "setScores": [
        "25-14",
        "25-22"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-21-faith-morrison",
      "date": "2026-10-21",
      "time": "09:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "FAITH",
      "away": "MORRISON",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "setScores": [
        "16-25",
        "10-25"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-21-gis-yiss",
      "date": "2026-10-21",
      "time": "09:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "GIS",
      "away": "YISS",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "setScores": [
        "4-25",
        "4-25"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-21-dalat-ics-bkk",
      "date": "2026-10-21",
      "time": "10:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "DALAT",
      "away": "ICS-BKK",
      "homeScore": 1,
      "awayScore": 2,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "setScores": [
        "26-24",
        "16-25",
        "8-15"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-21-sph-ics-hk",
      "date": "2026-10-21",
      "time": "10:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "SPH",
      "away": "ICS-HK",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "fixtureId": "acsc-volleyball-girls-2026-round-robin-ics-hk",
      "setScores": [
        "25-21",
        "25-19"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-21-gis-morrison",
      "date": "2026-10-21",
      "time": "11:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "GIS",
      "away": "MORRISON",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "setScores": [
        "12-25",
        "12-25"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-21-yiss-faith",
      "date": "2026-10-21",
      "time": "11:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "YISS",
      "away": "FAITH",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "setScores": [
        "25-12",
        "25-8"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-21-ics-bkk-sph",
      "date": "2026-10-21",
      "time": "14:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "ICS-BKK",
      "away": "SPH",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "fixtureId": "acsc-volleyball-girls-2026-round-robin-ics-bkk",
      "setScores": [
        "25-12",
        "25-17"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-21-ics-hk-dalat",
      "date": "2026-10-21",
      "time": "14:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "ICS-HK",
      "away": "DALAT",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "setScores": [
        "21-25",
        "23-25"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-21-morrison-yiss",
      "date": "2026-10-21",
      "time": "15:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "MORRISON",
      "away": "YISS",
      "homeScore": 2,
      "awayScore": 1,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "setScores": [
        "24-26",
        "25-18",
        "15-9"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-21-gis-faith",
      "date": "2026-10-21",
      "time": "15:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "GIS",
      "away": "FAITH",
      "homeScore": 1,
      "awayScore": 2,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "setScores": [
        "25-22",
        "25-27",
        "12-15"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-22-gis-ics-bkk",
      "date": "2026-10-22",
      "time": "08:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "GIS",
      "away": "ICS-BKK",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "setScores": [
        "10-25",
        "13-25"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-22-sph-yiss",
      "date": "2026-10-22",
      "time": "08:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "SPH",
      "away": "YISS",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "fixtureId": "acsc-volleyball-girls-2026-round-robin-yiss",
      "setScores": [
        "10-25",
        "17-25"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-22-dalat-faith",
      "date": "2026-10-22",
      "time": "09:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "DALAT",
      "away": "FAITH",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "notes": "Dalat won 2–0. The official matrix disagrees on one first-set point (25–14 or 25–15), so individual set scores are withheld."
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-22-ics-hk-morrison",
      "date": "2026-10-22",
      "time": "09:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "ICS-HK",
      "away": "MORRISON",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "setScores": [
        "19-25",
        "21-25"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-22-yiss-ics-bkk",
      "date": "2026-10-22",
      "time": "10:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "YISS",
      "away": "ICS-BKK",
      "homeScore": 1,
      "awayScore": 2,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "setScores": [
        "20-25",
        "25-20",
        "11-15"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-22-gis-sph",
      "date": "2026-10-22",
      "time": "10:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "GIS",
      "away": "SPH",
      "homeScore": 1,
      "awayScore": 2,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "fixtureId": "acsc-volleyball-girls-2026-round-robin-grace",
      "setScores": [
        "15-25",
        "25-23",
        "13-15"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-22-faith-ics-hk",
      "date": "2026-10-22",
      "time": "11:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "FAITH",
      "away": "ICS-HK",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "setScores": [
        "22-25",
        "20-25"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-22-morrison-dalat",
      "date": "2026-10-22",
      "time": "11:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "MORRISON",
      "away": "DALAT",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "setScores": [
        "25-17",
        "25-23"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-22-yiss-dalat",
      "date": "2026-10-22",
      "time": "13:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "YISS",
      "away": "DALAT",
      "homeScore": 2,
      "awayScore": 1,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "setScores": [
        "25-16",
        "22-25",
        "15-5"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-22-gis-ics-hk",
      "date": "2026-10-22",
      "time": "13:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "GIS",
      "away": "ICS-HK",
      "homeScore": 1,
      "awayScore": 2,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "setScores": [
        "27-25",
        "23-25",
        "8-15"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-22-morrison-ics-bkk",
      "date": "2026-10-22",
      "time": "14:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "MORRISON",
      "away": "ICS-BKK",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "setScores": [
        "21-25",
        "20-25"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-22-faith-sph",
      "date": "2026-10-22",
      "time": "14:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "FAITH",
      "away": "SPH",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "fixtureId": "acsc-volleyball-girls-2026-round-robin-faith",
      "setScores": [
        "25-20",
        "25-19"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-22-ics-hk-yiss",
      "date": "2026-10-22",
      "time": "15:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "ICS-HK",
      "away": "YISS",
      "homeScore": 2,
      "awayScore": 1,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "setScores": [
        "15-25",
        "26-24",
        "15-11"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-22-gis-dalat",
      "date": "2026-10-22",
      "time": "15:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "GIS",
      "away": "DALAT",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "setScores": [
        "9-25",
        "8-25"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-22-ics-bkk-faith",
      "date": "2026-10-22",
      "time": "16:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "ICS-BKK",
      "away": "FAITH",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "setScores": [
        "25-19",
        "25-14"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-2026-10-22-sph-morrison",
      "date": "2026-10-22",
      "time": "16:30",
      "stage": "Round robin",
      "kind": "pool",
      "home": "SPH",
      "away": "MORRISON",
      "homeScore": 1,
      "awayScore": 2,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "fixtureId": "acsc-volleyball-girls-2026-round-robin-morrison",
      "setScores": [
        "12-25",
        "25-23",
        "9-15"
      ]
    },
    {
      "id": "acsc-girls-volleyball-2026-g1",
      "date": "2026-10-23",
      "time": "15:00",
      "stage": "Quarterfinal · G1",
      "kind": "playoff",
      "home": "ICS-BKK",
      "away": "GIS",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Community School, Bangkok, Thailand · Court 1"
    },
    {
      "id": "acsc-girls-volleyball-2026-g2",
      "date": "2026-10-23",
      "time": "15:00",
      "stage": "Quarterfinal · G2",
      "kind": "playoff",
      "home": "DALAT",
      "away": "ICS-HK",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Community School, Bangkok, Thailand · Court 2"
    },
    {
      "id": "acsc-girls-volleyball-2026-g3",
      "date": "2026-10-23",
      "time": "18:00",
      "stage": "Quarterfinal · G3",
      "kind": "playoff",
      "home": "MORRISON",
      "away": "SPH",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "fixtureId": "acsc-volleyball-girls-2026-quarterfinal"
    },
    {
      "id": "acsc-girls-volleyball-2026-g4",
      "date": "2026-10-23",
      "time": "18:00",
      "stage": "Quarterfinal · G4",
      "kind": "playoff",
      "home": "YISS",
      "away": "FAITH",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Community School, Bangkok, Thailand · Court 2"
    },
    {
      "id": "acsc-girls-volleyball-2026-g5",
      "date": "2026-10-24",
      "time": "08:00",
      "stage": "Consolation · G5",
      "kind": "playoff",
      "home": "Loser G1",
      "away": "Loser G2",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "notes": "Participants depend on earlier playoff results. Times are Bangkok local (UTC+7), the same as Jakarta."
    },
    {
      "id": "acsc-girls-volleyball-2026-g6",
      "date": "2026-10-24",
      "time": "08:00",
      "stage": "Consolation · G6",
      "kind": "playoff",
      "home": "Loser G3",
      "away": "Loser G4",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "notes": "Participants depend on earlier playoff results. Times are Bangkok local (UTC+7), the same as Jakarta."
    },
    {
      "id": "acsc-girls-volleyball-2026-g7",
      "date": "2026-10-24",
      "time": "09:30",
      "stage": "Semifinal · G7",
      "kind": "playoff",
      "home": "Winner G1",
      "away": "Winner G2",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "notes": "Participants depend on earlier playoff results. Times are Bangkok local (UTC+7), the same as Jakarta."
    },
    {
      "id": "acsc-girls-volleyball-2026-g8",
      "date": "2026-10-24",
      "time": "09:30",
      "stage": "Semifinal · G8",
      "kind": "playoff",
      "home": "Winner G3",
      "away": "Winner G4",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "notes": "Participants depend on earlier playoff results. Times are Bangkok local (UTC+7), the same as Jakarta."
    },
    {
      "id": "acsc-girls-volleyball-2026-g9",
      "date": "2026-10-24",
      "time": "12:00",
      "stage": "5th/6th place · G9",
      "kind": "playoff",
      "home": "Winner G5",
      "away": "Winner G6",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "notes": "Participants depend on earlier playoff results. Times are Bangkok local (UTC+7), the same as Jakarta."
    },
    {
      "id": "acsc-girls-volleyball-2026-g10",
      "date": "2026-10-24",
      "time": "12:00",
      "stage": "7th/8th place · G10",
      "kind": "playoff",
      "home": "Loser G5",
      "away": "Loser G6",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "notes": "Participants depend on earlier playoff results. Times are Bangkok local (UTC+7), the same as Jakarta."
    },
    {
      "id": "acsc-girls-volleyball-2026-g11",
      "date": "2026-10-24",
      "time": "13:30",
      "stage": "Championship · G11",
      "kind": "playoff",
      "home": "Winner G7",
      "away": "Winner G8",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Community School, Bangkok, Thailand · Court 1",
      "notes": "Participants depend on earlier playoff results. Times are Bangkok local (UTC+7), the same as Jakarta."
    },
    {
      "id": "acsc-girls-volleyball-2026-g12",
      "date": "2026-10-24",
      "time": "13:30",
      "stage": "3rd/4th place · G12",
      "kind": "playoff",
      "home": "Loser G7",
      "away": "Loser G8",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Community School, Bangkok, Thailand · Court 2",
      "notes": "Participants depend on earlier playoff results. Times are Bangkok local (UTC+7), the same as Jakarta."
    }
  ]
};
