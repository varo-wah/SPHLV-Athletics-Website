import type { SheetMatch } from '../services/parsers';

export interface GameDayUpdate {
  teamId: string;
  date: string;
  opponent: string;
  scoreFor: number;
  scoreAgainst: number;
  details: Pick<SheetMatch, 'statLeaders' | 'highlights' | 'matchType' | 'penalties'>;
  newFixture?: { time: string; venue: string; locationType?: SheetMatch['locationType'] };
}

// Reviewed GameDay Summaries posts and attached workbook, September 8, 2026.
// Provenance and unresolved results: docs/gameday-updates-20260914.md.
export const GAMEDAY_UPDATES: GameDayUpdate[] = [
  // Results reported directly by William on September 19, 2026.
  // Kickoff times, venues and tournament name await confirmation.
  {
    teamId: 'soccer-sma-boys', date: '2026-09-16', opponent: 'SMK-31', scoreFor: 1, scoreAgainst: 0,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: { highlights: ['SPH-LV won 1–0 against SMK-31.'] },
  },
  {
    teamId: 'soccer-sma-boys', date: '2026-09-18', opponent: 'PGRI-83', scoreFor: 1, scoreAgainst: 1,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      matchType: 'Semifinal', penalties: { scoreFor: 4, scoreAgainst: 3 },
      highlights: ['SPH-LV advanced to the final with a 4–3 penalty shootout win after a 1–1 draw against PGRI-83.'],
    },
  },
  {
    teamId: 'soccer-sma-boys', date: '2026-09-19', opponent: 'SLH Moria', scoreFor: 1, scoreAgainst: 4,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: { matchType: 'Final', highlights: ['SPH-LV lost 1–4 to SLH Moria in the final.'] },
  },
  {
    teamId: 'basketball-smp-boys', date: '2026-09-14', opponent: 'National High', scoreFor: 91, scoreAgainst: 20,
    newFixture: { time: '', venue: 'SPH LV' },
    details: {
      statLeaders: ['Eduardo #80 — 23 points, 7 assists, 8 steals', 'Jacob #72 — 14 points, 12 rebounds, 1 block', 'Rainer #6 — 16 points, 11 assists', 'Eduardo #80 — 11/14 FG (78.6%)', 'Shane #1 — 3/4 three-pointers (75%)'],
      highlights: ['A 91–20 home win over National High, with the new Horns offense creating open shots.', 'Shane and Danson each made three three-pointers.', 'Jacob and Rainer both recorded double-doubles.', 'With Coby unavailable, Eduardo stepped into the point guard role.'],
    },
  },
  {
    teamId: 'basketball-smp-girls', date: '2026-09-14', opponent: 'National High', scoreFor: 43, scoreAgainst: 9,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      statLeaders: ['London — 17 points, 8/12 FG (67%), 1/3 three-pointers (33%)', 'Hope — 4 assists, 7 steals, 1 block', 'Hillary — 7 steals', 'Samantha — 3 rebounds', 'Maggie — 3 rebounds'],
      highlights: ['The SMP girls won 43–9 against National High.', 'London led the scoring with 17 points. Hope and Hillary each collected seven steals, while Samantha and Maggie led the rebounding with three apiece.'],
    },
  },
  {
    teamId: 'soccer-sma-boys', date: '2026-08-15', opponent: 'SMK 31', scoreFor: 1, scoreAgainst: 3,
    details: { matchType: 'Friendly', statLeaders: ['Jaehun Oh — 1 goal'], highlights: ['Jaehun Oh scored an unassisted goal.'] },
  },
  {
    teamId: 'soccer-sma-boys', date: '2026-08-22', opponent: 'SMA 17', scoreFor: 1, scoreAgainst: 6,
    details: { matchType: 'Friendly', statLeaders: ['Solomon Schleper — 1 goal'], highlights: ['Solomon Schleper scored from the penalty spot.'] },
  },
  {
    teamId: 'soccer-sma-boys', date: '2026-09-05', opponent: 'SPH-KV', scoreFor: 12, scoreAgainst: 0,
    details: {
      statLeaders: [
        'Kenzo Stanley — 3 goals, 4 assists', 'Jacob Huang — 1 goal, 2 assists',
        'Kenzo Tjokrokusumo — 1 goal, 2 assists', 'Solomon Schleper — 1 goal, 1 assist',
        'Jaehun Oh — 1 goal', 'Jayden Karwelo — 1 goal', 'Lionel Boentoro — 1 goal',
        'Axel Hardjadinata — 1 goal', 'Yusang Chon — 1 assist',
      ],
      highlights: ['Kenzo Stanley scored a hat-trick and provided four assists.', 'Ten SPH-LV goals and two KV own goals completed the 12–0 win.'],
    },
  },
  {
    teamId: 'soccer-sma-girls', date: '2026-08-15', opponent: 'SMK 31', scoreFor: 11, scoreAgainst: 0,
    details: {
      statLeaders: ['Sherny — 4 goals, 2 assists', 'Grace — 3 goals', 'Isa — 2 goals, 1 assist', 'Summer — 1 goal, 1 assist', 'Mika (#8) — 1 goal, 2 assists'],
      highlights: ['Sherny scored four and Grace added a hat-trick in the 11–0 win.'],
    },
  },
  {
    teamId: 'soccer-sma-girls', date: '2026-08-22', opponent: 'SMA 17', scoreFor: 4, scoreAgainst: 1,
    details: { statLeaders: ['Sherny — 3 goals', 'Isa — 1 goal', 'Grace — 1 assist', 'Marchyie — 1 assist'], highlights: ['Sherny scored a hat-trick and Isa added the fourth goal.'] },
  },
  {
    teamId: 'soccer-sma-girls', date: '2026-09-05', opponent: 'SPH-KV', scoreFor: 2, scoreAgainst: 2,
    newFixture: { time: '08:05', venue: 'SPH LV' },
    details: { matchType: 'JAAC', statLeaders: ['Sherny — 1 goal', 'Marchyie — 1 goal', 'Grace — 1 assist', 'Summer — 1 assist'], highlights: ['Sherny and Marchyie scored in the 2–2 draw with SPH-KV.'] },
  },
  {
    teamId: 'soccer-sma-girls', date: '2026-09-05', opponent: 'JIS', scoreFor: 3, scoreAgainst: 0,
    newFixture: { time: '09:40', venue: 'SPH LV' },
    details: { matchType: 'JAAC', statLeaders: ['Isa — 1 goal, 1 assist', 'Sherny — 1 goal', 'Grace — 1 goal', 'Tiffany — 1 assist', 'Kate — 1 assist', 'Gwen — 2 saves', 'Kalia — 2 saves'], highlights: ['Isa, Sherny and Grace scored in the 3–0 win.', 'Gwen and Kalia made two saves each to keep a clean sheet.'] },
  },
];
