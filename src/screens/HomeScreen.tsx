import { CalendarDays, ChevronRight, MapPin, Newspaper, Plus, Star, Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import eagleAppHomeBanner from '../assets/eagleappheadbanner.png';
import CompactResultCard from '../components/CompactResultCard';
import { IS_PROTOTYPE, isLaunchTeamSelection, isVisibleScheduleEvent } from '../config/launchSports';
import { TEAM_CATALOG } from '../config/teamCatalog';
import { useAuth } from '../contexts/AuthContext';
import { useTeamFavorites } from '../contexts/TeamFavoritesContext';
import { visibleNewsArticles } from '../data/news';
import { ScheduleEvent } from '../data/scheduleTypes';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { SheetMatch } from '../services/parsers';
import { consolidateSharedScheduleEvents } from '../services/schedulePresentation';
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

  const parsedDate = event.date
    ? new Date(`${event.date} ${event.time || '00:00'}`)
    : null;

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
  if (match?.result === 'W') return 'text-brand-sky';
  if (match?.result === 'L') return 'text-brand-red dark:text-red-400';
  if (match?.result === 'D') return 'text-amber-700 dark:text-yellow-300';
  return 'text-foreground/35';
}

function compactDate(date: string | null) {
  if (!date) return 'TBD';

  const [year, month, day] = date.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function compactTeamCode(event: ScheduleEvent) {
  const catalogTeam = TEAM_CATALOG.find(
    (team) =>
      team.sport === event.sportKey &&
      team.division === event.level &&
      team.gender === event.genderGroup,
  );

  if (catalogTeam) {
    return catalogTeam.menuCode.replace(/^SMP([BG])B$/, 'SMP-$1B');
  }

  const division =
    event.level === 'SMA'
      ? 'V'
      : event.level === 'SMP'
        ? 'SMP'
        : '';

  const genders = /boys\s*&\s*girls/i.test(event.team)
    ? ['B', 'G']
    : [
        event.genderGroup === 'Boys'
          ? 'B'
          : event.genderGroup === 'Girls'
            ? 'G'
            : '',
      ];

  const sport =
    event.sportKey === 'Soccer'
      ? 'S'
      : event.sportKey === 'Volleyball'
        ? 'V'
        : event.sportKey === 'Basketball'
          ? 'B'
          : '';

  const codes = genders
    .map((gender) => `${division}${gender}${sport}`)
    .filter(Boolean);

  return (codes.join('/') || event.team).replace(
    /^SMP([BG])B$/,
    'SMP-$1B',
  );
}

function compactTeamCodeColor(code: string) {
  if (/G/.test(code)) return 'text-brand-maroon';
  if (/B/.test(code)) return 'text-brand-sky';
  return 'text-foreground/60';
}

function compactGameMeta(event: ScheduleEvent) {
  const rawVenue =
    event.eventType === 'Away Game'
      ? event.location || event.opponent
      : event.location || 'LV';

  const venue = (rawVenue || 'LV')
    .replace(/^@\s*/, '')
    .replace(/^SPH[-\s]?LV$/i, 'LV')
    .trim();

  return `@${venue} ${compactDate(event.date)} ${event.time || 'TBD'}`;
}

function compactOpponentName(event: ScheduleEvent) {
  const withoutMetadata = event.eventText
    .replace(/\b\d{1,2}:\d{2}\b/gi, '')
    .replace(/\b(?:gym|field|court)\s*\d*\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (event.eventType === 'Home Game') {
    return (
      withoutMetadata
        .replace(/\s*@\s*(?:sph[-\s]?lv|lv)\b.*$/i, '')
        .trim() ||
      event.opponent ||
      event.team
    );
  }

  if (event.eventType === 'Away Game') {
    return (
      withoutMetadata
        .replace(/^\s*(?:sph[-\s]?lv|lv)\s*@\s*/i, '')
        .trim() ||
      event.opponent ||
      event.team
    );
  }

  return event.opponent || withoutMetadata || event.team;
}

export default function HomeScreen({
  athleticsDataState,
  onNavigateToNews,
  onNavigateToTeam,
  onBrowseTeams,
}: HomeScreenProps) {
  const [gameFeedView, setGameFeedView] =
    useState<'upcoming' | 'results'>('results');
  const [heroSlide, setHeroSlide] = useState(0);

  const { user } = useAuth();

  const {
    favoriteTeams,
    loading: favoritesLoading,
    error: favoritesError,
  } = useTeamFavorites();

  const visibleFavoriteTeams = useMemo(
    () =>
      favoriteTeams.filter((favorite) =>
        isLaunchTeamSelection(
          favorite.sport,
          favorite.division,
          favorite.gender,
        ),
      ),
    [favoriteTeams],
  );

  const favoriteTeamSummaries = useMemo(() => {
    const now = new Date();

    const todayIso = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    return buildFavoriteTeamSummaries(
      visibleFavoriteTeams,
      athleticsDataState.data.masterScheduleEvents || [],
      athleticsDataState.data.matches || [],
      todayIso,
      (event) =>
        isVisibleScheduleEvent(
          event.season,
          event.sportKey || null,
          event.team,
        ),
    );
  }, [
    athleticsDataState.data.masterScheduleEvents,
    athleticsDataState.data.matches,
    visibleFavoriteTeams,
  ]);

  const latestNewsArticle = useMemo(
    () =>
      [...visibleNewsArticles(IS_PROTOTYPE)]
        .sort((a, b) => {
          const aTime = a.publishedAt
            ? new Date(a.publishedAt).getTime()
            : Number.MIN_SAFE_INTEGER;

          const bTime = b.publishedAt
            ? new Date(b.publishedAt).getTime()
            : Number.MIN_SAFE_INTEGER;

          return bTime - aTime;
        })[0] || null,
    [],
  );

  const latestResults = useMemo(
    () =>
      [...(athleticsDataState.data.matches || [])]
        .filter(
          (match) =>
            match.status === 'Finished' &&
            match.homeScore !== null &&
            match.awayScore !== null,
        )
        .sort((a, b) => {
          const aTime = new Date(
            `${a.date} ${a.time || '00:00'}`,
          ).getTime();

          const bTime = new Date(
            `${b.date} ${b.time || '00:00'}`,
          ).getTime();

          return bTime - aTime;
        })
        .slice(0, 4),
    [athleticsDataState.data.matches],
  );

  const nextGames = useMemo(() => {
    const now = new Date();

    const todayIso = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const visibleEvents = (
      athleticsDataState.data.masterScheduleEvents || []
    ).filter(
      (event) =>
        isVisibleScheduleEvent(
          event.season,
          event.sportKey || null,
          event.team,
        ) &&
        event.date &&
        event.date >= todayIso &&
        ['Home Game', 'Away Game', 'Tournament'].includes(
          event.eventType,
        ),
    );

    return consolidateSharedScheduleEvents(visibleEvents)
      .sort((a, b) => {
        const aTime = new Date(
          `${a.date} ${a.time || '00:00'}`,
        ).getTime();

        const bTime = new Date(
          `${b.date} ${b.time || '00:00'}`,
        ).getTime();

        return aTime - bTime;
      })
      .slice(0, 4);
  }, [athleticsDataState.data.masterScheduleEvents]);

  const hasFavoriteTeams = Boolean(
    user && favoriteTeamSummaries.length > 0,
  );

  useEffect(() => {
    if (!latestNewsArticle) return undefined;

    const interval = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % 2);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [latestNewsArticle]);

  return (
    <div className="animate-in fade-in duration-500 mt-4 space-y-6 px-4 pb-8">
      <div className="hero-image-card" aria-roledescription="carousel" aria-label="Featured athletics updates">
        <div
          className="flex h-full transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${heroSlide * 50}%)`, width: '200%' }}
        >
          <div className="h-full w-1/2 shrink-0">
            <img
              src={eagleAppHomeBanner}
              alt="Eagle App — SPH-LV Athletics"
              className="hero-banner-img"
            />
          </div>

          {latestNewsArticle && (
            <button
              type="button"
              onClick={() => onNavigateToNews(latestNewsArticle.id)}
              className="relative h-full w-1/2 shrink-0 overflow-hidden text-left"
              aria-label={`Read latest news: ${latestNewsArticle.title}`}
            >
              <img src={latestNewsArticle.image} alt="" className="hero-banner-img scale-105 object-cover" />
              <span className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/52 to-black/16" />
              <span className="absolute inset-y-0 left-0 flex max-w-[78%] flex-col justify-center px-5 text-white">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-sky">Latest news</span>
                <span className="mt-1 line-clamp-2 text-sm font-black uppercase leading-tight tracking-[0.02em]">{latestNewsArticle.title}</span>
                <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-white/70">Read story ›</span>
              </span>
            </button>
          )}
        </div>

        {latestNewsArticle && (
          <div className="absolute bottom-2 right-3 flex gap-1" aria-hidden="true">
            {[0, 1].map((slide) => (
              <span key={slide} className={`h-1 rounded-full transition-all ${heroSlide === slide ? 'w-4 bg-white' : 'w-1 bg-white/45'}`} />
            ))}
          </div>
        )}
      </div>

      <section
        aria-label="Games"
        className="overflow-hidden rounded-3xl border border-border/10 bg-subcard/75 shadow-[0_3px_10px_rgba(0,0,0,0.06)]"
      >
        <div className="grid grid-cols-2 gap-1 border-b border-border/6 bg-foreground/[0.02] p-1">
          {[
            { id: 'results' as const, label: 'Past' },
            { id: 'upcoming' as const, label: 'Upcoming' },
          ].map((view) => {
            const active = gameFeedView === view.id;

            return (
              <button
                key={view.id}
                type="button"
                onClick={() => setGameFeedView(view.id)}
                aria-pressed={active}
                className={`flex items-center justify-center rounded-lg px-2 py-1.5 text-[7px] font-black uppercase tracking-[0.12em] transition-colors ${
                  active
                    ? 'bg-brand-maroon text-white'
                    : 'text-foreground/42 hover:bg-foreground/[0.04]'
                }`}
              >
                {view.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-1.5 p-2">
          {gameFeedView === 'results' &&
            latestResults.map((match) => (
              <CompactResultCard
                key={match.id}
                match={match}
                formatDate={compactDate}
                dense
              />
            ))}

          {gameFeedView === 'upcoming' &&
            nextGames.map((event) => (
              <article
                key={event.id}
                className="grid min-h-[58px] grid-cols-[32px_minmax(0,1fr)] items-center gap-2.5 rounded-2xl border border-border/8 bg-foreground/[0.02] px-3 py-2"
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/[0.035] text-lg"
                  aria-hidden="true"
                >
                  {favoriteTeamEmojis[event.sportKey || 'Soccer']}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex shrink-0 text-[9px] font-black uppercase tracking-[0.12em]">
                      {compactTeamCode(event)
                        .split('/')
                        .map((code, index) => (
                          <span
                            key={code}
                            className={compactTeamCodeColor(code)}
                          >
                            {index > 0 && (
                              <span className="text-foreground/35">
                                /
                              </span>
                            )}
                            {code}
                          </span>
                        ))}
                    </span>

                    <span className="truncate text-[13px] font-black uppercase text-foreground">
                      {compactOpponentName(event)}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-[8px] font-bold uppercase tracking-[0.08em] text-foreground/38">
                    {compactGameMeta(event)}
                  </p>
                </div>
              </article>
            ))}

          {gameFeedView === 'results' &&
            latestResults.length === 0 && (
              <p className="px-3 py-5 text-center text-[10px] font-bold uppercase tracking-[0.1em] text-foreground/38">
                No completed results available
              </p>
            )}

          {gameFeedView === 'upcoming' &&
            nextGames.length === 0 && (
              <p className="px-3 py-5 text-center text-[10px] font-bold uppercase tracking-[0.1em] text-foreground/38">
                No upcoming games listed
              </p>
            )}
        </div>
      </section>

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
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#B5413F]">
                Personalized home
              </p>

              <h2
                id="my-teams-loading-heading"
                className="text-xl font-black uppercase tracking-[0.08em] text-foreground"
              >
                My Teams
              </h2>
            </div>
          </div>

          <div
            className="mt-4 grid gap-3 sm:grid-cols-2"
            aria-label="Loading favorite teams"
          >
            {[0, 1].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-3xl bg-foreground/[0.035]"
              />
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
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#B5413F]">
                  Personalized home
                </p>

                <h2
                  id="my-teams-heading"
                  className="text-xl font-black uppercase tracking-[0.08em] text-foreground"
                >
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

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {favoriteTeamSummaries.map(
              ({ favorite, nextEvent, recentMatch }) => {
                const sportEmoji =
                  favoriteTeamEmojis[favorite.sport];

                const label = getTeamFavoriteLabel(favorite);

                const opponent = recentMatch
                  ? `vs ${recentMatch.opponent}`
                  : 'No completed games yet';

                return (
                  <button
                    key={favorite.key}
                    type="button"
                    onClick={() =>
                      onNavigateToTeam(
                        favorite.sport,
                        favorite.division,
                        favorite.gender,
                      )
                    }
                    className="group min-w-0 rounded-3xl border border-border/10 bg-foreground/[0.025] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#B5413F]/30 hover:bg-[#B5413F]/8"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/10 bg-foreground/[0.035] text-xl"
                          aria-hidden="true"
                        >
                          {sportEmoji}
                        </span>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-black uppercase tracking-[0.07em] text-foreground">
                            {label}
                          </h3>

                          <p className="mt-1 text-[9px] font-black uppercase tracking-[0.15em] text-[#B5413F]">
                            Favorite team
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        size={17}
                        className="shrink-0 text-foreground/30 transition-transform group-hover:translate-x-0.5 group-hover:text-[#B5413F]"
                      />
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <div className="min-w-0 rounded-2xl border border-brand-navy/8 bg-white/55 p-3 dark:border-white/8 dark:bg-white/[0.025]">
                        <div className="flex items-center gap-2 text-brand-navy/55 dark:text-brand-sky/75">
                          <CalendarDays size={14} />

                          <span className="text-[8px] font-black uppercase tracking-[0.16em]">
                            Next game
                          </span>
                        </div>

                        <p className="mt-2 line-clamp-2 text-xs font-black uppercase leading-tight text-brand-navy dark:text-white">
                          {athleticsDataState.loading
                            ? 'Loading schedule'
                            : nextEvent?.eventText ||
                              'No upcoming game'}
                        </p>

                        <p className="mt-2 flex min-w-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.06em] text-foreground/42">
                          <MapPin
                            size={11}
                            className="shrink-0 text-brand-sky"
                          />

                          <span className="truncate">
                            {nextEvent
                              ? `${formatScheduleDateTime(nextEvent)} · ${
                                  nextEvent.location ||
                                  'Venue TBD'
                                }`
                              : 'Schedule pending'}
                          </span>
                        </p>
                      </div>

                      <div className="min-w-0 rounded-2xl border border-brand-red/8 bg-white/55 p-3 dark:border-white/8 dark:bg-white/[0.025]">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-brand-red/65 dark:text-red-300/75">
                            <Trophy size={14} />

                            <span className="text-[8px] font-black uppercase tracking-[0.16em]">
                              Latest result
                            </span>
                          </div>

                          <strong
                            className={`text-sm font-black ${resultClass(
                              recentMatch,
                            )}`}
                          >
                            {recentMatch?.result || '—'}
                          </strong>
                        </div>

                        <p className="mt-2 truncate text-xs font-black uppercase text-brand-navy dark:text-white">
                          {athleticsDataState.loading
                            ? 'Loading result'
                            : opponent}
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-2 text-[9px] font-bold uppercase tracking-[0.06em] text-foreground/42">
                          <span className="truncate">
                            {recentMatch?.date ||
                              'Awaiting result'}
                          </span>

                          <strong className="shrink-0 text-sm text-brand-navy dark:text-white">
                            {formatResultScore(recentMatch)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              },
            )}
          </div>

          {favoritesError && (
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-red-400">
              {favoritesError}
            </p>
          )}
        </section>
      ) : (
        <section
          aria-labelledby="latest-news-heading"
          className="space-y-3"
        >
          <div className="flex items-end justify-between gap-3 px-1">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-brand-red">
                Eagles updates
              </p>

              <h2
                id="latest-news-heading"
                className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-foreground"
              >
                Latest News
              </h2>
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
              onClick={() =>
                onNavigateToNews(latestNewsArticle.id)
              }
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
                  <span className="rounded-full bg-[#5A1C2C] px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white">
                    {latestNewsArticle.category}
                  </span>

                  <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/65">
                    {latestNewsArticle.dateLabel}
                  </span>
                </span>

                <span className="mt-3 block max-w-3xl text-xl font-black uppercase leading-tight tracking-wide text-white sm:text-2xl">
                  {latestNewsArticle.title}
                </span>

                <span className="mt-2 line-clamp-2 max-w-3xl text-sm font-semibold leading-relaxed text-white/68">
                  {latestNewsArticle.excerpt}
                </span>

                <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                  View news here

                  <ChevronRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigateToNews()}
              className="group flex w-full items-center gap-4 rounded-3xl border border-brand-red/12 bg-subcard p-5 text-left shadow-[0_3px_10px_rgba(120,0,0,0.06)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
                <Newspaper size={19} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black uppercase tracking-[0.08em] text-foreground">
                  News publishing soon
                </span>

                <span className="mt-1 block text-xs font-semibold text-foreground/42">
                  Approved Eagles Athletics stories will
                  appear here.
                </span>
              </span>

              <ChevronRight
                size={18}
                className="text-foreground/30"
              />
            </button>
          )}

          {favoritesError && (
            <p className="px-1 text-[10px] font-bold uppercase tracking-[0.12em] text-red-400">
              {favoritesError}
            </p>
          )}
        </section>
      )}

      {hasFavoriteTeams && (
        <section
          aria-labelledby="home-news-widget-heading"
          className="space-y-3"
        >
          <div className="px-1">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-brand-red">
              Eagles updates
            </p>

            <h2
              id="home-news-widget-heading"
              className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-foreground"
            >
              Latest News
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              onNavigateToNews(latestNewsArticle?.id)
            }
            className="group flex w-full items-center gap-4 overflow-hidden rounded-3xl border border-brand-red/12 bg-subcard p-3 text-left shadow-[0_3px_10px_rgba(120,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:border-brand-red/25 sm:p-4"
            aria-label={
              latestNewsArticle
                ? `View news: ${latestNewsArticle.title}`
                : 'View Eagles Athletics news'
            }
          >
            {latestNewsArticle ? (
              <img
                src={latestNewsArticle.image}
                alt=""
                className="h-20 w-20 shrink-0 rounded-2xl object-cover sm:h-24 sm:w-28"
              />
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
                <Newspaper size={20} />
              </span>
            )}

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2 text-[8px] font-black uppercase tracking-[0.15em] text-foreground/42">
                <span className="text-brand-red">
                  {latestNewsArticle?.category ||
                    'Eagles Athletics'}
                </span>

                {latestNewsArticle?.dateLabel && (
                  <span>
                    {latestNewsArticle.dateLabel}
                  </span>
                )}
              </span>

              <span className="mt-1.5 line-clamp-2 block text-sm font-black uppercase leading-tight tracking-[0.05em] text-foreground sm:text-base">
                {latestNewsArticle?.title ||
                  'News publishing soon'}
              </span>

              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#5A1C2C] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-white">
                View news here

                <ChevronRight
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </span>
          </button>
        </section>
      )}
    </div>
  );
}
