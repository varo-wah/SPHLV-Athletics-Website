import { ChevronRight, Newspaper } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import eagleAppHomeBanner from '../assets/eagleappheadbanner.png';
import CompactResultCard from '../components/CompactResultCard';
import FavoriteTeamsSection from '../components/FavoriteTeamsSection';
import NewsListRow from '../components/NewsListRow';
import TeamLogo from '../components/TeamLogo';
import { IS_PROTOTYPE, isVisibleScheduleEvent } from '../config/launchSports';
import { visibleNewsArticles } from '../data/news';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { consolidateSharedScheduleEvents } from '../services/schedulePresentation';
import { DivisionTab, GenderTab, SportTab } from '../types';
import { homeUpcomingFixtures } from '../utils/homeUpcomingPresentation';
import { readableFixtureLabel } from '../utils/scheduleTimeline';
import {
  PAGE_TRANSITION,
  PRESS_SCALE,
  PRESS_TRANSITION,
  QUICK_TRANSITION,
  STANDARD_SPRING,
  staggerDelay,
} from '../config/motion';

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

export default function HomeScreen({
  athleticsDataState,
  onNavigateToNews,
  onNavigateToTeam,
  onBrowseTeams,
}: HomeScreenProps) {
  const [gameFeedView, setGameFeedView] =
    useState<'upcoming' | 'results'>('upcoming');
  const reduceMotion = useReducedMotion();
  const [feedPages, setFeedPages] = useState({ upcoming: 0, results: 0 });
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const recentNewsArticles = useMemo(
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
        })
        .slice(0, 3),
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
        }),
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

    return homeUpcomingFixtures(consolidateSharedScheduleEvents(visibleEvents))
      .sort((a, b) => {
        const aTime = new Date(
          `${a.event.date} ${a.time || '00:00'}`,
        ).getTime();

        const bTime = new Date(
          `${b.event.date} ${b.time || '00:00'}`,
        ).getTime();

        return aTime - bTime;
      });
  }, [athleticsDataState.data.masterScheduleEvents]);

  const feedCount = gameFeedView === 'results' ? latestResults.length : nextGames.length;
  const lastPage = Math.max(0, Math.ceil(feedCount / 4) - 1);
  const feedPage = Math.min(feedPages[gameFeedView], lastPage);
  const changeFeedPage = (step: number) => setFeedPages(pages => ({
    ...pages, [gameFeedView]: Math.max(0, Math.min(lastPage, feedPage + step)),
  }));

  return (
    <div className="animate-in fade-in duration-500 mt-4 space-y-6 px-4 pb-8">
      <div className="hero-image-card" aria-label="Eagle App banner">
        <img
          src={eagleAppHomeBanner}
          alt="Eagle App — SPH-LV Athletics"
          className="hero-banner-img"
        />
      </div>

      <FavoriteTeamsSection
        athleticsDataState={athleticsDataState}
        onNavigateToTeam={onNavigateToTeam}
        onBrowseTeams={onBrowseTeams}
      />

      <section
        aria-label="Games"
        className="overflow-hidden rounded-xl border border-border/10 bg-subcard/75"
      >
        <div className="mx-auto mt-3 grid w-[calc(100%-1.5rem)] max-w-[23rem] grid-cols-2 gap-1.5 rounded-2xl border border-border/10 bg-subcard/70 p-2 shadow-sm">
          {[
            { id: 'results' as const, label: 'Past', count: latestResults.length },
            { id: 'upcoming' as const, label: 'Upcoming', count: nextGames.length },
          ].map((view) => {
            const active = gameFeedView === view.id;

            return (
              <motion.button
                key={view.id}
                type="button"
                onClick={() => setGameFeedView(view.id)}
                aria-pressed={active}
                whileTap={{ scale: PRESS_SCALE }}
                transition={PRESS_TRANSITION}
                className={`relative flex min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-transparent px-4 py-3 text-xs font-black uppercase tracking-[0.12em] transition-all duration-200 ${
                  active
                    ? 'text-white'
                    : 'text-foreground/42 hover:bg-foreground/[0.04]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="home-game-feed-pill"
                    className="absolute inset-0 rounded-xl border border-brand-maroon bg-brand-maroon"
                    transition={STANDARD_SPRING}
                  />
                )}
                <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.12em] sm:text-xs">
                  {view.label}
                </span>
                <span
                  className={`relative z-10 shrink-0 rounded-full px-2 py-1 font-mono text-[9px] font-black leading-none ${
                    active
                      ? 'bg-white/18 text-white'
                      : 'bg-foreground/[0.05] text-foreground/38'
                  }`}
                >
                  {view.count}
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="p-2" style={{ touchAction: 'pan-y' }}
          onTouchStart={event => {
            const touch = event.touches[0];
            touchStart.current = { x: touch.clientX, y: touch.clientY };
          }}
          onTouchCancel={() => { touchStart.current = null; }}
          onTouchEnd={event => {
            const start = touchStart.current;
            touchStart.current = null;
            if (!start) return;
            const touch = event.changedTouches[0];
            const dx = touch.clientX - start.x;
            const dy = touch.clientY - start.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) changeFeedPage(dx < 0 ? 1 : -1);
          }}>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${gameFeedView}-${feedPage}`}
              className="space-y-1.5"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
              transition={PAGE_TRANSITION}
            >
          {gameFeedView === 'results' &&
            latestResults.slice(feedPage * 4, feedPage * 4 + 4).map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...QUICK_TRANSITION, delay: staggerDelay(index) }}
              >
                <CompactResultCard
                  match={match}
                  formatDate={compactDate}
                  dense
                />
              </motion.div>
            ))}

          {gameFeedView === 'upcoming' &&
            nextGames.slice(feedPage * 4, feedPage * 4 + 4).map((fixture, index) => (
              <motion.article
                key={fixture.id}
                className={`grid min-h-[76px] grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border px-3 py-3 shadow-[0_2px_7px_rgba(0,0,0,0.05)] ${
                  fixture.event.eventType === 'Home Game'
                    ? 'border-brand-maroon/18 bg-white dark:bg-subcard'
                    : 'border-border/12 bg-[#ECEDEF] dark:bg-white/[0.055]'
                }`}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...QUICK_TRANSITION, delay: staggerDelay(index) }}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/8 bg-white/75 text-xl shadow-sm dark:bg-white/[0.05]"
                  aria-hidden="true"
                >
                  {favoriteTeamEmojis[fixture.event.sportKey || 'Soccer']}
                </span>

                <div className="min-w-0">
                  <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs font-black uppercase tracking-[0.035em] text-foreground">
                    <span className="min-w-0">{readableFixtureLabel(fixture.teamCode)}</span>
                    <span className="text-[9px] text-foreground/35">VS</span>
                    <span className="truncate">{fixture.opponent}</span>
                  </div>

                  <p className="mt-1.5 truncate text-[10px] font-black uppercase tracking-[0.07em] text-foreground/75 dark:text-white/75">
                    {compactDate(fixture.event.date)} · {fixture.time || 'Time TBD'} ·{' '}
                    {fixture.event.eventType.replace(' Game', '')}
                  </p>
                </div>

                {/\bcup\b/i.test(`${fixture.opponent} ${fixture.event.eventText}`) ? (
                  <span role="img" aria-label="Cup game" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-sm">🏆</span>
                ) : (
                  <span className="flex shrink-0 -space-x-2">
                    {fixture.opponentLogoNames.map((name) => (
                      <span key={name}><TeamLogo name={name} className="h-10 w-10 border-2 border-background bg-white shadow-sm" /></span>
                    ))}
                  </span>
                )}
              </motion.article>
            ))}

          {gameFeedView === 'results' &&
            latestResults.length === 0 && (
              <p className="px-3 py-5 text-center text-[10px] font-bold uppercase tracking-[0.1em] text-foreground/38">
                {athleticsDataState.loading ? 'Loading results…' : athleticsDataState.data.resultSourceStates.some(source => source.failed || !source.configured) ? 'Results unavailable — retry using Data status above' : 'No completed results recorded yet'}
              </p>
            )}

          {gameFeedView === 'upcoming' &&
            nextGames.length === 0 && (
              <p className="px-3 py-5 text-center text-[10px] font-bold uppercase tracking-[0.1em] text-foreground/38">
                No upcoming games listed
              </p>
            )}
            </motion.div>
          </AnimatePresence>
          {feedCount > 4 && (
            <nav aria-label={`${gameFeedView === 'results' ? 'Results' : 'Upcoming games'} pages`} className="flex flex-wrap items-center justify-between gap-2 px-2 pt-3 text-xs font-bold text-brand-maroon dark:text-red-300">
              <button type="button" disabled={feedPage === 0} onClick={() => changeFeedPage(-1)} className="min-h-11 disabled:opacity-30">« {gameFeedView === 'results' ? 'Newer Results' : 'Previous Games'}</button>
              <span role="status" className="text-[10px] text-foreground/60">{feedPage * 4 + 1}–{Math.min((feedPage + 1) * 4, feedCount)} of {feedCount}</span>
              <button type="button" disabled={feedPage === lastPage} onClick={() => changeFeedPage(1)} className="min-h-11 disabled:opacity-30">{gameFeedView === 'results' ? 'Previous Results' : 'Next Games'} »</button>
            </nav>
          )}
        </div>
      </section>

      {(
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

          {recentNewsArticles.length > 0 ? (
            <div className="space-y-2">
              {recentNewsArticles.map((article) => (
                <NewsListRow
                  key={article.id}
                  article={article}
                  onOpen={(selected) => onNavigateToNews(selected.id)}
                />
              ))}
            </div>
          ) : (
            <motion.button
              type="button"
              onClick={() => onNavigateToNews()}
              className="group flex w-full items-center gap-3 rounded-2xl border border-border/10 bg-subcard p-3 text-left shadow-[0_2px_7px_rgba(0,0,0,0.055)]"
              whileTap={{ scale: PRESS_SCALE }}
              transition={PRESS_TRANSITION}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.035] text-brand-red">
                <Newspaper size={18} />
              </span>
              <span className="text-xs font-black uppercase tracking-[0.06em] text-foreground">
                News publishing soon
                <ChevronRight size={13} className="ml-1 inline-block align-[-0.15em] text-brand-red" />
              </span>
            </motion.button>
          )}
        </section>
      )}
    </div>
  );
}
