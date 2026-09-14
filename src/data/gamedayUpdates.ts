import type { SheetMatch } from '../services/parsers';

export interface GameDayUpdate {
  teamId: string;
  date: string;
  opponent: string;
  scoreFor: number;
  scoreAgainst: number;
  details: Pick<SheetMatch, 'statLeaders' | 'highlights' | 'matchType'>;
  newFixture?: { time: string; venue: string };
}

// Reviewed GameDay Summaries posts and attached workbook, September 8, 2026.
// Provenance and unresolved results: docs/gameday-updates-20260914.md.
export const GAMEDAY_UPDATES: GameDayUpdate[] = [
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
