import React, { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { GenderTab, SportTab, DivisionTab } from '../types';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { SheetMatch, Standing } from '../services/parsers';

interface SportScheduleScreenProps {
  sport: SportTab;
  gender: GenderTab;
  division: DivisionTab;
  onSportChange: (sport: SportTab) => void;
  athleticsDataState: AthleticsDataState;
}

type SectionKey = 'standings' | 'upcoming' | 'finished';

export default function SportScheduleScreen({
  sport,
  gender,
  division,
  onSportChange,
  athleticsDataState,
}: SportScheduleScreenProps) {
  const { data, loading, error } = athleticsDataState;

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    standings: true,
    upcoming: true,
    finished: false,
  });

  const SPORTS_LIST: SportTab[] = [
    'Basketball',
    'Volleyball',
    'Soccer',
    'Badminton',
    'TrackAndField',
  ];

  const formatSportName = (s: SportTab) => {
    switch (s) {
      case 'TrackAndField':
        return 'Track & Field';
      default:
        return s;
    }
  };

  const displayDivision = division === 'SMA' ? 'SMA / Varsity' : 'SMP';

  const toggleSection = (section: SectionKey) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  // Use the combined data.matches and data.standings to automatically support Soccer and Basketball schedule sync
  const currentMatches = (data.matches || data.soccerMatches || []).filter((match) => {
    return (
      match.sportKey === sport &&
      match.level === division &&
      match.genderGroup === gender
    );
  });

  const standings = (data.standings || data.soccerStandings || []).filter((standing) => {
    return (
      standing.sportKey === sport &&
      standing.level === division &&
      standing.genderGroup === gender
    );
  });

  const upcomingMatches = currentMatches.filter((match) => {
    return match.status === 'Upcoming' || match.status === 'Live' || match.status === 'Postponed';
  });

  const finishedMatches = currentMatches.filter((match) => {
    return match.status === 'Finished';
  });

  return (
    <div className="animate-in fade-in duration-500 px-4 sm:px-6 lg:px-8 pb-24 mt-4">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="space-y-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40">
              Google Sheets Live Data
            </p>

            <h1 className="mt-2 text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground">
              {formatSportName(sport)} Schedule
            </h1>

            <p className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-foreground/45">
              {displayDivision} · {gender}
            </p>
          </div>

          <div className="flex overflow-x-auto gap-3 pb-2 -mx-1 px-1 no-scrollbar">
            {SPORTS_LIST.map((s) => (
              <button
                key={s}
                onClick={() => onSportChange(s)}
                className={`flex-shrink-0 px-6 py-3 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest border transition-all ${
                  sport === s
                    ? 'bg-[#7A001F] text-white border-[#BFD7EA]/30 shadow-md'
                    : 'bg-subcard text-foreground/50 border-border/10 hover:text-foreground'
                }`}
              >
                {formatSportName(s)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SectionToggleButton
              label="Standings"
              count={standings.length}
              isOpen={openSections.standings}
              onClick={() => toggleSection('standings')}
            />

            <SectionToggleButton
              label="Upcoming Matches"
              count={upcomingMatches.length}
              isOpen={openSections.upcoming}
              onClick={() => toggleSection('upcoming')}
            />

            <SectionToggleButton
              label="Finished Matches"
              count={finishedMatches.length}
              isOpen={openSections.finished}
              onClick={() => toggleSection('finished')}
            />
          </div>
        </header>

        {loading && (
          <StateCard title="Loading data..." body="Pulling live information from Google Sheets." />
        )}

        {error && (
          <StateCard title="Google Sheets sync error" body={error} isError />
        )}

        {!loading && !error && (
          <main className="space-y-8">
            {openSections.standings && (
              <CollapsibleSection title="League Standings">
                {standings.length > 0 ? (
                  <StandingsTable standings={standings} />
                ) : (
                  <StateCard
                    title="Standings not available yet"
                    body="Add rows in the standings sheet for this sport, division, and gender."
                  />
                )}
              </CollapsibleSection>
            )}

            {openSections.upcoming && (
              <CollapsibleSection title="Upcoming Matches">
                {upcomingMatches.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingMatches.map((match, index) => (
                      <div key={`${match.id}-${index}`}>
                        <HorizontalMatchCard match={match} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <StateCard
                    title="No upcoming matches"
                    body="Upcoming games will appear here once added to the Google Sheet."
                  />
                )}
              </CollapsibleSection>
            )}

            {openSections.finished && (
              <CollapsibleSection title="Finished Matches">
                {finishedMatches.length > 0 ? (
                  <div className="space-y-4">
                    {finishedMatches.map((match, index) => (
                      <div key={`${match.id}-${index}`}>
                        <HorizontalMatchCard match={match} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <StateCard
                    title="No finished matches"
                    body="Completed games will appear here once scores are added."
                  />
                )}
              </CollapsibleSection>
            )}
          </main>
        )}
      </div>
    </div>
  );
}

interface SectionToggleButtonProps {
  label: string;
  count: number;
  isOpen: boolean;
  onClick: () => void;
}

function SectionToggleButton({
  label,
  count,
  isOpen,
  onClick,
}: SectionToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-[22px] border px-5 py-4 flex items-center justify-between transition-all ${
        isOpen
          ? 'bg-[#7A001F] text-white border-[#BFD7EA]/30 shadow-md'
          : 'bg-subcard text-foreground border-border/10 hover:border-border/25'
      }`}
    >
      <div className="text-left">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-60">
          Show / Hide
        </p>
        <p className="mt-1 text-sm font-black uppercase tracking-widest">
          {label}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">
          {count}
        </span>

        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
    </button>
  );
}

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
}

function CollapsibleSection({
  title,
  children,
}: CollapsibleSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight text-foreground border-l-4 border-[#B5413F] pl-4">
          {title}
        </h2>
        <div className="h-px flex-1 bg-border/70" />
      </div>

      {children}
    </section>
  );
}

function HorizontalMatchCard({ match }: { match: SheetMatch }) {
  const hasScore = match.scoreFor !== null && match.scoreAgainst !== null;

  const statusClass =
    match.status === 'Finished'
      ? 'bg-foreground/10 text-foreground/70 border-border/20'
      : match.status === 'Live'
        ? 'bg-red-500/20 text-red-200 border-red-400/40'
        : match.status === 'Postponed'
          ? 'bg-yellow-500/15 text-yellow-200 border-yellow-400/30'
          : 'bg-[#5B86D6]/20 text-[#BFD3FF] border-[#5B86D6]/35';

  return (
    <article className="w-full overflow-hidden rounded-[28px] border border-border/10 bg-subcard shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_180px]">
        <div className="flex flex-col justify-between gap-4 border-b lg:border-b-0 lg:border-r border-border/10 p-5">
          <div>
            <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${statusClass}`}>
              {match.status}
            </span>

            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/40">
              {match.tournament}
            </p>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#B5413F]">
              {match.locationType || 'Match'}
            </p>
            <p className="mt-1 text-xs font-bold text-foreground/45">
              {match.date || 'Date TBD'} · {match.time || 'Time TBD'}
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/35">
                SPH
              </p>
              <h3 className="mt-2 text-xl sm:text-3xl font-black uppercase tracking-widest text-foreground">
                LV
              </h3>
            </div>

            <div className="text-center min-w-[90px] sm:min-w-[140px]">
              {hasScore ? (
                <div className="flex items-center justify-center gap-4">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                    {match.scoreFor}
                  </span>
                  <span className="text-foreground/20 text-2xl font-black">-</span>
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                    {match.scoreAgainst}
                  </span>
                </div>
              ) : (
                <div>
                  <p className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
                    {match.time || 'TBD'}
                  </p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                    {match.date || 'Date TBD'}
                  </p>
                </div>
              )}

              {match.result && (
                <p className="mt-2 text-xs font-black uppercase tracking-widest text-[#B5413F]">
                  Result: {match.result}
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/35">
                Opponent
              </p>
              <h3 className="mt-2 text-xl sm:text-3xl font-black uppercase tracking-widest text-foreground">
                {match.opponent || 'TBD'}
              </h3>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border/10 pt-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/45">
              <MapPin size={14} className="text-[#B5413F]" />
              {match.venue || 'Venue TBD'}
            </div>

            {match.notes && (
              <p className="text-xs font-bold text-foreground/45">
                {match.notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex lg:flex-col items-center justify-between gap-3 border-t lg:border-t-0 lg:border-l border-border/10 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/35">
            Match Info
          </p>

          <div className="text-right lg:text-center">
            <p className="text-sm font-black uppercase tracking-widest text-foreground">
              {match.genderGroup}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-foreground/45">
              {match.level}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function StandingsTable({ standings }: { standings: Standing[] }) {
  return (
    <div className="w-full overflow-hidden rounded-[28px] border border-border/10 bg-subcard shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border/10 text-[10px] uppercase tracking-[0.25em] text-foreground/45">
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Team</th>
              <th className="p-4 text-center">GP</th>
              <th className="p-4 text-center">W</th>
              <th className="p-4 text-center">D</th>
              <th className="p-4 text-center">L</th>
              <th className="p-4 text-center">GF</th>
              <th className="p-4 text-center">GA</th>
              <th className="p-4 text-center">GD</th>
              <th className="p-4 text-center">PTS</th>
            </tr>
          </thead>

          <tbody>
            {standings.map((standing, index) => {
              const gamesPlayed =
                (standing.wins ?? 0) +
                (standing.draws ?? 0) +
                (standing.losses ?? 0);

              return (
                <tr
                  key={`${standing.id}-${index}`}
                  className="border-b border-border/5 last:border-0 hover:bg-foreground/[0.03]"
                >
                  <td className="p-4 font-black text-[#B5413F]">
                    {standing.rank ?? '-'}
                  </td>

                  <td className="p-4">
                    <p className="font-black uppercase tracking-widest text-foreground">
                      {standing.team}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-foreground/35">
                      {standing.tournament}
                    </p>
                  </td>

                  <td className="p-4 text-center font-bold text-foreground/70">
                    {gamesPlayed || '-'}
                  </td>
                  <td className="p-4 text-center font-bold text-foreground/70">
                    {standing.wins ?? '-'}
                  </td>
                  <td className="p-4 text-center font-bold text-foreground/70">
                    {standing.draws ?? '-'}
                  </td>
                  <td className="p-4 text-center font-bold text-foreground/70">
                    {standing.losses ?? '-'}
                  </td>
                  <td className="p-4 text-center font-bold text-foreground/70">
                    {standing.forValue ?? '-'}
                  </td>
                  <td className="p-4 text-center font-bold text-foreground/70">
                    {standing.againstValue ?? '-'}
                  </td>
                  <td className="p-4 text-center font-bold text-foreground/70">
                    {standing.difference ?? '-'}
                  </td>
                  <td className="p-4 text-center text-lg font-black text-[#B5413F]">
                    {standing.points ?? '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface StateCardProps {
  title: string;
  body: string;
  isError?: boolean;
}

function StateCard({
  title,
  body,
  isError = false,
}: StateCardProps) {
  return (
    <div className={`rounded-[28px] border p-8 text-center bg-subcard shadow-md ${
      isError ? 'border-red-500/25' : 'border-border/10'
    }`}>
      <p className={`text-sm font-black uppercase tracking-widest ${
        isError ? 'text-red-400' : 'text-foreground/70'
      }`}>
        {title}
      </p>

      <p className="mt-2 text-xs font-bold text-foreground/40">
        {body}
      </p>
    </div>
  );
}
