import { SheetMatch } from '../services/parsers';
import { presentResultTeams, resultOutcomeLabel } from '../utils/teamGamePresentation';
import TeamLogo from './TeamLogo';

interface CompactResultCardProps {
  match: SheetMatch;
  formatDate: (date: string | null) => string;
  dense?: boolean;
  key?: string | number;
}

export default function CompactResultCard({ match, formatDate, dense = false }: CompactResultCardProps) {
  const teams = presentResultTeams(match);
  const outcome = resultOutcomeLabel(match.result);
  const outcomeClasses = match.result === 'W'
    ? 'text-green-700 dark:text-green-300'
    : match.result === 'L'
      ? 'text-brand-red dark:text-red-300'
      : 'text-amber-700 dark:text-amber-300';

  return (
    <article className="overflow-hidden rounded-2xl border border-border/10 bg-subcard shadow-[0_2px_7px_rgba(0,0,0,0.06)]">
      <div className={`grid grid-cols-[minmax(0,1fr)_58px] items-stretch ${dense ? 'min-h-[86px]' : 'min-h-[102px]'}`}>
        <div className="divide-y divide-border/6">
          {teams.map((team) => (
            <div
              key={`${match.id}-${team.home ? 'home' : 'away'}`}
              className={`grid grid-cols-[28px_28px_minmax(0,1fr)] items-center gap-2 px-3 ${dense ? 'h-[43px]' : 'h-[51px]'}`}
            >
              <TeamLogo name={team.name} className="h-7 w-7" />
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
        </div>
      </div>
    </article>
  );
}
