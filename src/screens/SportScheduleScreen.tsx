import { useEffect, useMemo, useState, type ElementType } from 'react';
import { CalendarDays, CalendarRange, ChevronDown, ChevronUp, Clock, Filter, List, MapPin, Search, Trophy, Users, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import scheduleDataJson from '../data/schedule.json';
import { ScheduleData, ScheduleEvent, ScheduleEventType } from '../data/scheduleTypes';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { DivisionTab, GenderTab, SportTab } from '../types';

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

interface FilterDropdownProps {
  id: string;
  label: string;
  icon: ElementType;
  value: string;
  options: { value: string; label: string }[];
  isOpen: boolean;
  onToggle: (id: string) => void;
  onChange: (value: string) => void;
}

function FilterDropdown({
  id,
  label,
  icon: Icon,
  value,
  options,
  isOpen,
  onToggle,
  onChange,
}: FilterDropdownProps) {
  const selected = options.find((option) => option.value === value)?.label || value;

  return (
    <div className="relative space-y-1.5">
      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/45 dark:text-foreground/35">
        <Icon size={13} />
        {label}
      </span>

      <button
        type="button"
        onClick={() => onToggle(id)}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-black text-foreground transition-colors ${
          isOpen ? 'border-[#B5413F]/35 bg-subcard' : 'border-border/10 bg-subcard/80 hover:border-[#B5413F]/25'
        }`}
      >
        <span className="min-w-0 truncate">{selected}</span>
        <ChevronDown size={17} className={`shrink-0 text-foreground/45 transition-transform ${isOpen ? 'rotate-180 text-[#B5413F]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-border/10 bg-[#1c1618] p-1.5 shadow-[0_22px_70px_rgba(0,0,0,0.48)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-colors ${
                option.value === value
                  ? 'bg-[#B5413F] text-white'
                  : 'text-foreground/72 hover:bg-foreground/[0.055] hover:text-foreground'
              }`}
            >
              <span className="min-w-0 truncate">{option.label}</span>
              {option.value === value && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
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

function sortOptions(values: string[]) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

export default function SportScheduleScreen({ athleticsDataState }: SportScheduleScreenProps) {
  const liveEvents = athleticsDataState?.data.masterScheduleEvents || [];
  const scheduleEvents = liveEvents.length > 0 ? liveEvents : fallbackScheduleData.events;
  const seasons = useMemo(() => {
    const liveSeasons = [...new Set(scheduleEvents.map((event) => event.season))];
    return liveSeasons.length > 0 ? liveSeasons : fallbackScheduleData.seasons;
  }, [scheduleEvents]);
  const sourceFile = liveEvents.length > 0 ? 'Live Google Sheets Master Schedule' : fallbackScheduleData.sourceFile;
  const [activeSeason, setActiveSeason] = useState(seasons[0] || 'Season 1');
  const [teamFilter, setTeamFilter] = useState(ALL);
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [weekFilter, setWeekFilter] = useState(ALL);
  const [dateFilter, setDateFilter] = useState(ALL);
  const [search, setSearch] = useState('');
  const [collapsedWeeks, setCollapsedWeeks] = useState<Record<string, boolean>>({});
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [scheduleView, setScheduleView] = useState<ScheduleView>('list');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<SelectedCalendarDay | null>(null);

  useEffect(() => {
    if (!seasons.includes(activeSeason) && seasons[0]) {
      setActiveSeason(seasons[0]);
    }
  }, [activeSeason, seasons]);

  const seasonEvents = useMemo(() => {
    return scheduleEvents
      .filter((event) => event.season === activeSeason)
      .sort((a, b) => {
        const dateCompare = (a.date || '').localeCompare(b.date || '');
        if (dateCompare !== 0) return dateCompare;
        return a.team.localeCompare(b.team);
      });
  }, [activeSeason, scheduleEvents]);

  const teams = useMemo(() => sortOptions([...new Set<string>(seasonEvents.map((event) => event.team))]), [seasonEvents]);
  const eventTypes = useMemo(
    () => sortOptions([...new Set<string>(seasonEvents.map((event) => event.eventType))]) as ScheduleEventType[],
    [seasonEvents],
  );
  const weeks = useMemo(() => {
    return [...new Set<string>(seasonEvents.map((event) => event.week || 'Unassigned Week'))].sort(
      (a, b) => weekNumber(a) - weekNumber(b),
    );
  }, [seasonEvents]);
  const dates = useMemo(() => {
    return [...new Set<string>(seasonEvents.map((event) => event.date).filter(Boolean) as string[])].sort();
  }, [seasonEvents]);
  const teamOptions = useMemo(() => [ALL, ...teams].map((team) => ({ value: team, label: team })), [teams]);
  const typeOptions = useMemo(() => [ALL, ...eventTypes].map((type) => ({ value: type, label: type })), [eventTypes]);
  const weekOptions = useMemo(() => [ALL, ...weeks].map((week) => ({ value: week, label: week })), [weeks]);
  const dateOptions = useMemo(
    () => [{ value: ALL, label: ALL }, ...dates.map((date) => ({ value: date, label: formatDate(date) }))],
    [dates],
  );

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return seasonEvents.filter((event) => {
      if (teamFilter !== ALL && event.team !== teamFilter) return false;
      if (typeFilter !== ALL && event.eventType !== typeFilter) return false;
      if (weekFilter !== ALL && (event.week || 'Unassigned Week') !== weekFilter) return false;
      if (dateFilter !== ALL && event.date !== dateFilter) return false;
      if (!query) return true;

      return [event.team, event.eventText, event.eventType, event.location, event.opponent, event.raw]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [dateFilter, search, seasonEvents, teamFilter, typeFilter, weekFilter]);

  const groupedEvents = useMemo(() => groupEventsByWeek(filteredEvents), [filteredEvents]);
  const visibleWeeks = Object.keys(groupedEvents).sort((a, b) => weekNumber(a) - weekNumber(b));
  const seasonEventCounts = useMemo(() => {
    return scheduleEvents.reduce<Record<string, number>>((counts, event) => {
      counts[event.season] = (counts[event.season] || 0) + 1;
      return counts;
    }, {});
  }, [scheduleEvents]);
  const groupedCalendarEvents = useMemo(() => groupEventsByMonth(filteredEvents), [filteredEvents]);
  const visibleMonths = Object.keys(groupedCalendarEvents).sort((a, b) => {
    if (a === 'undated') return 1;
    if (b === 'undated') return -1;
    return a.localeCompare(b);
  });
  const hasFilters = teamFilter !== ALL || typeFilter !== ALL || weekFilter !== ALL || dateFilter !== ALL || search.trim() !== '';
  const activeSeasonIndex = Math.max(seasons.indexOf(activeSeason), 0) + 1;
  const todayIso = new Date().toISOString().slice(0, 10);
  const nextEvent = seasonEvents.find((event) => event.date && event.date >= todayIso) || seasonEvents.find((event) => event.date);

  const clearFilters = () => {
    setTeamFilter(ALL);
    setTypeFilter(ALL);
    setWeekFilter(ALL);
    setDateFilter(ALL);
    setSearch('');
    setOpenFilter(null);
  };

  const changeSeason = (season: string) => {
    setActiveSeason(season);
    setSelectedCalendarDay(null);
    clearFilters();
    setCollapsedWeeks({});
  };

  const toggleWeek = (week: string) => {
    setCollapsedWeeks((current) => ({
      ...current,
      [week]: !current[week],
    }));
  };

  const toggleFilter = (id: string) => {
    setOpenFilter((current) => current === id ? null : id);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 px-4 sm:px-6 lg:px-8 mt-5 space-y-6">
      <header className="relative overflow-hidden rounded-[2rem] border border-[#B5413F]/20 bg-[#120b0e] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.24)] sm:p-6">
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(181,65,63,0.26),rgba(18,11,14,0.68)_44%,rgba(34,42,52,0.32))]" />
        <div className="absolute inset-x-6 top-8 h-32 rounded-[2rem] border border-white/[0.055] opacity-55" />
        <div className="absolute left-1/2 top-8 h-32 w-px bg-white/[0.05]" />
        <div className="absolute left-[18%] top-8 h-32 w-px bg-white/[0.04]" />
        <div className="absolute right-[18%] top-8 h-32 w-px bg-white/[0.04]" />
        <div className="absolute left-[40%] top-8 h-32 w-32 -translate-x-1/2 rounded-full border border-white/[0.045]" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#F06865]">
              <CalendarDays size={13} />
              Master schedule
            </p>
            <p className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
              Season {activeSeasonIndex} of {seasons.length}
            </p>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-end">
            <div>
              <h2 className="text-[2.6rem] font-black uppercase leading-[0.9] tracking-[0.12em] text-white sm:text-6xl">
                Schedule
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-bold leading-relaxed text-white/56">
                {sourceFile} · {seasonEvents.length} events loaded for {activeSeason}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-white/10 bg-black/24 p-3">
                <p className="text-2xl font-black text-[#F06865]">{filteredEvents.length}</p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/38">
                  Showing
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/24 p-3">
                <p className="text-2xl font-black text-white">{teams.length}</p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/38">
                  Teams
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/24 p-3">
                <p className="text-2xl font-black text-white">{weeks.length}</p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/38">
                  Weeks
                </p>
              </div>
            </div>
          </div>

          {nextEvent && (
            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/28 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#F06865]">
                  <Trophy size={13} />
                  Next listed event
                </p>
                <p className="mt-1 truncate text-lg font-black uppercase tracking-tight text-white">
                  {nextEvent.eventText}
                </p>
              </div>
              <div className="shrink-0 text-left sm:text-right">
                <p className="text-sm font-black uppercase tracking-wide text-white">
                  {formatDate(nextEvent.date)}
                </p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
                  {nextEvent.team}
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {seasons.map((season, index) => (
            <button
              key={season}
              type="button"
              onClick={() => changeSeason(season)}
              className={`group relative shrink-0 overflow-hidden rounded-2xl border px-4 py-2.5 text-left transition-colors ${
                activeSeason === season
                  ? 'border-[#C1121F] bg-[#C1121F] text-white shadow-[0_12px_30px_rgba(193,18,31,0.18)] dark:border-[#B5413F]/40 dark:bg-[#B5413F] dark:text-white'
                  : 'border-border bg-subcard text-foreground hover:border-[#C1121F]/30 hover:bg-[#5A1C2C]/12 dark:border-border/10 dark:bg-subcard dark:text-foreground/60 dark:hover:bg-[#5A1C2C]/18 dark:hover:text-foreground'
              }`}
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-xs font-black uppercase tracking-[0.14em]">
                  {season}
                </span>
                <span className={`rounded-lg border px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] ${
                  activeSeason === season
                    ? 'border-white bg-white text-[#C1121F] shadow-[0_8px_18px_rgba(0,0,0,0.12)] dark:border-white dark:bg-white dark:text-[#C1121F]'
                    : 'border-border/10 bg-foreground/[0.045] text-foreground/60 group-hover:border-[#C1121F]/20 group-hover:bg-[#5A1C2C]/18 dark:border-white/10 dark:bg-white/10 dark:text-white/70'
                }`}>
                  {seasonEventCounts[season] || 0}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="flex w-full rounded-2xl border border-border/10 bg-subcard p-1 shadow-[0_12px_34px_rgba(15,23,42,0.06)] sm:w-fit">
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
                onClick={() => setScheduleView(view.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] transition-colors sm:flex-none ${
                  active
                    ? 'bg-[#C1121F] text-white shadow-[0_10px_24px_rgba(193,18,31,0.18)] dark:bg-[#5A1C2C]'
                    : 'text-foreground/50 hover:bg-[#ECEEF2] hover:text-[#C1121F] dark:hover:bg-foreground/[0.04]'
                }`}
              >
                <Icon size={14} />
                {view.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <FilterDropdown
            id="team"
            label="Team"
            icon={Users}
            value={teamFilter}
            options={teamOptions}
            isOpen={openFilter === 'team'}
            onToggle={toggleFilter}
            onChange={(value) => {
              setTeamFilter(value);
              setOpenFilter(null);
            }}
          />

          <FilterDropdown
            id="type"
            label="Type"
            icon={Filter}
            value={typeFilter}
            options={typeOptions}
            isOpen={openFilter === 'type'}
            onToggle={toggleFilter}
            onChange={(value) => {
              setTypeFilter(value);
              setOpenFilter(null);
            }}
          />

          <FilterDropdown
            id="week"
            label="Week"
            icon={CalendarDays}
            value={weekFilter}
            options={weekOptions}
            isOpen={openFilter === 'week'}
            onToggle={toggleFilter}
            onChange={(value) => {
              setWeekFilter(value);
              setOpenFilter(null);
            }}
          />

          <FilterDropdown
            id="date"
            label="Date"
            icon={CalendarDays}
            value={dateFilter}
            options={dateOptions}
            isOpen={openFilter === 'date'}
            onToggle={toggleFilter}
            onChange={(value) => {
              setDateFilter(value);
              setOpenFilter(null);
            }}
          />

          <label className="space-y-1.5">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/45 dark:text-foreground/35">
              <Search size={13} /> Search
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Opponent, venue, raw text"
              className="w-full rounded-2xl border border-border/10 bg-subcard px-4 py-3 text-sm font-bold text-foreground outline-none placeholder:text-foreground/25"
            />
          </label>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-2 rounded-2xl border border-border/10 bg-subcard px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/55 hover:text-foreground"
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </section>

      {filteredEvents.length === 0 ? (
        <div className="rounded-3xl border border-border/10 bg-subcard p-8 text-center shadow-md">
          <p className="text-sm font-black uppercase tracking-widest text-foreground/70">
            No events match these filters
          </p>
          <p className="mt-2 text-xs text-foreground/40">
            Clear filters or switch seasons to see more events.
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
                            <span className="rounded-full border border-border/10 bg-[#ECEEF2] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/45 dark:border-white/10 dark:bg-white/10 dark:text-white/60">
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
                        const CellTag = hasEvents ? 'button' : 'div';

                        return (
                          <CellTag
                            key={`${month}-${index}`}
                            type={hasEvents ? 'button' : undefined}
                            onClick={hasEvents ? () => setSelectedCalendarDay({ label: formatLongDate(dateIso), events: day.events }) : undefined}
                            className={`min-h-[74px] rounded-2xl border p-2 text-left transition-all ${
                              day
                                ? hasEvents
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
                                  {hasEvents && (
                                    <span className="rounded-full bg-[#C1121F] px-1.5 py-0.5 text-[8px] font-black text-white shadow-[0_6px_14px_rgba(193,18,31,0.2)]">
                                      {day.events.length}
                                    </span>
                                  )}
                                </div>

                                <div className="mt-2 space-y-1">
                                  {day.events.slice(0, 2).map((event) => (
                                    <div
                                      key={event.id}
                                      className="truncate rounded-lg bg-[#FEE2E2] px-1.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#7F1D1D] dark:bg-[#B5413F]/18 dark:text-[#FCA5A5]"
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
            const collapsed = collapsedWeeks[week];

            return (
              <div key={week} className="overflow-hidden rounded-3xl border border-border/10 bg-subcard shadow-[0_18px_55px_rgba(0,0,0,0.16)]">
                <button
                  type="button"
                  onClick={() => toggleWeek(week)}
                  className="flex w-full items-center justify-between gap-4 border-b border-border/5 bg-[#5A1C2C]/10 px-4 py-4 text-left"
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
                    <span className="rounded-full border border-border/10 bg-subcard px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/50">
                      {events.length}
                    </span>
                    {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </div>
                </button>

                {!collapsed && (
                  <div className="divide-y divide-border/5">
                    {events.map((event) => (
                      <article key={event.id} className="grid gap-4 px-4 py-4 transition-colors hover:bg-foreground/[0.02] md:grid-cols-[112px_minmax(0,1fr)_auto] md:items-center">
                        <div className="flex items-center gap-3 md:block">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/10 bg-foreground/[0.035] md:mb-2">
                            <CalendarDays size={19} className="text-[#B5413F]" />
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase tracking-wide text-foreground">
                              {formatDate(event.date)}
                            </p>
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
                            <span className="rounded-full border border-border/10 bg-foreground/[0.025] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/45">
                              {event.team}
                            </span>
                          </div>

                          <h4 className="text-lg font-black uppercase leading-tight tracking-tight text-foreground">
                            {event.eventText}
                          </h4>

                          <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-bold uppercase tracking-[0.13em] text-foreground/45">
                            {event.time && (
                              <span className="inline-flex items-center gap-1.5">
                                <Clock size={13} className="text-[#B5413F]" />
                                {event.time}
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

                        <div className="hidden rounded-2xl border border-border/10 bg-foreground/[0.025] px-3 py-2 text-right md:block">
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-foreground/35">
                            Raw
                          </p>
                          <p className="max-w-[180px] truncate text-xs font-bold text-foreground/55">
                            {event.raw}
                          </p>
                        </div>
                      </article>
                    ))}
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
                      <span className="rounded-full border border-border/10 bg-[#ECEEF2] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/55 dark:border-white/10 dark:bg-white/10 dark:text-white/60">
                        {event.team}
                      </span>
                    </div>

                    <h4 className="text-lg font-black uppercase leading-tight tracking-tight text-foreground">
                      {event.eventText}
                    </h4>

                    <div className="mt-3 grid gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-foreground/50 sm:grid-cols-2">
                      {event.time && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={13} className="text-[#C1121F]" />
                          {event.time}
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
