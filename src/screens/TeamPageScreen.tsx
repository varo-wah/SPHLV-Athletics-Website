import { SportTab, DivisionTab, GenderTab } from '../types';
import { Users, Trophy, ChevronRight, Clock, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import TeamFavoriteButton from '../components/TeamFavoriteButton';
import CompactResultCard from '../components/CompactResultCard';
import { findTeam, sportDetails } from '../config/teamCatalog';
import {
  teamAccentProperties,
  teamVisualThemeForCode,
} from '../config/teamVisualThemes';
import {
  jaacOpponentSchoolsForEvent,
  jaacSchoolByCode,
} from '../data/jaacSchools';
import type { JaacSchool } from '../data/jaacSchools';
import type { ScheduleEvent } from '../data/scheduleTypes';
import { rosterForTeam } from '../data/teamRosters';
import { isCompetitiveScheduleEvent } from '../services/masterScheduleParser';
import smpBoysBasketballBanner from '../assets/smpboysbasketball.png';
import smpGirlsBasketballBanner from '../assets/smpgirlsbasketball.png';
import varsityBoysSoccerBanner from '../assets/varsityboyssoccer.png';
import varsityBoysVolleyballBanner from '../assets/varsityboysvolleyball.png';
import varsityGirlsSoccerBanner from '../assets/varsitygirlssoccer.png';
import varsityGirlsVolleyballBanner from '../assets/varsitygirlsvolleyball.png';
import {
  PAGE_TRANSITION,
  PRESS_SCALE,
  PRESS_TRANSITION,
  STANDARD_SPRING,
} from '../config/motion';

interface TeamPageScreenProps {
  sport: SportTab;
  division: DivisionTab;
  gender: GenderTab;
  athleticsDataState?: AthleticsDataState;
}

type TeamPageSection = 'games' | 'standings' | 'players';
type GamesView = 'upcoming' | 'results';

const teamPageSections: { id: TeamPageSection; label: string }[] = [
  { id: 'games', label: 'Games' },
  { id: 'standings', label: 'Standings' },
  { id: 'players', label: 'Players' },
];

const varsityBoysSoccerTournamentResults = [
  {
    name: 'SPH Cup',
    placement: 'Pending',
    detail: 'Final placement will be posted after the tournament.',
  },
  {
    name: 'JAAC',
    placement: 'Runner-up',
    detail: 'Final · SPH 0–2 BSJ',
  },
  {
    name: 'ACSC',
    placement: 'Pending',
    detail: 'Final placement has not been posted.',
    href: 'https://acscconference.com/boys-soccer/',
  },
] as const;

function formatGameDate(date: string | null) {
  if (!date) return 'Date TBD';

  const [year, month, day] = date.split('-').map(Number);
  const value = new Date(year, month - 1, day);

  if (Number.isNaN(value.getTime())) return date;

  return value.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function gameTimestamp(date: string | null, time?: string | null) {
  if (!date) return Number.MAX_SAFE_INTEGER;

  const value = new Date(`${date} ${time || '00:00'}`).getTime();

  return Number.isNaN(value) ? Number.MAX_SAFE_INTEGER : value;
}

function SchoolIdentity({ school }: { school: JaacSchool }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <img
        src={school.logo}
        alt={`${school.name} logo`}
        className="h-11 w-11 shrink-0 rounded-full border border-border/10 bg-white object-cover shadow-sm"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-black uppercase text-foreground">
          {school.code}
        </p>
        <p className="truncate text-[9px] font-bold uppercase tracking-[0.08em] text-foreground/40">
          {school.mascot}
        </p>
      </div>
    </div>
  );
}

function JaacMatchup({ event }: { event: ScheduleEvent }) {
  const opponents = jaacOpponentSchoolsForEvent(
    event.opponent,
    event.eventText,
    event.raw,
  );

  if (opponents.length === 0) return null;

  const lippoVillage = jaacSchoolByCode('LV');
  const isAway = event.eventType === 'Away Game';
  const leftSchools = isAway ? opponents : [lippoVillage];
  const rightSchools = isAway ? [lippoVillage] : opponents;

  return (
    <div className="mt-3 rounded-xl border border-border/10 bg-foreground/[0.025] px-3 py-2.5">
      <p className="mb-2 text-[8px] font-black uppercase tracking-[0.16em] text-foreground/35">
        JAAC matchup
      </p>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <div className="space-y-2">
          {leftSchools.map((school) => (
            <div key={school.code}>
              <SchoolIdentity school={school} />
            </div>
          ))}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-foreground/30">
          vs
        </span>
        <div className="space-y-2">
          {rightSchools.map((school) => (
            <div key={school.code}>
              <SchoolIdentity school={school} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TeamPageScreen({
  sport,
  division,
  gender,
  athleticsDataState,
}: TeamPageScreenProps) {
  const [activeSection, setActiveSection] = useState<TeamPageSection>('games');
  const [gamesView, setGamesView] = useState<GamesView>('upcoming');
  const [sectionDirection, setSectionDirection] = useState(1);
  const [gamesDirection, setGamesDirection] = useState(1);
  const reduceMotion = useReducedMotion();

  const selectSection = (nextSection: TeamPageSection) => {
    const currentIndex = teamPageSections.findIndex((section) => section.id === activeSection);
    const nextIndex = teamPageSections.findIndex((section) => section.id === nextSection);
    setSectionDirection(nextIndex >= currentIndex ? 1 : -1);
    setActiveSection(nextSection);
  };

  const selectGamesView = (nextView: GamesView) => {
    setGamesDirection(nextView === 'results' ? 1 : -1);
    setGamesView(nextView);
  };

  const team = findTeam(sport, division, gender);
  const sportInfo = sportDetails(sport);

  const teamName =
    team?.displayName ?? `${division} ${gender} ${sportInfo.label}`;
  const teamTheme = teamVisualThemeForCode(team?.menuCode);

  const roster = team ? rosterForTeam(team.id) : undefined;

  const divisionLabel =
    division === 'SMA'
      ? 'SMA / Varsity'
      : 'SMP / Middle School';

  const getBannerForTeam = () => {
    if (
      sport === 'Basketball' &&
      division === 'SMP' &&
      gender === 'Boys'
    ) {
      return smpBoysBasketballBanner;
    }

    if (
      sport === 'Basketball' &&
      division === 'SMP' &&
      gender === 'Girls'
    ) {
      return smpGirlsBasketballBanner;
    }

    if (
      sport === 'Soccer' &&
      division === 'SMA' &&
      gender === 'Boys'
    ) {
      return varsityBoysSoccerBanner;
    }

    if (
      sport === 'Volleyball' &&
      division === 'SMA' &&
      gender === 'Boys'
    ) {
      return varsityBoysVolleyballBanner;
    }

    if (
      sport === 'Soccer' &&
      division === 'SMA' &&
      gender === 'Girls'
    ) {
      return varsityGirlsSoccerBanner;
    }

    if (
      sport === 'Volleyball' &&
      division === 'SMA' &&
      gender === 'Girls'
    ) {
      return varsityGirlsVolleyballBanner;
    }

    return '';
  };

  const headerBanner = getBannerForTeam();

  useEffect(() => {
    setActiveSection('games');
    setGamesView('upcoming');
  }, [sport, division, gender]);

  const standingsForDisplay = (athleticsDataState?.data.standings || []).filter(
    (standing) =>
      standing.sportKey === sport &&
      standing.level === division &&
      standing.genderGroup === gender,
  );

  const isPreseasonStandings = false;
  const differenceLabel =
    sport === 'Soccer'
      ? 'GD'
      : sport === 'Volleyball'
        ? 'SD'
        : 'PD';

  const resultSourceState = team
    ? athleticsDataState?.data.resultSourceStates.find(
        (source) => source.teamId === team.id,
      )
    : undefined;

  const completedResults = (
    athleticsDataState?.data.matches || []
  )
    .filter(
      (match) =>
        match.sportKey === sport &&
        match.level === division &&
        match.genderGroup === gender,
    )
    .sort(
      (a, b) =>
        gameTimestamp(b.date, b.time) -
        gameTimestamp(a.date, a.time),
    );

  const today = new Date();

  const todayIso = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const upcomingEvents = (
    athleticsDataState?.data.masterScheduleEvents || []
  )
    .filter(
      (event) =>
        isCompetitiveScheduleEvent(event) &&
        event.sportKey === sport &&
        event.level === division &&
        event.genderGroup === gender &&
        Boolean(event.date && event.date >= todayIso),
    )
    .sort(
      (a, b) =>
        gameTimestamp(a.date, a.time) -
        gameTimestamp(b.date, b.time),
    );

  const standingsRows = standingsForDisplay
    .map((row, idx) => {
      const wins = row.wins ?? 0;
      const draws = row.draws ?? 0;
      const losses = row.losses ?? 0;

      const gp = wins + draws + losses;

      const pts =
        row.points ?? wins * 3 + draws;

      const goalsFor =
        row.forValue ?? 0;

      const diff =
        row.difference ??
        (row.forValue !== null && row.againstValue !== null
          ? row.forValue - row.againstValue
          : 0);

      return {
        row,
        idx,
        wins,
        draws,
        losses,
        gp,
        pts,
        goalsFor,
        diff,
        rank: idx + 1,
      };
    })
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.diff !== a.diff) return b.diff - a.diff;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      if (b.wins !== a.wins) return b.wins - a.wins;

      if (isPreseasonStandings) {
        return a.idx - b.idx;
      }

      return a.row.team.localeCompare(b.row.team);
    })
    .map((entry, idx) => ({
      ...entry,
      rank: isPreseasonStandings ? 1 : idx + 1,
    }));

  const allTeamsTied =
    standingsRows.length > 1 &&
    standingsRows.every(
      (entry) =>
        entry.pts === standingsRows[0].pts &&
        entry.gp === standingsRows[0].gp &&
        entry.wins === standingsRows[0].wins &&
        entry.draws === standingsRows[0].draws &&
        entry.losses === standingsRows[0].losses &&
        entry.diff === standingsRows[0].diff,
    );

  const leader = standingsRows[0];

  const lvStanding =
    standingsRows.find((entry) => {
      const teamName = entry.row.team.toLowerCase().replace(/[^a-z0-9]/g, '');

      return (
        teamName === 'lv' ||
        teamName.includes('sphlv')
      );
    }) ?? leader;

  const EmptyPanel = ({
    title,
    body,
  }: {
    title: string;
    body: string;
  }) => (
    <div className="rounded-2xl border border-border/10 bg-[#5A1C2C]/5 p-8 text-center">
      <p className="text-sm font-black uppercase tracking-widest text-foreground/70">
        {title}
      </p>

      <p className="mt-2 text-xs leading-relaxed text-foreground/45">
        {body}
      </p>
    </div>
  );

  const teamInitials = (name: string) => {
    const cleaned = name.trim();

    if (!cleaned) return 'TBD';

    const parts = cleaned.split(/\s+/);

    if (parts.length === 1) {
      return parts[0].slice(0, 3).toUpperCase();
    }

    return parts
      .map((part) => part[0])
      .join('')
      .slice(0, 3)
      .toUpperCase();
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 cursor-default">
      <header
        className="mx-4 sm:mx-6 lg:mx-8"
        style={teamAccentProperties(teamTheme)}
      >
        {headerBanner && (
          <div
            className="relative overflow-hidden rounded-2xl border border-border/10 bg-black shadow-[0_4px_12px_rgba(0,0,0,0.14)]"
            style={{ aspectRatio: '3.368 / 1' }}
          >
            <img
              src={headerBanner}
              alt={teamName}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        )}

        <div className="mt-3 flex items-start justify-between gap-4 px-1">
          <div className="min-w-0">
            <p className="team-accent-text text-[9px] font-black uppercase tracking-[0.18em] sm:text-[10px] sm:tracking-[0.2em]">
              {divisionLabel}
            </p>

            <h1 className="mt-1 text-[clamp(1.15rem,5.2vw,2.25rem)] font-black uppercase leading-tight tracking-[-0.035em] text-foreground sm:text-3xl">
              {teamName}
            </h1>
          </div>

          <TeamFavoriteButton
            sport={sport}
            division={division}
            gender={gender}
            theme={teamTheme}
            className="shrink-0"
          />
        </div>
      </header>

      <nav
        aria-label={`${teamName} sections`}
        className="pointer-events-none sticky top-16 z-40 px-3 py-3 sm:px-6 lg:px-8"
      >
        <div
          role="tablist"
          aria-label="Team page sections"
          className="pointer-events-auto mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-[1.4rem] border border-border/10 bg-canvas/80 p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.11)] backdrop-blur-2xl saturate-150 [scrollbar-width:none] supports-[backdrop-filter]:bg-canvas/65 [&::-webkit-scrollbar]:hidden"
          style={teamAccentProperties(teamTheme)}
        >
          {teamPageSections.map((section) => {
            const isActive =
              activeSection === section.id;

            return (
              <motion.button
                key={section.id}
                id={`team-section-tab-${section.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="team-section-panel"
                onClick={() => selectSection(section.id)}
                whileTap={{ scale: PRESS_SCALE }}
                transition={PRESS_TRANSITION}
                className={`relative min-w-fit rounded-[1.05rem] border border-transparent px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.11em] transition-all duration-200 sm:px-6 ${
                  isActive
                    ? 'text-white'
                    : 'text-foreground/42 hover:bg-foreground/[0.045] hover:text-foreground/75'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="team-section-active-pill"
                    className="team-accent-active absolute inset-0 rounded-[1.05rem]"
                    transition={STANDARD_SPRING}
                  />
                )}
                <span className="relative z-10">{section.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      <div
        id="team-section-panel"
        role="tabpanel"
        aria-labelledby={`team-section-tab-${activeSection}`}
        className="mt-5 space-y-8 px-4 sm:px-6 lg:px-8"
      >
        <AnimatePresence mode="wait" initial={false} custom={sectionDirection}>
          <motion.div
            key={activeSection}
            custom={sectionDirection}
            initial={{ opacity: 0, x: reduceMotion ? 0 : sectionDirection * 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduceMotion ? 0 : sectionDirection * -6 }}
            transition={PAGE_TRANSITION}
          >
        <div className="space-y-10">
          {activeSection === 'standings' && (
            <section className="space-y-4">
              <div className="overflow-hidden rounded-3xl border border-brand-maroon/10 bg-white/90 p-4 shadow-[0_4px_12px_rgba(15,23,42,0.06)] dark:border-border/10 dark:bg-subcard/40 dark:shadow-[0_4px_12px_rgba(0,0,0,0.14)]">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#B5413F]">
                      {isPreseasonStandings
                        ? 'Preseason table'
                        : 'Official table'}
                    </p>

                    <h2 className="mt-2 text-xl font-black uppercase leading-tight tracking-[0.12em] text-foreground sm:text-3xl">
                      Regular Season
                      <br />
                      Standings
                    </h2>
                  </div>

                </div>

                {lvStanding && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="rounded-2xl border border-brand-maroon/12 border-l-4 border-l-brand-red bg-[#F4F4F3] p-4 dark:border-[#B5413F]/20 dark:border-l-[#B5413F] dark:bg-white/[0.045]">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#B5413F]">
                        {allTeamsTied
                          ? 'Table status'
                          : 'LV status'}
                      </p>

                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#B5413F] text-sm font-black text-white shadow-[0_2px_6px_rgba(15,23,42,0.16)]">
                          {allTeamsTied
                            ? 'T1'
                            : `#${lvStanding.rank}`}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-lg font-black uppercase tracking-tight text-foreground sm:text-xl">
                            {allTeamsTied
                              ? 'All teams tied'
                              : lvStanding.rank === 1
                                ? 'LV leads the table'
                                : `LV is #${lvStanding.rank}`}
                          </p>

                          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/40">
                            {lvStanding.wins}W ·{' '}
                            {lvStanding.draws}D ·{' '}
                            {lvStanding.losses}L
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:min-w-[230px]">
                      <div className="rounded-2xl border border-brand-maroon/10 bg-[#F4F4F3] p-3 text-center dark:border-border/10 dark:bg-foreground/[0.035]">
                        <p className="text-2xl font-black text-[#B5413F]">
                          {lvStanding.pts}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-foreground/35">
                          Pts
                        </p>
                      </div>

                      <div className="rounded-2xl border border-brand-maroon/10 bg-[#F4F4F3] p-3 text-center dark:border-border/10 dark:bg-foreground/[0.035]">
                        <p className="text-2xl font-black text-foreground">
                          {lvStanding.gp}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-foreground/35">
                          GP
                        </p>
                      </div>

                      <div className="rounded-2xl border border-brand-maroon/10 bg-[#F4F4F3] p-3 text-center dark:border-border/10 dark:bg-foreground/[0.035]">
                        <p className="text-2xl font-black text-foreground">
                          {lvStanding.diff !== null &&
                          lvStanding.diff > 0
                            ? `+${lvStanding.diff}`
                            : lvStanding.diff ?? '-'}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-foreground/35">
                          {differenceLabel}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-3xl border border-brand-maroon/10 bg-white/95 shadow-[0_4px_12px_rgba(15,23,42,0.06)] dark:border-border/10 dark:bg-subcard dark:shadow-[0_4px_12px_rgba(0,0,0,0.16)]">
                <div className="grid grid-cols-[48px_minmax(0,1fr)_64px_70px] gap-2 border-b border-border/10 bg-[#F1F2F3] px-4 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-brand-maroon sm:grid-cols-[56px_minmax(0,1fr)_52px_52px_52px_52px_70px] dark:border-white/10 dark:bg-muted dark:text-[#D85A57]">
                  <div>Rank</div>
                  <div>Club</div>
                  <div className="text-center">
                    GP
                  </div>
                  <div className="hidden text-center sm:block">
                    W
                  </div>
                  <div className="hidden text-center sm:block">
                    D
                  </div>
                  <div className="hidden text-center sm:block">
                    L
                  </div>
                  <div className="text-right">
                    Pts
                  </div>
                </div>

                <div className="flex flex-col">
                  {athleticsDataState?.loading &&
                  standingsForDisplay.length === 0 ? (
                    <div className="animate-pulse p-6 text-center text-xs font-medium text-foreground/40">
                      Loading official standings...
                    </div>
                  ) : standingsRows.length === 0 ? (
                    <div className="space-y-2 p-8 text-center text-xs font-medium text-foreground/40">
                      <p className="font-bold text-foreground/60">
                        Standings will appear once uploaded
                      </p>
                      <p>
                        No standings matches for{' '}
                        {sportInfo.label} ·{' '}
                        {divisionLabel} · {gender}.
                      </p>
                    </div>
                  ) : (
                    standingsRows.map(
                      ({
                        row,
                        idx,
                        wins,
                        draws,
                        losses,
                        gp,
                        pts,
                        rank,
                        diff,
                      }) => {
                        const normalizedTeamName = row.team
                          .toLowerCase()
                          .replace(/[^a-z0-9]/g, '');

                        const isLvTeamRow =
                          normalizedTeamName === 'lv' ||
                          normalizedTeamName.includes(
                            'sphlv',
                          );

                        const isHighlightedLeader =
                          isLvTeamRow ||
                          (idx === 0 &&
                            !allTeamsTied);

                        return (
                          <div
                            key={`${row.id || idx}-${idx}`}
                            className={`relative grid grid-cols-[48px_minmax(0,1fr)_64px_70px] gap-2 border-b border-border/5 px-4 py-4 transition-colors hover:bg-foreground/[0.025] sm:grid-cols-[56px_minmax(0,1fr)_52px_52px_52px_52px_70px] ${
                              isHighlightedLeader
                                ? 'border border-[#B5413F]/40 bg-[#FFF4F4] shadow-[inset_0_0_0_1px_rgba(181,65,63,0.12)] dark:border-[#B5413F]/40 dark:bg-[#B5413F]/[0.055]'
                                : ''
                            }`}
                          >
                            {isHighlightedLeader && (
                              <div className="absolute bottom-3 left-0 top-3 w-1 rounded-r-full bg-[#B5413F]" />
                            )}

                            <div className="flex items-center">
                              <span
                                className={`flex h-9 w-9 items-center justify-center rounded-2xl border text-xs font-black ${
                                  isHighlightedLeader
                                    ? 'border-[#B5413F]/30 bg-[#B5413F] text-white shadow-[0_10px_24px_rgba(181,65,63,0.26)]'
                                    : 'border-border/10 bg-foreground/[0.035] text-foreground/55'
                                }`}
                              >
                                {allTeamsTied
                                  ? 'T1'
                                  : rank}
                              </span>
                            </div>

                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border/10 bg-foreground/[0.035] text-[10px] font-black uppercase tracking-wider text-foreground/55">
                                {teamInitials(row.team)}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-base font-black uppercase tracking-wide text-foreground">
                                  {row.team}
                                </p>

                                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-foreground/35 sm:hidden">
                                  {wins}W · {draws}D ·{' '}
                                  {losses}L
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-center font-mono text-sm text-foreground/80">
                              {gp}
                            </div>

                            <div className="hidden items-center justify-center font-mono text-sm text-foreground/70 sm:flex">
                              {wins}
                            </div>

                            <div className="hidden items-center justify-center font-mono text-sm text-foreground/70 sm:flex">
                              {draws}
                            </div>

                            <div className="hidden items-center justify-center font-mono text-sm text-foreground/70 sm:flex">
                              {losses}
                            </div>

                            <div className="flex items-center justify-end">
                              <div className="text-right">
                                <p className="font-mono text-xl font-black text-[#B5413F]">
                                  {pts}
                                </p>

                                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-foreground/30">
                                  {differenceLabel}{' '}
                                  {diff !== null &&
                                  diff > 0
                                    ? `+${diff}`
                                    : diff ?? '-'}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )
                  )}
                </div>

                <div className="flex flex-col gap-2 border-t border-brand-maroon/5 bg-[#F4F4F3] px-5 py-4 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/45 sm:flex-row sm:items-center sm:justify-between dark:border-border/5 dark:bg-foreground/[0.025] dark:text-foreground/35">
                  <span>
                    {isPreseasonStandings
                      ? 'Preseason table'
                      : 'Official workbook snapshot'}
                  </span>

                  <span>
                    {standingsRows.length} Teams ·{' '}
                    {isPreseasonStandings
                      ? 'All tied 0–0'
                      : 'Verified Aug 26'}
                  </span>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'games' && (
            <section className="space-y-4">
              <div className="flex flex-col gap-4 rounded-2xl border border-border/10 bg-subcard/50 px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#B5413F]">
                    Schedule & results
                  </p>

                  <h2 className="mt-1 text-[clamp(1.05rem,4.4vw,1.6rem)] font-black uppercase tracking-[0.06em] text-foreground">
                    Season Games
                  </h2>
                </div>
              </div>

              <div
                role="group"
                aria-label="Choose upcoming games or completed results"
                className="mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-2xl border border-border/10 bg-subcard/70 p-1.5 shadow-sm [scrollbar-width:none] sm:mx-0 [&::-webkit-scrollbar]:hidden"
              >
                {[
                  {
                    id: 'upcoming' as const,
                    label: 'Upcoming',
                    count: upcomingEvents.length,
                  },
                  {
                    id: 'results' as const,
                    label: 'Results',
                    count: completedResults.length,
                  },
                ].map((view) => {
                  const isActive =
                    gamesView === view.id;

                  return (
                    <motion.button
                      key={view.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => selectGamesView(view.id)}
                      whileTap={{ scale: PRESS_SCALE }}
                      transition={PRESS_TRANSITION}
                      className={`relative flex min-w-fit shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-transparent px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] transition-all duration-200 sm:px-4 ${
                        isActive
                          ? 'text-white'
                          : 'text-foreground/45 hover:bg-foreground/[0.04] hover:text-foreground/75'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="team-games-view-pill"
                          className="absolute inset-0 rounded-xl border border-brand-maroon bg-brand-maroon shadow-[0_8px_20px_rgba(120,0,0,0.24)]"
                          transition={STANDARD_SPRING}
                        />
                      )}
                      <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.12em] sm:text-[10px]">
                        {view.label}
                      </span>

                      <span
                        className={`relative z-10 shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[8px] font-black leading-none sm:px-2 sm:text-[9px] ${
                          isActive
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

              <AnimatePresence mode="wait" initial={false} custom={gamesDirection}>
              <motion.div
                key={gamesView}
                className="grid gap-5"
                initial={{ opacity: 0, x: reduceMotion ? 0 : gamesDirection * 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduceMotion ? 0 : gamesDirection * -6 }}
                transition={PAGE_TRANSITION}
              >
                {gamesView === 'upcoming' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-foreground">
                        Upcoming
                      </h3>

                      <span className="rounded-full border border-border/10 bg-subcard px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-foreground/45">
                        Master schedule
                      </span>
                    </div>

                    {athleticsDataState?.loading &&
                    upcomingEvents.length === 0 ? (
                      <EmptyPanel
                        title="Loading schedule"
                        body="Fetching the latest master schedule."
                      />
                    ) : upcomingEvents.length ===
                      0 ? (
                      <EmptyPanel
                        title="No upcoming games"
                        body="No future competitive events are listed for this team."
                      />
                    ) : (
                      <div className="space-y-3">
                        {upcomingEvents.map(
                          (event) => (
                            <article
                              key={event.id}
                              className="rounded-2xl border border-border/10 bg-subcard p-4 shadow-sm"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#B5413F]">
                                  {formatGameDate(
                                    event.date,
                                  )}
                                </p>

                                <span className="rounded-full border border-border/10 bg-foreground/[0.035] px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-foreground/48">
                                  {
                                    event.eventType
                                  }
                                </span>
                              </div>

                              <h4 className="mt-2 text-base font-black uppercase leading-tight text-foreground">
                                {event.eventText}
                              </h4>

                              <JaacMatchup event={event} />

                              <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/42">
                                {event.time && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <Clock
                                      size={12}
                                    />
                                    {event.time}
                                  </span>
                                )}

                                {event.location && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <MapPin
                                      size={12}
                                    />
                                    {event.location}
                                  </span>
                                )}
                              </div>
                            </article>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                )}

                {gamesView === 'results' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-foreground">
                        Completed results
                      </h3>

                      <span className="rounded-full border border-border/10 bg-subcard px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-foreground/45">
                        Manager sheet
                      </span>
                    </div>

                    {!resultSourceState?.configured ? (
                      <EmptyPanel
                        title="Results sheet awaiting publication"
                        body="This team feed will activate when its published CSV URL is configured."
                      />
                    ) : resultSourceState.failed &&
                      !resultSourceState.fromCache ? (
                      <EmptyPanel
                        title="Results temporarily unavailable"
                        body="The team sheet could not be loaded and no cached result is available."
                      />
                    ) : athleticsDataState?.loading &&
                      completedResults.length ===
                        0 ? (
                      <EmptyPanel
                        title="Loading results"
                        body="Fetching completed matches from the team manager sheet."
                      />
                    ) : completedResults.length ===
                      0 ? (
                      <EmptyPanel
                        title="No completed results yet"
                        body="A result appears after both scores and the required match fields are entered."
                      />
                    ) : (
                      <div className="space-y-3">
                        {completedResults.map(
                          (match) => (
                            <CompactResultCard
                              key={match.id}
                              match={match}
                              formatDate={
                                formatGameDate
                              }
                            />
                          ),
                        )}
                      </div>
                    )}

                    {resultSourceState &&
                      (resultSourceState.invalidRowCount >
                        0 ||
                        resultSourceState.duplicateRowCount >
                          0) && (
                        <p className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-[10px] font-bold text-amber-700 dark:text-amber-200">
                          {
                            resultSourceState.invalidRowCount
                          }{' '}
                          invalid and{' '}
                          {
                            resultSourceState.duplicateRowCount
                          }{' '}
                          duplicate row(s) were
                          ignored.
                        </p>
                      )}
                  </div>
                )}
              </motion.div>
              </AnimatePresence>
            </section>
          )}
        </div>

        {activeSection === 'standings' &&
          sport === 'Soccer' &&
          division === 'SMA' &&
          gender === 'Boys' && (
            <section className="mt-8 space-y-4">
              <div className="border-b border-brand-maroon/10 pb-3 dark:border-border/10">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-red">
                  Cup · JAAC · ACSC
                </p>

                <h3 className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-foreground sm:text-2xl">
                  Tournament Results
                </h3>

                <p className="mt-1 text-xs font-semibold text-foreground/45">
                  Final placement and championship
                  result only.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {varsityBoysSoccerTournamentResults.map(
                  (result) => {
                    const content = (
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-sky/18 text-brand-navy dark:text-brand-sky">
                          <Trophy size={17} />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-red">
                                {result.name}
                              </p>

                              <p className="mt-0.5 text-lg font-black uppercase tracking-tight text-foreground">
                                {
                                  result.placement
                                }
                              </p>
                            </div>

                            {'href' in result && (
                              <ChevronRight
                                size={16}
                                className="mt-1 shrink-0 text-foreground/30"
                              />
                            )}
                          </div>

                          <p className="mt-1 text-[11px] font-semibold leading-relaxed text-foreground/48">
                            {result.detail}
                          </p>
                        </div>
                      </div>
                    );

                    return 'href' in result ? (
                      <a
                        key={result.name}
                        href={result.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-2xl border border-brand-maroon/10 bg-white/80 p-4 shadow-sm transition-colors hover:border-brand-sky/40 dark:border-border/10 dark:bg-subcard"
                        aria-label={`Open ${result.name} results`}
                      >
                        {content}
                      </a>
                    ) : (
                      <article
                        key={result.name}
                        className="rounded-2xl border border-brand-maroon/10 bg-white/80 p-4 shadow-sm dark:border-border/10 dark:bg-subcard"
                      >
                        {content}
                      </article>
                    );
                  },
                )}
              </div>
            </section>
          )}

        {activeSection === 'players' && (
          <section
            className="space-y-4"
            data-roster-team={team?.id}
          >
            <div className="relative overflow-hidden rounded-[1.75rem] border border-border/10 bg-subcard px-5 py-5 shadow-sm sm:px-6">
              <div className="pointer-events-none absolute -right-10 -top-14 h-36 w-36 rounded-full border-[28px] border-[#B5413F]/[0.045]" />

              <div className="relative flex items-end justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#C1121F] dark:text-[#D85A57]">
                    <Users size={14} />
                    Official team list
                  </p>

                  <h3 className="mt-2 text-2xl font-black uppercase tracking-[0.08em] text-foreground sm:text-3xl">
                    Player Roster
                  </h3>
                </div>

                <div className="relative flex h-14 min-w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-[#B5413F]/20 bg-[#5A1C2C] px-3 text-white shadow-[0_12px_30px_rgba(90,28,44,0.24)]">
                  <span
                    className={`${
                      roster
                        ? 'text-xl'
                        : 'text-[10px] uppercase tracking-[0.14em]'
                    } font-black leading-none`}
                  >
                    {roster?.players.length ??
                      'Pending'}
                  </span>

                  {roster && (
                    <span className="mt-1 text-[8px] font-black uppercase tracking-[0.16em] text-white/55">
                      Players
                    </span>
                  )}
                </div>
              </div>
            </div>

            {roster ? (
              <ol
                className="grid gap-2.5 sm:grid-cols-2"
                aria-label={`${teamName} player roster`}
              >
                {roster.players.map(
                  (player, index) => (
                    <li
                      key={player}
                      data-player-name={player}
                      className="group flex min-h-16 items-center gap-3 overflow-hidden rounded-2xl border border-border/10 bg-subcard px-3.5 py-3 shadow-[0_3px_9px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B5413F]/25 hover:shadow-[0_5px_14px_rgba(90,28,44,0.09)]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#B5413F]/15 bg-[#B5413F]/[0.07] font-mono text-[11px] font-black text-[#B5413F] transition-colors group-hover:bg-[#5A1C2C] group-hover:text-white">
                        {String(index + 1).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <span className="min-w-0 text-[13px] font-black uppercase leading-snug tracking-[0.045em] text-foreground sm:text-sm">
                        {player}
                      </span>
                    </li>
                  ),
                )}
              </ol>
            ) : (
              <div className="flex min-h-[230px] flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-border/15 bg-foreground/[0.018] px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/10 bg-foreground/[0.035] text-foreground/30">
                  <Users size={24} />
                </div>

                <p className="mt-4 text-sm font-black uppercase tracking-[0.12em] text-foreground/68">
                  Roster awaiting confirmation
                </p>

                <p className="mt-2 max-w-md text-xs font-semibold leading-relaxed text-foreground/38">
                  Player names will appear after the
                  official team list is submitted.
                </p>
              </div>
            )}
          </section>
        )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
