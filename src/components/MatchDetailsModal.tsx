import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BarChart3, CalendarDays, MapPin, Sparkles, X } from 'lucide-react';
import { SheetMatch } from '../services/parsers';
import { presentResultTeams, resultOutcomeLabel } from '../utils/teamGamePresentation';
import TeamLogo from './TeamLogo';
import { PRESS_SCALE, PRESS_TRANSITION, QUICK_TRANSITION, SOFT_SPRING, staggerDelay } from '../config/motion';

interface MatchDetailsModalProps {
  match: SheetMatch;
  formatDate: (date: string | null) => string;
  onClose: () => void;
}

const SPORT_EMOJIS: Record<SheetMatch['sportKey'], string> = {
  Soccer: '⚽',
  Volleyball: '🏐',
  Basketball: '🏀',
  Badminton: '🏸',
  TrackAndField: '🏃',
};

function DetailList({ items }: { items: string[] }) {
  return (
    <motion.ul className="space-y-2">
      {items.map((item, index) => (
        <motion.li
          key={item}
          className="flex gap-2 text-sm font-semibold leading-relaxed text-foreground/72"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...QUICK_TRANSITION, delay: staggerDelay(index) }}
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-maroon" />
          <span>{item}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export default function MatchDetailsModal({ match, formatDate, onClose }: MatchDetailsModalProps) {
  const teams = presentResultTeams(match);
  const setScores = match.setScores || [];
  const statLeaders = match.statLeaders || [];
  const highlights = match.highlights || [];
  const reduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia('(min-width: 640px)').matches,
  );
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 640px)');
    const handleChange = () => setIsDesktop(media.matches);
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 px-3 pb-24 pt-10 backdrop-blur-sm sm:items-center sm:pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={QUICK_TRANSITION}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby={`match-details-${match.id}`}
        className="max-h-[82vh] w-full max-w-xl overflow-y-auto rounded-[28px] border border-border/10 bg-card shadow-2xl"
        initial={{
          opacity: 0,
          y: reduceMotion ? 0 : isDesktop ? 10 : 42,
          scale: reduceMotion ? 1 : isDesktop ? 0.97 : 0.99,
        }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{
          opacity: 0,
          y: reduceMotion ? 0 : isDesktop ? 8 : 30,
          scale: reduceMotion ? 1 : 0.98,
        }}
        transition={SOFT_SPRING}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border/8 bg-card/95 px-5 py-4 backdrop-blur-xl">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-maroon">
              {SPORT_EMOJIS[match.sportKey]} {match.matchType || 'Match'} details
            </p>
            <h2 id={`match-details-${match.id}`} className="mt-1 text-xl font-black uppercase tracking-[0.04em] text-foreground">
              SPH LV vs {match.opponent}
            </h2>
          </div>

          <motion.button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close game details"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/10 bg-foreground/[0.04] text-foreground/55 transition-colors hover:bg-foreground/[0.08] hover:text-foreground"
            whileTap={{ scale: PRESS_SCALE }}
            transition={PRESS_TRANSITION}
          >
            <X size={17} />
          </motion.button>
        </div>

        <div className="space-y-5 p-5">
          <div className="overflow-hidden rounded-2xl border border-border/10 bg-subcard">
            {teams.map((team) => (
              <div key={`${match.id}-${team.home ? 'home' : 'away'}`} className="grid grid-cols-[36px_minmax(0,1fr)_52px] items-center gap-3 border-b border-border/6 px-4 py-3 last:border-b-0">
                <TeamLogo name={team.sourceName} className="h-9 w-9" />
                <span className={`truncate text-sm font-black uppercase ${team.winner ? 'text-foreground' : 'text-foreground/55'}`}>
                  {team.name}
                </span>
                <span className="text-right font-mono text-2xl font-black tabular-nums text-foreground">
                  {team.score ?? '—'}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-foreground/48">
            <span className="rounded-full bg-brand-maroon px-3 py-1.5 text-white">
              {resultOutcomeLabel(match.result)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/10 bg-subcard px-3 py-1.5">
              <CalendarDays size={12} /> {formatDate(match.date)}{match.time ? ` · ${match.time}` : ''}
            </span>
            {match.venue && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/10 bg-subcard px-3 py-1.5">
                <MapPin size={12} /> {match.venue}
              </span>
            )}
          </div>

          {setScores.length > 0 && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/55">
                <BarChart3 size={14} className="text-brand-maroon" /> 📊 Set scores
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {setScores.map((score, index) => (
                  <motion.div
                    key={score}
                    className="rounded-xl border border-border/10 bg-subcard px-3 py-2 text-center font-mono text-xs font-black text-foreground"
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...QUICK_TRANSITION, delay: staggerDelay(index) }}
                  >
                    {score}
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {statLeaders.length > 0 && (
            <section className="rounded-2xl border border-border/10 bg-subcard p-4">
              <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/55">
                ⭐ Stat leaders
              </h3>
              <DetailList items={statLeaders} />
            </section>
          )}

          {highlights.length > 0 && (
            <section className="rounded-2xl border border-brand-maroon/15 bg-brand-maroon/[0.045] p-4">
              <h3 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-brand-maroon">
                <Sparkles size={14} /> ⚡ Highlights
              </h3>
              <DetailList items={highlights} />
            </section>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}
