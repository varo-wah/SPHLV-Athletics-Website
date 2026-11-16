import { SCHOOL_MASTER_SCHEDULE_URL } from '../config/sheets';
import type { ScheduleEvent } from './scheduleTypes';

// SPHLV Sports Master Schedule 26-27.xlsx, Season 2!B6:F49, read November 16.
// Columns E/F identify SMP boys/girls volleyball. Dates use the stored Excel
// serial values, which are November–December 2026 despite the stale page title.
// Rows 56 onward revert to January 2026; do not infer corrected 2027 dates.
type Session = Pick<ScheduleEvent, 'raw' | 'eventText' | 'eventType' | 'location' | 'opponent' | 'time' | 'details' | 'pairingsPending'>;

const gym: Session = { raw: 'Practice Gym 1', eventText: 'Practice', eventType: 'Practice', location: 'Gym 1' };
const covered: Session = { raw: 'Practice Covered', eventText: 'Practice', eventType: 'Practice', location: 'Covered court' };
const coveredOutdoor: Session = { raw: 'Practice Covered/Outdoor', eventText: 'Practice', eventType: 'Practice', location: 'Covered / outdoor court' };
const stl: Session = {
  raw: 'STL @ LV', eventText: 'STL at SPH-LV', eventType: 'Home Game', opponent: 'STL', location: 'SPH-LV',
};
const acg: Session = {
  raw: 'LV @ ACG', eventText: 'SPH-LV at ACG', eventType: 'Away Game', opponent: 'ACG', location: 'ACG',
};
const bsj: Session = {
  raw: 'BSJ @ LV 08:00', eventText: 'BSJ at SPH-LV', eventType: 'Home Game', opponent: 'BSJ', location: 'SPH-LV', time: '08:00',
  details: 'The school schedule lists 08:00 for both teams. Separate match times are not specified.',
};
const gjsSession: Session = {
  pairingsPending: true,
  raw: 'LV/KV @ GJS', eventText: 'LV / KV session at GJS', eventType: 'Away Game', location: 'GJS',
  details: 'The school schedule lists LV and KV at GJS. Individual pairings and start times are to be confirmed.',
};

// Explicitly retain each team's venue; a blank workbook cell is not a practice.
const sessions: readonly [date: string, boys: Session, girls: Session][] = [
  ['2026-11-02', gym, coveredOutdoor],
  ['2026-11-03', covered, gym],
  ['2026-11-06', coveredOutdoor, coveredOutdoor],
  ['2026-11-10', covered, gym],
  ['2026-11-13', gym, coveredOutdoor],
  ['2026-11-16', covered, coveredOutdoor],
  ['2026-11-17', stl, stl],
  ['2026-11-20', gym, coveredOutdoor],
  ['2026-11-27', gym, coveredOutdoor],
  ['2026-11-28', acg, acg],
  ['2026-11-30', covered, coveredOutdoor],
  ['2026-12-01', covered, gym],
  ['2026-12-04', gym, coveredOutdoor],
  ['2026-12-05', bsj, bsj],
  ['2026-12-07', covered, coveredOutdoor],
  ['2026-12-08', covered, gym],
  ['2026-12-11', gym, coveredOutdoor],
  ['2026-12-12', gjsSession, gjsSession],
  ['2026-12-14', covered, coveredOutdoor],
  ['2026-12-15', covered, gym],
];

export const SMP_VOLLEYBALL_SCHEDULE: ScheduleEvent[] = sessions.flatMap(([date, boys, girls]) => {
  const week = 1 + Math.floor((Date.parse(date) - Date.UTC(2026, 10, 2)) / (7 * 86_400_000));
  return (['Boys', 'Girls'] as const).map(gender => ({
    id: `smp-volleyball-${gender.toLowerCase()}-${date}`,
    season: 'Season 2', week: `Week #${week}`, date,
    day: new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
    team: `SMP ${gender} Volleyball`, sport: 'Volleyball', sportKey: 'Volleyball', genderGroup: gender, level: 'SMP',
    timeZone: 'Asia/Jakarta', sourceUrl: SCHOOL_MASTER_SCHEDULE_URL, sourceLabel: 'School master schedule',
    ...(gender === 'Boys' ? boys : girls),
  }));
});
