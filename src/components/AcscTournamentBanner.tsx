import { ExternalLink, Play } from 'lucide-react';
import { ACSC_LOGO, acscSchoolForName } from '../data/acscSchools';
import { acscTournamentForTeam } from '../data/acscTournaments2026';
import { acscResultsForTeam } from '../data/acscCompetitionResults2026';

const watchClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-brand-maroon px-3 py-2 text-xs font-bold text-white hover:bg-brand-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

export default function AcscTournamentBanner({ teamId }: { teamId?: string }) {
  const tournament = acscTournamentForTeam(teamId);
  if (!tournament) return null;
  const host = acscSchoolForName(tournament.host);
  const snapshot = acscResultsForTeam(teamId);
  return (
    <aside aria-label={`${tournament.title} tournament guide`} className="rounded-2xl border border-brand-maroon/25 bg-brand-maroon/[0.04] p-4 shadow-sm dark:bg-white/[0.04]">
      <div className="flex items-center gap-3">
        <img src={ACSC_LOGO} alt="ACSC" className="h-12 w-16 shrink-0 rounded-xl bg-white object-contain p-1" />
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-brand-red">International tournament</p>
          <h3 className="text-base font-black uppercase leading-tight">{tournament.title}</h3>
          <p className="mt-1 text-xs font-semibold text-foreground/65">October 21–24 · {tournament.city}</p>
        </div>
        {host && <img src={host.logo} alt={`${host.name} host logo`} className="h-10 w-10 shrink-0 rounded-full bg-white object-contain p-1" />}
      </div>
      <p className="mt-3 text-xs font-semibold leading-relaxed text-foreground/65">{snapshot?.summary ?? tournament.sourceNote}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <a href={tournament.livestreamUrl} target="_blank" rel="noopener noreferrer" className={watchClass}><Play size={14} aria-hidden="true" />Tournament broadcasts</a>
        <a href={tournament.scheduleUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1 text-xs font-bold text-brand-maroon underline underline-offset-2 dark:text-red-300">Official schedule<ExternalLink size={12} aria-hidden="true" /></a>
        <a href={tournament.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center text-xs font-bold text-brand-maroon underline underline-offset-2 dark:text-red-300">Booklet</a>
      </div>
    </aside>
  );
}
