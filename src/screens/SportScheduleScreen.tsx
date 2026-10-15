import { useHashRoute, navigateHash } from '../hooks/useHashRoute';
import { parseScheduleQuery } from '../services/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import scheduleDataJson from '../data/schedule.json';
import { ScheduleData, ScheduleEvent, ScheduleEventType } from '../data/scheduleTypes';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { chronologicalScheduleDays, readableFixtureLabel, scheduleDayStatus } from '../utils/scheduleTimeline';
import { DivisionTab, GenderTab, SportTab } from '../types';
import {
  IS_PROTOTYPE,
  LAUNCH_SEASON,
  isVisibleScheduleEvent,
} from '../config/launchSports';
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
    label: 'Boys Soccer',
    title: 'Varsity Boys Soccer',
    emoji: '⚽',
  },
  {
    id: 'VGS',
    label: 'Girls Soccer',
    title: 'Varsity Girls Soccer',
    emoji: '⚽',
  },
  {
    id: 'VBV',
    label: 'Boys Volleyball',
    title: 'Varsity Boys Volleyball',
    emoji: '🏐',
  },
  {
    id: 'VGV',
    label: 'Girls Volleyball',
    title: 'Varsity Girls Volleyball',
    emoji: '🏐',
  },
  {
    id: 'SMPBB',
    label: 'SMP Boys Basketball',
    title: 'SMP Boys Basketball',
    emoji: '🏀',
  },
  {
    id: 'SMPGB',
    label: 'SMP Girls Basketball',
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

function isMeaningfulScheduleEvent(event: ScheduleEvent) {
  return /[A-Za-z0-9]/.test(event.eventText);
}

function displayEventTime(event: ScheduleEvent) {
  if (!event.time) return null;
  if (/\bgym\s+\d+\s*(?:am|pm)\b/i.test(event.eventText)) return null;
  return event.time;
}

function teamFilterClasses(filter: ScheduleTeamFilter, active: boolean) {
  if (filter === 'All') {
    return active
      ? 'border-[#669BBC] bg-[#669BBC] text-white shadow-[0_8px_20px_rgba(102,155,188,0.24)]'
      : 'border-[#8FC1DD] bg-[#EAF4FA] text-[#235B7A] hover:border-[#669BBC] dark:bg-[#669BBC]/15 dark:text-[#9CCCE5]';
  }

  const boysTeam = filter === 'VBS' || filter === 'VBV' || filter === 'SMPBB';
  if (boysTeam) {
    return active
      ? 'border-[#669BBC] bg-[#DCEEF8] text-[#174D6B] ring-2 ring-[#669BBC]/25 shadow-[0_8px_20px_rgba(102,155,188,0.18)] dark:bg-[#669BBC]/25 dark:text-[#BFDFF0]'
      : 'border-[#9BC8DF] bg-[#EDF7FC] text-[#286886] hover:border-[#669BBC] dark:bg-[#669BBC]/12 dark:text-[#9CCCE5]';
  }

  return active
    ? 'border-[#DF8791] bg-[#FBE1E5] text-[#8F2633] ring-2 ring-[#DF8791]/25 shadow-[0_8px_20px_rgba(193,18,31,0.12)] dark:bg-[#C14D5B]/25 dark:text-[#F5BBC1]'
    : 'border-[#EBA8AF] bg-[#FFF0F2] text-[#A73643] hover:border-[#DF8791] dark:bg-[#C14D5B]/12 dark:text-[#F0A8B0]';
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
  if (/boys\s*&\s*girls/i.test(team)) return 'Boys & Girls';
  if (/\bgirls?\b/i.test(team)) return 'Girls';
  if (/\bboys?\b/i.test(team)) return 'Boys';
  return team.replace(/\b(Varsity|SMP|SMA)\b/gi, '').trim();
}

function eventGenderAccent(event: ScheduleEvent) {
  if (/boys\s*&\s*girls/i.test(event.team)) return 'border-l-foreground/25';
  if (event.genderGroup === 'Girls' || /\bgirls?\b/i.test(event.team)) return 'border-l-[#DF8791]';
  if (event.genderGroup === 'Boys' || /\bboys?\b/i.test(event.team)) return 'border-l-[#669BBC]';
  return 'border-l-foreground/25';
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
  const hash = useHashRoute();
  const filters = parseScheduleQuery(hash.split('?')[1] ?? '', IS_PROTOTYPE ? seasons : [LAUNCH_SEASON], LAUNCH_SEASON);
  const activeSeason = filters.season;
  const teamFilter = filters.team as ScheduleTeamFilter;
  const scheduleScope = filters.scope;
  const scheduleView: ScheduleView = filters.view;
  const updateFilters = (patch: Partial<typeof filters>) => {
    const next = { ...filters, ...patch };
    navigateHash(`#/schedule?${new URLSearchParams(next).toString()}`);
  };
  const setTeamFilter = (team: ScheduleTeamFilter) => updateFilters({ team });
  const setScheduleScope = (scope: 'games' | 'practices') => updateFilters({ scope });
  const setScheduleView = (view: ScheduleView) => updateFilters({ view });
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
      if (event.key === 'Tab') {
        event.preventDefault();
        calendarCloseRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeCalendarDay, selectedCalendarDay]);



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

  const timelineDays = useMemo(() => chronologicalScheduleDays(filteredEvents), [filteredEvents]);
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
    updateFilters({ team: ALL, scope: 'games' });
    setShowArchivedWeeks(false);
  };

  const changeSeason = (season: string) => {
    updateFilters({ season, team: ALL, scope: 'games' });
    setShowArchivedWeeks(false);
    setSelectedCalendarDay(null);
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

        <div className="grid grid-cols-2 gap-2" aria-label="Filter schedule by team">
          {TEAM_FILTER_OPTIONS.map((option) => {
            const active = teamFilter === option.id;
            return (
              <motion.button
                key={option.id}
                type="button"
                title={option.title}
                aria-pressed={active}
                onClick={() => setTeamFilter(option.id)}
                whileTap={{ scale: PRESS_SCALE }}
                transition={PRESS_TRANSITION}
                className={`relative flex min-h-10 min-w-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-left transition-colors ${
                  teamFilterClasses(option.id, active)
                }`}
              >
                <span aria-hidden="true" className="relative z-10 shrink-0 text-sm leading-none">{option.emoji}</span>
                <span className="relative z-10 min-w-0 flex-1 break-words whitespace-normal text-[11px] font-black uppercase leading-snug tracking-[0.04em]">{option.label}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/10">
          <div className="flex gap-5" aria-label="Filter schedule by event type">
            {([
              { id: 'games', label: 'Games', emoji: '🏆' },
              { id: 'practices', label: 'Games + practice', emoji: '🏋️' },
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
              { id: 'list' as const, label: 'Timeline', emoji: '📋' },
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
                  className={`relative flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-2 text-[10px] font-bold transition-colors ${
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
                  <span aria-hidden="true" className="relative z-10 text-sm leading-none">{view.emoji}</span><span className="relative z-10">{view.label}</span>
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
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] transition-colors ${
              showArchivedWeeks
                ? 'border-[#9CA3AF]/35 bg-[#9CA3AF]/12 text-[#6B7280]'
                : 'border-[#9CA3AF]/25 bg-[#9CA3AF]/8 text-[#6B7280] hover:border-[#6B7280]/35 hover:text-[#4B5563]'
            }`}
          >
            <span aria-hidden="true" className="text-[10px] leading-none">🗃️</span>
            {showArchivedWeeks ? 'Hide' : 'Show'} {archivedWeeks.size} past week{archivedWeeks.size === 1 ? '' : 's'}
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
            Clear the team filter or show past weeks to see more events.
          </p>
          <button type="button" onClick={clearFilters} className="mt-3 min-h-10 text-xs font-bold text-brand-maroon dark:text-red-300">Clear filters</button>
        </div>
      ) : scheduleView === 'calendar' ? (
        <section className="space-y-5">
          {visibleMonths.map((month) => {
            const monthEvents = groupedCalendarEvents[month];
            const days = buildMonthDays(month, monthEvents);

            return (
              <div key={month} className="overflow-hidden rounded-xl border border-border/10 bg-subcard">
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
                    {monthEvents.map((event) => (
                        <article
                          key={event.id}
                          className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                        >
                          <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${EVENT_TYPE_STYLES[event.eventType]}`}>
                                <span aria-hidden="true" className="mr-1.5">{EVENT_TYPE_EMOJIS[event.eventType]}</span>
                                {event.eventType}
                              </span>
                              <span
                                className="rounded-full border border-border/10 bg-foreground/[0.035] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/60"
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
                    ))}
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
                        const isPast = Boolean(dateIso && dateIso < todayIso);
                        const CellTag = hasEvents ? 'button' : 'div';

                        return (
                          <CellTag
                            key={`${month}-${index}`}
                            type={hasEvents ? 'button' : undefined}
                            onClick={hasEvents ? (event) => {
                              calendarTriggerRef.current = event.currentTarget as HTMLButtonElement;
                              setSelectedCalendarDay({ label: formatLongDate(dateIso), events: day.events });
                            } : undefined}
                            className={`min-h-[68px] rounded-lg border p-1 text-left transition-all sm:p-2 ${
                              day
                                ? isToday
                                  ? 'border-[#B5413F]/45 bg-[#B5413F]/10 ring-1 ring-inset ring-[#B5413F]/25 dark:bg-white/[0.075]'
                                  : hasEvents
                                    ? 'border-border/20 bg-white hover:border-foreground/40 dark:bg-foreground/[0.025]'
                                    : 'border-brand-maroon/10 bg-muted/70 dark:border-white/10 dark:bg-white/[0.055]'
                                : 'border-transparent bg-transparent'
                            }`}
                          >
                            {day && (
                              <>
                                <div className="flex items-center justify-between gap-1">
                                  <span className={`text-xs font-black ${isToday ? 'text-[#C1121F]' : isPast ? 'text-foreground/45' : hasEvents ? 'text-foreground' : 'text-foreground/38'}`}>
                                    {day.day}
                                  </span>
                                  {isToday ? (
                                    <span aria-label="Today" className="h-1.5 w-1.5 rounded-full bg-[#B5413F] sm:h-auto sm:w-auto sm:px-1.5 sm:py-0.5 sm:text-[7px] sm:font-black sm:text-white">
                                      <span className="hidden sm:inline">Today</span>
                                    </span>
                                  ) : hasEvents && (
                                    <span className={`rounded-full px-1 py-0.5 text-[8px] font-bold ${isPast ? 'bg-foreground/10 text-foreground/45' : 'bg-foreground/10 text-foreground/75'}`}>
                                      {day.events.length}
                                    </span>
                                  )}
                                </div>

                                <div className="mt-2 space-y-1">
                                  {day.events.slice(0, 2).map((event) => (
                                      <div
                                        key={event.id}
                                        className={`truncate border-l-2 bg-muted px-1 py-1 text-[9px] font-bold text-foreground/60 dark:bg-white/[0.055] ${eventGenderAccent(event)}`}
                                        title={`${event.team}: ${event.eventText}`}
                                      >
                                        <span aria-hidden="true" className="mr-1">{sportEmojiForEvent(event)}</span>
                                        {shortTeamName(event.team)}
                                      </div>
                                  ))}
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
        <section aria-label="Schedule timeline">
          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold text-foreground/55" aria-label="Date key">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#C1121F]" />Today</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-foreground/30" />Past date</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full border border-foreground/40" />Upcoming</span>
          </div>
          <div className="ml-2 border-l border-border/20 pl-5">
            {timelineDays.map((day) => {
              const status = scheduleDayStatus(day.date, todayIso);
              return (
                <section key={day.key} aria-label={formatDate(day.date)} className="relative pb-6 last:pb-0">
                  <span aria-hidden="true" className={`absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-background ${status === 'today' ? 'bg-[#C1121F]' : status === 'past' ? 'bg-foreground/30' : 'border border-foreground/40 bg-background'}`} />
                  <div className="mb-2.5 flex flex-wrap items-center gap-2">
                    <h3 className={`text-sm font-black ${status === 'past' ? 'text-foreground/60' : 'text-foreground'}`}>{formatDate(day.date)}</h3>
                    {status === 'today' && <span className="text-[10px] font-bold text-[#C1121F] dark:text-red-300">Today</span>}
                    {status === 'past' && <span className="text-[10px] font-medium text-foreground/45">Past date</span>}
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border/10 bg-card">
                    {day.events.map((event) => {
                      const fixtureLines = scheduleFixtureLines(event);
                      const hasMultipleFixtures = fixtureLines.length > 1;
                      const eventTime = hasMultipleFixtures ? null : fixtureLines[0]?.time || displayEventTime(event);
                      return (
                        <button
                          key={event.id}
                          type="button"
                          aria-haspopup="dialog"
                          aria-label={`View event details: ${event.team}, ${formatDate(event.date)}, ${event.eventText}`}
                          onClick={(clickEvent) => {
                            calendarTriggerRef.current = clickEvent.currentTarget;
                            setSelectedCalendarDay({ label: formatLongDate(event.date), events: [event] });
                          }}
                          className={`block w-full border-b border-l-[3px] border-b-border/10 px-3 py-3 text-left transition-colors last:border-b-0 hover:bg-foreground/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-sky ${eventGenderAccent(event)} ${status === 'today' ? 'bg-brand-red/[0.025]' : ''}`}
                        >
                          <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[10px] text-foreground/60">
                            <span className="font-bold"><span aria-hidden="true" className="mr-1.5">{sportEmojiForEvent(event)}</span>{event.team}</span>
                            <span className="font-semibold">{eventTime || (hasMultipleFixtures ? 'Multiple games' : 'Time TBD')} · {event.eventType.replace(/\s+Game$/i, '')}</span>
                          </span>
                          <span className="mt-1.5 block space-y-1.5">
                            {fixtureLines.map((fixture, fixtureIndex) => (
                              <span key={`${event.id}-fixture-${fixtureIndex}`} className="flex items-baseline justify-between gap-3">
                                <span className="min-w-0 text-sm font-bold leading-snug">{readableFixtureLabel(fixture.label)}</span>
                                {hasMultipleFixtures && <span className="shrink-0 text-xs tabular-nums text-foreground/55">{fixture.time || 'Time TBD'}</span>}
                              </span>
                            ))}
                          </span>
                          {event.location && <span className="mt-1.5 block text-[10px] text-foreground/55">{event.location}</span>}
                          <span className="mt-2 block text-[10px] font-bold text-brand-maroon dark:text-red-300">View details →</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
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
              role="dialog"
              aria-modal="true"
              aria-labelledby="schedule-event-details-title"
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
                      Event details
                    </p>
                    <h3 id="schedule-event-details-title" className="mt-1 text-2xl font-black uppercase tracking-tight">
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
                    aria-label="Close event details"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="max-h-[62vh] space-y-3 overflow-y-auto p-4">
                {selectedCalendarDay.events.map((event, index) => (
                    <motion.article
                      key={event.id}
                      className="rounded-2xl border border-border/10 bg-[linear-gradient(145deg,#FFFFFF_0%,#F1F1F1_100%)] p-4 shadow-[0_3px_10px_rgba(0,0,0,0.06)] dark:bg-none dark:bg-foreground/[0.025]"
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
                        className="rounded-full border border-border/10 bg-foreground/[0.035] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/60"
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
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
