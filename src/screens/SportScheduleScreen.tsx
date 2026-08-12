import { useEffect, useMemo, useState, type ElementType } from 'react';
import { Archive, CalendarRange, ChevronDown, ChevronUp, Clock, List, MapPin, Trophy, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import scheduleDataJson from '../data/schedule.json';
import { ScheduleData, ScheduleEvent, ScheduleEventType } from '../data/scheduleTypes';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { DivisionTab, GenderTab, SportTab } from '../types';
import {
  BadmintonIcon,
  BasketballIcon,
  SoccerIcon,
  SwimmingIcon,
  TrackIcon,
  VolleyballIcon,
} from '../components/SportIcons';
import {
  IS_PROTOTYPE,
  LAUNCH_SEASON,
  isVisibleScheduleEvent,
} from '../config/launchSports';
import {
  consolidateSharedScheduleEvents,
  eventMatchesTeamFilter,
  isGameScheduleEvent,
  type ScheduleTeamFilter,
} from '../services/schedulePresentation';

const fallbackScheduleData = scheduleDataJson as ScheduleData;

const EVENT_TYPE_STYLES: Record<ScheduleEventType, string> = {
  Practice: 'border-[#7F1D1D]/15 bg-[#FEE2E2] text-[#7F1D1D] dark:border-[#BFD7EA]/20 dark:bg-[#BFD7EA]/10 dark:text-[#BFD7EA]',
  'Home Game': 'border-[#C1121F] bg-[#C1121F] text-white dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400',
  'Away Game': 'border-[#7F1D1D] bg-[#7F1D1D] text-white dark:border-yellow-400/20 dark:bg-yellow-400/10 dark:text-yellow-300',
  Tournament: 'border-[#991B1B] bg-[#991B1B] text-white dark:border-[#B5413F]/25 dark:bg-[#B5413F]/12 dark:text-[#D85A57]',
  Holiday: 'border-[#E5E7EB] bg-[#F3F4F6] text-[#1F2937] dark:border-purple-400/20 dark:bg-purple-400/10 dark:text-purple-300',
  Other: 'border-border/10 bg-foreground/[0.035] text-foreground/55',
};

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

function sportIconForEvent(event: ScheduleEvent): ElementType {
  switch (eventSportKey(event)) {
    case 'Soccer': return SoccerIcon;
    case 'Basketball': return BasketballIcon;
    case 'Volleyball': return VolleyballIcon;
    case 'Badminton': return BadmintonIcon;
    case 'TrackAndField': return TrackIcon;
    case 'Swimming': return SwimmingIcon;
    default: return Trophy;
  }
}

const TEAM_ACCENT_STYLES = [
  { match: 'varsity boys soccer', rail: 'border-l-[#EF4444]', icon: 'text-[#F87171]', badge: 'border-[#EF4444]/35 bg-[#EF4444]/12 text-[#B91C1C] dark:text-[#FCA5A5]' },
  { match: 'varsity girls soccer', rail: 'border-l-[#F472B6]', icon: 'text-[#F9A8D4]', badge: 'border-[#F472B6]/35 bg-[#F472B6]/12 text-[#BE185D] dark:text-[#F9A8D4]' },
  { match: 'varsity boys volleyball', rail: 'border-l-[#F59E0B]', icon: 'text-[#FBBF24]', badge: 'border-[#F59E0B]/35 bg-[#F59E0B]/12 text-[#92400E] dark:text-[#FCD34D]' },
  { match: 'varsity girls volleyball', rail: 'border-l-[#A78BFA]', icon: 'text-[#C4B5FD]', badge: 'border-[#A78BFA]/35 bg-[#A78BFA]/12 text-[#6D28D9] dark:text-[#C4B5FD]' },
  { match: 'smp boys basketball', rail: 'border-l-[#3B82F6]', icon: 'text-[#60A5FA]', badge: 'border-[#3B82F6]/35 bg-[#3B82F6]/12 text-[#1D4ED8] dark:text-[#93C5FD]' },
  { match: 'smp girls basketball', rail: 'border-l-[#22D3EE]', icon: 'text-[#67E8F9]', badge: 'border-[#22D3EE]/35 bg-[#22D3EE]/12 text-[#0E7490] dark:text-[#67E8F9]' },
  { match: 'js 3-4 mixed basketball', rail: 'border-l-[#84CC16]', icon: 'text-[#A3E635]', badge: 'border-[#84CC16]/35 bg-[#84CC16]/12 text-[#3F6212] dark:text-[#BEF264]' },
  { match: 'js 5-6 boys basketball', rail: 'border-l-[#6366F1]', icon: 'text-[#818CF8]', badge: 'border-[#6366F1]/35 bg-[#6366F1]/12 text-[#4338CA] dark:text-[#A5B4FC]' },
  { match: 'js 5-6 girls basketball', rail: 'border-l-[#F97316]', icon: 'text-[#FB923C]', badge: 'border-[#F97316]/35 bg-[#F97316]/12 text-[#C2410C] dark:text-[#FDBA74]' },
  { match: 'swim', rail: 'border-l-[#14B8A6]', icon: 'text-[#5EEAD4]', badge: 'border-[#14B8A6]/35 bg-[#14B8A6]/12 text-[#0F766E] dark:text-[#5EEAD4]' },
] as const;

function teamAccentForEvent(event: ScheduleEvent) {
  const team = event.team.toLowerCase();
  if (team.includes('boys & girls')) {
    return {
      rail: 'border-l-brand-sky',
      icon: 'text-brand-sky',
      badge: 'border-brand-sky/35 bg-brand-sky/12 text-brand-navy dark:text-brand-sky',
    };
  }
  return TEAM_ACCENT_STYLES.find((style) => team.includes(style.match)) || {
    rail: 'border-l-[#94A3B8]',
    icon: 'text-[#CBD5E1]',
    badge: 'border-[#94A3B8]/35 bg-[#94A3B8]/12 text-[#475569] dark:text-[#CBD5E1]',
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
  const [scheduleScope, setScheduleScope] = useState<'games' | 'all'>('games');
  const [collapsedWeeks, setCollapsedWeeks] = useState<Record<string, boolean>>({});
  const [scheduleView, setScheduleView] = useState<ScheduleView>('list');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<SelectedCalendarDay | null>(null);
  const [showArchivedWeeks, setShowArchivedWeeks] = useState(false);
  const todayIso = localIsoDate();

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
              <button
                key={season}
                type="button"
                onClick={() => changeSeason(season)}
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
              </button>
            ))}
          </div>
        )}

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 no-scrollbar" aria-label="Filter schedule by team">
          {([
            { id: 'All', label: 'All', title: 'All teams', icon: Trophy },
            { id: 'VBS', label: 'VBS', title: 'Varsity Boys Soccer', icon: SoccerIcon },
            { id: 'VGS', label: 'VGS', title: 'Varsity Girls Soccer', icon: SoccerIcon },
            { id: 'SMPBB', label: 'SMPBB', title: 'SMP Boys Basketball', icon: BasketballIcon },
            { id: 'SMPGB', label: 'SMPGB', title: 'SMP Girls Basketball', icon: BasketballIcon },
          ] as const).map((option) => {
            const Icon = option.icon;
            const active = teamFilter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                title={option.title}
                aria-pressed={active}
                onClick={() => setTeamFilter(option.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.08em] transition-colors ${
                  active
                    ? 'border-brand-sky bg-brand-sky text-brand-navy shadow-[0_8px_20px_rgba(102,155,188,0.22)]'
                    : 'border-border/10 bg-subcard text-foreground/55 hover:border-brand-sky/40 hover:text-foreground'
                }`}
              >
                <Icon size={15} />
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-end justify-between gap-4 border-b border-border/10">
          <div className="flex gap-5" aria-label="Filter schedule by event type">
            {([
              { id: 'games', label: 'Games' },
              { id: 'all', label: 'All' },
            ] as const).map((scope) => (
              <button
                key={scope.id}
                type="button"
                aria-pressed={scheduleScope === scope.id}
                onClick={() => setScheduleScope(scope.id)}
                className={`relative pb-2 text-xs font-black uppercase tracking-[0.12em] transition-colors ${
                  scheduleScope === scope.id
                    ? 'text-brand-sky after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-brand-sky'
                    : 'text-foreground/45 hover:text-foreground/70'
                }`}
              >
                {scope.label}
              </button>
            ))}
          </div>

          <div className="mb-1 flex rounded-xl border border-border/10 bg-subcard p-1">
            {[
              { id: 'list' as const, label: 'List', icon: List },
              { id: 'calendar' as const, label: 'Calendar', icon: CalendarRange },
            ].map((view) => {
              const Icon = view.icon;
              const active = scheduleView === view.id;
              return (
                <button
                  key={view.id}
                  type="button"
                  aria-label={`${view.label} view`}
                  aria-pressed={active}
                  onClick={() => setScheduleView(view.id)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                    active ? 'bg-brand-sky text-brand-navy' : 'text-foreground/40 hover:text-foreground/70'
                  }`}
                >
                  <Icon size={14} />
                </button>
              );
            })}
          </div>
        </div>

        {archivedWeeks.size > 0 && (
          <button
            type="button"
            onClick={() => setShowArchivedWeeks((current) => !current)}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] transition-colors ${
              showArchivedWeeks
                ? 'border-brand-sky/35 bg-brand-sky/12 text-brand-sky'
                : 'border-border/10 bg-subcard text-foreground/55 hover:border-brand-sky/30 hover:text-foreground'
            }`}
          >
            <Archive size={14} />
            {showArchivedWeeks ? 'Hide' : 'Show'} {archivedWeeks.size} archived week{archivedWeeks.size === 1 ? '' : 's'}
          </button>
        )}
      </section>

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
              <div key={month} className="overflow-hidden rounded-3xl border border-border/10 bg-subcard shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
                <div className="flex flex-col gap-3 border-b border-border/10 bg-[#C1121F]/8 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C1121F]">
                      {activeSeason}
                    </p>
                    <h3 className="mt-1 text-2xl font-black uppercase tracking-tight text-foreground">
                      {monthLabel(month)}
                    </h3>
                  </div>
                  <span className="w-fit rounded-full border border-border/10 bg-[#ECEEF2] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/55 dark:border-white/10 dark:bg-white/10 dark:text-white/60">
                    {monthEvents.length} events
                  </span>
                </div>

                {month === 'undated' ? (
                  <div className="divide-y divide-border/10">
                    {monthEvents.map((event) => (
                      <article key={event.id} className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${EVENT_TYPE_STYLES[event.eventType]}`}>
                              {event.eventType}
                            </span>
                            <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${teamAccentForEvent(event).badge}`}>
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
                        const CellTag = hasEvents ? 'button' : 'div';

                        return (
                          <CellTag
                            key={`${month}-${index}`}
                            type={hasEvents ? 'button' : undefined}
                            onClick={hasEvents ? () => setSelectedCalendarDay({ label: formatLongDate(dateIso), events: day.events }) : undefined}
                            className={`min-h-[74px] rounded-2xl border p-2 text-left transition-all ${
                              day
                                ? isToday
                                  ? 'border-[#B5413F]/45 bg-[#B5413F]/10 ring-1 ring-inset ring-[#B5413F]/25 dark:bg-white/[0.075]'
                                  : hasEvents
                                    ? 'border-[#C1121F]/25 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:border-[#C1121F]/50 hover:shadow-[0_18px_40px_rgba(193,18,31,0.14)] dark:bg-foreground/[0.025]'
                                    : 'border-border/10 bg-[#ECEEF2]/70 dark:border-white/10 dark:bg-white/[0.055]'
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
                                  {day.events.slice(0, 2).map((event) => (
                                    <div
                                      key={event.id}
                                      className={`truncate rounded-lg border-l-[3px] bg-[#FEE2E2] px-1.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#7F1D1D] dark:bg-white/[0.055] dark:text-white/72 ${teamAccentForEvent(event).rail}`}
                                      title={`${event.team}: ${event.eventText}`}
                                    >
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
        <section className="space-y-4">
          {visibleWeeks.map((week) => {
            const events = groupedEvents[week];
            const collapsed = collapsedWeeks[week] ?? week !== visibleWeeks[0];
            const archived = archivedWeeks.has(week);
            const containsToday = events.some((event) => event.date === todayIso);

            return (
              <div key={week} className="overflow-hidden rounded-3xl border border-border/10 bg-subcard shadow-[0_18px_55px_rgba(0,0,0,0.16)]">
                <button
                  type="button"
                  onClick={() => toggleWeek(week)}
                  className={`flex w-full items-center justify-between gap-4 border-b border-border/5 px-4 py-4 text-left ${
                    containsToday ? 'bg-white/[0.065]' : archived ? 'bg-foreground/[0.025]' : 'bg-[#5A1C2C]/10'
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
                          ? 'border-[#B5413F]/30 bg-[#B5413F]/12 text-[#D85A57]'
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
                    {events.map((event) => {
                      const SportIcon = sportIconForEvent(event);
                      const teamAccent = teamAccentForEvent(event);
                      const isToday = event.date === todayIso;
                      const eventTime = displayEventTime(event);

                      return (
                        <article
                          key={event.id}
                          className={`grid gap-4 border-l-[7px] px-4 py-4 transition-all md:grid-cols-[112px_minmax(0,1fr)] md:items-center ${teamAccent.rail} ${
                            isToday
                              ? 'bg-[#B5413F]/8 ring-1 ring-inset ring-[#B5413F]/18 dark:bg-white/[0.065]'
                              : 'hover:bg-foreground/[0.025]'
                          }`}
                        >
                          <div className="flex items-center gap-3 md:block">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/10 bg-foreground/[0.035] md:mb-2">
                              <SportIcon size={20} className={teamAccent.icon} />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-black uppercase tracking-wide text-foreground">
                                  {formatDate(event.date)}
                                </p>
                                {isToday && (
                                  <span className="rounded-full bg-[#B5413F] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-white">
                                    Today
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-foreground/35">
                                {event.day || 'Day TBD'}
                              </p>
                            </div>
                          </div>

                          <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${EVENT_TYPE_STYLES[event.eventType]}`}>
                                {event.eventType}
                              </span>
                              <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${teamAccent.badge}`}>
                                {event.team}
                              </span>
                            </div>

                            <h4 className="text-lg font-black uppercase leading-tight tracking-tight text-foreground">
                              {event.eventText}
                            </h4>

                            <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-bold uppercase tracking-[0.13em] text-foreground/45">
                              {eventTime && (
                                <span className="inline-flex items-center gap-1.5">
                                  <Clock size={13} className="text-[#B5413F]" />
                                  {eventTime}
                                </span>
                              )}
                              {event.location && (
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin size={13} className="text-[#B5413F]" />
                                  {event.location}
                                </span>
                              )}
                              {event.opponent && <span>Opponent: {event.opponent}</span>}
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

      <AnimatePresence>
        {selectedCalendarDay && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/35 px-3 pb-24 pt-10 backdrop-blur-sm sm:items-center sm:pb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCalendarDay(null)}
          >
            <motion.div
              className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-border/10 bg-subcard shadow-[0_30px_90px_rgba(0,0,0,0.28)]"
              initial={{ opacity: 0, y: 42, scale: 0.94, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 34, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
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
                    type="button"
                    onClick={() => setSelectedCalendarDay(null)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white hover:text-[#C1121F]"
                    aria-label="Close calendar events"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="max-h-[62vh] space-y-3 overflow-y-auto p-4">
                {selectedCalendarDay.events.map((event, index) => (
                  <motion.article
                    key={event.id}
                    className="rounded-2xl border border-border/10 bg-[#FFFFFF] p-4 shadow-[0_14px_36px_rgba(15,23,42,0.07)] dark:bg-foreground/[0.025]"
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.045, type: 'spring', stiffness: 420, damping: 34 }}
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${EVENT_TYPE_STYLES[event.eventType]}`}>
                        {event.eventType}
                      </span>
                      <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${teamAccentForEvent(event).badge}`}>
                        {event.team}
                      </span>
                    </div>

                    <h4 className="text-lg font-black uppercase leading-tight tracking-tight text-foreground">
                      {event.eventText}
                    </h4>

                    <div className="mt-3 grid gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-foreground/50 sm:grid-cols-2">
                      {displayEventTime(event) && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={13} className="text-[#C1121F]" />
                          {displayEventTime(event)}
                        </span>
                      )}
                      {event.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#C1121F]" />
                          {event.location}
                        </span>
                      )}
                      {event.opponent && <span>Opponent: {event.opponent}</span>}
                      {event.week && <span>{event.week}</span>}
                    </div>

                    {event.raw && (
                      <p className="mt-3 rounded-xl border border-border/10 bg-[#ECEEF2] px-3 py-2 text-xs font-bold text-foreground/55 dark:border-white/10 dark:bg-white/[0.07] dark:text-white/60">
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
