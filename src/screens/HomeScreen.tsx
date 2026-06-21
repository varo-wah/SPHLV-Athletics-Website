import { Activity, CalendarDays, MapPin, Newspaper, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { SheetMatch } from '../services/parsers';

interface HomeScreenProps {
  athleticsDataState: AthleticsDataState;
  onNavigateToNews?: () => void;
}

export default function HomeScreen({ athleticsDataState, onNavigateToNews }: HomeScreenProps) {
  const [activeFeaturePanel, setActiveFeaturePanel] = useState<'match' | 'result' | 'table'>('match');

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
