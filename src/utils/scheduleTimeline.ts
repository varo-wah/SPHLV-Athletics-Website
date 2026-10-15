import { ScheduleEvent } from '../data/scheduleTypes';

const TEAM_LABELS: Record<string, string> = {
  'VBS/VGS': 'Boys & Girls Soccer',
  'VBV/VGV': 'Boys & Girls Volleyball',
  'SMPBB/SMPGB': 'SMP Boys & Girls Basketball',
  'SMP-BB/SMP-GB': 'SMP Boys & Girls Basketball',
  VBS: 'Boys Soccer',
  VGS: 'Girls Soccer',
  VBV: 'Boys Volleyball',
  VGV: 'Girls Volleyball',
  SMPBB: 'SMP Boys Basketball',
  SMPGB: 'SMP Girls Basketball',
  'SMP-BB': 'SMP Boys Basketball',
  'SMP-GB': 'SMP Girls Basketball',
};

/** Expand display labels without changing the source codes used by fixture parsers. */
export function readableFixtureLabel(value: string) {
  return value.replace(/\b(?:VBS\/VGS|VBV\/VGV|SMPBB\/SMPGB|SMP-BB\/SMP-GB|VBS|VGS|VBV|VGV|SMP-?BB|SMP-?GB)\b/g, (code) => TEAM_LABELS[code] || code);
}

export type ScheduleDayStatus = 'past' | 'today' | 'upcoming' | 'undated';

export function scheduleDayStatus(date: string | null, todayIso: string): ScheduleDayStatus {
  if (!date) return 'undated';
  if (date === todayIso) return 'today';
  return date < todayIso ? 'past' : 'upcoming';
}

function timeInMinutes(time: string | null | undefined) {
  const parsed = time?.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
  if (!parsed) return Number.MAX_SAFE_INTEGER;
  let hour = Number(parsed[1]);
  if (parsed[3]) hour = hour % 12 + (parsed[3].toLowerCase() === 'pm' ? 12 : 0);
  return hour * 60 + Number(parsed[2]);
}

export function chronologicalScheduleDays(events: readonly ScheduleEvent[]) {
  const groups = new Map<string, ScheduleEvent[]>();
  [...events].sort((a, b) => (
    (a.date || '9999').localeCompare(b.date || '9999')
    || timeInMinutes(a.time) - timeInMinutes(b.time)
    || a.team.localeCompare(b.team)
  )).forEach((event) => {
    const key = event.date || 'undated';
    const day = groups.get(key) || [];
    day.push(event);
    groups.set(key, day);
  });
  return [...groups].map(([key, dayEvents]) => ({
    key,
    date: key === 'undated' ? null : key,
    events: dayEvents,
  }));
}
