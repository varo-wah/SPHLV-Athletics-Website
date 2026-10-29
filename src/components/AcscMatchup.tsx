import { ACSC_LOGO, acscSchoolForName } from '../data/acscSchools';
import type { ScheduleEvent } from '../data/scheduleTypes';

export default function AcscMatchup({ event }: { event: ScheduleEvent }) {
  if (!event.tournamentId) return null;
  const opponent = acscSchoolForName(event.opponent);
  const sph = acscSchoolForName('SPH')!;
  const sportLabel = event.tournamentId === 'acsc-swimming-2026'
    ? 'Swimming'
    : [event.genderGroup, event.sportKey].filter(Boolean).join(' ');
  return (
    <div className="my-3 rounded-xl border border-brand-maroon/15 bg-brand-maroon/[0.04] p-3 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.14em] text-brand-maroon dark:text-red-300">
        <img src={ACSC_LOGO} alt="ACSC" className="h-7 w-12 rounded bg-white object-contain p-0.5" />
        <span>ACSC 2026{sportLabel && ` · ${sportLabel}`}</span>
      </div>
      {opponent && (
        <div className="flex items-center justify-between gap-2 text-xs font-black text-foreground">
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <img src={sph.logo} alt={`${sph.name} logo`} className="h-10 w-10 shrink-0 rounded-full bg-white object-contain p-1" />
            <span>SPH LV</span>
          </span>
          <span className="text-[10px] text-foreground/45">VS</span>
          <span className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right">
            <span>{opponent.shortName}</span>
            <img src={opponent.logo} alt={`${opponent.name} logo`} className="h-10 w-10 shrink-0 rounded-full bg-white object-contain p-1" />
          </span>
        </div>
      )}
    </div>
  );
}
