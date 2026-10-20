import { OCTOBER_20_UPDATES } from '../data/october20Updates';
import type { ScheduleEvent } from '../data/scheduleTypes';

const TEAM_NAME = 'SMP Boys Basketball';
const confirmedFixtures = OCTOBER_20_UPDATES.filter((update) => (
  update.teamId === 'basketball-smp-boys'
  && Boolean(update.date)
  && update.details.matchType?.startsWith('SPH Cup')
));

function normalizedOpponent(value: string | null | undefined): string {
  return (value ?? '').toLowerCase().replace(/\bnegeri\b/g, '').replace(/[^a-z0-9]/g, '');
}

function isBoysBasketball(event: ScheduleEvent): boolean {
  return event.team.trim().toLowerCase() === TEAM_NAME.toLowerCase();
}

function fixtureStage(event: ScheduleEvent): string | null {
  return event.eventText.match(/\b(semifinal|final)\b/i)?.[1].toLowerCase() ?? null;
}

function isSameFixture(left: ScheduleEvent, right: ScheduleEvent): boolean {
  if (left.id === right.id) return true;
  if (!isBoysBasketball(left) || left.date !== right.date) return false;
  if (normalizedOpponent(left.opponent) !== normalizedOpponent(right.opponent)) return false;
  const leftStage = fixtureStage(left);
  const rightStage = fixtureStage(right);
  return !leftStage || !rightStage || leftStage === rightStage;
}

/** Add only fixtures whose match dates are confirmed in the reviewed reports. */
export function mergeReviewedCupSchedule(events: ScheduleEvent[]): ScheduleEvent[] {
  const confirmedDates = new Set(confirmedFixtures.map((fixture) => fixture.date));
  const merged = events.filter((event) => !(
    isBoysBasketball(event)
    && confirmedDates.has(event.date ?? '')
    && !event.opponent
    && /^sph cup$/i.test(event.eventText.trim())
  ));

  for (const fixture of confirmedFixtures) {
    const sameDate = events.find((event) => event.date === fixture.date && event.week);
    const event: ScheduleEvent = {
      id: `reviewed-schedule-${fixture.fixtureId}`,
      season: 'Season 1',
      // October 12–17 is Week #12 in the bundled, verified master schedule.
      week: sameDate?.week ?? 'Week #12',
      date: fixture.date,
      day: new Date(`${fixture.date}T00:00:00Z`).toLocaleDateString('en-US', {
        weekday: 'short', timeZone: 'UTC',
      }),
      team: TEAM_NAME,
      sportKey: 'Basketball',
      sport: 'Basketball',
      level: 'SMP',
      genderGroup: 'Boys',
      eventText: `${fixture.details.matchType}: LV vs ${fixture.opponent}`,
      eventType: 'Tournament',
      location: fixture.newFixture?.venue || null,
      opponent: fixture.opponent,
      time: fixture.newFixture?.time || null,
      raw: `GameDay Summaries · ${fixture.reportedDate} · ${fixture.details.matchType}: LV vs ${fixture.opponent}`,
    };
    // A later published schedule keeps its confirmed time, venue, and source ID.
    if (!merged.some((existing) => isSameFixture(existing, event))) merged.push(event);
  }

  return merged;
}
