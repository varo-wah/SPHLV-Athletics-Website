import { ACSC_SWIMMING_SCHEDULE } from '../data/swimming';
import type { ScheduleEvent } from '../data/scheduleTypes';

/** Expand the single master-schedule entry into the official competition sessions. */
export function mergeAcscSwimmingSchedule(events: ScheduleEvent[]): ScheduleEvent[] {
  const reviewedIds = new Set(ACSC_SWIMMING_SCHEDULE.map(event => event.id));
  const merged = events.filter(event => !(
    /swim/i.test(event.team)
    && event.date && event.date >= '2026-10-28' && event.date <= '2026-10-31'
    && /^acsc(?:\s+swimming)?(?:\s*@\s*yiss)?$/i.test(event.eventText.trim())
    && !reviewedIds.has(event.id)
  ));
  for (const session of ACSC_SWIMMING_SCHEDULE) {
    const index = merged.findIndex(event => event.id === session.id);
    if (index < 0) merged.push({ ...session });
    else merged[index] = { ...session, ...merged[index] };
  }
  return merged;
}
