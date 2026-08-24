import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SheetMatch } from '../services/parsers';
import { presentResultTeams, resultOutcomeLabel } from '../utils/teamGamePresentation';
import MatchDetailsModal from './MatchDetailsModal';
import TeamLogo from './TeamLogo';
import { PRESS_SCALE, PRESS_TRANSITION, QUICK_TRANSITION } from '../config/motion';

interface CompactResultCardProps {
  match: SheetMatch;
  formatDate: (date: string | null) => string;
  dense?: boolean;
  key?: string | number;
}

export default function CompactResultCard({ match, formatDate, dense = false }: CompactResultCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
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
    <motion.article
      layout
      whileHover={hasDetails ? { y: -2 } : undefined}
      transition={QUICK_TRANSITION}
      className={`overflow-hidden rounded-2xl border border-border/10 bg-subcard shadow-[0_2px_7px_rgba(0,0,0,0.06)] ${hasDetails ? 'transition-[border-color,box-shadow] group-hover:border-brand-maroon/30 group-hover:shadow-[0_7px_18px_rgba(120,0,0,0.10)]' : ''}`}
    >
      <div className={`grid grid-cols-[minmax(0,1fr)_66px] items-stretch ${dense ? 'min-h-[78px]' : 'min-h-[94px]'}`}>
        <div className="divide-y divide-border/6">
          {teams.map((team) => (
            <div
              key={`${match.id}-${team.home ? 'home' : 'away'}`}
              className={`grid grid-cols-[32px_minmax(0,1fr)_28px_10px] items-center gap-1.5 py-0 pl-3 pr-1 ${dense ? 'h-[39px]' : 'h-[47px]'}`}
            >
              <TeamLogo name={team.sourceName} className="h-8 w-8" />
              <span className={`flex min-w-0 items-center gap-1.5 truncate text-[13px] font-black uppercase tracking-[0.04em] ${team.winner ? 'text-foreground' : 'text-foreground/58'}`}>
                <span className="truncate">{team.name}</span>
              </span>
              <span className={`justify-self-end font-mono text-lg font-black tabular-nums ${team.winner ? 'text-foreground' : 'text-foreground/58'}`}>
                {team.score ?? '—'}
              </span>
              <span className="flex w-3 justify-center" aria-hidden={!team.winner}>
                {team.winner && <span aria-label="Winner" className="text-[11px] text-brand-maroon">◀</span>}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center border-l border-[#D6D8DC] px-1.5 text-center dark:border-white/15">
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
    </motion.article>
  );

  if (!hasDetails) return card;

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={() => setDetailsOpen(true)}
        aria-label={`Open ${match.opponent} game statistics`}
        aria-haspopup="dialog"
        className="group block w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-maroon focus-visible:ring-offset-2"
        whileTap={{ scale: PRESS_SCALE }}
        transition={PRESS_TRANSITION}
      >
        {card}
      </motion.button>

      <AnimatePresence>
        {detailsOpen && (
          <MatchDetailsModal
            match={match}
            formatDate={formatDate}
            onClose={() => {
              setDetailsOpen(false);
              window.requestAnimationFrame(() => triggerRef.current?.focus());
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
