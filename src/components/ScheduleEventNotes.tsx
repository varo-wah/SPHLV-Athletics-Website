import type { ScheduleEvent } from '../data/scheduleTypes';

export default function ScheduleEventNotes({ event, showTime = false }: { event: ScheduleEvent; showTime?: boolean }) {
  if (!event.sourceUrl) return null;
  return (
    <div className="mt-2 space-y-1 text-xs font-semibold leading-relaxed text-foreground/55">
      {showTime && <p>{event.time || 'Kickoff to be confirmed'}{event.timeZone === 'Asia/Bangkok' ? ' · Thailand time (UTC+7)' : ''}</p>}
      {event.location && <p>{event.location}</p>}
      {event.details && <p>{event.details}</p>}
      <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-block font-bold text-brand-maroon underline underline-offset-2">
        {event.sourceLabel || 'Official schedule'}
      </a>
    </div>
  );
}
