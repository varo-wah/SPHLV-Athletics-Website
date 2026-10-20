import { ACSC_SOCCER_SCHEDULE } from '../data/acscSoccer2026';
import type { ScheduleEvent } from '../data/scheduleTypes';

function isBoysSoccer(event: ScheduleEvent): boolean {
  return ['sma boys soccer', 'varsity boys soccer'].includes(event.team.trim().toLowerCase())
    || (event.sportKey === 'Soccer' && event.level === 'SMA' && event.genderGroup === 'Boys');
}

function normalizedOpponent(value: string | null | undefined): string {
  const key = (value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['icshk', 'icshongkong', 'internationalchristianschoolhongkong'].includes(key)) return 'icshk';
  if (['morrison', 'morrisonacademy'].includes(key)) return 'morrison';
  if (['yiss', 'yongsaninternationalschoolofseoul'].includes(key)) return 'yiss';
  return key;
}

function sameFixture(existing: ScheduleEvent, fixture: ScheduleEvent): boolean {
  if (existing.id === fixture.id) return true;
  return Boolean(fixture.opponent)
    && isBoysSoccer(existing)
    && existing.date === fixture.date
    && /\bacsc\b/i.test(existing.eventText)
    && normalizedOpponent(existing.opponent) === normalizedOpponent(fixture.opponent);
}

/** Replace the arrival-day placeholder without disturbing other teams or sports. */
export function mergeAcscSoccerSchedule(events: ScheduleEvent[]): ScheduleEvent[] {
  const merged = events.filter((event) => !(
    isBoysSoccer(event)
    && event.date === '2026-10-20'
    && !event.opponent
    && /^acsc(?:\s*@\s*grace)?$/i.test(event.eventText.trim())
  ));

  for (const fixture of ACSC_SOCCER_SCHEDULE) {
    // Keep any later published fixture, including its updated time and venue.
    if (!merged.some((existing) => sameFixture(existing, fixture))) merged.push({ ...fixture });
  }
  return merged;
}
