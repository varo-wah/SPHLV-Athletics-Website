import type { ScheduleEvent } from './scheduleTypes';

export const ACSC_SWIMMING_2026 = {
  title: 'ACSC Swimming Championship 2026',
  startDate: '2026-10-29',
  endDate: '2026-10-31',
  host: 'Yongsan International School of Seoul',
  venue: 'Guardian Pool, YISS, Seoul, South Korea',
  timeZone: 'Asia/Seoul',
  sourceUrl: 'https://acscconference.com/swimming/',
  bookletUrl: 'https://acscconference.com/wp-content/uploads/2026/10/2026-27-acsc-swimming-booklet-edited.pdf',
  livestreamUrl: 'https://www.youtube.com/@YISSPNGames/streams',
  reviewedAt: '2026-10-29',
} as const;

// The live ACSC page still repeats SPH's 2025 names and grades. Do not publish
// them as the 2026 delegation until this year's entries are confirmed.

/** Competition sessions from booklet pp. 3–4. Arrival and ceremonies are not races. */
export const SWIMMING_ACSC_SESSIONS = [
  { number: 1, date: '2026-10-29', day: 'Thu', start: '14:30', end: '18:00', warmupStart: '13:30', warmupEnd: '14:15' },
  { number: 2, date: '2026-10-30', day: 'Fri', start: '08:00', end: '11:00', warmupStart: '07:00', warmupEnd: '07:45' },
  { number: 3, date: '2026-10-30', day: 'Fri', start: '14:30', end: '17:30', warmupStart: '13:30', warmupEnd: '14:15' },
  { number: 4, date: '2026-10-31', day: 'Sat', start: '08:00', end: '11:00', warmupStart: '07:00', warmupEnd: '07:45' },
  { number: 5, date: '2026-10-31', day: 'Sat', start: '14:00', end: '17:00', warmupStart: '13:00', warmupEnd: '13:45' },
] as const;

export const ACSC_SWIMMING_SCHEDULE: ScheduleEvent[] = SWIMMING_ACSC_SESSIONS.map(session => ({
  id: `acsc-swimming-2026-session-${session.number}`,
  season: 'Season 1',
  week: 'Week #14',
  date: session.date,
  day: session.day,
  team: 'Varsity Swim',
  eventText: `ACSC Swimming: Meet session ${session.number}`,
  eventType: 'Tournament',
  location: ACSC_SWIMMING_2026.venue,
  time: session.start,
  timeZone: ACSC_SWIMMING_2026.timeZone,
  sourceUrl: ACSC_SWIMMING_2026.bookletUrl,
  sourceLabel: 'Official ACSC swimming booklet',
  tournamentId: 'acsc-swimming-2026',
  details: `Meet session ${session.number}: ${session.start}–${session.end} KST. Warm-up: ${session.warmupStart}–${session.warmupEnd} KST. Seoul is two hours ahead of Jakarta.`,
  raw: `Official ACSC swimming booklet pp. 3–4: ${session.date}, meet session ${session.number}, ${session.start}–${session.end} KST, Guardian Pool.`,
}));
