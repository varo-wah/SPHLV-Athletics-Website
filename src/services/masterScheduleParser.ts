import { DivisionTab, GenderTab, SheetSport, SportTab } from '../types';
import { ScheduleEvent, ScheduleEventType } from '../data/scheduleTypes';

const DAY_NAMES = ['Mon', 'Tues', 'Tue', 'Wed', 'Thur', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  sept: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

interface TeamIdentity {
  sport: SheetSport;
  sportKey: SportTab;
  level: DivisionTab;
  genderGroup: GenderTab;
}

export function parseMasterScheduleSeason(season: string, matrix: string[][]): ScheduleEvent[] {
  const headers = headerMap(matrix);
  const events: ScheduleEvent[] = [];
  let currentWeek: string | null = null;
  let currentDate: string | null = null;

  for (let rowIndex = 4; rowIndex < matrix.length; rowIndex += 1) {
    const row = matrix[rowIndex] || [];
    const first = clean(row[0]);
    const second = clean(row[1]);

    if (isWeekLabel(first)) {
      currentWeek = normalizeWeek(first);
      continue;
    }

    const parsedDate = parseScheduleDate(second || first) || currentDate;

    if (parseScheduleDate(second || first)) {
      currentDate = parsedDate;
    }

    if (!parsedDate) {
      continue;
    }

    headers.forEach(({ columnIndex, team }) => {
      const text = clean(row[columnIndex]);

      if (!text) {
        return;
      }

      const identity = identityForTeam(team);
      const eventType = detectEventType(text, team);

      events.push({
        id: `${season.toLowerCase().replace(/\s+/g, '-')}-${rowIndex + 1}-${columnIndex + 1}`,
        season,
        week: currentWeek,
        date: parsedDate,
        day: isDayLabel(first) ? first.replace(/\.$/, '') : dayForDate(parsedDate),
        team,
        sport: identity?.sport,
        sportKey: identity?.sportKey,
        level: identity?.level,
        genderGroup: identity?.genderGroup,
        eventText: text,
        eventType,
        location: detectLocation(text),
        opponent: detectOpponent(text),
        time: detectTime(text),
        raw: text,
      });
    });
  }

  return events;
}

export function isCompetitiveScheduleEvent(event: ScheduleEvent): boolean {
  return event.eventType === 'Home Game' || event.eventType === 'Away Game' || event.eventType === 'Tournament';
}

function headerMap(matrix: string[][]): { columnIndex: number; team: string }[] {
  const headerRow = matrix[3] || [];

  return headerRow
    .map((value, columnIndex) => ({ columnIndex, team: clean(value) }))
    .filter(({ team }) => {
      if (!team) return false;
      if (team.toLowerCase().includes('color code')) return false;
      if (team.toLowerCase().startsWith('week')) return false;
      return !DAY_NAMES.includes(team);
    });
}

function clean(value: unknown): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function isWeekLabel(value: string): boolean {
  return /\bweek\s*#?\s*\d+/i.test(value);
}

function normalizeWeek(value: string): string {
  const match = value.match(/week\s*#?\s*(\d+)/i);
  return match ? `Week #${match[1]}` : value;
}

function isDayLabel(value: string): boolean {
  return DAY_NAMES.includes(value.replace(/\.$/, ''));
}

function parseScheduleDate(value: string): string | null {
  const cleaned = clean(value);
  const match = cleaned.match(/^(\d{1,2})[-/\s]([A-Za-z]{3,5})$/);

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = MONTH_INDEX[match[2].toLowerCase()];

  if (!Number.isFinite(day) || month === undefined) {
    return null;
  }

  const year = month >= 6 ? 2026 : 2027;
  const date = new Date(year, month, day);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function dayForDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'short' });
}

function detectEventType(text: string, team: string): ScheduleEventType {
  const haystack = `${text} ${team}`.toLowerCase();

  if (/(holiday|break|no classes|retreat|pd day|good friday|academic holiday)/.test(haystack)) {
    return 'Holiday';
  }

  if (/(tournament|finals|final|acsc|jaac|sph cup)/.test(haystack)) {
    return 'Tournament';
  }

  if (/(practice|tryout|pool recovery|training|meet in)/.test(haystack)) {
    return 'Practice';
  }

  if (/\blv\s*@/.test(haystack) || /\bsph[-\s]?lv\s*@/.test(haystack)) {
    return 'Away Game';
  }

  if (/@\s*lv\b/.test(haystack) || /@\s*sph[-\s]?lv\b/.test(haystack) || /\bv\b/.test(haystack)) {
    return 'Home Game';
  }

  if (haystack.includes('game')) {
    return 'Other';
  }

  return 'Other';
}

function detectTime(text: string): string | null {
  const match = text.match(/\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b|\b\d{1,2}:\d{2}\b/i);
  return match?.[0] ?? null;
}

function detectLocation(text: string): string | null {
  const known = [
    'Main Field',
    'Side Field',
    'Back Field',
    'LV Field',
    'Gym 1',
    'Gym 2',
    'Covered Courts',
    'Covered',
    'Outdoor',
    'Track',
    'Pool',
    'K102',
    'SPH LV',
    'SPH-LV',
    'LV',
    'BSJ',
    'Grace',
    'HK',
    'BKK',
    'YISS',
    'FAITH',
    'AIS',
  ];
  const lowerText = text.toLowerCase();
  const venue = known.find((candidate) => lowerText.includes(candidate.toLowerCase()));

  if (venue) {
    return venue;
  }

  const atMatch = text.match(/@\s*([A-Za-z0-9 -]+)/);
  return atMatch?.[1]?.trim() ?? null;
}

function detectOpponent(text: string): string | null {
  const cleaned = clean(text);
  const awayMatch = cleaned.match(/\b(?:LV|SPH[-\s]?LV)\s*@\s*([A-Za-z0-9 -]+)/i);

  if (awayMatch) {
    return cleanOpponent(awayMatch[1]);
  }

  const homeMatch = cleaned.match(/([A-Za-z0-9 -/&]+)\s*@\s*(?:LV|SPH[-\s]?LV)\b/i);

  if (homeMatch) {
    return cleanOpponent(homeMatch[1]);
  }

  const versusMatch = cleaned.match(/\bLV\s+v\s+([A-Za-z0-9 -/&]+)/i);

  if (versusMatch) {
    return cleanOpponent(versusMatch[1]);
  }

  return null;
}

function cleanOpponent(value: string): string {
  return value
    .replace(/\b\d{1,2}(?::\d{2})?\s*(?:am|pm)?\b.*$/i, '')
    .replace(/\b[a-z]\s*game\b.*$/i, '')
    .trim();
}

function identityForTeam(team: string): TeamIdentity | null {
  const normalized = team.toLowerCase();

  const sport = normalized.includes('basketball')
    ? 'Basketball'
    : normalized.includes('volleyball')
      ? 'Volleyball'
      : normalized.includes('badminton')
        ? 'Badminton'
        : normalized.includes('track')
          ? 'Track & Field'
          : normalized.includes('soccer')
            ? 'Soccer'
            : null;

  if (!sport) {
    return null;
  }

  const level: DivisionTab = normalized.includes('smp') ? 'SMP' : 'SMA';
  const genderGroup: GenderTab = normalized.includes('girls')
    ? 'Girls'
    : normalized.includes('boys')
      ? 'Boys'
      : 'Combined';
  const sportKey: SportTab = sport === 'Track & Field' ? 'TrackAndField' : sport;

  return {
    sport,
    sportKey,
    level,
    genderGroup,
  };
}
