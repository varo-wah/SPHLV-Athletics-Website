import { Trophy } from 'lucide-react';
import type { SheetMatch } from '../services/parsers';
import { acscResultsForTeam } from '../data/acscCompetitionResults2026';
import AcscTournamentBanner from './AcscTournamentBanner';

const tournaments = ['SPH Cup', 'JAAC', 'ACSC'] as const;
const basketballCupFinals: Record<string, string> = {
  'basketball-smp-boys': '2026-boys-basketball-cup-final',
  'basketball-smp-girls': '2026-girls-basketball-cup-final',
};
const basketballJaacFinals: Record<string, string> = {
  'basketball-smp-boys': '2026-boys-basketball-jaac-final',
  'basketball-smp-girls': '2026-girls-basketball-jaac-final',
};

function finalSummary(match: SheetMatch): string {
  const dateLabel = match.date
    ? new Date(`${match.date}T12:00:00+07:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Jakarta' })
    : 'Match date to be confirmed';
  return `${dateLabel} · Final: SPH-LV ${match.scoreFor}–${match.scoreAgainst} ${match.opponent}`;
}

// Keep these separate from completed match scores and regular-season standings.
export default function TournamentResultsSection({ teamId, matches = [] }: { teamId?: string; matches?: readonly SheetMatch[] } = {}) {
  const acsc = acscResultsForTeam(teamId);
  const eligibleTournaments = tournaments.filter(name => name !== 'ACSC' || !teamId?.split('-').includes('smp'));
  const basketballFinal = matches.find(match => match.teamId === teamId
    && match.reviewedFixtureId === basketballCupFinals[teamId ?? '']
    && match.reviewedFixtureId !== undefined
    && match.status === 'Finished'
    && (match.result === 'W' || match.result === 'L')
    && match.scoreFor !== null && match.scoreAgainst !== null);
  const jaacFinal = matches.find(match => match.teamId === teamId
    && match.reviewedFixtureId === basketballJaacFinals[teamId ?? '']
    && match.reviewedFixtureId !== undefined && match.status === 'Finished'
    && (match.result === 'W' || match.result === 'L')
    && match.scoreFor !== null && match.scoreAgainst !== null);
  const acscRank = acsc?.finalPlacements?.find(row => row.school === 'SPH')?.rank;
  const acscPlacement = acscRank === 1 ? 'Champions' : acscRank === 2 ? 'Runner-up' : acscRank === 3 ? '3rd place' : acscRank ? `${acscRank}th place` : acsc?.complete ? 'Placement unconfirmed' : 'In progress';
  let cupPlacement = 'Pending';
  let cupSummary = 'Final placement will be posted after the tournament.';
  if (teamId === 'soccer-sma-boys') {
    cupPlacement = 'Runner-up';
    cupSummary = 'September 19, 2026 · Final: SPH-LV 1–4 SLH Moria';
  } else if (teamId === 'volleyball-sma-girls') {
    cupPlacement = 'Runner-up';
    cupSummary = 'September 28–29, 2026 · 3 wins, 1 loss';
  } else if (teamId === 'volleyball-sma-boys') {
    cupPlacement = '3rd place · provisional';
    cupSummary = 'September 2026 · Reported placement; awaiting confirmation.';
  } else if (basketballFinal) {
    cupPlacement = basketballFinal.result === 'W' ? 'Champions' : 'Runner-up';
    cupSummary = finalSummary(basketballFinal);
  }
  return (
    <section className="mt-8 space-y-4" aria-label="Tournament results">
      {teamId?.startsWith('volleyball-') && <AcscTournamentBanner teamId={teamId} />}
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
                  {name === 'SPH Cup' ? cupPlacement : name === 'ACSC' && acsc ? acscPlacement : name === 'JAAC' && jaacFinal ? jaacFinal.result === 'W' ? 'Champions' : 'Runner-up' : 'Pending'}
                </p>
                <p className="mt-1 text-[11px] font-semibold leading-relaxed text-foreground/48">
                  {name === 'SPH Cup' ? cupSummary : name === 'JAAC' && jaacFinal ? finalSummary(jaacFinal) : name === 'ACSC' && acsc?.complete ? 'October 21–24, 2026 · Tournament complete' : 'Final placement will be posted after the tournament.'}
                </p>
                {name === 'ACSC' && acsc && (
                  <div className="mt-2 space-y-1 text-[11px] font-semibold leading-relaxed text-foreground/55">
                    <p>{acsc.summary}</p>
                    <p>{acsc.complete ? 'Final standings, match results and awards are shown above.' : 'Pool standings and playoff fixtures are shown above.'}</p>
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
