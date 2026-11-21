import snapshot from './seasonTwoLeagueSnapshot.json';
import { parseLeagueStandings, parseLeagueMatchups, type LeagueSport } from '../services/leagueStandings';
import type { DivisionTab, GenderTab } from '../types';
import type { GameDayUpdate } from './gamedayUpdates';
import type { ScheduleEvent } from './scheduleTypes';

export const SEASON_TWO_VERIFIED_AT = snapshot.verifiedAt;
export const SEASON_TWO_STANDINGS = snapshot.tables.flatMap(table =>
  parseLeagueStandings(table.matrix, table.sport as LeagueSport, table.gender as 'Boys' | 'Girls').map(row => ({
    ...row, level: table.level as DivisionTab,
    id: `official-${table.sport}-${table.level}-${table.gender}-${row.team}`.toLowerCase(),
    pageId: `${table.sport}-${table.level}-${table.gender}`.toLowerCase(),
  })));
export const SEASON_TWO_LADDERS = snapshot.tables.map(table => ({
  sportKey: table.sport as LeagueSport, level: table.level as DivisionTab, genderGroup: table.gender as GenderTab,
  matchups: parseLeagueMatchups(table.matrix, table.sport as LeagueSport),
}));
export const SEASON_TWO_RESULT_SOURCES = snapshot.tables.map(table => ({
  id: `reviewed-${table.sport}-${table.level}-${table.gender}`.toLowerCase(),
  teamId: `${table.sport}-${table.level}-${table.gender}`.toLowerCase(),
  displayName: `${table.level} ${table.gender} ${table.sport}`,
  sport: table.sport as LeagueSport, sportKey: table.sport as LeagueSport,
  level: table.level as DivisionTab, genderGroup: table.gender as GenderTab,
}));

export const SEASON_TWO_RESULTS: GameDayUpdate[] = snapshot.tables.flatMap(table => table.fixtures
  .filter(f => f.homeScore !== null && f.awayScore !== null).map(f => {
    const home = f.home === 'SPH-LV';
    const boysVolleyball = table.sport === 'Volleyball' && table.gender === 'Boys' && f.date === '2026-11-17';
    return {
      fixtureId: `jaac-${table.sport}-${table.level}-${table.gender}-${f.date}-${f.home}-${f.away}`.toLowerCase(),
      teamId: `${table.sport}-${table.level}-${table.gender}`.toLowerCase(), date: f.date,
      opponent: home ? f.away : f.home, scoreFor: (home ? f.homeScore : f.awayScore)!, scoreAgainst: (home ? f.awayScore : f.homeScore)!,
      newFixture: { time: f.time, venue: f.venue, locationType: home ? 'Home' as const : 'Away' as const },
      details: { tournament: 'Season' as const, matchType: 'JAAC regular season',
        ...(boysVolleyball ? { setScores: ['25–20', '25–16'],
          highlights: ['SMP boys opened their JAAC season with a 2–0 win over STL, taking the sets 25–20 and 25–16.'],
          statLeaders: ['Jackson — 4 kills, 4 aces', 'Jacob — 5 kills, 1 block, 2 aces', 'Bryce — 1 kill, 4 aces', 'Yuseong — 1 kill', 'Denzel — 1 ace', 'Judah — 1 ace'],
        } : {}),
      },
    };
  }));

export const SEASON_TWO_FIXTURES: ScheduleEvent[] = snapshot.tables.flatMap(table => table.fixtures.map(f => {
  const home = f.home === 'SPH-LV';
  const finished = f.homeScore !== null && f.awayScore !== null;
  const opponent = home ? f.away : f.home;
  return {
    id: `jaac-${table.sport}-${table.level}-${table.gender}-${f.date}-${f.home}-${f.away}`.toLowerCase(),
    season: 'Season 2', week: `Week #${1 + Math.floor((Date.parse(f.date) - Date.UTC(2026, 10, 2)) / 604800000)}`,
    date: f.date, day: new Date(`${f.date}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
    team: `${table.level === 'SMA' ? 'Varsity' : 'SMP'} ${table.gender} ${table.sport}`,
    sport: table.sport as LeagueSport, sportKey: table.sport as LeagueSport,
    level: table.level as DivisionTab, genderGroup: table.gender as GenderTab,
    eventText: `${home ? opponent + ' at SPH-LV' : 'SPH-LV vs ' + opponent}`, eventType: home ? 'Home Game' as const : 'Away Game' as const,
    location: f.venue, opponent, time: f.time, timeZone: 'Asia/Jakarta',
    sourceUrl: `https://docs.google.com/spreadsheets/d/${table.source}/edit`, sourceLabel: 'Official JAAC workbook',
    status: finished ? 'Finished' as const : 'Scheduled' as const,
    ...(finished ? { resultScore: `${home ? f.homeScore : f.awayScore}–${home ? f.awayScore : f.homeScore}` } : {}),
    raw: `${f.home} vs ${f.away}`,
  };
}));

export function mergeSeasonTwoFixtures(events: ScheduleEvent[]) {
  // A league fixture replaces the school schedule's provisional session for that team/date.
  return [...events.filter(event => !SEASON_TWO_FIXTURES.some(f => f.date === event.date && f.sportKey === event.sportKey
    && f.level === event.level && f.genderGroup === event.genderGroup && event.eventType !== 'Practice')), ...SEASON_TWO_FIXTURES];
}
