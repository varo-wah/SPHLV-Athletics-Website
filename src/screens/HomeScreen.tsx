import { CalendarDays, ChevronRight, MapPin, Newspaper, Plus, Star, Trophy } from 'lucide-react';
import { useMemo } from 'react';
import eagleAppHomeBanner from '../assets/eagle-app-home-banner.jpg';
import { IS_PROTOTYPE, isLaunchTeamSelection, isVisibleScheduleEvent } from '../config/launchSports';
import { useAuth } from '../contexts/AuthContext';
import { useTeamFavorites } from '../contexts/TeamFavoritesContext';
import { visibleNewsArticles } from '../data/news';
import { ScheduleEvent } from '../data/scheduleTypes';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { SheetMatch } from '../services/parsers';
import { DivisionTab, GenderTab, SportTab } from '../types';
import { buildFavoriteTeamSummaries } from '../utils/homePersonalization';
import { getTeamFavoriteLabel } from '../utils/teamFavorites';

interface HomeScreenProps {
  athleticsDataState: AthleticsDataState;
  onNavigateToNews: (articleId?: string) => void;
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

function formatScheduleDateTime(event: ScheduleEvent | null) {
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
}

function formatResultScore(match: SheetMatch | null) {
  return match && match.scoreFor !== null && match.scoreAgainst !== null
    ? `${match.scoreFor}–${match.scoreAgainst}`
    : '—';
}

function resultClass(match: SheetMatch | null) {
  if (match?.result === 'W') return 'text-green-700 dark:text-green-400';
  if (match?.result === 'L') return 'text-brand-red dark:text-red-400';
  if (match?.result === 'D') return 'text-amber-700 dark:text-yellow-300';
  return 'text-foreground/35';
}

export default function HomeScreen({
  athleticsDataState,
  onNavigateToNews,
  onNavigateToTeam,
  onBrowseTeams,
}: HomeScreenProps) {
  const { user } = useAuth();
  const { favoriteTeams, loading: favoritesLoading, error: favoritesError } = useTeamFavorites();
  const visibleFavoriteTeams = useMemo(
    () => favoriteTeams.filter((favorite) => (
      isLaunchTeamSelection(favorite.sport, favorite.division, favorite.gender)
    )),
    [favoriteTeams],
  );

  const favoriteTeamSummaries = useMemo(() => {
    const now = new Date();
    const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    return buildFavoriteTeamSummaries(
      visibleFavoriteTeams,
      athleticsDataState.data.masterScheduleEvents || [],
      athleticsDataState.data.matches || [],
      todayIso,
      (event) => isVisibleScheduleEvent(event.season, event.sportKey || null, event.team),
    );
  }, [athleticsDataState.data.masterScheduleEvents, athleticsDataState.data.matches, visibleFavoriteTeams]);

  const latestNewsArticle = useMemo(() => (
    [...visibleNewsArticles(IS_PROTOTYPE)]
      .sort((a, b) => {
        const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : Number.MIN_SAFE_INTEGER;
        const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : Number.MIN_SAFE_INTEGER;
        return bTime - aTime;
      })[0] || null
  ), []);

  const hasFavoriteTeams = Boolean(user && favoriteTeamSummaries.length > 0);

  return (
    <div className="animate-in fade-in duration-500 mt-4 space-y-6 px-4 pb-8">
      <div className="hero-image-card">
        <img
          src={eagleAppHomeBanner}
          alt="Eagle App — SPH-LV Athletics"
          className="hero-banner-img"
        />
      </div>

      {user && favoritesLoading ? (
        <section
          aria-labelledby="my-teams-loading-heading"
          className="overflow-hidden rounded-3xl border border-border/10 bg-subcard/70 p-4 shadow-[0_4px_12px_rgba(0,0,0,0.09)] backdrop-blur-xl sm:p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#F4C95D]/25 bg-[#F4C95D]/10 text-[#F4C95D]">
              <Star size={18} fill="currentColor" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#B5413F]">Personalized home</p>
              <h2 id="my-teams-loading-heading" className="text-xl font-black uppercase tracking-[0.08em] text-foreground">My Teams</h2>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2" aria-label="Loading favorite teams">
            {[0, 1].map((item) => (
              <div key={item} className="h-44 animate-pulse rounded-3xl bg-foreground/[0.035]" />
            ))}
          </div>
        </section>
      ) : hasFavoriteTeams ? (
        <section
          aria-labelledby="my-teams-heading"
          className="overflow-hidden rounded-3xl border border-border/10 bg-subcard/70 p-4 shadow-[0_4px_12px_rgba(0,0,0,0.09)] backdrop-blur-xl sm:p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#F4C95D]/25 bg-[#F4C95D]/10 text-[#F4C95D]">
                <Star size={18} fill="currentColor" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#B5413F]">Personalized home</p>
                <h2 id="my-teams-heading" className="text-xl font-black uppercase tracking-[0.08em] text-foreground">My Teams</h2>
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

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {favoriteTeamSummaries.map(({ favorite, nextEvent, recentMatch }) => {
              const sportEmoji = favoriteTeamEmojis[favorite.sport];
              const label = getTeamFavoriteLabel(favorite);
              const opponent = recentMatch ? `vs ${recentMatch.opponent}` : 'No completed games yet';

              return (
                <button
                  key={favorite.key}
                  type="button"
                  onClick={() => onNavigateToTeam(favorite.sport, favorite.division, favorite.gender)}
                  className="group min-w-0 rounded-3xl border border-border/10 bg-foreground/[0.025] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#B5413F]/30 hover:bg-[#B5413F]/8"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/10 bg-foreground/[0.035] text-xl" aria-hidden="true">
                        {sportEmoji}
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-black uppercase tracking-[0.07em] text-foreground">{label}</h3>
                        <p className="mt-1 text-[9px] font-black uppercase tracking-[0.15em] text-[#B5413F]">Favorite team</p>
                      </div>
                    </div>
                    <ChevronRight size={17} className="shrink-0 text-foreground/30 transition-transform group-hover:translate-x-0.5 group-hover:text-[#B5413F]" />
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="min-w-0 rounded-2xl border border-brand-navy/8 bg-white/55 p-3 dark:border-white/8 dark:bg-white/[0.025]">
                      <div className="flex items-center gap-2 text-brand-navy/55 dark:text-brand-sky/75">
                        <CalendarDays size={14} />
                        <span className="text-[8px] font-black uppercase tracking-[0.16em]">Next game</span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs font-black uppercase leading-tight text-brand-navy dark:text-white">
                        {athleticsDataState.loading ? 'Loading schedule' : nextEvent?.eventText || 'No upcoming game'}
                      </p>
                      <p className="mt-2 flex min-w-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.06em] text-foreground/42">
                        <MapPin size={11} className="shrink-0 text-brand-sky" />
                        <span className="truncate">{nextEvent ? `${formatScheduleDateTime(nextEvent)} · ${nextEvent.location || 'Venue TBD'}` : 'Schedule pending'}</span>
                      </p>
                    </div>

                    <div className="min-w-0 rounded-2xl border border-brand-red/8 bg-white/55 p-3 dark:border-white/8 dark:bg-white/[0.025]">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-brand-red/65 dark:text-red-300/75">
                          <Trophy size={14} />
                          <span className="text-[8px] font-black uppercase tracking-[0.16em]">Latest result</span>
                        </div>
                        <strong className={`text-sm font-black ${resultClass(recentMatch)}`}>{recentMatch?.result || '—'}</strong>
                      </div>
                      <p className="mt-2 truncate text-xs font-black uppercase text-brand-navy dark:text-white">
                        {athleticsDataState.loading ? 'Loading result' : opponent}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2 text-[9px] font-bold uppercase tracking-[0.06em] text-foreground/42">
                        <span className="truncate">{recentMatch?.date || 'Awaiting result'}</span>
                        <strong className="shrink-0 text-sm text-brand-navy dark:text-white">{formatResultScore(recentMatch)}</strong>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {favoritesError && (
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-red-400">{favoritesError}</p>
          )}
        </section>
      ) : (
        <section aria-labelledby="latest-news-heading" className="space-y-3">
          <div className="flex items-end justify-between gap-3 px-1">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-brand-red">Eagles updates</p>
              <h2 id="latest-news-heading" className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-foreground">Latest News</h2>
            </div>
            {user && (
              <button
                type="button"
                onClick={onBrowseTeams}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/10 bg-foreground/[0.035] px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-foreground/55 transition-colors hover:border-[#B5413F]/30 hover:bg-[#B5413F]/10 hover:text-foreground"
              >
                <Plus size={13} />
                Add favorites
              </button>
            )}
          </div>

          {latestNewsArticle ? (
            <button
              type="button"
              onClick={() => onNavigateToNews(latestNewsArticle.id)}
              className="group relative min-h-[250px] w-full overflow-hidden rounded-3xl border border-brand-red/12 text-left shadow-[0_4px_12px_rgba(120,0,0,0.08)]"
              aria-label={`Read latest news: ${latestNewsArticle.title}`}
            >
              <img
                src={latestNewsArticle.image}
                alt={latestNewsArticle.imageAlt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/15" />
              <span className="relative flex min-h-[250px] flex-col justify-end p-5 sm:p-6">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#5A1C2C] px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white">{latestNewsArticle.category}</span>
                  <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/65">{latestNewsArticle.dateLabel}</span>
                </span>
                <span className="mt-3 block max-w-3xl text-xl font-black uppercase leading-tight tracking-wide text-white sm:text-2xl">{latestNewsArticle.title}</span>
                <span className="mt-2 line-clamp-2 max-w-3xl text-sm font-semibold leading-relaxed text-white/68">{latestNewsArticle.excerpt}</span>
                <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                  Read latest story
                  <ChevronRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigateToNews()}
              className="group flex w-full items-center gap-4 rounded-3xl border border-brand-red/12 bg-subcard p-5 text-left shadow-[0_3px_10px_rgba(120,0,0,0.06)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red"><Newspaper size={19} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black uppercase tracking-[0.08em] text-foreground">News publishing soon</span>
                <span className="mt-1 block text-xs font-semibold text-foreground/42">Approved Eagles Athletics stories will appear here.</span>
              </span>
              <ChevronRight size={18} className="text-foreground/30" />
            </button>
          )}

          {favoritesError && (
            <p className="px-1 text-[10px] font-bold uppercase tracking-[0.12em] text-red-400">{favoritesError}</p>
          )}
        </section>
      )}
    </div>
  );
}
