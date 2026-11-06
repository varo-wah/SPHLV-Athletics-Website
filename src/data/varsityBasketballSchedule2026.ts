import { VARSITY_BASKETBALL_SEASON } from '../config/launchSports';
import { SCHOOL_MASTER_SCHEDULE_URL } from '../config/sheets';
import type { ScheduleEvent } from './scheduleTypes';

// Season 2, columns A:D, rows 6–49 of the school's 26–27 master workbook.
// After Christmas the stored dates revert to Jan/Feb 2026. Await corrected dates.
type Session = Pick<ScheduleEvent, 'raw' | 'eventText' | 'eventType' | 'location' | 'opponent' | 'time' | 'details'>;

const tryouts: Session = { raw: 'Tryouts Gym 2', eventText: 'Tryouts', eventType: 'Practice', location: 'Gym 2' };
const practice: Session = { raw: 'Practice Gym 2', eventText: 'Practice', eventType: 'Practice', location: 'Gym 2' };
const morningPractice: Session = { ...practice, raw: 'Practice Gym 2 AM', eventText: 'Morning practice' };
const dragons: Session = {
  raw: 'Friendly vs Dragons Club 5pm Gym 2', eventText: 'Friendly vs Dragons Club', eventType: 'Home Game',
  opponent: 'Dragons Club', time: '17:00', location: 'Gym 2',
};
const stl: Session = { raw: 'STL @ LV', eventText: 'STL at SPH-LV', eventType: 'Home Game', opponent: 'STL', location: 'SPH-LV' };
const bsj: Session = { raw: 'LV @ BSJ', eventText: 'SPH-LV at BSJ', eventType: 'Away Game', opponent: 'BSJ', location: 'BSJ' };
const acsAcg: Session = {
  raw: 'ACS/ACG @ LV 09:00', eventText: 'ACS/ACG at SPH-LV', eventType: 'Home Game', opponent: 'ACS/ACG',
  time: '09:00', location: 'SPH-LV', details: 'The session starts at 09:00. Individual game times are pending.',
};
const kvGjs: Session = {
  raw: 'KV/GJS @ LV', eventText: 'KV/GJS at SPH-LV', eventType: 'Home Game', opponent: 'KV/GJS', location: 'SPH-LV',
};

// One session in both columns unless a different girls' session is given.
const dates: [date: string, boys: Session, girls?: Session][] = [
  ['2026-11-02', tryouts],
  ['2026-11-03', tryouts],
  ['2026-11-06', dragons, { ...tryouts, raw: 'Tryouts Gym 1', location: 'Gym 1' }],
  ['2026-11-09', practice, tryouts],
  ['2026-11-10', practice, tryouts],
  ['2026-11-13', practice],
  ['2026-11-16', practice],
  ['2026-11-17', morningPractice],
  ['2026-11-20', stl],
  ['2026-11-21', bsj],
  ['2026-11-27', practice],
  ['2026-11-30', practice],
  ['2026-12-01', practice],
  ['2026-12-04', practice],
  ['2026-12-05', acsAcg],
  ['2026-12-07', practice],
  ['2026-12-08', practice],
  ['2026-12-11', practice],
  ['2026-12-12', kvGjs],
  ['2026-12-14', practice],
  ['2026-12-15', practice],
];

export const VARSITY_BASKETBALL_SCHEDULE: ScheduleEvent[] = dates.flatMap(([date, boys, girls = boys]) => {
  const week = 1 + Math.floor((Date.parse(date) - Date.UTC(2026, 10, 2)) / (7 * 86_400_000));
  return (['Boys', 'Girls'] as const).map(gender => ({
    id: `varsity-basketball-${gender.toLowerCase()}-${date}`, season: VARSITY_BASKETBALL_SEASON,
    week: `Week #${week}`, date, day: new Date(date).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
    team: `Varsity ${gender} Basketball`, sport: 'Basketball', sportKey: 'Basketball', genderGroup: gender, level: 'SMA',
    timeZone: 'Asia/Jakarta', sourceUrl: SCHOOL_MASTER_SCHEDULE_URL, sourceLabel: 'School master schedule',
    ...(gender === 'Boys' ? boys : girls),
  }));
});
