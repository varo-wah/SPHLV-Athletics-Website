import { Activity, CalendarDays, ChevronRight, MapPin, Newspaper, Plus, Star, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { SheetMatch } from '../services/parsers';
import { useAuth } from '../contexts/AuthContext';
import { useTeamFavorites } from '../contexts/TeamFavoritesContext';
import { DivisionTab, GenderTab, SportTab } from '../types';
import { getTeamFavoriteLabel } from '../utils/teamFavorites';
import { isLaunchTeamSport } from '../config/launchSports';
import {
  BadmintonIcon,
  BasketballIcon,
  SoccerIcon,
  TrackIcon,
  VolleyballIcon,
} from '../components/SportIcons';

interface HomeScreenProps {
  athleticsDataState: AthleticsDataState;
  onNavigateToNews?: () => void;
  onNavigateToTeam: (sport: SportTab, division: DivisionTab, gender: GenderTab) => void;
  onBrowseTeams: () => void;
}

const favoriteTeamIcons = {
  Basketball: BasketballIcon,
  Volleyball: VolleyballIcon,
  Soccer: SoccerIcon,
  Badminton: BadmintonIcon,
  TrackAndField: TrackIcon,
};

export default function HomeScreen({
  athleticsDataState,
  onNavigateToNews,
  onNavigateToTeam,
  onBrowseTeams,
}: HomeScreenProps) {
  const [activeFeaturePanel, setActiveFeaturePanel] = useState<'match' | 'result' | 'table'>('match');
  const { user } = useAuth();
  const { favoriteTeams, loading: favoritesLoading, error: favoritesError } = useTeamFavorites();
  const visibleFavoriteTeams = favoriteTeams.filter((favorite) => isLaunchTeamSport(favorite.sport));

  const formatMatchDateTime = (match: SheetMatch | null) => {
    if (!match) return 'Schedule pending';

    const parsedDate = match.date ? new Date(`${match.date} ${match.time || '00:00'}`) : null;

    if (parsedDate && !Number.isNaN(parsedDate.getTime())) {
      const date = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(parsedDate);

      return `${date}${match.time ? ` @ ${match.time}` : ''}`;
    }

    if (match.date || match.time) {
      return `${match.date || 'Date TBD'}${match.time ? ` @ ${match.time}` : ''}`;
    }

    return 'Date TBD';
  };

  const getMatchTime = (match: SheetMatch) => {
    const parsedDate = match.date ? new Date(`${match.date} ${match.time || '00:00'}`) : null;
    return parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.getTime() : Number.MAX_SAFE_INTEGER;
  };

  const nextUpcomingMatch = useMemo(() => {
    const upcomingMatches = (athleticsDataState.data.soccerMatches || [])
      .filter((match: SheetMatch) => match.status !== 'Finished')
      .sort((a: SheetMatch, b: SheetMatch) => getMatchTime(a) - getMatchTime(b));

    return upcomingMatches[0] || null;
  }, [athleticsDataState.data.soccerMatches]);

  const recentFinishedMatch = useMemo(() => {
    const finishedMatches = (athleticsDataState.data.soccerMatches || [])
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
  }, [athleticsDataState.data.soccerMatches]);

  const recentResultTitle = recentFinishedMatch
    ? `${recentFinishedMatch.genderGroup === 'Girls' ? 'Girls’' : recentFinishedMatch.genderGroup === 'Boys' ? 'Boys’' : 'SMA'} Soccer ${recentFinishedMatch.result === 'W' ? 'wins against' : recentFinishedMatch.result === 'L' ? 'lost against' : 'drew against'} ${recentFinishedMatch.opponent}`
    : 'No recent result yet';

  const recentResultScore = recentFinishedMatch && recentFinishedMatch.scoreFor !== null && recentFinishedMatch.scoreAgainst !== null
    ? `${recentFinishedMatch.scoreFor}–${recentFinishedMatch.scoreAgainst}`
    : '—';

  const recentResultBadge = recentFinishedMatch?.result || '—';

  const recentResultBadgeClass =
    recentResultBadge === 'W'
      ? 'text-green-400'
      : recentResultBadge === 'L'
        ? 'text-red-400'
        : recentResultBadge === 'D'
          ? 'text-yellow-300'
          : 'text-foreground/40';

  const recentResultSubtitle = recentFinishedMatch
    ? `${recentFinishedMatch.tournament} · ${recentFinishedMatch.date || 'Date TBD'}${recentFinishedMatch.venue ? ` · ${recentFinishedMatch.venue}` : ''}`
    : 'Finished match results will appear after coaches update the sheet.';

  const nextMatchTitle = nextUpcomingMatch
    ? `${nextUpcomingMatch.level} ${nextUpcomingMatch.genderGroup} Soccer vs ${nextUpcomingMatch.opponent}`
    : 'No upcoming soccer match';

  const nextMatchMeta = athleticsDataState.loading
    ? 'Loading live schedule...'
    : formatMatchDateTime(nextUpcomingMatch);

  const syncStatus = athleticsDataState.error
    ? `Sync issue: ${athleticsDataState.error}`
    : athleticsDataState.refreshing
      ? 'Refreshing Google Sheets...'
      : athleticsDataState.lastUpdated
        ? `Updated ${athleticsDataState.lastUpdated}`
        : null;

  const topStanding = useMemo(() => {
    return [...(athleticsDataState.data.soccerStandings || [])]
      .sort((a, b) => {
        const aRank = a.rank ?? Number.MAX_SAFE_INTEGER;
        const bRank = b.rank ?? Number.MAX_SAFE_INTEGER;
        return aRank - bRank;
      })[0] || null;
  }, [athleticsDataState.data.soccerStandings]);

  const featurePanels = {
    match: {
      eyebrow: 'Next Match',
      title: athleticsDataState.loading ? 'Loading live schedule' : nextMatchTitle,
      meta: nextMatchMeta,
      detail: nextUpcomingMatch?.venue || 'Venue TBD',
      stat: nextUpcomingMatch?.tournament || 'Live',
      icon: CalendarDays,
    },
    result: {
      eyebrow: 'Latest Result',
      title: athleticsDataState.loading ? 'Loading latest result' : recentResultTitle,
      meta: recentResultSubtitle,
      detail: recentResultScore,
      stat: recentResultBadge,
      icon: Trophy,
    },
    table: {
      eyebrow: 'Table Leader',
      title: topStanding ? `${topStanding.team} leads ${topStanding.level} ${topStanding.genderGroup}` : 'Standings syncing',
      meta: topStanding ? `${topStanding.tournament} · ${topStanding.points ?? 0} pts` : 'Soccer standings will appear after sync',
      detail: topStanding ? `${topStanding.wins ?? 0}W ${topStanding.draws ?? 0}D ${topStanding.losses ?? 0}L` : 'No rows yet',
      stat: topStanding ? `#${topStanding.rank ?? 1}` : 'Table',
      icon: Activity,
    },
  };

  const activeFeature = featurePanels[activeFeaturePanel];
  const ActiveFeatureIcon = activeFeature.icon;

  return (
    <div className="animate-in fade-in duration-500 pb-8 px-4 space-y-6 mt-4">
      <div className="hero-image-card">
        <img
          src="https://res.cloudinary.com/dpgt445lg/image/upload/v1780443630/ACSC_Girls_football_26_2_bcdvak.png"
          alt="LV Athletics Banner"
          className="hero-banner-img"
        />
        <div className="hero-image-overlay" />
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
                const Icon = favoriteTeamIcons[favorite.sport];
                const label = getTeamFavoriteLabel(favorite);

                return (
                  <button
                    key={favorite.key}
                    type="button"
                    onClick={() => onNavigateToTeam(favorite.sport, favorite.division, favorite.gender)}
                    className="group flex min-h-[72px] items-center justify-between gap-3 rounded-2xl border border-border/10 bg-foreground/[0.025] px-3.5 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-[#B5413F]/30 hover:bg-[#B5413F]/10"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/10 bg-foreground/[0.035] text-foreground/55 transition-colors group-hover:border-[#B5413F]/25 group-hover:text-[#D85A57]">
                        <Icon size={19} />
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

      <section className="home-live-card" aria-label="Live athletics summary">
        <div className="home-live-card__field" aria-hidden="true">
          <div className="home-live-card__line home-live-card__line--top" />
          <div className="home-live-card__line home-live-card__line--middle" />
          <div className="home-live-card__line home-live-card__line--bottom" />
          <div className="home-live-card__marker home-live-card__marker--one" />
          <div className="home-live-card__marker home-live-card__marker--two" />
        </div>

        <div className="home-live-card__header">
          <span className="home-live-card__sync">
            <span />
            Live Sheet Sync
          </span>

          <button type="button" onClick={onNavigateToNews} className="home-live-card__news">
            <Newspaper size={14} />
            News
          </button>
        </div>

        <div className="home-live-card__main">
          <div className="home-live-card__copy">
            <p>{activeFeature.eyebrow}</p>
            <h3>{activeFeature.title}</h3>
            <span>{activeFeature.meta}</span>

            <div className="home-live-card__detail">
              <MapPin size={14} />
              <strong>{activeFeature.detail}</strong>
            </div>
          </div>

          <div className="home-live-card__stat">
            <ActiveFeatureIcon size={20} />
            <strong>{activeFeature.stat}</strong>
          </div>
        </div>

        <div className="home-live-card__controls" aria-label="Live summary panels">
          {([
            ['match', 'Match'],
            ['result', 'Result'],
            ['table', 'Table'],
          ] as const).map(([panel, label]) => (
            <button
              key={panel}
              type="button"
              onClick={() => setActiveFeaturePanel(panel)}
              className={activeFeaturePanel === panel ? 'is-active' : ''}
              aria-pressed={activeFeaturePanel === panel}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {syncStatus && (
        <div className={`rounded-xl border px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] ${
          athleticsDataState.error
            ? 'border-red-500/20 bg-red-500/5 text-red-400'
            : 'border-border/10 bg-subcard text-foreground/45'
        }`}>
          {syncStatus}
        </div>
      )}

      {/* Recent Results Header */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-3">
          <Trophy size={22} className="text-[#C1121F] dark:text-[#5A1C2C]" />
          <h2 className="text-2xl font-black uppercase italic tracking-[0.18em] text-foreground dark:text-foreground">
            Recent Results
          </h2>
        </div>

        <div className="bg-subcard rounded-2xl border border-border/10 overflow-hidden shadow-md">
          <div className="p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#B5413F]">
                Result
              </p>

              <h3 className="text-lg font-black text-foreground mt-1">
                {athleticsDataState.loading ? 'Loading latest result...' : recentResultTitle}
              </h3>

              <p className="text-xs text-foreground/45 mt-1">
                {athleticsDataState.error ? 'Google Sheets result sync unavailable.' : recentResultSubtitle}
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-black text-foreground">
                {recentResultScore}
              </p>

              <p className={`text-xs font-black uppercase tracking-widest ${recentResultBadgeClass}`}>
                {recentResultBadge}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
