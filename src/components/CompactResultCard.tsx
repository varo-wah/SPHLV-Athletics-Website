import { useState } from 'react';
import { SheetMatch } from '../services/parsers';
import { presentResultTeams, resultOutcomeLabel } from '../utils/teamGamePresentation';
import MatchDetailsModal from './MatchDetailsModal';
import TeamLogo from './TeamLogo';

interface CompactResultCardProps {
  match: SheetMatch;
  formatDate: (date: string | null) => string;
  dense?: boolean;
  key?: string | number;
}

export default function CompactResultCard({ match, formatDate, dense = false }: CompactResultCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const teams = presentResultTeams(match);
  const outcome = resultOutcomeLabel(match.result);
  const hasDetails = Boolean(
    match.matchType ||
    match.setScores?.length ||
    match.statLeaders?.length ||
    match.highlights?.length,
  );
  const outcomeClasses = match.result === 'W'
    ? 'text-brand-sky'
    : match.result === 'L'
      ? 'text-brand-red dark:text-red-300'
      : 'text-amber-700 dark:text-amber-300';

  const card = (
    <article className={`overflow-hidden rounded-2xl border border-border/10 bg-subcard shadow-[0_2px_7px_rgba(0,0,0,0.06)] ${hasDetails ? 'transition-all group-hover:border-brand-maroon/30 group-hover:shadow-[0_7px_18px_rgba(120,0,0,0.10)]' : ''}`}>
      <div className={`grid grid-cols-[minmax(0,1fr)_58px] items-stretch ${dense ? 'min-h-[86px]' : 'min-h-[102px]'}`}>
        <div className="divide-y divide-border/6">
          {teams.map((team) => (
            <div
              key={`${match.id}-${team.home ? 'home' : 'away'}`}
              className={`grid grid-cols-[28px_auto_minmax(0,1fr)] items-center gap-2 px-3 ${dense ? 'h-[43px]' : 'h-[51px]'}`}
            >
              <TeamLogo name={team.sourceName} className="h-7 w-7" />
              <span className="font-mono text-base font-black tabular-nums text-foreground">
                {team.score ?? '—'}
              </span>
              <span className={`flex min-w-0 items-center gap-1.5 truncate text-xs font-black uppercase tracking-[0.04em] ${team.winner ? 'text-foreground' : 'text-foreground/58'}`}>
                <span className="truncate">{team.name}</span>
                {team.winner && <span aria-label="Winner" className="shrink-0 text-[11px] text-brand-maroon">◀</span>}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center border-l border-border/6 px-1 text-center">
          <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${outcomeClasses}`}>{outcome}</span>
          <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.08em] text-foreground/36">
            {formatDate(match.date)}
          </span>
          {hasDetails && (
            <span className="mt-1 text-[7px] font-black uppercase tracking-[0.1em] text-brand-maroon">
              Stats ›
            </span>
          )}
        </div>
      </div>
    </article>
  );

  if (!hasDetails) return card;

  return (
    <>
      <button
        type="button"
        onClick={() => setDetailsOpen(true)}
        aria-label={`Open ${match.opponent} game statistics`}
        aria-haspopup="dialog"
        className="group block w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-maroon focus-visible:ring-offset-2"
      >
        {card}
      </button>

      {detailsOpen && (
        <MatchDetailsModal
          match={match}
          formatDate={formatDate}
          onClose={() => setDetailsOpen(false)}
        />
      )}
    </>
  );
}
