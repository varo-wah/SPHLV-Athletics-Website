import type { ScheduleEvent } from './scheduleTypes';

// Mark Heil's September 27 Teams attachment: SMA Volleyball SPH Cup, September 28–29.
export const VOLLEYBALL_CUP_SCHEDULE: ScheduleEvent[] = (['Boys', 'Girls'] as const).flatMap(gender => [
  ['2026-09-28', '15:30', 'SLH Moria'], ['2026-09-28', '17:30', 'SMA 15'],
  ['2026-09-29', '13:30', 'SMA 4'], ['2026-09-29', '16:30', 'St. Laurensia'],
].map(([date, time, opponent]) => ({
  id: `sph-cup-volleyball-${gender}-${date}-${time}`, season: 'Season 1', week: null, date,
  day: date === '2026-09-28' ? 'Mon' : 'Tue', team: `Varsity ${gender} Volleyball`,
  sportKey: 'Volleyball', sport: 'Volleyball', level: 'SMA', genderGroup: gender,
  eventText: `SPH Cup: LV vs ${opponent} ${time} · Court ${gender === 'Boys' ? 1 : 2}`,
  eventType: 'Tournament', location: `Court ${gender === 'Boys' ? 1 : 2}`, opponent, time,
  raw: `SMA Volleyball SPH Cup 28–29 Sep 2026 · ${gender}`,
})));
