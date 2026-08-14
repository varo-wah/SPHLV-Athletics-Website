import { ScheduleEvent } from '../data/scheduleTypes';

export type ScheduleTeamFilter = 'All' | 'VBS' | 'VGS' | 'VBV' | 'VGV' | 'SMPBB' | 'SMPGB';

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
