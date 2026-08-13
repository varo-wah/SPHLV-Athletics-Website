import { SportTab, DivisionTab, GenderTab } from '../types';
import { Users, Trophy, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import TeamFavoriteButton from '../components/TeamFavoriteButton';
import { findTeam, sportDetails } from '../config/teamCatalog';
import { rosterForTeam } from '../data/teamRosters';
import { isCompetitiveScheduleEvent } from '../services/masterScheduleParser';

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

const approvedSoccerTeamPhotos = [
  'https://res.cloudinary.com/dpgt445lg/image/upload/v1780241030/Varsity_soccer_boys_teampic_2_dyv7mz.jpg',
  'https://res.cloudinary.com/dpgt445lg/image/upload/v1780241126/Varsity_boys_soccer_team_pic_resized_i1ezdp.jpg',
] as const;

const varsityBoysSoccerPreseasonTeams = ['LV', 'BSJ', 'GJS', 'ACS'] as const;

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

export default function TeamPageScreen({
  sport,
  division,
  gender,
  athleticsDataState,
}: TeamPageScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<TeamPageSection>('games');
  const [gamesView, setGamesView] = useState<GamesView>('upcoming');

  const team = findTeam(sport, division, gender);
  const sportInfo = sportDetails(sport);
  const teamName = team?.displayName ?? `${division} ${gender} ${sportInfo.label}`;
  const roster = team ? rosterForTeam(team.id) : undefined;
  const divisionLabel = division === 'SMA' ? 'SMA / Varsity' : 'SMP / Middle School';
  const teamPhotos = sport === 'Soccer' && division === 'SMA' && gender === 'Boys'
    ? approvedSoccerTeamPhotos
    : [];

  const goToPreviousPhoto = () => {
    if (teamPhotos.length === 0) return;
    setCurrentImageIndex((current) => (current - 1 + teamPhotos.length) % teamPhotos.length);
  };

  const goToNextPhoto = () => {
    if (teamPhotos.length === 0) return;
    setCurrentImageIndex((current) => (current + 1) % teamPhotos.length);
  };

  useEffect(() => {
    if (teamPhotos.length < 2) return undefined;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % teamPhotos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [teamPhotos.length]);

  useEffect(() => {
    setActiveSection('games');
    setGamesView('upcoming');
    setCurrentImageIndex(0);
  }, [sport, division, gender]);

  const currentStandings = (athleticsDataState?.data?.standings || []).filter((standing) => {
    return (
      standing.sportKey === sport &&
      standing.level === division &&
      standing.genderGroup === gender
    );
  });
  const isPreseasonStandings = sport === 'Soccer' && division === 'SMA' && gender === 'Boys';
  const standingsForDisplay = isPreseasonStandings
    ? varsityBoysSoccerPreseasonTeams.map((club, index) => ({
        id: `preseason-soccer-sma-boys-${club.toLowerCase()}`,
        pageId: 'preseason-soccer-sma-boys',
        sport: 'Soccer' as const,
        sportKey: 'Soccer' as const,
        level: 'SMA' as const,
        genderGroup: 'Boys' as const,
        tournament: 'Season' as const,
        rank: 1,
        team: club,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        forValue: 0,
        againstValue: 0,
        difference: 0,
        notes: index === 0 ? 'Preseason table' : '',
      }))
    : currentStandings;

  const resultSourceState = team
    ? athleticsDataState?.data.resultSourceStates.find((source) => source.teamId === team.id)
    : undefined;
  const completedResults = (athleticsDataState?.data.matches || [])
    .filter((match) => (
      match.sportKey === sport &&
      match.level === division &&
      match.genderGroup === gender
    ))
    .sort((a, b) => gameTimestamp(b.date, b.time) - gameTimestamp(a.date, a.time));
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const upcomingEvents = (athleticsDataState?.data.masterScheduleEvents || [])
    .filter((event) => (
      isCompetitiveScheduleEvent(event) &&
      event.sportKey === sport &&
      event.level === division &&
      event.genderGroup === gender &&
      Boolean(event.date && event.date >= todayIso)
    ))
    .sort((a, b) => gameTimestamp(a.date, a.time) - gameTimestamp(b.date, b.time));

  const standingsRows = standingsForDisplay
    .map((row, idx) => {
      const wins = row.wins ?? 0;
      const draws = row.draws ?? 0;
      const losses = row.losses ?? 0;
      const gp = wins + draws + losses;
      const pts = row.points ?? ((wins * 3) + draws);
      const goalsFor = row.forValue ?? 0;
      const diff = row.difference ?? (
        row.forValue !== null && row.againstValue !== null ? row.forValue - row.againstValue : 0
      );

      return { row, idx, wins, draws, losses, gp, pts, goalsFor, diff, rank: idx + 1 };
    })
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.diff !== a.diff) return b.diff - a.diff;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (isPreseasonStandings) return a.idx - b.idx;
      return a.row.team.localeCompare(b.row.team);
    })
    .map((entry, idx) => ({ ...entry, rank: isPreseasonStandings ? 1 : idx + 1 }));
  const allTeamsTied = standingsRows.length > 1 && standingsRows.every((entry) => (
    entry.pts === standingsRows[0].pts
    && entry.gp === standingsRows[0].gp
    && entry.wins === standingsRows[0].wins
    && entry.draws === standingsRows[0].draws
    && entry.losses === standingsRows[0].losses
    && entry.diff === standingsRows[0].diff
  ));
  const leader = standingsRows[0];
  const lvStanding = standingsRows.find((entry) => {
    const teamName = entry.row.team.trim().toLowerCase();
    return teamName === 'lv' || teamName.includes('sph lv') || teamName.includes('sphlv');
  }) ?? leader;

  const SectionHeader = ({
    title,
    detail,
    count,
  }: {
    title: string;
    detail: string;
    count?: number;
  }) => (
    <div className="rounded-2xl border border-border/10 bg-subcard/50 px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#B5413F]">
            {detail}
          </p>
          <h3 className="mt-1 text-2xl sm:text-3xl font-black uppercase tracking-[0.08em] text-foreground leading-none">
            {title}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {typeof count === 'number' && (
            <span className="rounded-full border border-border/10 bg-subcard px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/55">
              {count}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const EmptyPanel = ({ title, body }: { title: string; body: string }) => (
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
    if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase();

    return parts.map((part) => part[0]).join('').slice(0, 3).toUpperCase();
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 cursor-default">
      <header className="flex items-start justify-between gap-4 border-b border-border/10 px-4 py-5 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B5413F]">
            {divisionLabel}
          </p>
          <h1 className="mt-1 text-3xl font-black uppercase leading-tight tracking-[-0.025em] text-foreground sm:text-4xl">
            {teamName}
          </h1>
        </div>
        <TeamFavoriteButton
          sport={sport}
          division={division}
          gender={gender}
          className="shrink-0"
        />
      </header>

      <nav
        aria-label={`${teamName} sections`}
        className="pointer-events-none sticky top-16 z-40 px-3 py-3 sm:px-6 lg:px-8"
      >
        <div
          role="tablist"
          aria-label="Team page sections"
          className="pointer-events-auto mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-[1.4rem] border border-border/10 bg-canvas/80 p-1.5 shadow-[0_18px_55px_rgba(0,0,0,0.24)] backdrop-blur-2xl saturate-150 [scrollbar-width:none] supports-[backdrop-filter]:bg-canvas/65 [&::-webkit-scrollbar]:hidden"
        >
          {teamPageSections.map((section) => {
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                id={`team-section-tab-${section.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="team-section-panel"
                onClick={() => setActiveSection(section.id)}
                className={`relative min-w-fit rounded-[1.05rem] border border-transparent px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] transition-all duration-200 sm:px-6 sm:text-[11px] ${
                  isActive
                    ? 'border-brand-sky bg-brand-sky text-brand-navy shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_8px_24px_rgba(102,155,188,0.22)]'
                    : 'text-foreground/42 hover:bg-foreground/[0.045] hover:text-foreground/75'
                }`}
              >
                {section.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div
        id="team-section-panel"
        role="tabpanel"
        aria-labelledby={`team-section-tab-${activeSection}`}
        className="px-4 sm:px-6 lg:px-8 mt-5 space-y-8"
      >
        <div className="space-y-10">
          {/* STANDINGS COLUMN */}
          {activeSection === 'standings' && (
          <section className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-border/10 bg-subcard/40 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.16)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#B5413F]">
                    {isPreseasonStandings ? 'Preseason table' : 'Live table'}
                  </p>
                  <h2 className="mt-2 text-3xl font-black uppercase tracking-[0.16em] text-foreground leading-tight sm:text-4xl">
                    League<br />Standings
                  </h2>
                </div>

            {!isPreseasonStandings && <div className="flex flex-wrap items-center gap-3">
              {(athleticsDataState?.loading || athleticsDataState?.refreshing) && (
                <span className="rounded-full border border-[#B5413F]/20 bg-[#B5413F]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#B5413F] animate-pulse">
                  Syncing
                </span>
              )}

              {athleticsDataState?.lastUpdated && (
                <span className="rounded-full border border-border/10 bg-foreground/[0.025] px-3 py-2 text-[10px] font-mono uppercase tracking-[0.14em] text-foreground/40">
                  Updated {athleticsDataState.lastUpdated}
                </span>
              )}

              <button
                type="button"
                onClick={() => athleticsDataState?.refresh()}
                className="shrink-0 rounded-2xl border border-border/10 bg-subcard px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/65 transition-colors hover:border-[#B5413F]/40 hover:text-foreground"
              >
                Refresh
              </button>
            </div>}
          </div>

          {lvStanding && (
            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="rounded-2xl border border-[#B5413F]/20 bg-gradient-to-r from-[#5A1C2C]/35 via-[#5A1C2C]/14 to-transparent p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#B5413F]">
                  {allTeamsTied ? 'Preseason status' : 'LV status'}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#B5413F] text-sm font-black text-white shadow-[0_12px_30px_rgba(181,65,63,0.28)]">
                    {allTeamsTied ? `T${lvStanding.rank}` : `#${lvStanding.rank}`}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-2xl font-black uppercase tracking-tight text-foreground">
                      {allTeamsTied ? 'All teams tied' : lvStanding.rank === 1 ? 'LV leads the table' : `LV is #${lvStanding.rank}`}
                    </p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/40">
                      {lvStanding.wins}W · {lvStanding.draws}D · {lvStanding.losses}L
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:min-w-[230px]">
                <div className="rounded-2xl border border-border/10 bg-foreground/[0.025] p-3 text-center">
                  <p className="text-2xl font-black text-[#B5413F]">{lvStanding.pts}</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-foreground/35">Pts</p>
                </div>
                <div className="rounded-2xl border border-border/10 bg-foreground/[0.025] p-3 text-center">
                  <p className="text-2xl font-black text-foreground">{lvStanding.gp}</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-foreground/35">GP</p>
                </div>
                <div className="rounded-2xl border border-border/10 bg-foreground/[0.025] p-3 text-center">
                  <p className="text-2xl font-black text-foreground">
                    {lvStanding.diff !== null && lvStanding.diff > 0 ? `+${lvStanding.diff}` : lvStanding.diff ?? '-'}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-foreground/35">GD</p>
                </div>
              </div>
            </div>
          )}
        </div>

            <div className="overflow-hidden rounded-3xl border border-border/10 bg-subcard shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
               <div className="grid grid-cols-[48px_minmax(0,1fr)_64px_70px] gap-2 border-b border-[#5A1C2C]/10 bg-[#5A1C2C]/10 px-4 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-[#B5413F] sm:grid-cols-[56px_minmax(0,1fr)_52px_52px_52px_52px_70px]">
                  <div>Rank</div>
                  <div>Club</div>
                  <div className="text-center">GP</div>
                  <div className="hidden text-center sm:block">W</div>
                  <div className="hidden text-center sm:block">D</div>
                  <div className="hidden text-center sm:block">L</div>
                  <div className="text-right">Pts</div>
               </div>

               <div className="flex flex-col">
                  {athleticsDataState?.loading && standingsForDisplay.length === 0 ? (
                    <div className="p-6 text-center text-xs font-medium text-foreground/40 animate-pulse">
                      Fetching live standings from Google Sheets...
                    </div>
                  ) : athleticsDataState?.error && standingsForDisplay.length === 0 ? (
                    <div className="p-6 text-center text-xs font-semibold text-red-500 bg-red-500/5">
                      Failed to load. {athleticsDataState.error}
                    </div>
                  ) : standingsRows.length === 0 ? (
                    <div className="p-8 text-center text-xs font-medium text-foreground/40 space-y-2">
                      <p className="font-bold text-foreground/60">Standings will appear once uploaded</p>
                      <p>
                        No standings matches for {sportInfo.label} · {divisionLabel} · {gender}.
                      </p>
                    </div>
                  ) : (
                    standingsRows.map(({ row, idx, wins, draws, losses, gp, pts, rank, diff }) => {
                      return (
                        <div
                          key={`${row.id || idx}-${idx}`}
                          className={`relative grid grid-cols-[48px_minmax(0,1fr)_64px_70px] gap-2 border-b border-border/5 px-4 py-4 transition-colors hover:bg-foreground/[0.025] sm:grid-cols-[56px_minmax(0,1fr)_52px_52px_52px_52px_70px] ${
                            idx === 0 && !allTeamsTied ? 'bg-[#B5413F]/[0.055]' : ''
                          }`}
                        >
                          {idx === 0 && !allTeamsTied && <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-[#B5413F]" />}
                          <div className="flex items-center">
                            <span className={`flex h-9 w-9 items-center justify-center rounded-2xl border text-xs font-black ${
                              idx === 0 && !allTeamsTied
                                ? 'border-[#B5413F]/30 bg-[#B5413F] text-white shadow-[0_10px_24px_rgba(181,65,63,0.26)]'
                                : 'border-border/10 bg-foreground/[0.035] text-foreground/55'
                            }`}>
                              {allTeamsTied ? `T${rank}` : rank}
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
                                {wins}W · {draws}D · {losses}L
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
                              <p className="font-mono text-xl font-black text-[#B5413F]">{pts}</p>
                              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-foreground/30">
                                GD {diff !== null && diff > 0 ? `+${diff}` : diff ?? '-'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
               </div>

               <div className="flex flex-col gap-2 bg-foreground/[0.025] px-5 py-4 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/35 sm:flex-row sm:items-center sm:justify-between">
                  <span>{isPreseasonStandings ? 'Preseason table' : 'Google Sheets Synced'}</span>
                  <span>{standingsRows.length} Teams · {isPreseasonStandings ? 'All tied 0–0' : 'Live Data'}</span>
               </div>
            </div>
          </section>
          )}

          {/* GAMES */}
          {activeSection === 'games' && (
            <section className="space-y-4">
              <div className="flex flex-col gap-4 rounded-2xl border border-border/10 bg-subcard/50 px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#B5413F]">
                    Schedule & results
                  </p>
                  <h2 className="mt-1 text-2xl font-black uppercase tracking-[0.08em] text-foreground sm:text-3xl">
                    Season Games
                  </h2>
                </div>

              </div>

              <div
                role="group"
                aria-label="Choose upcoming games or completed results"
                className="grid grid-cols-2 gap-1 rounded-2xl border border-border/10 bg-subcard/70 p-1.5 shadow-sm sm:w-fit sm:min-w-[320px]"
              >
                {([
                  { id: 'upcoming' as const, label: 'Upcoming', count: upcomingEvents.length },
                  { id: 'results' as const, label: 'Results', count: completedResults.length },
                ]).map((view) => {
                  const isActive = gamesView === view.id;

                  return (
                    <button
                      key={view.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setGamesView(view.id)}
                      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] transition-all duration-200 ${
                        isActive
                          ? 'bg-brand-sky text-brand-navy shadow-[0_8px_20px_rgba(102,155,188,0.24)]'
                          : 'text-foreground/45 hover:bg-foreground/[0.04] hover:text-foreground/75'
                      }`}
                    >
                      <span>{view.label}</span>
                      <span className={`rounded-full px-2 py-0.5 font-mono text-[9px] ${
                        isActive ? 'bg-brand-navy/10 text-brand-navy' : 'bg-foreground/[0.05] text-foreground/38'
                      }`}>
                        {view.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {athleticsDataState?.warning && (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-xs font-bold text-amber-700 dark:text-amber-200">
                  {athleticsDataState.warning}
                </div>
              )}

              <div className="grid gap-5">
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

                  {athleticsDataState?.loading && upcomingEvents.length === 0 ? (
                    <EmptyPanel title="Loading schedule" body="Fetching the latest master schedule." />
                  ) : upcomingEvents.length === 0 ? (
                    <EmptyPanel title="No upcoming games" body="No future competitive events are listed for this team." />
                  ) : (
                    <div className="space-y-3">
                      {upcomingEvents.map((event) => (
                        <article key={event.id} className="rounded-2xl border border-border/10 bg-subcard p-4 shadow-sm">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#B5413F]">
                              {formatGameDate(event.date)}
                            </p>
                            <span className="rounded-full border border-border/10 bg-foreground/[0.035] px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-foreground/48">
                              {event.eventType}
                            </span>
                          </div>
                          <h4 className="mt-2 text-base font-black uppercase leading-tight text-foreground">
                            {event.eventText}
                          </h4>
                          <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/42">
                            {event.time && <span className="inline-flex items-center gap-1.5"><Clock size={12} />{event.time}</span>}
                            {event.location && <span className="inline-flex items-center gap-1.5"><MapPin size={12} />{event.location}</span>}
                          </div>
                        </article>
                      ))}
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
                    <EmptyPanel title="Results sheet awaiting publication" body="This team feed will activate when its published CSV URL is configured." />
                  ) : resultSourceState.failed && !resultSourceState.fromCache ? (
                    <EmptyPanel title="Results temporarily unavailable" body="The team sheet could not be loaded and no cached result is available." />
                  ) : athleticsDataState?.loading && completedResults.length === 0 ? (
                    <EmptyPanel title="Loading results" body="Fetching completed matches from the team manager sheet." />
                  ) : completedResults.length === 0 ? (
                    <EmptyPanel title="No completed results yet" body="A result appears after both scores and the required match fields are entered." />
                  ) : (
                    <div className="space-y-3">
                      {completedResults.map((match) => (
                        <article key={match.id} className="overflow-hidden rounded-2xl border border-border/10 bg-subcard shadow-sm">
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/5 px-4 py-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-foreground/45">
                              {formatGameDate(match.date)}{match.time ? ` · ${match.time}` : ''}
                            </p>
                            <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${
                              match.result === 'W'
                                ? 'bg-green-500/10 text-green-600 dark:text-green-300'
                                : match.result === 'L'
                                  ? 'bg-red-500/10 text-red-600 dark:text-red-300'
                                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                            }`}>
                              {match.result}
                            </span>
                          </div>
                          <div className="grid grid-cols-[minmax(0,1fr)_52px] border-b border-border/5 px-4 py-3">
                            <span className="truncate text-sm font-black uppercase text-foreground">{match.homeTeam}</span>
                            <span className="text-right font-mono text-xl font-black text-foreground">{match.homeScore}</span>
                          </div>
                          <div className="grid grid-cols-[minmax(0,1fr)_52px] px-4 py-3">
                            <span className="truncate text-sm font-black uppercase text-foreground">{match.awayTeam}</span>
                            <span className="text-right font-mono text-xl font-black text-foreground">{match.awayScore}</span>
                          </div>
                          {match.venue && (
                            <p className="border-t border-border/5 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-foreground/35">
                              {match.venue}
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  )}

                  {resultSourceState && (resultSourceState.invalidRowCount > 0 || resultSourceState.duplicateRowCount > 0) && (
                    <p className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-[10px] font-bold text-amber-700 dark:text-amber-200">
                      {resultSourceState.invalidRowCount} invalid and {resultSourceState.duplicateRowCount} duplicate row(s) were ignored.
                    </p>
                  )}
                </div>
                )}
              </div>

              {sport === 'Soccer' && division === 'SMA' && gender === 'Boys' && (
                <a
                  href="https://acscconference.com/boys-soccer/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-border/10 bg-subcard/70 px-4 py-3 text-white shadow-[0_14px_38px_rgba(0,0,0,0.16)] transition-colors hover:border-[#B5413F]/30 hover:bg-subcard"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-[#B5413F]" />

                  <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#B5413F]/20 bg-[#B5413F]/10">
                      <Trophy size={19} className="text-[#B5413F] transition-transform group-hover:scale-110" />
                    </div>

                    <div className="flex min-w-0 flex-col items-start gap-1 leading-none">
                      <span className="text-[9px] font-black uppercase tracking-[0.22em] text-foreground/40">
                        Postseason
                      </span>
                      <span className="truncate text-sm font-black tracking-tight text-foreground sm:text-base">
                        Open ACSC Results
                      </span>
                    </div>
                  </div>

                  <ChevronRight size={20} className="relative z-10 text-foreground/45 transition-transform group-hover:translate-x-1 group-hover:text-[#B5413F]" />
                </a>
              )}
            </section>
          )}
        </div>

        {/* JAAC Bracket */}
        {activeSection === 'standings' && sport === 'Soccer' && division === 'SMA' && gender === 'Boys' && (
          <section className="space-y-4 mt-10">
            <SectionHeader
              title="JAAC Bracket"
              detail="Semifinals & final"
            />

            <div className="rounded-2xl border border-brand-sky/20 bg-brand-maroon p-4 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60">
                  @BSJ · Final Round
                </p>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60">
                  2025
                </p>
              </div>

              <div className="rounded-xl border border-brand-sky/15 bg-brand-navy p-5">
                <div className="text-center mb-5">
                  <h4 className="text-lg font-black uppercase tracking-[0.18em] text-brand-cream">
                    JAAC Championship
                  </h4>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/50 mt-1">
                    Playoffs
                  </p>
                </div>

                {/* Final */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center mb-5">
                  <div className="overflow-hidden rounded-lg border border-white/10 border-l-4 border-l-brand-sky bg-white/5">
                    <div className="grid grid-cols-[1fr_48px] border-b border-white/5">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white/55">
                        SPH
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-white/55">
                        0
                      </div>
                    </div>

                    <div className="grid grid-cols-[1fr_48px] bg-white/10">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white">
                        BSJ
                      </div>
                      <div className="px-3 py-2 text-right text-xs font-black text-brand-cream">
                        2
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white/5 border border-white/10 min-h-[72px] flex items-center justify-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                      Final
                    </p>
                  </div>
                </div>

                {/* Semifinals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                    <div className="px-3 py-2 border-b border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        Semifinals 1
                      </p>
                    </div>

                    <div className="grid grid-cols-[1fr_48px] bg-white/10">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white">
                        SPH
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-white">
                        3
                      </div>
                    </div>

                    <div className="grid grid-cols-[1fr_48px] border-t border-white/5">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white/55">
                        JIS
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-white/55">
                        1
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                    <div className="px-3 py-2 border-b border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        Semifinals 2
                      </p>
                    </div>

                    <div className="grid grid-cols-[1fr_48px] bg-white/10">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white">
                        BSJ
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-white">
                        2
                      </div>
                    </div>

                    <div className="grid grid-cols-[1fr_48px] border-t border-white/5">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white/55">
                        ACS
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-white/55">
                        0
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Team Photo */}
        {activeSection === 'players' && teamPhotos.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#C1121F] dark:text-[#B5413F]">
                <Users size={14} />
                Team Photo
              </p>
              <h3 className="mt-1 text-2xl font-black uppercase tracking-[0.08em] text-foreground dark:text-foreground">
                2025-26 Squad
              </h3>
            </div>
            {teamPhotos.length > 0 && (
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/10 bg-subcard px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/45">
                <span>{currentImageIndex + 1}</span>
                <span className="text-foreground/20">/</span>
                <span>{teamPhotos.length}</span>
              </div>
            )}
          </div>

          <div className="group relative overflow-hidden rounded-[1.75rem] border border-border/10 bg-[#0b080a] shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
            <div className="relative aspect-[16/11] min-h-[260px] sm:aspect-[16/9]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={teamPhotos[currentImageIndex]}
                  alt={`${teamName} team photo ${currentImageIndex + 1}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="absolute inset-0 h-full w-full object-contain object-center"
                />
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_45%,rgba(0,0,0,0.72))]" />
              <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                    SPH LV Eagles
                  </p>
                  <p className="mt-1 text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
                    {teamName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousPhoto}
                    aria-label="Previous team photo"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition-colors hover:bg-white hover:text-black"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={goToNextPhoto}
                    aria-label="Next team photo"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition-colors hover:bg-white hover:text-black"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 border-t border-white/[0.06] bg-white/[0.025] px-4 py-3">
              {teamPhotos.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentImageIndex(idx)}
                  aria-label={`Show team photo ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex ? 'w-9 bg-[#F06865]' : 'w-2.5 bg-white/22 hover:bg-white/45'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Player Roster */}
        {activeSection === 'players' && (
        <section className="space-y-4" data-roster-team={team?.id}>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[#B5413F]/20 bg-[linear-gradient(135deg,rgba(90,28,44,0.14),rgba(181,65,63,0.04)_60%,transparent)] px-5 py-5 shadow-sm sm:px-6">
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
                <span className={`${roster ? 'text-xl' : 'text-[10px] uppercase tracking-[0.14em]'} font-black leading-none`}>
                  {roster?.players.length ?? 'Pending'}
                </span>
                {roster && (
                  <span className="mt-1 text-[8px] font-black uppercase tracking-[0.16em] text-white/55">Players</span>
                )}
              </div>
            </div>
          </div>

          {roster ? (
            <ol className="grid gap-2.5 sm:grid-cols-2" aria-label={`${teamName} player roster`}>
              {roster.players.map((player, index) => (
                <li
                  key={player}
                  data-player-name={player}
                  className="group flex min-h-16 items-center gap-3 overflow-hidden rounded-2xl border border-border/10 bg-subcard px-3.5 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B5413F]/25 hover:shadow-[0_14px_34px_rgba(90,28,44,0.11)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#B5413F]/15 bg-[#B5413F]/[0.07] font-mono text-[11px] font-black text-[#B5413F] transition-colors group-hover:bg-[#5A1C2C] group-hover:text-white">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 text-[13px] font-black uppercase leading-snug tracking-[0.045em] text-foreground sm:text-sm">
                    {player}
                  </span>
                </li>
              ))}
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
                Player names will appear after the official team list is submitted.
              </p>
            </div>
          )}
        </section>
        )}

      </div>
    </div>
  );
}
