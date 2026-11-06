import { jaacSchoolForName } from '../data/jaacSchools';
import { ScheduleEvent } from '../data/scheduleTypes';
import { scheduleFixtureLines, teamCodeForSchedule } from '../services/schedulePresentation';

export interface HomeUpcomingFixture {
  id: string;
  event: ScheduleEvent;
  opponent: string;
  opponentLogoName: string;
  opponentLogoNames: string[];
  teamCode: string;
  time: string | null;
}

export function opponentLogoNames(value: string): string[] {
  const schools = value.split(/\s*(?:\/|&|\+|,|\band\b)\s*/i)
    .map((part) => jaacSchoolForName(part)?.code)
    .filter((code): code is NonNullable<typeof code> => Boolean(code));
  return schools.length ? [...new Set(schools)] : [value];
}

function sideContainsOurTeam(value: string, teamCode: string) {
  const normalized = value.toUpperCase();
  return teamCode
    .split('/')
    .some((code) => normalized.includes(code.toUpperCase()));
}

function opponentFromFixtureLabel(label: string, teamCode: string) {
  const match = label.trim().match(/^(.+?)\s+(?:at|vs)\s+(.+)$/i);
  if (!match) return null;

  const leftIsOurs = sideContainsOurTeam(match[1], teamCode);
  const rightIsOurs = sideContainsOurTeam(match[2], teamCode);

  if (leftIsOurs && !rightIsOurs) return match[2].trim();
  if (rightIsOurs && !leftIsOurs) return match[1].trim();
  return null;
}

function fallbackOpponent(event: ScheduleEvent) {
  return event.opponent
    || event.eventText
      .replace(/\b(?:SPH[-\s]?LV|LV)\b/gi, '')
      .replace(/^\s*(?:@|v(?:s\.?|\b)|at)\s*/i, '')
      .replace(/\s+/g, ' ')
      .trim()
    || 'Opponent TBD';
}

export function homeUpcomingFixtures(events: ScheduleEvent[]) {
  return events.flatMap((event) => {
    const scheduleCode = teamCodeForSchedule(event.team);
    const teamCode = scheduleCode.replace(/SMP([BG]B)/g, 'SMP-$1');
    // A reviewed fixture or a shared time slot already names its opponent(s).
    // Only expand individual fixtures when the sheet actually lists them.
    const fixtureLines = scheduleFixtureLines(event);
    const sharedSlot = event.opponent?.includes('/') && fixtureLines.every(line => line.time === fixtureLines[0]?.time);
    const lines = event.opponent && (event.sourceUrl || sharedSlot) ? [] : fixtureLines;
    const ourFixtures = lines.flatMap((line, index) => {
      const opponent = opponentFromFixtureLabel(line.label, scheduleCode);
      if (!opponent) return [];

      const school = jaacSchoolForName(opponent);
      return [{
        id: `${event.id}-fixture-${index}`,
        event,
        opponent: school?.code ?? opponent.toUpperCase(),
        opponentLogoName: school?.code ?? opponent,
        opponentLogoNames: opponentLogoNames(opponent),
        teamCode,
        time: line.time ?? event.time ?? null,
      } satisfies HomeUpcomingFixture];
    });

    if (ourFixtures.length > 0) return ourFixtures;

    const opponent = fallbackOpponent(event);
    const school = jaacSchoolForName(opponent);
    return [{
      id: `${event.id}-fixture-0`,
      event,
      opponent: school?.code ?? opponent.toUpperCase(),
      opponentLogoName: school?.code ?? opponent,
      opponentLogoNames: opponentLogoNames(opponent),
      teamCode,
      time: event.time ?? null,
    } satisfies HomeUpcomingFixture];
  });
}
