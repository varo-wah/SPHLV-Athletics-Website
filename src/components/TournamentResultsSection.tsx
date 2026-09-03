import { Trophy } from 'lucide-react';

const tournaments = ['SPH Cup', 'JAAC', 'ACSC'] as const;

// Tournament placements are pending until current-season results are confirmed.
// Keep these separate from completed match scores and regular-season standings.
export default function TournamentResultsSection() {
  return (
    <section className="mt-8 space-y-4" aria-label="Tournament results">
      <div className="border-b border-brand-maroon/10 pb-3 dark:border-border/10">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-red">
          Cup · JAAC · ACSC
        </p>
        <h3 className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-foreground sm:text-2xl">
          Tournament Results
        </h3>
        <p className="mt-1 text-xs font-semibold text-foreground/45">
          Final placement and championship result only.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-3">
        {tournaments.map((name) => (
          <article
            key={name}
            className="rounded-2xl border border-brand-maroon/10 bg-white/80 p-4 shadow-sm dark:border-border/10 dark:bg-subcard"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-sky/18 text-brand-navy dark:text-brand-sky">
                <Trophy size={17} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-red">
                  {name}
                </p>
                <p className="mt-0.5 text-lg font-black uppercase tracking-tight text-foreground">
                  Pending
                </p>
                <p className="mt-1 text-[11px] font-semibold leading-relaxed text-foreground/48">
                  Final placement will be posted after the tournament.
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
