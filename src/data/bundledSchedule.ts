import scheduleDataJson from './schedule.json';
import seasonOneCsv from './master-schedule-season-1.csv?raw';
import type { ScheduleData } from './scheduleTypes';
import { parseCsvMatrix } from '../services/googleSheets';
import { parseMasterScheduleSeason } from '../services/masterScheduleParser';
import { reviewedSchedule } from '../services/reviewedSchedule';

const snapshot = scheduleDataJson as ScheduleData;
export const BUNDLED_SEASONS = snapshot.seasons;
export const SEASON_ONE_MATRIX = parseCsvMatrix(seasonOneCsv);
export const BUNDLED_SCHEDULE = reviewedSchedule([
  ...parseMasterScheduleSeason('Season 1', SEASON_ONE_MATRIX),
  ...snapshot.events.filter(event => event.season !== 'Season 1'),
]);
