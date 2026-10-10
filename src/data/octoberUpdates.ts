import type { GameDayUpdate } from './gamedayUpdates';

// GameDay Summaries September 29 and October 3; Cup dates from Mark's schedule.
export const OCTOBER_UPDATES: GameDayUpdate[] = [
  ...[
    { date: '2026-09-28', time: '15:30', opponent: 'SLH Moria', scoreFor: 2, scoreAgainst: 1 },
    { date: '2026-09-28', time: '17:30', opponent: 'SMA 15', scoreFor: 0, scoreAgainst: 2 },
    { date: '2026-09-29', time: '13:30', opponent: 'SMA 4', scoreFor: 2, scoreAgainst: 0 },
    { date: '2026-09-29', time: '16:30', opponent: 'St. Laurensia', scoreFor: 2, scoreAgainst: 0 },
  ].map(({ time, ...result }) => ({
    ...result, teamId: 'volleyball-sma-girls',
    newFixture: { time, venue: 'Court 2', locationType: 'TBD' as const },
    details: { matchType: 'SPH Cup', highlights: ['SPH-LV finished runner-up in the September 28–29 SPH Cup.'] },
  })),
  {
    teamId: 'volleyball-sma-boys', date: '2026-10-02', opponent: 'BSJ', scoreFor: 2, scoreAgainst: 0,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      setScores: ['25–16', '25–23'],
      statLeaders: ['Jared — 5 perfect-tempo sets', 'Jericho — 3 kills', 'John — 4 blocks', 'Bench — 8 service aces in the final set'],
      highlights: ['The boys beat BSJ in straight sets, with strong contributions from the bench in a close second set.'],
    },
  },
  {
    teamId: 'volleyball-sma-girls', date: '2026-10-02', opponent: 'BSJ', scoreFor: 2, scoreAgainst: 0,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      setScores: ['25–18', '25–14'], statLeaders: ['Trisha — 6 service aces'],
      highlights: ['Sam Chai and Christa contributed to the attack, while Louie and Yujin provided consistent passing.'],
    },
  },
];
