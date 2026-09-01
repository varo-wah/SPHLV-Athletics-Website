import { jaacSchoolForName } from '../data/jaacSchools';
import { ScheduleEvent } from '../data/scheduleTypes';
import { scheduleFixtureLines } from '../services/schedulePresentation';

export interface HomeUpcomingFixture {
  id: string;
  event: ScheduleEvent;
  opponent: string;
  opponentLogoName: string;
  teamCode: string;
  time: string | null;
}

function teamCodeForEvent(event: ScheduleEvent) {
  const combined = /boys\s*&\s*girls/i.test(event.team);
  const gender = combined
    ? 'B/G'
    : event.genderGroup === 'Girls'
      ? 'G'
      : 'B';

  if (event.sportKey === 'Soccer') return combined ? 'VBS/VGS' : `V${gender}S`;
  if (event.sportKey === 'Volleyball') return combined ? 'VBV/VGV' : `V${gender}V`;
  if (event.sportKey === 'Basketball') return combined ? 'SMP-BB/SMP-GB' : `SMP-${gender}B`;
  return event.team;
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
    const teamCode = teamCodeForEvent(event);
    const lines = scheduleFixtureLines(event);
    const ourFixtures = lines.flatMap((line, index) => {
      const opponent = opponentFromFixtureLabel(line.label, teamCode);
      if (!opponent) return [];

      const school = jaacSchoolForName(opponent);
      return [{
        id: `${event.id}-fixture-${index}`,
        event,
        opponent: school?.code ?? opponent.toUpperCase(),
        opponentLogoName: school?.code ?? opponent,
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
      teamCode,
      time: event.time ?? null,
    } satisfies HomeUpcomingFixture];
  });
}
