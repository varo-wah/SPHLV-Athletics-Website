import type { ScheduleEvent } from '../data/scheduleTypes';
import { IS_PROTOTYPE, isInReleaseSeason } from '../config/launchSports';
import { VOLLEYBALL_CUP_SCHEDULE } from '../data/volleyballCupSchedule';
import { mergeReviewedCupSchedule } from './reviewedCupSchedule';
import { mergeReviewedJaacSchedule } from './reviewedJaacSchedule';
import { mergeAcscSoccerSchedule, mergeAcscVolleyballSchedule } from './acscSchedule';
import { mergeAcscCompetitionSchedule } from './acscResults';
import { mergeAcscSwimmingSchedule } from './acscSwimmingSchedule';

/** Apply the same source corrections on first render and after the feed refreshes. */
export function reviewedSchedule(events: ScheduleEvent[], includePrototypeSeasons = IS_PROTOTYPE) {
  const master = events.filter(event => isInReleaseSeason(event.season, includePrototypeSeasons) && !(event.sportKey === 'Volleyball'
    && ['2026-09-28', '2026-09-29'].includes(event.date ?? '') && /cup/i.test(event.eventText)));
  const cup = mergeReviewedCupSchedule([...master, ...VOLLEYBALL_CUP_SCHEDULE]);
  const acsc = mergeAcscCompetitionSchedule(mergeAcscVolleyballSchedule(mergeAcscSoccerSchedule(cup)));
  return mergeAcscSwimmingSchedule(mergeReviewedJaacSchedule(acsc));
}
