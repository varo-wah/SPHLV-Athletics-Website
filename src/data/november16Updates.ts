import type { GameDayUpdate } from './gamedayUpdates';

// Mark Heil, GameDay Summaries, November 15 at 17:21. Neither the post nor the
// accessible school schedule confirms the match date, time, venue or competition.
export const NOVEMBER_16_UPDATES: GameDayUpdate[] = [
  {
    fixtureId: '2026-varsity-boys-basketball-lippo-cikarang-reported-nov15',
    teamId: 'basketball-sma-boys', date: '', reportedDate: '2026-11-15',
    opponent: 'SPH Lippo Cikarang', scoreFor: 54, scoreAgainst: 55,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      highlights: ['The Eagles rallied from 38–51 down entering the fourth quarter with a 16–4 run, but their final shot missed in a 54–55 loss to SPH Lippo Cikarang.',
        'Kiano scored 12 of his team-high 14 points in the fourth quarter and led the team with eight rebounds.'],
      statLeaders: ['Kiano — 14 points, 8 rebounds, 1 block; 6/8 FG (75%)',
        'Ryu — 13 points, 7 rebounds, 6 steals, 4 assists, 3 blocks; 5/16 FG',
        'Evans — 3 steals; 1/2 three-pointers (50%)', 'Ming — 1/2 three-pointers (50%)',
        'Sean — 3/7 FG (43%)'],
    },
  },
];
