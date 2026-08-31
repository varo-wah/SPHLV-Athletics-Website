import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import scheduleDataJson from '../data/schedule.json';
import { ScheduleData, ScheduleEvent, ScheduleEventType } from '../data/scheduleTypes';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { DivisionTab, GenderTab, SportTab } from '../types';
import {
  IS_PROTOTYPE,
  LAUNCH_SEASON,
  isVisibleScheduleEvent,
} from '../config/launchSports';
import {
  ALL_TEAMS_VISUAL_THEME,
  FALLBACK_TEAM_VISUAL_THEME,
  teamAccentProperties,
  teamVisualThemeForCode,
  teamVisualThemesForName,
} from '../config/teamVisualThemes';
import {
  consolidateSharedScheduleEvents,
  eventMatchesTeamFilter,
  isGameScheduleEvent,
  scheduleFixtureLines,
  type ScheduleTeamFilter,
} from '../services/schedulePresentation';
import {
  PAGE_TRANSITION,
  PRESS_SCALE,
  PRESS_TRANSITION,
  SOFT_SPRING,
  STANDARD_SPRING,
  staggerDelay,
} from '../config/motion';

const fallbackScheduleData = scheduleDataJson as ScheduleData;

const EVENT_TYPE_STYLES: Record<ScheduleEventType, string> = {
  Practice: 'border-[#7F1D1D]/25 bg-muted text-[#7F1D1D] dark:border-[#BFD7EA]/20 dark:bg-muted dark:text-[#BFD7EA]',
  'Home Game': 'border-brand-maroon bg-brand-maroon text-white dark:border-brand-maroon dark:bg-brand-maroon dark:text-white',
  'Away Game': 'border-[#6B7280] bg-[#6B7280] text-white dark:border-[#6B7280] dark:bg-[#6B7280] dark:text-white',
  Tournament: 'border-[#991B1B] bg-[#991B1B] text-white dark:border-[#B5413F]/25 dark:bg-[#B5413F]/12 dark:text-[#D85A57]',
  Holiday: 'border-brand-maroon/15 bg-brand-cream text-[#1F2937] dark:border-purple-400/20 dark:bg-purple-400/10 dark:text-purple-300',
  Other: 'border-border/10 bg-foreground/[0.035] text-foreground/55',
};

const EVENT_TYPE_EMOJIS: Record<ScheduleEventType, string> = {
  Practice: '🏋️',
  'Home Game': '🏠',
  'Away Game': '🚌',
  Tournament: '🏆',
  Holiday: '🏝️',
  Other: '📌',
};

const TEAM_FILTER_OPTIONS: ReadonlyArray<{
  id: ScheduleTeamFilter;
  label: string;
  title: string;
  emoji: string;
}> = [
  {
    id: 'All',
    label: 'All',
    title: 'All teams',
    emoji: '🏆',
  },
  {
    id: 'VBS',
    label: 'VBS',
    title: 'Varsity Boys Soccer',
    emoji: '⚽',
  },
  {
    id: 'VGS',
    label: 'VGS',
    title: 'Varsity Girls Soccer',
    emoji: '⚽',
  },
  {
    id: 'VBV',
    label: 'VBV',
    title: 'Varsity Boys Volleyball',
    emoji: '🏐',
  },
  {
    id: 'VGV',
    label: 'VGV',
    title: 'Varsity Girls Volleyball',
    emoji: '🏐',
  },
  {
    id: 'SMPBB',
    label: 'SMPBB',
    title: 'SMP Boys Basketball',
    emoji: '🏀',
  },
  {
    id: 'SMPGB',
    label: 'SMPGB',
    title: 'SMP Girls Basketball',
    emoji: '🏀',
  },
];

const ALL = 'All';
type ScheduleView = 'list' | 'calendar';
interface SelectedCalendarDay {
  label: string;
  events: ScheduleEvent[];
}

interface SportScheduleScreenProps {
  sport?: SportTab;
  gender?: GenderTab;
  division?: DivisionTab;
  onSportChange?: (sport: SportTab) => void;
  athleticsDataState?: AthleticsDataState;
}

function weekNumber(week: string | null) {
  const match = week?.match(/\d+/);
  return match ? Number(match[0]) : 999;
}

function formatDate(date: string | null) {
  if (!date) return 'Date TBD';
  const [year, month, day] = date.split('-').map(Number);
  const value = new Date(year, month - 1, day);
  return value.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatLongDate(date: string | null) {
  if (!date) return 'Date TBD';
  const [year, month, day] = date.split('-').map(Number);
  const value = new Date(year, month - 1, day);
  return value.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function parseIsoDate(date: string | null) {
  if (!date) return null;
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function localIsoDate(value = new Date()) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function eventSportKey(event: ScheduleEvent): SportTab | 'Swimming' | null {
  if (event.sportKey) return event.sportKey;

  const team = event.team.toLowerCase();
  if (team.includes('soccer')) return 'Soccer';
  if (team.includes('basketball')) return 'Basketball';
  if (team.includes('volleyball')) return 'Volleyball';
  if (team.includes('badminton')) return 'Badminton';
  if (team.includes('track')) return 'TrackAndField';
  if (team.includes('swim')) return 'Swimming';
  return null;
}

function sportEmojiForEvent(event: ScheduleEvent) {
  switch (eventSportKey(event)) {
    case 'Soccer': return '⚽';
    case 'Basketball': return '🏀';
    case 'Volleyball': return '🏐';
    case 'Badminton': return '🏸';
    case 'TrackAndField': return '🏃';
    case 'Swimming': return '🏊';
    default: return '🏆';
  }
}

function teamAccentForEvent(event: ScheduleEvent) {
  const themes = teamVisualThemesForName(event.team);
  const primary = themes[0] ?? FALLBACK_TEAM_VISUAL_THEME;
  const secondary = themes[1] ?? primary;

  return {
    combined: themes.length > 1,
    style: teamAccentProperties(primary, secondary),
  };
}

function isMeaningfulScheduleEvent(event: ScheduleEvent) {
  return /[A-Za-z0-9]/.test(event.eventText);
}

function displayEventTime(event: ScheduleEvent) {
  if (!event.time) return null;
  if (/\bgym\s+\d+\s*(?:am|pm)\b/i.test(event.eventText)) return null;
  return event.time;
}

function archivedWeekNames(events: ScheduleEvent[], todayIso: string) {
  const eventsByWeek = events.reduce<Record<string, ScheduleEvent[]>>((groups, event) => {
    const week = event.week || 'Unassigned Week';
    groups[week] = groups[week] || [];
    groups[week].push(event);
    return groups;
  }, {});

  return new Set(
    Object.entries(eventsByWeek)
      .filter(([, weekEvents]) => (
        weekEvents.length > 0
        && weekEvents.every((event) => Boolean(event.date) && event.date! < todayIso)
      ))
      .map(([week]) => week),
  );
}

function monthKey(date: string | null) {
  const value = parseIsoDate(date);
  if (!value) return 'undated';
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key: string) {
  if (key === 'undated') return 'Date TBD';
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function shortTeamName(team: string) {
  return team
    .replace(/\b(Varsity|SMP|SMA)\b/gi, '')
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 4)
    .toUpperCase();
}

function groupEventsByMonth(events: ScheduleEvent[]) {
  return events.reduce<Record<string, ScheduleEvent[]>>((groups, event) => {
    const key = monthKey(event.date);
    groups[key] = groups[key] || [];
    groups[key].push(event);
    return groups;
  }, {});
}

function buildMonthDays(key: string, events: ScheduleEvent[]) {
  if (key === 'undated') return [];
  const [year, month] = key.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const leadingBlanks = firstDay.getDay();
  const eventsByDay = events.reduce<Record<number, ScheduleEvent[]>>((groups, event) => {
    const value = parseIsoDate(event.date);
    if (!value) return groups;
    const day = value.getDate();
    groups[day] = groups[day] || [];
    groups[day].push(event);
    return groups;
  }, {});

  return [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      return { day, events: eventsByDay[day] || [] };
    }),
  ];
}

function groupEventsByWeek(events: ScheduleEvent[]) {
  return events.reduce<Record<string, ScheduleEvent[]>>((groups, event) => {
    const key = event.week || 'Unassigned Week';
    groups[key] = groups[key] || [];
    groups[key].push(event);
    return groups;
  }, {});
}

export default function SportScheduleScreen({ athleticsDataState }: SportScheduleScreenProps) {
  const liveEvents = athleticsDataState?.data.masterScheduleEvents || [];
  const scheduleEvents = liveEvents.length > 0 ? liveEvents : fallbackScheduleData.events;
  const seasons = useMemo(() => {
    const availableSeasons = new Set(scheduleEvents.map((event) => event.season));
    const configuredSeasons = fallbackScheduleData.seasons.filter((season) => availableSeasons.has(season));
    const additionalSeasons = [...availableSeasons]
      .filter((season) => !configuredSeasons.includes(season))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    return configuredSeasons.length > 0
      ? [...configuredSeasons, ...additionalSeasons]
      : fallbackScheduleData.seasons;
  }, [scheduleEvents]);
  const [selectedSeason, setSelectedSeason] = useState(LAUNCH_SEASON);
  const activeSeason = IS_PROTOTYPE ? selectedSeason : LAUNCH_SEASON;
  const [teamFilter, setTeamFilter] = useState<ScheduleTeamFilter>(ALL);
  const [scheduleScope, setScheduleScope] = useState<'games' | 'practices'>('games');
  const [collapsedWeeks, setCollapsedWeeks] = useState<Record<string, boolean>>({});
  const [scheduleView, setScheduleView] = useState<ScheduleView>('list');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<SelectedCalendarDay | null>(null);
  const [showArchivedWeeks, setShowArchivedWeeks] = useState(false);
  const reduceMotion = useReducedMotion();
  const calendarTriggerRef = useRef<HTMLButtonElement | null>(null);
  const calendarCloseRef = useRef<HTMLButtonElement | null>(null);
  const todayIso = localIsoDate();

  const closeCalendarDay = useCallback(() => {
    setSelectedCalendarDay(null);
    requestAnimationFrame(() => calendarTriggerRef.current?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    if (!selectedCalendarDay) return undefined;

    calendarCloseRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCalendarDay();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeCalendarDay, selectedCalendarDay]);

  useEffect(() => {
    if (IS_PROTOTYPE && !seasons.includes(selectedSeason) && seasons[0]) {
      setSelectedSeason(seasons[0]);
    }
  }, [seasons, selectedSeason]);

  const seasonEvents = useMemo(() => {
    const visibleEvents = scheduleEvents
      .filter((event) => (
        event.season === activeSeason
        && isMeaningfulScheduleEvent(event)
        && isVisibleScheduleEvent(event.season, eventSportKey(event), event.team)
      ))
      .sort((a, b) => {
        const dateCompare = (a.date || '').localeCompare(b.date || '');
        if (dateCompare !== 0) return dateCompare;
        return a.team.localeCompare(b.team);
      });

    return consolidateSharedScheduleEvents(visibleEvents);
  }, [activeSeason, scheduleEvents]);

  const archivedWeeks = useMemo(
    () => archivedWeekNames(seasonEvents, todayIso),
    [seasonEvents, todayIso],
  );
  const filteredEvents = useMemo(() => {
    return seasonEvents.filter((event) => {
      const eventWeek = event.week || 'Unassigned Week';
      if (!showArchivedWeeks && archivedWeeks.has(eventWeek)) return false;
      if (!eventMatchesTeamFilter(event, teamFilter)) return false;
      if (scheduleScope === 'games' && !isGameScheduleEvent(event)) return false;
      return true;
    });
  }, [archivedWeeks, scheduleScope, seasonEvents, showArchivedWeeks, teamFilter]);

  const groupedEvents = useMemo(() => groupEventsByWeek(filteredEvents), [filteredEvents]);
  const visibleWeeks = Object.keys(groupedEvents).sort((a, b) => {
    const archiveCompare = Number(archivedWeeks.has(a)) - Number(archivedWeeks.has(b));
    return archiveCompare || weekNumber(a) - weekNumber(b);
  });
  const seasonEventCounts = useMemo(() => (
    scheduleEvents.reduce<Record<string, number>>((counts, event) => {
      if (isMeaningfulScheduleEvent(event)) {
        counts[event.season] = (counts[event.season] || 0) + 1;
      }
      return counts;
    }, {})
  ), [scheduleEvents]);
  const groupedCalendarEvents = useMemo(() => groupEventsByMonth(filteredEvents), [filteredEvents]);
  const visibleMonths = Object.keys(groupedCalendarEvents).sort((a, b) => {
    if (a === 'undated') return 1;
    if (b === 'undated') return -1;
    return a.localeCompare(b);
  });
  const clearFilters = () => {
    setTeamFilter(ALL);
    setScheduleScope('games');
    setShowArchivedWeeks(false);
  };

  const changeSeason = (season: string) => {
    setSelectedSeason(season);
    clearFilters();
    setCollapsedWeeks({});
    setSelectedCalendarDay(null);
  };

  const toggleWeek = (week: string) => {
    setCollapsedWeeks((current) => ({
      ...current,
      [week]: !(current[week] ?? week !== visibleWeeks[0]),
    }));
  };

  return (
    <div className="animate-in fade-in duration-500 px-4 pb-8 sm:px-6 lg:px-8 mt-4 space-y-4">
      <section className="space-y-3">
        {IS_PROTOTYPE && (
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" aria-label="Schedule seasons">
            {seasons.map((season) => (
              <motion.button
                key={season}
                type="button"
                onClick={() => changeSeason(season)}
                whileTap={{ scale: PRESS_SCALE }}
                transition={PRESS_TRANSITION}
                className={`group relative shrink-0 overflow-hidden rounded-2xl border px-4 py-2.5 text-left transition-colors ${
                  activeSeason === season
                    ? 'border-brand-sky bg-brand-sky text-brand-navy shadow-[0_12px_30px_rgba(102,155,188,0.2)]'
                    : 'border-border/10 bg-subcard text-foreground/60 hover:border-brand-sky/35 hover:text-foreground'
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-[0.14em]">
                    {season}
                  </span>
                  <span className={`rounded-lg border px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] ${
                    activeSeason === season
                      ? 'border-brand-navy/10 bg-brand-navy text-white'
                      : 'border-border/10 bg-foreground/[0.045] text-foreground/60'
                  }`}>
                    {seasonEventCounts[season] || 0}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>
        )}

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 no-scrollbar" aria-label="Filter schedule by team">
          {TEAM_FILTER_OPTIONS.map((option) => {
            const active = teamFilter === option.id;
            const optionTheme = option.id === ALL
              ? ALL_TEAMS_VISUAL_THEME
              : teamVisualThemeForCode(option.id);
            return (
              <motion.button
                key={option.id}
                type="button"
                title={option.title}
                aria-pressed={active}
                onClick={() => setTeamFilter(option.id)}
                style={teamAccentProperties(optionTheme)}
                whileTap={{ scale: PRESS_SCALE }}
                transition={PRESS_TRANSITION}
                className={`relative flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.07em] transition-colors ${
                  active
                    ? 'text-white'
                    : 'team-accent-outline hover:-translate-y-0.5'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="schedule-team-filter-pill"
                    className="team-accent-active absolute inset-0 rounded-full"
                    transition={STANDARD_SPRING}
                  />
                )}
                <span aria-hidden="true" className="relative z-10 text-sm leading-none">{option.emoji}</span>
                <span className="relative z-10">{option.label}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-end justify-between gap-4 border-b border-border/10">
          <div className="flex gap-5" aria-label="Filter schedule by event type">
            {([
              { id: 'games', label: 'Games', emoji: '🏆' },
              { id: 'practices', label: 'Practices', emoji: '🏋️' },
            ] as const).map((scope) => (
              <motion.button
                key={scope.id}
                type="button"
                title={scope.id === 'practices' ? 'Show games and practices' : 'Show games only'}
                aria-pressed={scheduleScope === scope.id}
                onClick={() => setScheduleScope(scope.id)}
                whileTap={{ scale: PRESS_SCALE }}
                transition={PRESS_TRANSITION}
                className={`relative pb-1.5 text-[10px] font-black uppercase tracking-[0.1em] transition-colors ${
                  scheduleScope === scope.id
                    ? 'text-brand-sky'
                    : 'text-foreground/45 hover:text-foreground/70'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true" className="text-xs leading-none">{scope.emoji}</span>
                  {scope.label}
                </span>
                {scheduleScope === scope.id && (
                  <motion.span
                    layoutId="schedule-scope-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-sky"
                    transition={STANDARD_SPRING}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <div className="mb-1 flex rounded-xl border border-border/10 bg-subcard p-1">
            {[
              { id: 'list' as const, label: 'List', emoji: '📋' },
              { id: 'calendar' as const, label: 'Calendar', emoji: '🗓️' },
            ].map((view) => {
              const active = scheduleView === view.id;
              return (
                <motion.button
                  key={view.id}
                  type="button"
                  aria-label={`${view.label} view`}
                  aria-pressed={active}
                  onClick={() => setScheduleView(view.id)}
                  whileTap={{ scale: PRESS_SCALE }}
                  transition={PRESS_TRANSITION}
                  className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                    active ? 'text-brand-navy' : 'text-foreground/40 hover:text-foreground/70'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="schedule-view-pill"
                      className="absolute inset-0 rounded-lg bg-brand-sky"
                      transition={STANDARD_SPRING}
                    />
                  )}
                  <span aria-hidden="true" className="relative z-10 text-base leading-none">{view.emoji}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {archivedWeeks.size > 0 && (
          <motion.button
            type="button"
            onClick={() => setShowArchivedWeeks((current) => !current)}
            whileTap={{ scale: PRESS_SCALE }}
            transition={PRESS_TRANSITION}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.12em] transition-colors ${
              showArchivedWeeks
                ? 'border-[#9CA3AF]/35 bg-[#9CA3AF]/12 text-[#6B7280]'
                : 'border-[#9CA3AF]/25 bg-[#9CA3AF]/8 text-[#6B7280] hover:border-[#6B7280]/35 hover:text-[#4B5563]'
            }`}
          >
            <span aria-hidden="true" className="text-xs leading-none">🗃️</span>
            {showArchivedWeeks ? 'Hide' : 'Show'} {archivedWeeks.size} archived week{archivedWeeks.size === 1 ? '' : 's'}
          </motion.button>
        )}
      </section>

      <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={`${activeSeason}-${teamFilter}-${scheduleScope}-${scheduleView}-${showArchivedWeeks}`}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : -5 }}
        transition={PAGE_TRANSITION}
      >
      {filteredEvents.length === 0 ? (
        <div className="rounded-3xl border border-border/10 bg-subcard p-8 text-center shadow-md">
          <p className="text-sm font-black uppercase tracking-widest text-foreground/70">
            No events match these filters
          </p>
          <p className="mt-2 text-xs text-foreground/40">
            Clear the filters or open the archived weeks to see more events.
          </p>
        </div>
      ) : scheduleView === 'calendar' ? (
        <section className="space-y-5">
          {visibleMonths.map((month) => {
            const monthEvents = groupedCalendarEvents[month];
            const days = buildMonthDays(month, monthEvents);

            return (
              <div key={month} className="overflow-hidden rounded-3xl border border-border/10 bg-subcard shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                <div className="flex flex-col gap-3 border-b border-border/10 bg-muted/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C1121F]">
                      {activeSeason}
                    </p>
                    <h3 className="mt-1 text-2xl font-black uppercase tracking-tight text-foreground">
                      {monthLabel(month)}
                    </h3>
                  </div>
                  <span className="w-fit rounded-full border border-brand-maroon/10 bg-muted px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/55 dark:border-white/10 dark:bg-white/10 dark:text-white/60">
                    {monthEvents.length} events
                  </span>
                </div>

                {month === 'undated' ? (
                  <div className="divide-y divide-border/10">
                    {monthEvents.map((event) => {
                      const teamAccent = teamAccentForEvent(event);
                      return (
                        <article
                          key={event.id}
                          style={teamAccent.style}
                          data-combined={teamAccent.combined}
                          className="team-accent-rail grid gap-3 px-4 py-4 pl-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                        >
                          <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${EVENT_TYPE_STYLES[event.eventType]}`}>
                                <span aria-hidden="true" className="mr-1.5">{EVENT_TYPE_EMOJIS[event.eventType]}</span>
                                {event.eventType}
                              </span>
                              <span
                                style={teamAccent.style}
                                data-combined={teamAccent.combined}
                                className="team-accent-outline team-accent-split-marker rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]"
                              >
                                <span aria-hidden="true" className="mr-1.5">{sportEmojiForEvent(event)}</span>
                                {event.team}
                              </span>
                            </div>
                            <h4 className="text-base font-black uppercase tracking-tight text-foreground">
                              {event.eventText}
                            </h4>
                          </div>
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-foreground/45">
                            {event.raw}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 sm:p-4">
                    <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[9px] font-black uppercase tracking-[0.14em] text-foreground/35">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <span key={day}>{day}</span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1.5">
                      {days.map((day, index) => {
                        const hasEvents = Boolean(day && day.events.length > 0);
                        const dateIso = day && month !== 'undated' ? `${month}-${String(day.day).padStart(2, '0')}` : null;
                        const isToday = dateIso === todayIso;
                        const CellTag = hasEvents ? 'button' : 'div';

                        return (
                          <CellTag
                            key={`${month}-${index}`}
                            type={hasEvents ? 'button' : undefined}
                            onClick={hasEvents ? (event) => {
                              calendarTriggerRef.current = event.currentTarget as HTMLButtonElement;
                              setSelectedCalendarDay({ label: formatLongDate(dateIso), events: day.events });
                            } : undefined}
                            className={`min-h-[74px] rounded-2xl border p-2 text-left transition-all ${
                              day
                                ? isToday
                                  ? 'border-[#B5413F]/45 bg-[#B5413F]/10 ring-1 ring-inset ring-[#B5413F]/25 dark:bg-white/[0.075]'
                                  : hasEvents
                                    ? 'border-[#C1121F]/25 bg-white shadow-[0_3px_10px_rgba(15,23,42,0.05)] hover:-translate-y-0.5 hover:border-[#C1121F]/50 hover:shadow-[0_5px_14px_rgba(193,18,31,0.11)] dark:bg-foreground/[0.025]'
                                    : 'border-brand-maroon/10 bg-muted/70 dark:border-white/10 dark:bg-white/[0.055]'
                                : 'border-transparent bg-transparent'
                            }`}
                          >
                            {day && (
                              <>
                                <div className="flex items-center justify-between gap-1">
                                  <span className={`text-xs font-black ${hasEvents ? 'text-[#C1121F]' : 'text-foreground/38'}`}>
                                    {day.day}
                                  </span>
                                  {isToday ? (
                                    <span className="rounded-full bg-[#B5413F] px-1.5 py-0.5 text-[7px] font-black uppercase tracking-[0.08em] text-white">
                                      Today
                                    </span>
                                  ) : hasEvents && (
                                    <span className="rounded-full bg-[#C1121F] px-1.5 py-0.5 text-[8px] font-black text-white shadow-[0_6px_14px_rgba(193,18,31,0.2)]">
                                      {day.events.length}
                                    </span>
                                  )}
                                </div>

                                <div className="mt-2 space-y-1">
                                  {day.events.slice(0, 2).map((event) => {
                                    const teamAccent = teamAccentForEvent(event);
                                    return (
                                      <div
                                        key={event.id}
                                        style={teamAccent.style}
                                        data-combined={teamAccent.combined}
                                        className="team-accent-rail team-accent-text truncate rounded-lg bg-muted px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] dark:bg-white/[0.055]"
                                        title={`${event.team}: ${event.eventText}`}
                                      >
                                        <span aria-hidden="true" className="mr-1">{sportEmojiForEvent(event)}</span>
                                        {shortTeamName(event.team)}
                                      </div>
                                    );
                                  })}
                                  {day.events.length > 2 && (
                                    <p className="text-[9px] font-black uppercase tracking-[0.08em] text-foreground/40">
                                      +{day.events.length - 2} more
                                    </p>
                                  )}
                                </div>
                              </>
                            )}
                          </CellTag>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      ) : (
        <section className="space-y-4">
          {visibleWeeks.map((week) => {
            const events = groupedEvents[week];
            const collapsed = collapsedWeeks[week] ?? week !== visibleWeeks[0];
            const archived = archivedWeeks.has(week);
            const containsToday = events.some((event) => event.date === todayIso);

            return (
              <div key={week} className="overflow-hidden rounded-3xl border border-border/10 bg-subcard shadow-[0_4px_12px_rgba(0,0,0,0.10)]">
                <button
                  type="button"
                  onClick={() => toggleWeek(week)}
                  className={`flex w-full items-center justify-between gap-4 border-b border-border/5 px-4 py-4 text-left ${
                    containsToday ? 'bg-white/[0.065]' : archived ? 'bg-foreground/[0.025]' : 'bg-muted/70'
                  }`}
                >
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#B5413F]">
                      {activeSeason}
                    </p>
                    <h3 className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-foreground">
                      {week}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {(containsToday || archived) && (
                      <span className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${
                        containsToday
                          ? 'border-brand-sky/35 bg-brand-sky text-brand-navy'
                          : 'border-border/10 bg-foreground/[0.035] text-foreground/38'
                      }`}>
                        {containsToday ? 'This week' : 'Archived'}
                      </span>
                    )}
                    <span className="rounded-full border border-border/10 bg-subcard px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/50">
                      {events.length}
                    </span>
                    {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </div>
                </button>

                {!collapsed && (
                  <div className="divide-y divide-border/5">
                    {events.map((event, eventIndex) => {
                      const isToday = event.date === todayIso;
                      const eventTypeLabel = event.eventType.replace(/\s+Game$/i, '');
                      const fixtureLines = scheduleFixtureLines(event);
                      const hasMultipleFixtures = fixtureLines.length > 1;
                      const eventTime = hasMultipleFixtures
                        ? null
                        : fixtureLines[0]?.time || displayEventTime(event);

                      return (
                        <article
                          key={event.id}
                          className={`px-4 py-3 transition-colors ${
                            isToday
                              ? 'bg-muted/70 ring-1 ring-inset ring-[#B5413F]/18 dark:bg-white/[0.065]'
                              : eventIndex % 2 === 0
                                ? 'bg-white/90 hover:bg-white dark:bg-foreground/[0.02] dark:hover:bg-foreground/[0.04]'
                                : 'bg-[#F4F4F3] hover:bg-[#EEEEEC] dark:bg-foreground/[0.045] dark:hover:bg-foreground/[0.065]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/10 bg-foreground/[0.035]">
                              <span aria-hidden="true" className="text-[23px] leading-none">{sportEmojiForEvent(event)}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex min-w-0 items-center justify-between gap-2">
                                <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                  <p className="text-[13px] font-black uppercase tracking-[0.055em] text-foreground">
                                    {formatDate(event.date)}
                                  </p>
                                  {eventTime && (
                                    <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-foreground/38">
                                      {eventTime}
                                    </span>
                                  )}
                                  {isToday && (
                                    <span className="rounded-full bg-[#B5413F]/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] text-[#B5413F]">
                                      Today
                                    </span>
                                  )}
                                </div>
                                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.14em] ${EVENT_TYPE_STYLES[event.eventType]}`}>
                                  {eventTypeLabel}
                                </span>
                              </div>

                              <div className="mt-1 divide-y divide-border/8">
                                {fixtureLines.map((fixture, fixtureIndex) => (
                                  <div
                                    key={`${event.id}-fixture-${fixtureIndex}`}
                                    className="flex min-w-0 items-baseline justify-between gap-3 py-1 first:pt-0 last:pb-0"
                                  >
                                    <h4
                                      className="min-w-0 truncate text-[15px] font-black uppercase leading-snug tracking-tight text-foreground"
                                      title={fixture.label}
                                    >
                                      {fixture.label}
                                    </h4>
                                    {hasMultipleFixtures && fixture.time && (
                                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.06em] text-foreground/38">
                                        {fixture.time}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}
      </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selectedCalendarDay && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/35 px-3 pb-24 pt-10 backdrop-blur-sm sm:items-center sm:pb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCalendarDay}
          >
            <motion.div
              className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-border/10 bg-subcard shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
              initial={{ opacity: 0, y: 42, scale: 0.94, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 34, scale: 0.96 }}
              transition={SOFT_SPRING}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative overflow-hidden bg-[#C1121F] px-5 py-5 text-white">
                <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/12" />
                <div className="absolute -bottom-16 left-8 h-28 w-28 rounded-full bg-white/8" />
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/65">
                      Calendar day
                    </p>
                    <h3 className="mt-1 text-2xl font-black uppercase tracking-tight">
                      {selectedCalendarDay.label}
                    </h3>
                    <p className="mt-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/65">
                      {selectedCalendarDay.events.length} scheduled event{selectedCalendarDay.events.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <button
                    ref={calendarCloseRef}
                    type="button"
                    onClick={closeCalendarDay}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white hover:text-[#C1121F]"
                    aria-label="Close calendar events"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="max-h-[62vh] space-y-3 overflow-y-auto p-4">
                {selectedCalendarDay.events.map((event, index) => {
                  const teamAccent = teamAccentForEvent(event);
                  return (
                    <motion.article
                      key={event.id}
                      style={teamAccent.style}
                      data-combined={teamAccent.combined}
                      className="team-accent-rail rounded-2xl border border-border/10 bg-[linear-gradient(145deg,#FFFFFF_0%,#F1F1F1_100%)] p-4 pl-5 shadow-[0_3px_10px_rgba(0,0,0,0.06)] dark:bg-none dark:bg-foreground/[0.025]"
                      initial={{ opacity: 0, y: 18, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ ...SOFT_SPRING, delay: staggerDelay(index) }}
                    >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${EVENT_TYPE_STYLES[event.eventType]}`}>
                        <span aria-hidden="true" className="mr-1.5">{EVENT_TYPE_EMOJIS[event.eventType]}</span>
                        {event.eventType}
                      </span>
                      <span
                        style={teamAccent.style}
                        data-combined={teamAccent.combined}
                        className="team-accent-outline team-accent-split-marker rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]"
                      >
                        <span aria-hidden="true" className="mr-1.5">{sportEmojiForEvent(event)}</span>
                        {event.team}
                      </span>
                    </div>

                    <h4 className="text-lg font-black uppercase leading-tight tracking-tight text-foreground">
                      {event.eventText}
                    </h4>

                    <div className="mt-3 grid gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-foreground/50 sm:grid-cols-2">
                      {displayEventTime(event) && (
                        <span className="inline-flex items-center gap-1.5">
                          <span aria-hidden="true">🕒</span>
                          {displayEventTime(event)}
                        </span>
                      )}
                      {event.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <span aria-hidden="true">📍</span>
                          {event.location}
                        </span>
                      )}
                      {event.opponent && <span>🤝 Opponent: {event.opponent}</span>}
                      {event.week && <span>🗓️ {event.week}</span>}
                    </div>

                    {event.raw && (
                      <p className="mt-3 rounded-xl border border-brand-maroon/10 bg-muted px-3 py-2 text-xs font-bold text-foreground/55 dark:border-white/10 dark:bg-white/[0.07] dark:text-white/60">
                        {event.raw}
                      </p>
                    )}
                    </motion.article>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
