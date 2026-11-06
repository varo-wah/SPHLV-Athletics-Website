import type { GameDayUpdate } from './gamedayUpdates';
import { OCTOBER_26_UPDATES } from './october26Updates';

// JAAC senior football and volleyball schedules and ladders shared by Mark Heil.
// The October 31 and November 1 GameDay reports confirm the volleyball results.
export const NOVEMBER_JAAC_RESULTS: GameDayUpdate[] = [
  {
    fixtureId: '2026-girls-soccer-jaac-final',
    teamId: 'soccer-sma-girls', date: '2026-11-03',
    opponent: 'STL', scoreFor: 2, scoreAgainst: 1,
    newFixture: { time: '15:30', venue: 'SPH-LV', locationType: 'Home' },
    details: { tournament: 'JAAC', matchType: 'JAAC final',
      highlights: ['SPH-LV won the JAAC championship with a 2–1 victory over Santa Laurensia.'] },
  },
  {
    fixtureId: '2026-boys-volleyball-jaac-final',
    teamId: 'volleyball-sma-boys', date: '2026-10-31',
    opponent: 'GJS', scoreFor: 0, scoreAgainst: 3,
    newFixture: { time: '11:30', venue: 'SPH-LV', locationType: 'Neutral' },
    details: { tournament: 'JAAC', matchType: 'JAAC final',
      highlights: ['Global Jaya won the final in three sets. SPH-LV finished as JAAC runner-up after going 7–0 in the regular season.'] },
  },
  {
    fixtureId: '2026-boys-volleyball-jaac-semifinal',
    teamId: 'volleyball-sma-boys', date: '2026-10-31',
    opponent: 'STL', scoreFor: 3, scoreAgainst: 1,
    newFixture: { time: '09:15', venue: 'SPH-LV', locationType: 'Neutral' },
    details: { tournament: 'JAAC', matchType: 'JAAC semifinal',
      highlights: ['SPH-LV beat Santa Laurensia in four sets to earn a place in the final against Global Jaya later that morning.'] },
  },
  {
    fixtureId: '2026-boys-soccer-jaac-semifinal',
    teamId: 'soccer-sma-boys', date: '2026-10-30',
    opponent: 'BSJ', scoreFor: 1, scoreAgainst: 3,
    newFixture: { time: '15:30', venue: 'SPH-LV', locationType: 'Home' },
    details: { tournament: 'JAAC', matchType: 'JAAC semifinal' },
  },
  {
    fixtureId: '2026-girls-volleyball-jaac-semifinal',
    teamId: 'volleyball-sma-girls', date: '2026-10-30',
    opponent: 'BSJ', scoreFor: 3, scoreAgainst: 0,
    newFixture: { time: '16:00', venue: 'SPH-LV', locationType: 'Home' },
    details: { tournament: 'JAAC', matchType: 'JAAC semifinal',
      setScores: ['25–15', '25–23', '25–23'],
      highlights: ['SPH-LV beat BSJ in straight sets to reach the JAAC final. After a 25–15 opening set, the Eagles won both remaining sets 25–23.'] },
  },
];

export const JAAC_FINAL_RESULTS = [...OCTOBER_26_UPDATES, ...NOVEMBER_JAAC_RESULTS]
  .filter(update => update.details.matchType === 'JAAC final');
