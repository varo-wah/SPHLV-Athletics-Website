import { CalendarDays, ChevronRight, MapPin, Newspaper, Plus, Star, Trophy } from 'lucide-react';
import { useMemo } from 'react';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { ScheduleEvent } from '../data/scheduleTypes';
import { SheetMatch } from '../services/parsers';
import { isCompetitiveScheduleEvent } from '../services/masterScheduleParser';
import { useAuth } from '../contexts/AuthContext';
import { useTeamFavorites } from '../contexts/TeamFavoritesContext';
import { DivisionTab, GenderTab, SportTab } from '../types';
import { getTeamFavoriteLabel } from '../utils/teamFavorites';
import { isLaunchTeamSelection, isVisibleScheduleEvent } from '../config/launchSports';
import eagleAppHomeBanner from '../assets/eagle-app-home-banner.jpg';

interface HomeScreenProps {
  athleticsDataState: AthleticsDataState;
  onNavigateToNews: () => void;
  onNavigateToSchedule: () => void;
  onNavigateToTeam: (sport: SportTab, division: DivisionTab, gender: GenderTab) => void;
  onBrowseTeams: () => void;
}

const favoriteTeamEmojis: Record<SportTab, string> = {
  Basketball: '🏀',
  Volleyball: '🏐',
  Soccer: '⚽',
  Badminton: '🏸',
  TrackAndField: '🏃',
};

export default function HomeScreen({
  athleticsDataState,
  onNavigateToNews,
  onNavigateToSchedule,
  onNavigateToTeam,
  onBrowseTeams,
}: HomeScreenProps) {
  const { user } = useAuth();
  const { favoriteTeams, loading: favoritesLoading, error: favoritesError } = useTeamFavorites();
  const visibleFavoriteTeams = favoriteTeams.filter((favorite) => (
    isLaunchTeamSelection(favorite.sport, favorite.division, favorite.gender)
  ));

  const formatScheduleDateTime = (event: ScheduleEvent | null) => {
    if (!event) return 'Schedule pending';

    const parsedDate = event.date ? new Date(`${event.date} ${event.time || '00:00'}`) : null;

    if (parsedDate && !Number.isNaN(parsedDate.getTime())) {
      const date = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(parsedDate);

      return `${date}${event.time ? ` @ ${event.time}` : ''}`;
    }

    if (event.date || event.time) {
      return `${event.date || 'Date TBD'}${event.time ? ` @ ${event.time}` : ''}`;
    }

    return 'Date TBD';
  };

  const nextUpcomingEvent = useMemo(() => {
    const now = new Date();
    const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const eventTime = (event: ScheduleEvent) => {
      if (!event.date) return Number.MAX_SAFE_INTEGER;
      const parsed = new Date(`${event.date} ${event.time || '00:00'}`).getTime();
      return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
    };

    return [...(athleticsDataState.data.masterScheduleEvents || [])]
      .filter((event) => (
        isCompetitiveScheduleEvent(event) &&
        Boolean(event.date && event.date >= todayIso) &&
        isVisibleScheduleEvent(event.season, event.sportKey || null, event.team)
      ))
      .sort((a, b) => eventTime(a) - eventTime(b))[0] || null;
  }, [athleticsDataState.data.masterScheduleEvents]);

  const recentFinishedMatch = useMemo(() => {
    const finishedMatches = (athleticsDataState.data.matches || [])
      .filter((match: SheetMatch) => {
        return match.status === 'Finished' && match.scoreFor !== null && match.scoreAgainst !== null;
      })
      .sort((a: SheetMatch, b: SheetMatch) => {
        const aTime = new Date(`${a.date} ${a.time || '00:00'}`).getTime();
        const bTime = new Date(`${b.date} ${b.time || '00:00'}`).getTime();

        if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
        if (Number.isNaN(aTime)) return 1;
        if (Number.isNaN(bTime)) return -1;

        return bTime - aTime;
      });

    return finishedMatches[0] || null;
  }, [athleticsDataState.data.matches]);

  const recentResultScore = recentFinishedMatch && recentFinishedMatch.scoreFor !== null && recentFinishedMatch.scoreAgainst !== null
    ? `${recentFinishedMatch.scoreFor}–${recentFinishedMatch.scoreAgainst}`
    : '—';

  const recentResultBadge = recentFinishedMatch?.result || '—';

  const recentResultBadgeClass =
    recentResultBadge === 'W'
      ? 'text-green-700 dark:text-green-400'
      : recentResultBadge === 'L'
        ? 'text-brand-red dark:text-red-400'
        : recentResultBadge === 'D'
          ? 'text-amber-700 dark:text-yellow-300'
          : 'text-foreground/40';

  const nextMatchTitle = nextUpcomingEvent?.eventText || 'No upcoming match';

  const nextMatchMeta = athleticsDataState.loading
    ? 'Loading live schedule...'
    : formatScheduleDateTime(nextUpcomingEvent);

  const recentResultTeam = recentFinishedMatch
    ? `${recentFinishedMatch.level} ${recentFinishedMatch.genderGroup} ${recentFinishedMatch.sport}`
    : 'Results pending';

  const recentResultOpponent = recentFinishedMatch
    ? `vs ${recentFinishedMatch.opponent}`
    : 'No completed games yet';

  const canOpenRecentTeam = Boolean(
    recentFinishedMatch
    && isLaunchTeamSelection(
      recentFinishedMatch.sportKey,
      recentFinishedMatch.level,
      recentFinishedMatch.genderGroup,
    ),
  );

  return (
    <div className="animate-in fade-in duration-500 pb-8 px-4 space-y-6 mt-4">
      <div className="hero-image-card">
        <img
          src={eagleAppHomeBanner}
          alt="Eagle App — SPH-LV Athletics"
          className="hero-banner-img"
        />
      </div>

      {user && (
        <section
          aria-labelledby="my-teams-heading"
          className="overflow-hidden rounded-3xl border border-border/10 bg-subcard/70 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.14)] backdrop-blur-xl sm:p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#F4C95D]/25 bg-[#F4C95D]/10 text-[#F4C95D]">
                <Star size={18} fill="currentColor" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#B5413F]">
                  Quick access
                </p>
                <h2 id="my-teams-heading" className="text-xl font-black uppercase tracking-[0.08em] text-foreground">
                  My Teams
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onBrowseTeams}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/10 bg-foreground/[0.035] px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-foreground/55 transition-colors hover:border-[#B5413F]/30 hover:bg-[#B5413F]/10 hover:text-foreground"
            >
              <Plus size={13} />
              Browse
            </button>
          </div>

          {favoritesLoading ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading favorite teams">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-[72px] animate-pulse rounded-2xl bg-foreground/[0.035]" />
              ))}
            </div>
          ) : visibleFavoriteTeams.length > 0 ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {visibleFavoriteTeams.map((favorite) => {
                const sportEmoji = favoriteTeamEmojis[favorite.sport];
                const label = getTeamFavoriteLabel(favorite);

                return (
                  <button
                    key={favorite.key}
                    type="button"
                    onClick={() => onNavigateToTeam(favorite.sport, favorite.division, favorite.gender)}
                    className="group flex min-h-[72px] items-center justify-between gap-3 rounded-2xl border border-border/10 bg-foreground/[0.025] px-3.5 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-[#B5413F]/30 hover:bg-[#B5413F]/10"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/10 bg-foreground/[0.035] transition-colors group-hover:border-[#B5413F]/25">
                        <span aria-hidden="true" className="text-xl leading-none">
                          {sportEmoji}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black uppercase tracking-[0.07em] text-foreground">
                          {label}
                        </p>
                        <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-foreground/35">
                          Open team
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-foreground/30 transition-transform group-hover:translate-x-0.5 group-hover:text-[#B5413F]" />
                  </button>
                );
              })}
            </div>
          ) : (
            <button
              type="button"
              onClick={onBrowseTeams}
              className="mt-4 flex w-full items-center justify-between gap-4 rounded-2xl border border-dashed border-border/15 bg-foreground/[0.018] px-4 py-4 text-left transition-colors hover:border-[#B5413F]/30 hover:bg-[#B5413F]/8"
            >
              <div>
                <p className="text-sm font-black uppercase tracking-[0.08em] text-foreground/75">
                  No favorite teams yet
                </p>
                <p className="mt-1 text-xs font-semibold text-foreground/38">
                  Open a team and tap Favorite to add it here.
                </p>
              </div>
              <ChevronRight size={18} className="shrink-0 text-foreground/35" />
            </button>
          )}

          {favoritesError && (
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-red-400">
              {favoritesError}
            </p>
          )}
        </section>
      )}

      <section className="space-y-3" aria-labelledby="at-a-glance-heading">
        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-brand-red">
              Live athletics
            </p>
            <h2 id="at-a-glance-heading" className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-foreground">
              At a Glance
            </h2>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-foreground/35">
            Tap for details
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onNavigateToSchedule}
            className="group flex min-h-[168px] min-w-0 flex-col rounded-3xl border border-brand-navy/10 bg-[linear-gradient(145deg,#FFFFFF_0%,rgba(248,250,252,0.94)_70%,rgba(102,155,188,0.16)_100%)] p-4 text-left shadow-[0_16px_42px_rgba(0,48,73,0.10)] transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(0,48,73,0.72),rgba(10,4,5,0.96))]"
            aria-label="Open schedule for next game details"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-sky/18 text-brand-navy dark:text-brand-sky">
                <CalendarDays size={17} />
              </span>
              <ChevronRight size={16} className="text-brand-navy/30 transition-transform group-hover:translate-x-0.5 dark:text-white/30" />
            </div>
            <p className="mt-4 text-[9px] font-black uppercase tracking-[0.18em] text-brand-navy/55 dark:text-brand-sky/75">
              Next game
            </p>
            <h3 className="mt-1 line-clamp-2 text-sm font-black uppercase leading-tight text-brand-navy dark:text-white">
              {athleticsDataState.loading ? 'Loading schedule' : nextMatchTitle}
            </h3>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.08em] text-foreground/45 dark:text-white/48">
              {nextMatchMeta}
            </p>
            <p className="mt-auto flex min-w-0 items-center gap-1.5 pt-3 text-[9px] font-black uppercase tracking-[0.1em] text-brand-navy/48 dark:text-white/42">
              <MapPin size={12} className="shrink-0 text-brand-sky" />
              <span className="truncate">{nextUpcomingEvent?.location || 'Venue TBD'}</span>
            </p>
          </button>

          <button
            type="button"
            disabled={!canOpenRecentTeam}
            onClick={() => {
              if (!recentFinishedMatch || !canOpenRecentTeam) return;
              onNavigateToTeam(
                recentFinishedMatch.sportKey,
                recentFinishedMatch.level,
                recentFinishedMatch.genderGroup,
              );
            }}
            className="group flex min-h-[168px] min-w-0 flex-col rounded-3xl border border-brand-red/12 bg-[linear-gradient(145deg,#FFFFFF_0%,rgba(248,250,252,0.94)_66%,rgba(193,18,31,0.11)_100%)] p-4 text-left shadow-[0_16px_42px_rgba(120,0,0,0.10)] transition-transform hover:-translate-y-0.5 disabled:cursor-default disabled:hover:translate-y-0 dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(120,0,0,0.62),rgba(10,4,5,0.96))]"
            aria-label={recentFinishedMatch ? `Open ${recentResultTeam}` : 'No latest result available'}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red dark:text-red-300">
                <Trophy size={17} />
              </span>
              <span className={`text-xl font-black uppercase ${recentResultBadgeClass}`}>
                {recentResultBadge}
              </span>
            </div>
            <p className="mt-4 text-[9px] font-black uppercase tracking-[0.18em] text-brand-red/65 dark:text-red-300/75">
              Latest result
            </p>
            <h3 className="mt-1 line-clamp-2 text-sm font-black uppercase leading-tight text-brand-navy dark:text-white">
              {athleticsDataState.loading ? 'Loading result' : recentResultTeam}
            </h3>
            <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.06em] text-foreground/45 dark:text-white/48">
              {recentResultOpponent}
            </p>
            <div className="mt-auto flex items-end justify-between gap-2 pt-3">
              <span className="truncate text-[9px] font-black uppercase tracking-[0.08em] text-brand-maroon/45 dark:text-white/42">
                {recentFinishedMatch?.date || 'Awaiting result'}
              </span>
              <strong className="shrink-0 text-xl font-black text-brand-navy dark:text-white">
                {recentResultScore}
              </strong>
            </div>
          </button>
        </div>
      </section>

      <button
        type="button"
        onClick={onNavigateToNews}
        className="group flex w-full items-center gap-4 overflow-hidden rounded-3xl border border-brand-red/12 bg-[linear-gradient(120deg,#FFFFFF_0%,rgba(248,250,252,0.94)_58%,rgba(193,18,31,0.09)_100%)] p-4 text-left shadow-[0_14px_38px_rgba(120,0,0,0.08)] transition-transform hover:-translate-y-0.5 hover:border-brand-red/25 dark:border-white/10 dark:bg-[linear-gradient(120deg,rgba(120,0,0,0.54),rgba(10,4,5,0.96))]"
        aria-label="View athletics news"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red dark:bg-white/8 dark:text-red-300">
          <Newspaper size={19} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-brand-red/65 dark:text-red-300/75">
            Eagles updates
          </span>
          <span className="mt-1 block text-sm font-black uppercase tracking-[0.08em] text-brand-navy dark:text-white">
            View news here
          </span>
          <span className="mt-1 block truncate text-[10px] font-semibold text-foreground/42 dark:text-white/42">
            Announcements and game stories as they are published.
          </span>
        </span>
        <ChevronRight size={18} className="shrink-0 text-brand-maroon/30 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-red dark:text-white/30" />
      </button>

    </div>
  );
}
