import type { ScheduleEvent } from '../data/scheduleTypes';
import AcscMatchup from './AcscMatchup';
import { acscTournamentForEvent } from '../data/acscTournaments2026';
import { scheduleTimeLabel } from '../utils/scheduleTime';

export default function ScheduleEventNotes({ event, showTime = false }: { event: ScheduleEvent; showTime?: boolean }) {
  if (!event.sourceUrl) return null;
  const tournament = acscTournamentForEvent(event);
  return (
    <div className="mt-2 space-y-1 text-xs font-semibold leading-relaxed text-foreground/55">
      <AcscMatchup event={event} />
      {event.status === 'Finished' && event.resultScore && <p className="font-black text-foreground">Final · SPH {event.resultScore} {event.opponent}</p>}
      {(showTime || event.timeZone) && <p>{scheduleTimeLabel(event)}</p>}
      {event.location && <p>{event.location}</p>}
      {event.details && <p>{event.details}</p>}
      <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-block font-bold text-brand-maroon underline underline-offset-2">
        {event.sourceLabel || 'Official schedule'}
      </a>
      {tournament && <a href={tournament.livestreamUrl} target="_blank" rel="noopener noreferrer" className="ml-3 inline-flex min-h-10 items-center font-bold text-brand-maroon underline underline-offset-2 dark:text-red-300">Watch on YouTube</a>}
    </div>
  );
}
