import { GIRLS_VOLLEYBALL_JAAC_SEMIFINAL } from '../data/girlsVolleyballJaac2026';
import type { ScheduleEvent } from '../data/scheduleTypes';

function isGirlsVolleyball(event: ScheduleEvent): boolean {
  return ['varsity girls volleyball', 'sma girls volleyball'].includes(event.team.trim().toLowerCase())
    || (event.sportKey === 'Volleyball' && event.level === 'SMA' && event.genderGroup === 'Girls');
}

function isGenericJaac(event: ScheduleEvent): boolean {
  return !event.opponent && !event.sourceUrl
    && /^jaac(?:\s*\(alternate date\))?$/i.test(event.eventText.trim());
}

/** The revised team plan supersedes generic calendar slots, not explicit later fixtures. */
export function mergeReviewedGirlsVolleyballSchedule(events: ScheduleEvent[]): ScheduleEvent[] {
  const fixture = GIRLS_VOLLEYBALL_JAAC_SEMIFINAL;
  const staleDates = new Set([fixture.date, '2026-10-31', '2026-11-07']);
  const merged = events.filter(event => !(
    isGirlsVolleyball(event) && (
      (event.date === fixture.date && event.eventType === 'Practice')
      || (staleDates.has(event.date) && isGenericJaac(event))
    )
  ));
  const index = merged.findIndex(event => event.id === fixture.id || (
    isGirlsVolleyball(event) && event.date === fixture.date
    && /\bjaac\b/i.test(event.eventText) && /\bsemi[ -]?finals?\b/i.test(event.eventText)
  ));
  if (index < 0) merged.push({ ...fixture });
  else merged[index] = {
    ...fixture,
    ...merged[index],
    details: merged[index].details || fixture.details,
  };
  return merged;
}
