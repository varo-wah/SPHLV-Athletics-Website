import { Trophy } from 'lucide-react';
import type { SheetMatch } from '../services/parsers';
import { acscResultsForTeam } from '../data/acscCompetitionResults2026';
import { JAAC_FINAL_RESULTS } from '../data/novemberJaacResults';

const tournaments = ['SPH Cup', 'JAAC', 'ACSC'] as const;
const basketballCupFinals: Record<string, string> = {
  'basketball-smp-boys': '2026-boys-basketball-cup-final',
  'basketball-smp-girls': '2026-girls-basketball-cup-final',
};
function roundSummary(match: SheetMatch, round = 'Final'): string {
  const dateLabel = match.date
    ? new Date(`${match.date}T12:00:00+07:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Jakarta' })
    : 'Match date to be confirmed';
  return `${dateLabel} · ${round}: SPH-LV ${match.scoreFor}–${match.scoreAgainst} ${match.opponent}`;
}

// Keep these separate from completed match scores and regular-season standings.
export default function TournamentResultsSection({ teamId, matches = [] }: { teamId?: string; matches?: readonly SheetMatch[] } = {}) {
  const acsc = acscResultsForTeam(teamId);
  const eligibleTournaments = tournaments.filter(name => name !== 'ACSC' || acsc);
  const basketballFinal = matches.find(match => match.teamId === teamId
    && match.reviewedFixtureId === basketballCupFinals[teamId ?? '']
    && match.reviewedFixtureId !== undefined
    && match.status === 'Finished'
    && (match.result === 'W' || match.result === 'L')
    && match.scoreFor !== null && match.scoreAgainst !== null);
  const jaacFinalId = JAAC_FINAL_RESULTS.find(update => update.teamId === teamId)?.fixtureId;
  const jaacFinal = matches.find(match => match.teamId === teamId
    && match.reviewedFixtureId === jaacFinalId
    && match.reviewedFixtureId !== undefined && match.status === 'Finished'
    && (match.result === 'W' || match.result === 'L')
    && match.scoreFor !== null && match.scoreAgainst !== null);
  const jaacSemifinal = matches.find(match => match.teamId === teamId && match.matchType === 'JAAC semifinal'
    && match.status === 'Finished' && (match.result === 'W' || match.result === 'L')
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
    cupSummary = roundSummary(basketballFinal);
  }
  const pendingSummary = 'Final placement will be posted after the tournament.';
  let jaacPlacement = 'Pending';
  let jaacSummary = pendingSummary;
  if (jaacFinal) {
    jaacPlacement = jaacFinal.result === 'W' ? 'Champions' : 'Runner-up';
    jaacSummary = roundSummary(jaacFinal);
  } else if (jaacSemifinal) {
    jaacPlacement = jaacSemifinal.result === 'W' ? 'Finalist' : 'Semifinalist';
    jaacSummary = roundSummary(jaacSemifinal, 'Semifinal');
  }
  const outcomes = {
    'SPH Cup': { placement: cupPlacement, summary: cupSummary },
    JAAC: { placement: jaacPlacement, summary: jaacSummary },
    ACSC: { placement: acscPlacement, summary: acsc?.complete ? 'October 21–24, 2026 · Tournament complete' : pendingSummary },
  };
  return (
    <section className="mt-8 space-y-4" aria-label="Tournament results">
      <div className="border-b border-brand-maroon/10 pb-3 dark:border-border/10">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-red">
          {eligibleTournaments.map(name => name === 'SPH Cup' ? 'Cup' : name).join(' · ')}
        </p>
        <h3 className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-foreground sm:text-2xl">
          Tournament Results
        </h3>
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
                  {outcomes[name].placement}
                </p>
                <p className="mt-1 text-[11px] font-semibold leading-relaxed text-foreground/48">
                  {outcomes[name].summary}
                </p>
                {name === 'ACSC' && acsc && (
                  <div className="mt-2 space-y-1 text-[11px] font-semibold leading-relaxed text-foreground/55">
                    <p>{acsc.summary}</p>
                    <p>See the ACSC archive below for match results and awards.</p>
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
