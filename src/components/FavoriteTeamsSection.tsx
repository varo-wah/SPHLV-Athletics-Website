import { CalendarDays, ChevronRight, MapPin, Plus, Star, Trophy } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useMemo } from 'react';
import { isLaunchTeamSelection, isVisibleScheduleEvent } from '../config/launchSports';
import { PRESS_SCALE, PRESS_TRANSITION, QUICK_TRANSITION } from '../config/motion';
import { useAuth } from '../contexts/AuthContext';
import { useTeamFavorites } from '../contexts/TeamFavoritesContext';
import { ScheduleEvent } from '../data/scheduleTypes';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { SheetMatch } from '../services/parsers';
import { DivisionTab, GenderTab, SportTab } from '../types';
import { buildFavoriteTeamSummaries } from '../utils/homePersonalization';
import { getTeamFavoriteLabel } from '../utils/teamFavorites';

interface FavoriteTeamsSectionProps {
  athleticsDataState: AthleticsDataState;
  onNavigateToTeam: (sport: SportTab, division: DivisionTab, gender: GenderTab) => void;
  onBrowseTeams: () => void;
}

const sportEmojis: Record<SportTab, string> = {
  Basketball: '🏀',
  Volleyball: '🏐',
  Soccer: '⚽',
  Badminton: '🏸',
  TrackAndField: '🏃',
};

function compactGameDate(event: ScheduleEvent | null) {
  if (!event?.date) return 'Schedule pending';
  const parsed = new Date(`${event.date} ${event.time || '00:00'}`);
  if (Number.isNaN(parsed.getTime())) return event.date;
  const date = parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return date;
}

function compactResultDate(match: SheetMatch | null) {
  if (!match?.date) return 'Awaiting result';
  const [year, month, day] = match.date.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime())
    ? match.date
    : parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function resultScore(match: SheetMatch | null) {
  return match && match.scoreFor !== null && match.scoreAgainst !== null
    ? `${match.scoreFor}–${match.scoreAgainst}`
    : '—';
}

function resultColor(match: SheetMatch | null) {
  if (match?.result === 'W') return 'text-brand-sky';
  if (match?.result === 'L') return 'text-brand-red dark:text-red-300';
  if (match?.result === 'D') return 'text-amber-700 dark:text-amber-300';
  return 'text-foreground/35';
}

export default function FavoriteTeamsSection({
  athleticsDataState,
  onNavigateToTeam,
  onBrowseTeams,
}: FavoriteTeamsSectionProps) {
  const reduceMotion = useReducedMotion();
  const { user } = useAuth();
  const { favoriteTeams, loading, error } = useTeamFavorites();

  const summaries = useMemo(() => {
    const now = new Date();
    const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return buildFavoriteTeamSummaries(
      favoriteTeams.filter((favorite) => isLaunchTeamSelection(
        favorite.sport,
        favorite.division,
        favorite.gender,
      )),
      athleticsDataState.data.masterScheduleEvents || [],
      athleticsDataState.data.matches || [],
      todayIso,
      (event) => isVisibleScheduleEvent(event.season, event.sportKey || null, event.team),
    );
  }, [athleticsDataState.data.masterScheduleEvents, athleticsDataState.data.matches, favoriteTeams]);

  if (!user) return null;

  return (
    <section
      aria-labelledby="my-teams-heading"
      className="mb-5 overflow-hidden rounded-3xl border border-border/10 bg-subcard/70 p-4 shadow-[0_4px_12px_rgba(0,0,0,0.09)] backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#F4C95D]/25 bg-[#F4C95D]/10 text-[#F4C95D]">
            <Star size={18} fill="currentColor" />
          </span>
          <h1 id="my-teams-heading" className="text-lg font-black uppercase tracking-[0.07em] text-foreground">
            My Teams
          </h1>
        </div>

        <motion.button
          type="button"
          onClick={onBrowseTeams}
          aria-label="Browse all teams"
          title="Browse all teams"
          whileTap={{ scale: PRESS_SCALE }}
          transition={PRESS_TRANSITION}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/10 bg-foreground/[0.035] text-foreground/55 transition-colors hover:border-brand-maroon/30 hover:bg-brand-maroon/10 hover:text-foreground"
        >
          <Plus size={18} />
        </motion.button>
      </div>

      {loading ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2" aria-label="Loading favorite teams">
          {[0, 1].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-3xl bg-foreground/[0.035]" />
          ))}
        </div>
      ) : summaries.length > 0 ? (
        <motion.div layout className="mt-4 grid gap-3 min-[480px]:grid-cols-2">
          <AnimatePresence initial={false}>
            {summaries.map(({ favorite, nextEvent, recentMatch }) => (
              <motion.button
                key={favorite.key}
                layout
                type="button"
                onClick={() => onNavigateToTeam(favorite.sport, favorite.division, favorite.gender)}
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
                whileTap={{ scale: PRESS_SCALE }}
                transition={QUICK_TRANSITION}
                className="group min-w-0 rounded-3xl border border-border/10 bg-foreground/[0.025] p-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-brand-maroon/30 hover:bg-brand-maroon/[0.06]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/10 bg-foreground/[0.035] text-lg" aria-hidden="true">
                      {sportEmojis[favorite.sport]}
                    </span>
                    <h2 className="line-clamp-2 text-[11px] font-black uppercase leading-tight tracking-[0.05em] text-foreground">
                      {getTeamFavoriteLabel(favorite)}
                    </h2>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-foreground/30 transition-transform group-hover:translate-x-0.5" />
                </div>

                <div className="mt-2.5 grid gap-2">
                  <div className="min-w-0 rounded-2xl border border-brand-navy/8 bg-white/55 p-2 dark:border-white/8 dark:bg-white/[0.025]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.14em] text-brand-navy/55 dark:text-brand-sky/75">
                        <CalendarDays size={12} /> Next game
                      </span>
                      <span className="shrink-0 text-[8px] font-bold uppercase text-foreground/48">
                        {compactGameDate(nextEvent)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="truncate text-[11px] font-black uppercase text-brand-navy dark:text-white">
                        {athleticsDataState.loading ? 'Loading schedule' : nextEvent?.eventText || 'No upcoming game'}
                      </span>
                      <span className="flex shrink-0 items-center gap-1 text-[8px] font-bold uppercase text-foreground/42">
                        <MapPin size={10} className="text-brand-sky" /> {nextEvent?.location || 'TBD'}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0 rounded-2xl border border-brand-red/8 bg-white/55 p-2 dark:border-white/8 dark:bg-white/[0.025]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.14em] text-brand-red/65 dark:text-red-300/75">
                        <Trophy size={12} /> Latest result
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-[8px] font-bold uppercase text-foreground/48">{compactResultDate(recentMatch)}</span>
                        <strong className={`text-xs font-black ${resultColor(recentMatch)}`}>{recentMatch?.result || '—'}</strong>
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="truncate text-[11px] font-black uppercase text-brand-navy dark:text-white">
                        {athleticsDataState.loading ? 'Loading result' : recentMatch ? `vs ${recentMatch.opponent}` : 'No completed game'}
                      </span>
                      <strong className="shrink-0 text-xs text-brand-navy dark:text-white">{resultScore(recentMatch)}</strong>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <p className="mt-4 rounded-2xl border border-dashed border-border/15 px-4 py-5 text-center text-[10px] font-bold uppercase tracking-[0.1em] text-foreground/42">
          Favorite a team below to pin it here.
        </p>
      )}

      {error && <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-red-400">{error}</p>}
    </section>
  );
}
