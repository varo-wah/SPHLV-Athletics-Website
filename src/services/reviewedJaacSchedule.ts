import { TEAM_CATALOG } from '../config/teamCatalog';
import type { ScheduleEvent } from '../data/scheduleTypes';
import { jaacSchoolForName } from '../data/jaacSchools';
import { officialStandingsUrlFor } from '../data/officialStandings';
import { OCTOBER_26_UPDATES } from '../data/october26Updates';
import { OCTOBER_29_UPDATES } from '../data/october29Updates';
import { NOVEMBER_JAAC_RESULTS } from '../data/novemberJaacResults';
import { mergeReviewedGirlsVolleyballSchedule } from './reviewedGirlsVolleyballSchedule';

const soccerBoys = {
  season: 'Season 1', week: 'Week #15', team: 'Varsity Boys Soccer',
  sport: 'Soccer', sportKey: 'Soccer', level: 'SMA', genderGroup: 'Boys',
} satisfies Partial<ScheduleEvent>;

const finalPractice: ScheduleEvent = {
  ...soccerBoys, id: 'boys-soccer-final-practice-20261102', date: '2026-11-02', day: 'Mon',
  eventText: 'Final team practice', eventType: 'Practice', time: '15:15', timeZone: 'Asia/Jakarta',
  location: 'Main Field', details: '3:15–4:30 pm on the main field.', raw: 'Coach Trey · final team practice, November 2.',
};
const staffExhibition: ScheduleEvent = {
  ...soccerBoys, id: 'boys-soccer-staff-friendly-20261107', date: '2026-11-07', day: 'Sat',
  eventType: 'Home Game', eventText: 'Optional friendly: SMA boys vs staff', opponent: 'SPH staff',
  time: '15:00', timeZone: 'Asia/Jakarta', location: 'Main Field', status: 'Scheduled',
  details: 'Optional end-of-season exhibition against the school staff. SMA boys wear white.',
  raw: 'Coach Trey · Saturday, November 7, 3 pm on the main field.',
};

function teamId(event: ScheduleEvent) {
  return TEAM_CATALOG.find(team => team.displayName === event.team || (
    team.sport === event.sportKey && team.gender === event.genderGroup && team.division === event.level
  ))?.id;
}

function reviewedFixtures(): ScheduleEvent[] {
  const fixtures: ScheduleEvent[] = [];
  for (const result of [...OCTOBER_26_UPDATES, ...OCTOBER_29_UPDATES, ...NOVEMBER_JAAC_RESULTS]) {
    if (!result.date || !result.fixtureId || result.teamId === 'volleyball-sma-girls') continue;
    const team = TEAM_CATALOG.find(entry => entry.id === result.teamId);
    if (!team || (team.sport !== 'Basketball' && team.sport !== 'Soccer' && team.sport !== 'Volleyball')) continue;
    const date = new Date(result.date + 'T12:00:00Z');
    const week = 14 + Math.floor((date.valueOf() - Date.UTC(2026, 9, 26, 12)) / (7 * 86400000));
    const label = result.details.matchType || 'JAAC';
    const opponent = result.opponent;
    fixtures.push({
      id: 'schedule-' + result.fixtureId, season: 'Season 1', week: 'Week #' + week, date: result.date,
      day: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
      team: team.displayName, sport: team.sport, sportKey: team.sport, level: team.division, genderGroup: team.gender,
      eventText: label + ': SPH-LV vs ' + opponent, eventType: 'Tournament', opponent,
      status: 'Finished', resultScore: result.scoreFor + '–' + result.scoreAgainst,
      time: result.newFixture?.time || null, location: result.newFixture?.venue || null, timeZone: 'Asia/Jakarta',
      sourceUrl: team.sport === 'Basketball' ? undefined : officialStandingsUrlFor(team.sport, team.gender) ?? undefined,
      sourceLabel: 'Official JAAC workbook', details: result.details.highlights?.[0], raw: label + ': SPH-LV vs ' + opponent,
    });
  }
  return [...fixtures, finalPractice, staffExhibition];
}
const fixtures = reviewedFixtures();

function sameFixture(event: ScheduleEvent, fixture: ScheduleEvent) {
  if (event.id === fixture.id) return true;
  if (event.season !== fixture.season || event.date !== fixture.date || teamId(event) !== teamId(fixture)) return false;
  if (fixture.eventType === 'Practice') return event.eventType === 'Practice';
  if (fixture.id === staffExhibition.id) return /staff/i.test(event.eventText) || /staff/i.test(event.opponent || '');
  if (!event.opponent) return false;
  return (jaacSchoolForName(event.opponent)?.code ?? event.opponent) ===
    (jaacSchoolForName(fixture.opponent)?.code ?? fixture.opponent) && /\bJAAC\b/i.test(event.eventText);
}

function isSupersededPlaceholder(event: ScheduleEvent) {
  if (event.season !== 'Season 1' || event.opponent || event.sourceUrl) return false;
  const id = teamId(event);
  if (event.date === '2026-10-24' && id === 'basketball-smp-boys') return /^jaac finals?$/i.test(event.eventText.trim());
  if (event.date !== '2026-10-31' && event.date !== '2026-11-07') return false;
  const completedTeam = id === 'soccer-sma-girls' || id === 'volleyball-sma-boys' || id === 'soccer-sma-boys';
  return completedTeam && /^jaac(?:\s*\(alternate date\))?$/i.test(event.eventText.trim());
}

/** Replace unused finals slots with the dated games confirmed by the league and coaches. */
export function mergeReviewedJaacSchedule(events: ScheduleEvent[]): ScheduleEvent[] {
  const merged = mergeReviewedGirlsVolleyballSchedule(events).filter(event => !isSupersededPlaceholder(event));
  for (const fixture of fixtures) {
    const index = merged.findIndex(event => sameFixture(event, fixture));
    const published = merged[index];
    const confirmed: ScheduleEvent = {
      ...fixture, ...published, eventText: fixture.eventText,
      status: fixture.status ?? published?.status, resultScore: published?.resultScore || fixture.resultScore,
      time: published?.time || fixture.time, location: published?.location || fixture.location,
      details: published?.details || fixture.details,
    };
    if (index < 0) merged.push(confirmed);
    else merged[index] = confirmed;
  }
  return merged;
}
