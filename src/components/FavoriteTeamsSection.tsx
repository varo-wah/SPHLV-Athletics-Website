import { CalendarDays, ChevronRight, Plus, Star } from 'lucide-react';
import { useId, useMemo } from 'react';
import { isLaunchTeamSelection, isVisibleScheduleEvent } from '../config/launchSports';
import { useAuth } from '../contexts/AuthContext';
import { useTeamFavorites } from '../contexts/TeamFavoritesContext';
import { ScheduleEvent } from '../data/scheduleTypes';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { SheetMatch } from '../services/parsers';
import { DivisionTab, GenderTab, SportTab } from '../types';
import { buildFavoriteTeamSummaries } from '../utils/homePersonalization';
import { getTeamFavoriteLabel } from '../utils/teamFavorites';
import { penaltyScoreLabel, resultOutcomeLabel } from '../utils/teamGamePresentation';

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

function compactDate(date: string | null | undefined, fallback: string) {
  if (!date) return fallback;
  const [year, month, day] = date.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime())
    ? date
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
  return 'text-foreground/40';
}

function nextGameLabel(event: ScheduleEvent | null) {
  if (!event) return 'No upcoming game listed';
  return `${compactDate(event.date, 'Date TBD')}${event.time ? ` · ${event.time}` : ''} · ${event.eventText}`;
}

export default function FavoriteTeamsSection({
  athleticsDataState,
  onNavigateToTeam,
  onBrowseTeams,
}: FavoriteTeamsSectionProps) {
  const headingId = useId();
  const { user, openLoginModal } = useAuth();
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

  return (
    <section aria-labelledby={headingId} className="mb-5">
      <div className="flex items-center justify-between gap-3 border-b border-border/10 pb-2.5">
        <h2 id={headingId} className="flex items-center gap-2 text-base font-black uppercase tracking-[0.06em]">
          <Star size={17} className="text-amber-600 dark:text-amber-300" fill="currentColor" />
          My Teams
        </h2>
        {user && (
          <button
            type="button"
            onClick={onBrowseTeams}
            className="inline-flex min-h-10 items-center gap-1.5 px-2 text-xs font-bold text-foreground/65 hover:text-foreground"
          >
            <Plus size={15} /> Add teams
          </button>
        )}
      </div>

      {!user ? (
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <p className="text-xs leading-relaxed text-foreground/60">Pin your teams to see their latest results here.</p>
          <button type="button" onClick={openLoginModal} className="min-h-10 text-xs font-bold text-brand-maroon dark:text-red-300">Sign in to pin teams <ChevronRight size={13} className="inline-block" /></button>
        </div>
      ) : loading ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2" aria-label="Loading favorite teams">
          {[0, 1].map((item) => <div key={item} className="h-28 animate-pulse rounded-lg bg-foreground/5" />)}
        </div>
      ) : summaries.length > 0 ? (
        <div className="mt-3 grid gap-3 min-[480px]:grid-cols-2">
          {summaries.map(({ favorite, nextEvent, recentMatch }) => (
            <button
              key={favorite.key}
              type="button"
              onClick={() => onNavigateToTeam(favorite.sport, favorite.division, favorite.gender)}
              className={`group min-w-0 rounded-lg border border-l-[3px] bg-card p-3 text-left transition-colors hover:bg-foreground/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/45 ${favorite.gender === 'Boys' ? 'border-border/10 border-l-[#669BBC]' : favorite.gender === 'Girls' ? 'border-border/10 border-l-[#DF8791]' : 'border-border/10 border-l-foreground/35'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex min-w-0 items-center gap-2 text-[11px] font-black uppercase leading-snug tracking-[0.03em]">
                  <span className="shrink-0 text-lg" aria-hidden="true">{sportEmojis[favorite.sport]}</span>
                  {getTeamFavoriteLabel(favorite)}
                </h3>
                <ChevronRight size={15} className="shrink-0 text-foreground/35" />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-foreground/50">
                    Latest result · {compactDate(recentMatch?.date, 'Pending')}
                  </p>
                  <p className="mt-1 truncate text-sm font-bold">
                    {athleticsDataState.loading ? 'Loading result' : recentMatch ? `vs ${recentMatch.opponent}` : 'No completed game'}
                  </p>
                </div>
                <div className="flex shrink-0 items-baseline gap-2">
                  <span className={`text-xs font-black ${resultColor(recentMatch)}`}>{recentMatch ? resultOutcomeLabel(recentMatch.result) : '—'}</span>
                  <strong className="text-xl tabular-nums">{resultScore(recentMatch)}</strong>
                </div>
              </div>
              {recentMatch?.penalties && <p className="mt-1 text-right text-[10px] text-foreground/60">{penaltyScoreLabel(recentMatch)}</p>}
              <p className="mt-3 flex gap-1.5 border-t border-border/10 pt-2 text-[10px] leading-relaxed text-foreground/60">
                <CalendarDays size={12} className="mt-0.5 shrink-0" />
                <span><span className="font-bold">Next: </span>{athleticsDataState.loading ? 'Loading schedule' : nextGameLabel(nextEvent)}</span>
              </p>
            </button>
          ))}
        </div>
      ) : (
        <button type="button" onClick={onBrowseTeams} className="w-full py-4 text-left text-xs leading-relaxed text-foreground/60 hover:text-foreground">
          Open a team and tap its star to pin it here. <span className="font-bold text-brand-maroon dark:text-red-300">Browse teams →</span>
        </button>
      )}

      {error && <p role="status" className="mt-2 text-xs text-red-600 dark:text-red-300">{error}</p>}
    </section>
  );
}
