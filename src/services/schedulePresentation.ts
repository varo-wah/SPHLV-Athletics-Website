import { ScheduleEvent } from '../data/scheduleTypes';

export type ScheduleTeamFilter = 'All' | 'VBS' | 'VGS' | 'VBV' | 'VGV' | 'SMPBB' | 'SMPGB';

export interface ScheduleFixtureLine {
  label: string;
  time: string | null;
}

const TEAM_FILTER_NAMES: Record<Exclude<ScheduleTeamFilter, 'All'>, string> = {
  VBS: 'Varsity Boys Soccer',
  VGS: 'Varsity Girls Soccer',
  VBV: 'Varsity Boys Volleyball',
  VGV: 'Varsity Girls Volleyball',
  SMPBB: 'SMP Boys Basketball',
  SMPGB: 'SMP Girls Basketball',
};

const GAME_EVENT_TYPES = new Set<ScheduleEvent['eventType']>([
  'Home Game',
  'Away Game',
  'Tournament',
]);

function normalized(value: string | null | undefined) {
  return (value || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function genderFromTeam(team: string) {
  if (/\bboys?\b/i.test(team)) return 'boys';
  if (/\bgirls?\b/i.test(team)) return 'girls';
  return null;
}

function withoutGender(value: string | null | undefined) {
  return normalized(value)
    .replace(/\b(?:boys?|girls?)\b/g, '')
    .replace(/\s*&\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sharedEventKey(event: ScheduleEvent) {
  return [
    normalized(event.season),
    normalized(event.week),
    normalized(event.date),
    normalized(event.time),
    normalized(event.eventType),
    normalized(event.sportKey || event.sport),
    normalized(event.level),
    withoutGender(event.team),
    withoutGender(event.eventText),
    normalized(event.location),
    normalized(event.opponent),
  ].join('|');
}

function combinedGenderLabel(value: string) {
  const replaced = value.replace(/\b(?:boys?|girls?)\b/i, 'Boys & Girls');
  if (replaced !== value) return replaced;

  const words = value.trim().split(/\s+/);
  words.splice(Math.max(words.length - 1, 0), 0, 'Boys', '&', 'Girls');
  return words.join(' ');
}

function combinedEventLabel(value: string) {
  if (/^\s*(?:boys?|girls?)\b/i.test(value)) {
    return value.replace(/\b(?:boys?|girls?)\b/i, 'Boys & Girls');
  }

  return value.replace(/\b(?:boys?|girls?)\b/gi, '').replace(/\s+/g, ' ').trim();
}

function teamCodeForSchedule(team: string) {
  const value = normalized(team);
  const combined = /boys\s*&\s*girls/.test(value);

  if (value.includes('soccer')) return combined ? 'VBS/VGS' : value.includes('girls') ? 'VGS' : 'VBS';
  if (value.includes('volleyball')) return combined ? 'VBV/VGV' : value.includes('girls') ? 'VGV' : 'VBV';
  if (value.includes('basketball')) return combined ? 'SMPBB/SMPGB' : value.includes('girls') ? 'SMPGB' : 'SMPBB';
  return team;
}

function isLvTeam(value: string) {
  return /^(?:lv|sph[-\s]?lv)$/i.test(value.trim());
}

function fixtureLabels(left: string, right: string, teamCode: string) {
  const leftTeams = left.split('/').map((value) => value.trim()).filter(Boolean);
  const rightTeams = right.split('/').map((value) => value.trim()).filter(Boolean);

  if (rightTeams.some(isLvTeam)) {
    return leftTeams.map((opponent) => `${opponent} at ${teamCode}`);
  }

  if (leftTeams.some(isLvTeam)) {
    return rightTeams.map((opponent) => `${teamCode} at ${opponent}`);
  }

  return [`${left.trim()} vs ${right.trim()}`];
}

function parseFixture(value: string, teamCode: string, time: string | null): ScheduleFixtureLine[] {
  const match = value.trim().match(/^(.+?)\s*(?:@|\bv(?:s\.?)?\b|\bat\b)\s*(.+)$/i);
  if (!match) return [];

  return fixtureLabels(match[1], match[2], teamCode).map((label) => ({ label, time }));
}

export function scheduleFixtureLines(event: ScheduleEvent): ScheduleFixtureLine[] {
  const rawTimes = [...event.raw.matchAll(/\b\d{1,2}:\d{2}(?:\s*(?:am|pm))?\b/gi)];
  const source = rawTimes.length > 1 ? event.raw : event.eventText;
  const teamCode = teamCodeForSchedule(event.team);
  const timedSegments = [...source.matchAll(/(.+?)\s+(\d{1,2}:\d{2}(?:\s*(?:am|pm))?)(?=\s|$)/gi)];

  if (timedSegments.length > 0) {
    const fixtures = timedSegments.flatMap((match) => parseFixture(match[1], teamCode, match[2]));
    if (fixtures.length > 0) return fixtures;
  }

  const withoutTime = source.replace(/\b\d{1,2}:\d{2}(?:\s*(?:am|pm))?\b/gi, '').trim();
  const fixtures = parseFixture(withoutTime, teamCode, event.time ?? null);
  if (fixtures.length > 0) return fixtures;

  return [{ label: withoutTime || event.team, time: event.time ?? null }];
}

export function isGameScheduleEvent(event: ScheduleEvent) {
  return GAME_EVENT_TYPES.has(event.eventType);
}

export function eventMatchesTeamFilter(event: ScheduleEvent, filter: ScheduleTeamFilter) {
  if (filter === 'All') return true;

  const target = TEAM_FILTER_NAMES[filter];
  if (normalized(event.team) === normalized(target)) return true;

  return withoutGender(event.team) === withoutGender(target)
    && /boys\s*&\s*girls/i.test(event.team);
}

export function consolidateSharedScheduleEvents(events: ScheduleEvent[]) {
  const groups = new Map<string, ScheduleEvent[]>();

  events.forEach((event) => {
    const key = sharedEventKey(event);
    const group = groups.get(key) || [];
    group.push(event);
    groups.set(key, group);
  });

  return [...groups.values()].flatMap((group) => {
    const genders = new Set(group.map((event) => genderFromTeam(event.team)).filter(Boolean));
    if (!genders.has('boys') || !genders.has('girls')) return group;

    const [first] = group;
    const combined: ScheduleEvent = {
      ...first,
      id: `combined-${group.map((event) => event.id).sort().join('--')}`,
      team: combinedGenderLabel(first.team),
      eventText: combinedEventLabel(first.eventText),
      raw: combinedEventLabel(first.raw),
    };
    delete combined.genderGroup;
    return [combined];
  });
}
