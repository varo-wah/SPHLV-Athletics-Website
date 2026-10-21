import { ACSC_SOCCER_SCHEDULE } from '../data/acscSoccer2026';
import { ACSC_BOYS_VOLLEYBALL_SCHEDULE } from '../data/acscBoysVolleyball2026';
import { ACSC_GIRLS_VOLLEYBALL_SCHEDULE } from '../data/acscGirlsVolleyball2026';
import { acscSchoolForName } from '../data/acscSchools';
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

function volleyballGender(event: ScheduleEvent): 'Boys' | 'Girls' | null {
  const team = event.team.trim().toLowerCase();
  for (const gender of ['Boys', 'Girls'] as const) {
    if (team === `varsity ${gender.toLowerCase()} volleyball` || team === `sma ${gender.toLowerCase()} volleyball`
      || (event.sportKey === 'Volleyball' && event.level === 'SMA' && event.genderGroup === gender)) return gender;
  }
  return null;
}

/** Replace only arrival placeholders; never interpret arrival, a bye or an uncertain seed as a match. */
export function mergeAcscVolleyballSchedule(events: ScheduleEvent[]): ScheduleEvent[] {
  const merged = events.filter(event => !(volleyballGender(event)
    && event.date === '2026-10-20' && !event.opponent
    && /^acsc(?:\s*@\s*(?:hk|bkk))?$/i.test(event.eventText.trim())));
  for (const fixture of [...ACSC_BOYS_VOLLEYBALL_SCHEDULE, ...ACSC_GIRLS_VOLLEYBALL_SCHEDULE]) {
    const index = merged.findIndex(existing => existing.id === fixture.id || (
      fixture.opponent && existing.opponent && volleyballGender(existing) === fixture.genderGroup
      && existing.date === fixture.date && /\bacsc\b/i.test(existing.eventText)
      && (acscSchoolForName(existing.opponent)?.code ?? normalizedOpponent(existing.opponent))
        === (acscSchoolForName(fixture.opponent)?.code ?? normalizedOpponent(fixture.opponent))
    ));
    if (index < 0) merged.push({ ...fixture });
    else merged[index] = {
      ...fixture, ...merged[index], tournamentId: fixture.tournamentId,
      sourceUrl: merged[index].sourceUrl ?? fixture.sourceUrl,
      sourceLabel: merged[index].sourceLabel ?? fixture.sourceLabel,
    };
  }
  return merged;
}
