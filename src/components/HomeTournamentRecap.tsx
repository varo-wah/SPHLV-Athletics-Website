import { ChevronRight, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ACSC_LOGO } from '../data/acscSchools';
import { getHomeTournamentRecap, HOME_RECAP_END, HOME_RECAP_START, isHomeRecapVisible } from '../data/homeTournamentRecap';
import type { SheetMatch } from '../services/parsers';

export default function HomeTournamentRecap({ matches = [] }: { matches?: readonly SheetMatch[] }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const nextBoundary = [HOME_RECAP_START, HOME_RECAP_END].find(boundary => boundary > now);
    if (!nextBoundary) return;
    const updateClock = () => setNow(Date.now());
    const timeout = window.setTimeout(updateClock, Math.min(2_147_483_647, Math.max(1, nextBoundary - Date.now())));
    window.addEventListener('focus', updateClock);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('focus', updateClock);
    };
  }, [now]);

  if (!isHomeRecapVisible(now)) return null;
  const recap = getHomeTournamentRecap(matches);

  return <section aria-label="October tournament recap" className="home-recap overflow-hidden rounded-2xl border border-brand-maroon/20 bg-subcard shadow-sm">
    <div className="flex items-center gap-3 border-b border-border/10 bg-brand-maroon/[0.04] px-4 py-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-maroon text-white"><Trophy size={20} aria-hidden="true" /></span>
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-brand-red">October 2026</p>
        <h2 className="text-base font-black uppercase tracking-wide">Tournament recap</h2>
      </div>
    </div>
    <div className="space-y-4 p-4">
      {([{ key: 'jaac', title: 'JAAC basketball' }, { key: 'acsc', title: 'ACSC final placements' }] as const).map(group => <div key={group.key}>
        <h3 className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-foreground/60">
          {group.key === 'acsc' && <img src={ACSC_LOGO} alt="" className="h-6 w-6 rounded-full bg-white object-contain p-0.5" />}
          {group.title}
        </h3>
        <ul className="divide-y divide-border/10">
          {recap[group.key].map(entry => <li key={entry.teamId}>
            <a href={`#/teams/${entry.teamId}`} className="flex min-h-16 items-center gap-2 rounded-lg py-2.5 transition-colors hover:bg-brand-maroon/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-maroon focus-visible:outline-offset-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold leading-snug">{entry.label}</p>
                <p className="mt-1 text-[10px] font-medium leading-relaxed text-foreground/60">{entry.detail}</p>
              </div>
              <span className="shrink-0 rounded-lg bg-brand-maroon/[0.07] px-2 py-1.5 text-[10px] font-black text-brand-maroon dark:text-red-200">{entry.outcome}</span>
              <ChevronRight size={13} aria-hidden="true" className="shrink-0 text-foreground/40" />
            </a>
          </li>)}
        </ul>
      </div>)}
      <p className="text-[10px] font-medium text-foreground/50">Tap a team for full results and awards.</p>
    </div>
  </section>;
}
