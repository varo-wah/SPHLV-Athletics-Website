import { Trophy } from 'lucide-react';
import type { SheetMatch } from '../services/parsers';
import { ACSC_SOCCER_2026 } from '../data/acscSoccer2026';

const tournaments = ['SPH Cup', 'JAAC', 'ACSC'] as const;
const basketballCupFinals: Record<string, string> = {
  'basketball-smp-boys': '2026-boys-basketball-cup-final',
  'basketball-smp-girls': '2026-girls-basketball-cup-final',
};

// Keep these separate from completed match scores and regular-season standings.
export default function TournamentResultsSection({ teamId, matches = [] }: { teamId?: string; matches?: readonly SheetMatch[] } = {}) {
  const eligibleTournaments = tournaments.filter(name => name !== 'ACSC' || !teamId?.split('-').includes('smp'));
  const basketballFinal = matches.find(match => match.teamId === teamId
    && match.reviewedFixtureId === basketballCupFinals[teamId ?? '']
    && match.reviewedFixtureId !== undefined
    && match.status === 'Finished'
    && (match.result === 'W' || match.result === 'L')
    && match.scoreFor !== null && match.scoreAgainst !== null);
  let cupPlacement = 'Pending';
  let cupSummary = 'Final placement will be posted after the tournament.';
  if (teamId === 'soccer-sma-boys') {
    cupPlacement = 'Runner-up';
    cupSummary = 'September 19, 2026 · Final: SPH-LV 1–4 SLH Moria';
  } else if (teamId === 'volleyball-sma-girls') {
    cupPlacement = 'Runner-up';
    cupSummary = 'September 28–29, 2026 · 3 wins, 1 loss';
  } else if (basketballFinal) {
    cupPlacement = basketballFinal.result === 'W' ? 'Champions' : 'Runner-up';
    const dateLabel = basketballFinal.date
      ? new Date(`${basketballFinal.date}T12:00:00+07:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Jakarta' })
      : 'Match date to be confirmed';
    cupSummary = `${dateLabel} · Final: SPH-LV ${basketballFinal.scoreFor}–${basketballFinal.scoreAgainst} ${basketballFinal.opponent}`;
  }
  return (
    <section className="mt-8 space-y-4" aria-label="Tournament results">
      <div className="border-b border-brand-maroon/10 pb-3 dark:border-border/10">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-red">
          {eligibleTournaments.map(name => name === 'SPH Cup' ? 'Cup' : name).join(' · ')}
        </p>
        <h3 className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-foreground sm:text-2xl">
          Tournament Results
        </h3>
        <p className="mt-1 text-xs font-semibold text-foreground/45">
          Final placement and championship result only.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-3">
        {eligibleTournaments.map((name) => (
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
                  {name === 'SPH Cup' ? cupPlacement : 'Pending'}
                </p>
                <p className="mt-1 text-[11px] font-semibold leading-relaxed text-foreground/48">
                  {name === 'SPH Cup' ? cupSummary : 'Final placement will be posted after the tournament.'}
                </p>
                {name === 'ACSC' && teamId === 'soccer-sma-boys' && (
                  <div className="mt-2 space-y-1 text-[11px] font-semibold leading-relaxed text-foreground/55">
                    <p>October 21–24, 2026 · Grace International School, Chiang Mai</p>
                    <p>Pool A: SPH, YISS, Morrison and ICS Hong Kong. Pool ranking uses 3 points for a win and 1 for a draw.</p>
                    <p>Results awaiting confirmation. Confirmed fixtures are listed under Games.</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      <a className="text-brand-maroon underline underline-offset-2" href={ACSC_SOCCER_2026.sourceUrl} target="_blank" rel="noopener noreferrer">Tournament booklet</a>
                      <a className="text-brand-maroon underline underline-offset-2" href={ACSC_SOCCER_2026.livestreamUrl} target="_blank" rel="noopener noreferrer">Host livestream channel</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
