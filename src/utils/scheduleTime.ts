import type { ScheduleEvent } from '../data/scheduleTypes';

/** Reviewed ACSC fixtures use their host's clock; Indonesian fixtures use WIB. */
export function scheduleTimestamp(event: Pick<ScheduleEvent, 'date' | 'time' | 'timeZone'>): number {
  if (!event.date) return Number.MAX_SAFE_INTEGER;
  const offset = event.timeZone === 'Asia/Hong_Kong' ? '+08:00' : '+07:00';
  const time = event.time || '23:59';
  const value = Date.parse(`${event.date}T${time}:00${offset}`);
  return Number.isNaN(value) ? Number.MAX_SAFE_INTEGER : value;
}

export function scheduleTimeLabel(event: Pick<ScheduleEvent, 'date' | 'time' | 'timeZone'>): string {
  if (!event.time) return 'Time to be confirmed';
  if (event.timeZone === 'Asia/Hong_Kong') {
    const jakarta = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).format(new Date(scheduleTimestamp(event)));
    return `${event.time} HKT · ${jakarta} WIB`;
  }
  if (event.timeZone === 'Asia/Bangkok') return `${event.time} · Bangkok / Jakarta (UTC+7)`;
  return event.time;
}
