import type { AcscCompetitionSnapshot } from './acscCompetitionTypes';

/** Official final placements and rankings; unreported or conflicting scores stay null. */
export const ACSC_BOYS_VOLLEYBALL_RESULTS: AcscCompetitionSnapshot = {
  "tournamentId": "acsc-volleyball-boys-2026",
  "teamId": "volleyball-sma-boys",
  "sport": "Volleyball",
  "verifiedAt": "2026-10-26T12:48:07+07:00",
  "sourceUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT7sCekOMtJPrF8ylZKbmAfD89OFTOTzrwckWCtLgivIz_rVqaXzBVkgBHe4eiCfoh_rEC5z8zGMmiS/pub?start=false&loop=false&delayms=3000",
  "sourceLabel": "Official ACSC boys volleyball results and awards",
  "timeZone": "Asia/Hong_Kong",
  "summary": "SPH finished seventh at ACSC boys volleyball. Paul Schleper was named to the All-Tournament team.",
  "caveat": "Final placements and round-robin rankings are official. The Grace–Dalat pool score conflicts with the final standings and is withheld. Unpublished playoff scores and disputed historical times remain unconfirmed.",
  "pools": [
    {
      "name": "Final round-robin rankings",
      "complete": false,
      "rows": [
        {
          "school": "FAITH",
          "rank": 1,
          "played": 6,
          "wins": 6,
          "losses": 0,
          "points": 18
        },
        {
          "school": "YISS",
          "rank": 2,
          "played": 6,
          "wins": 5,
          "losses": 1,
          "points": 15
        },
        {
          "school": "DALAT",
          "rank": 3,
          "played": 6,
          "wins": 4,
          "losses": 2,
          "points": 12
        },
        {
          "school": "GIS",
          "rank": 4,
          "played": 6,
          "wins": 3,
          "losses": 3,
          "points": 9
        },
        {
          "school": "ICS-HK",
          "rank": 5,
          "played": 6,
          "wins": 2,
          "losses": 4,
          "points": 6
        },
        {
          "school": "ICS-BKK",
          "rank": 6,
          "played": 6,
          "wins": 1,
          "losses": 5,
          "points": 3
        },
        {
          "school": "SPH",
          "rank": 7,
          "played": 6,
          "wins": 0,
          "losses": 6,
          "points": 0
        }
      ]
    }
  ],
  "matches": [
    {
      "id": "acsc-bvb-2026-pool-ics-hk-faith",
      "date": "2026-10-21",
      "time": "09:00",
      "stage": "Round-robin · Round 1",
      "kind": "pool",
      "home": "ICS-HK",
      "away": "FAITH",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Christian School, Hong Kong · UG"
    },
    {
      "id": "acsc-bvb-2026-pool-yiss-sph",
      "date": "2026-10-21",
      "time": "09:00",
      "stage": "Round-robin · Round 1",
      "kind": "pool",
      "home": "YISS",
      "away": "SPH",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Christian School, Hong Kong · LG",
      "fixtureId": "acsc-volleyball-boys-2026-round-1"
    },
    {
      "id": "acsc-bvb-2026-pool-ics-bkk-gis",
      "date": "2026-10-21",
      "time": "10:00",
      "stage": "Round-robin · Round 1",
      "kind": "pool",
      "home": "ICS-BKK",
      "away": "GIS",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Christian School, Hong Kong · UG"
    },
    {
      "id": "acsc-bvb-2026-pool-faith-sph",
      "date": "2026-10-21",
      "time": "12:00",
      "stage": "Round-robin · Round 2",
      "kind": "pool",
      "home": "FAITH",
      "away": "SPH",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Christian School, Hong Kong · UG",
      "fixtureId": "acsc-volleyball-boys-2026-round-2"
    },
    {
      "id": "acsc-bvb-2026-pool-yiss-dalat",
      "date": "2026-10-21",
      "time": "12:00",
      "stage": "Round-robin · Round 2",
      "kind": "pool",
      "home": "YISS",
      "away": "DALAT",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Christian School, Hong Kong · LG"
    },
    {
      "id": "acsc-bvb-2026-pool-ics-hk-gis",
      "date": "2026-10-21",
      "time": "13:00",
      "stage": "Round-robin · Round 2",
      "kind": "pool",
      "home": "ICS-HK",
      "away": "GIS",
      "homeScore": 1,
      "awayScore": 2,
      "venue": "International Christian School, Hong Kong · UG"
    },
    {
      "id": "acsc-bvb-2026-pool-sph-gis",
      "date": "2026-10-21",
      "time": "14:00",
      "stage": "Round-robin · Round 3",
      "kind": "pool",
      "home": "SPH",
      "away": "GIS",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Christian School, Hong Kong · UG",
      "fixtureId": "acsc-volleyball-boys-2026-round-3"
    },
    {
      "id": "acsc-bvb-2026-pool-faith-dalat",
      "date": "2026-10-21",
      "time": "14:00",
      "stage": "Round-robin · Round 3",
      "kind": "pool",
      "home": "FAITH",
      "away": "DALAT",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Christian School, Hong Kong · LG"
    },
    {
      "id": "acsc-bvb-2026-pool-ics-hk-ics-bkk",
      "date": "2026-10-21",
      "time": "15:00",
      "stage": "Round-robin · Round 3",
      "kind": "pool",
      "home": "ICS-HK",
      "away": "ICS-BKK",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Christian School, Hong Kong · UG"
    },
    {
      "id": "acsc-bvb-2026-pool-dalat-sph",
      "date": "2026-10-22",
      "time": "09:30",
      "stage": "Round-robin · Round 4",
      "kind": "pool",
      "home": "DALAT",
      "away": "SPH",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Christian School, Hong Kong · UG",
      "fixtureId": "acsc-volleyball-boys-2026-round-4"
    },
    {
      "id": "acsc-bvb-2026-pool-faith-ics-bkk",
      "date": "2026-10-22",
      "time": "09:30",
      "stage": "Round-robin · Round 4",
      "kind": "pool",
      "home": "FAITH",
      "away": "ICS-BKK",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Christian School, Hong Kong · LG"
    },
    {
      "id": "acsc-bvb-2026-pool-ics-hk-yiss",
      "date": "2026-10-22",
      "time": "10:45",
      "stage": "Round-robin · Round 4",
      "kind": "pool",
      "home": "ICS-HK",
      "away": "YISS",
      "homeScore": 1,
      "awayScore": 2,
      "venue": "International Christian School, Hong Kong · UG"
    },
    {
      "id": "acsc-bvb-2026-pool-dalat-ics-bkk",
      "date": "2026-10-22",
      "time": "12:30",
      "stage": "Round-robin · Round 5",
      "kind": "pool",
      "home": "DALAT",
      "away": "ICS-BKK",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Christian School, Hong Kong · UG"
    },
    {
      "id": "acsc-bvb-2026-pool-gis-yiss",
      "date": "2026-10-22",
      "time": "12:30",
      "stage": "Round-robin · Round 5",
      "kind": "pool",
      "home": "GIS",
      "away": "YISS",
      "homeScore": 1,
      "awayScore": 2,
      "venue": "International Christian School, Hong Kong · LG"
    },
    {
      "id": "acsc-bvb-2026-pool-sph-ics-hk",
      "date": "2026-10-22",
      "time": "13:30",
      "stage": "Round-robin · Round 5",
      "kind": "pool",
      "home": "SPH",
      "away": "ICS-HK",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Christian School, Hong Kong · UG",
      "fixtureId": "acsc-volleyball-boys-2026-round-5"
    },
    {
      "id": "acsc-bvb-2026-pool-ics-bkk-yiss",
      "date": "2026-10-22",
      "time": "14:30",
      "stage": "Round-robin · Round 6",
      "kind": "pool",
      "home": "ICS-BKK",
      "away": "YISS",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Christian School, Hong Kong · UG"
    },
    {
      "id": "acsc-bvb-2026-pool-gis-faith",
      "date": "2026-10-22",
      "time": "14:30",
      "stage": "Round-robin · Round 6",
      "kind": "pool",
      "home": "GIS",
      "away": "FAITH",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Christian School, Hong Kong · LG"
    },
    {
      "id": "acsc-bvb-2026-pool-dalat-ics-hk",
      "date": "2026-10-22",
      "time": "15:45",
      "stage": "Round-robin · Round 6",
      "kind": "pool",
      "home": "DALAT",
      "away": "ICS-HK",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Christian School, Hong Kong · UG"
    },
    {
      "id": "acsc-bvb-2026-pool-yiss-faith",
      "date": "2026-10-23",
      "time": "10:00",
      "stage": "Round-robin · Round 7",
      "kind": "pool",
      "home": "YISS",
      "away": "FAITH",
      "homeScore": 0,
      "awayScore": 2,
      "venue": "International Christian School, Hong Kong · UG"
    },
    {
      "id": "acsc-bvb-2026-pool-ics-bkk-sph",
      "date": "2026-10-23",
      "time": "10:00",
      "stage": "Round-robin · Round 7",
      "kind": "pool",
      "home": "ICS-BKK",
      "away": "SPH",
      "homeScore": 2,
      "awayScore": 0,
      "venue": "International Christian School, Hong Kong · LG",
      "fixtureId": "acsc-volleyball-boys-2026-round-7"
    },
    {
      "id": "acsc-bvb-2026-pool-gis-dalat",
      "date": "2026-10-23",
      "time": "11:15",
      "stage": "Round-robin · Round 7",
      "kind": "pool",
      "home": "GIS",
      "away": "DALAT",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Christian School, Hong Kong · UG",
      "notes": "Score withheld: the official matrix says Grace 2–0 Dalat, but the final GP/W/L table and playoff seeding indicate a Dalat win. Host confirmation is needed."
    },
    {
      "id": "acsc-bvb-2026-playoff-1",
      "date": "2026-10-23",
      "time": "13:00",
      "stage": "Playoffs · M1",
      "kind": "playoff",
      "home": "GIS",
      "away": "ICS-HK",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Christian School, Hong Kong · UG",
      "notes": "Named pairing verified in the final official bracket; exact score not published."
    },
    {
      "id": "acsc-bvb-2026-playoff-2",
      "date": "2026-10-23",
      "time": "13:00",
      "stage": "Playoffs · M2",
      "kind": "playoff",
      "home": "YISS",
      "away": "SPH",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Christian School, Hong Kong · LG",
      "notes": "Named pairing verified in the final official bracket; exact score not published.",
      "fixtureId": "acsc-volleyball-boys-2026-seeding"
    },
    {
      "id": "acsc-bvb-2026-playoff-3",
      "date": "2026-10-23",
      "time": "14:15",
      "stage": "Playoffs · M3",
      "kind": "playoff",
      "home": "DALAT",
      "away": "ICS-BKK",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Christian School, Hong Kong · LG",
      "notes": "Named pairing verified in the final official bracket; exact score not published."
    },
    {
      "id": "acsc-bvb-2026-playoff-4",
      "date": "2026-10-23",
      "time": "14:15",
      "stage": "Playoffs · M4",
      "kind": "playoff",
      "home": "FAITH",
      "away": "ICS-HK",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Christian School, Hong Kong",
      "notes": "Named pairing verified in the final official bracket; exact score not published. Court to be confirmed: the official schedule lists UG; the bracket lists LG."
    },
    {
      "id": "acsc-bvb-2026-playoff-5",
      "date": "2026-10-23",
      "time": "15:45",
      "stage": "Playoffs · M5",
      "kind": "playoff",
      "home": "YISS",
      "away": "DALAT",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Christian School, Hong Kong · UG",
      "notes": "Named pairing verified in the final official bracket; exact score not published."
    },
    {
      "id": "acsc-bvb-2026-playoff-7",
      "date": "2026-10-23",
      "time": "15:45",
      "stage": "Playoffs · M7",
      "kind": "playoff",
      "home": "SPH",
      "away": "ICS-BKK",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Christian School, Hong Kong · LG",
      "notes": "Seventh-place elimination match. SPH finished seventh according to the official awards; the exact match score is not published in the bracket.",
      "fixtureId": "acsc-volleyball-boys-2026-consolation"
    },
    {
      "id": "acsc-bvb-2026-playoff-8",
      "date": "2026-10-24",
      "time": "08:00",
      "stage": "Playoffs · M8",
      "kind": "playoff",
      "home": "ICS-BKK",
      "away": "ICS-HK",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Christian School, Hong Kong · LG",
      "notes": "Named pairing verified in the final official bracket; exact score not published."
    },
    {
      "id": "acsc-bvb-2026-playoff-9",
      "date": "2026-10-24",
      "time": "08:00",
      "stage": "Playoffs · M9",
      "kind": "playoff",
      "home": "GIS",
      "away": "YISS",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Christian School, Hong Kong · UG",
      "notes": "Named pairing verified in the final official bracket; exact score not published."
    },
    {
      "id": "acsc-bvb-2026-playoff-6",
      "date": "2026-10-24",
      "time": "09:30",
      "stage": "Playoffs · M6",
      "kind": "playoff",
      "home": "FAITH",
      "away": "DALAT",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Christian School, Hong Kong · UG",
      "notes": "Named pairing verified in the final official bracket; exact score not published. Best of five sets."
    },
    {
      "id": "acsc-bvb-2026-playoff-10",
      "date": "2026-10-24",
      "time": "11:00",
      "stage": "Playoffs · M10",
      "kind": "playoff",
      "home": "ICS-BKK",
      "away": "YISS",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Christian School, Hong Kong · UG",
      "notes": "Named pairing verified in the final official bracket; exact score not published."
    },
    {
      "id": "acsc-bvb-2026-playoff-11",
      "date": "2026-10-24",
      "time": "12:30",
      "stage": "Playoffs · M11",
      "kind": "playoff",
      "home": "ICS-HK",
      "away": "GIS",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Christian School, Hong Kong",
      "notes": "Named pairing verified in the final official bracket; exact score not published. Court to be confirmed: the official schedule lists LG; the bracket lists UG."
    },
    {
      "id": "acsc-bvb-2026-playoff-12",
      "date": "2026-10-24",
      "time": null,
      "stage": "Playoffs · M12",
      "kind": "playoff",
      "home": "DALAT",
      "away": "GIS",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Christian School, Hong Kong · UG",
      "notes": "Named pairing verified in the final official bracket; exact score not published. Best of five sets. Start time to be confirmed: official schedule 12:30; bracket 14:00 Hong Kong time."
    },
    {
      "id": "acsc-bvb-2026-playoff-13",
      "date": "2026-10-24",
      "time": null,
      "stage": "Championship · M13",
      "kind": "playoff",
      "home": "FAITH",
      "away": "DALAT",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Christian School, Hong Kong · UG",
      "notes": "Named pairing verified in the final official bracket; exact score not published. Championship, best of five sets. Start time to be confirmed: official schedule 15:30; bracket 16:00 Hong Kong time."
    },
    {
      "id": "acsc-bvb-2026-playoff-exhibition",
      "date": "2026-10-24",
      "time": "14:00",
      "stage": "Exhibition",
      "kind": "playoff",
      "home": "SPH",
      "away": "ICS-BKK",
      "homeScore": null,
      "awayScore": null,
      "venue": "International Christian School, Hong Kong · UG",
      "notes": "Exhibition pairing verified in the final official bracket; exact score not published. This does not change final placement.",
      "fixtureId": "acsc-volleyball-boys-2026-playoffs-placement"
    }
  ],
  "complete": true,
  "finalPlacements": [
    {
      "school": "FAITH",
      "rank": 1
    },
    {
      "school": "DALAT",
      "rank": 2
    },
    {
      "school": "GIS",
      "rank": 3
    },
    {
      "school": "ICS-HK",
      "rank": 4
    },
    {
      "school": "YISS",
      "rank": 5
    },
    {
      "school": "ICS-BKK",
      "rank": 6
    },
    {
      "school": "SPH",
      "rank": 7
    }
  ],
  "awards": [
    {
      "school": "SPH",
      "label": "All-Tournament",
      "recipient": "Paul Schleper"
    }
  ]
};
