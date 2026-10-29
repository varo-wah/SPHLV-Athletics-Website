import type { GameDayUpdate } from './gamedayUpdates';

// Teams GameDay Summaries reviewed October 29. Mark reported both October 27
// soccer results that evening; William confirmed the boys' scorers October 28.
// Tournament-wide ACSC totals are separate and must not be added to these games.
export const OCTOBER_29_UPDATES: GameDayUpdate[] = [
  {
    fixtureId: '2026-boys-soccer-jaac-stl-oct27',
    teamId: 'soccer-sma-boys', date: '2026-10-27', reportedDate: '2026-10-28',
    opponent: 'STL', scoreFor: 3, scoreAgainst: 0,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      tournament: 'JAAC', matchType: 'JAAC',
      statLeaders: ['Deven — 1 goal', 'Solomon Schleper — 1 goal', 'Ben Yulianto — 1 goal (penalty)'],
      highlights: ['SPH-LV beat Santa Laurensia 3–0. Deven and Solomon scored, and Ben converted a penalty.'],
    },
  },
  {
    fixtureId: '2026-girls-soccer-jaac-bsj-oct27',
    teamId: 'soccer-sma-girls', date: '2026-10-27', reportedDate: '2026-10-27',
    opponent: 'BSJ', scoreFor: 3, scoreAgainst: 2,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      tournament: 'JAAC', matchType: 'JAAC',
      statLeaders: ['Sherny Lim — 2 goals', 'Grace Priskila Nawipa — 1 goal'],
      highlights: [
        'No. 4 SPH-LV upset No. 1 BSJ 3–2.',
        'Sherny scored twice for an early 2–0 lead. BSJ equalized before Grace scored the late winner.',
        'The goalkeeper made key saves to help secure the win.',
      ],
    },
  },
];
