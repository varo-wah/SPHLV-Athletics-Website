import * as React from 'react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { SportTab, DivisionTab, GenderTab } from '../types';
import {
  BasketballIcon,
  VolleyballIcon,
  SoccerIcon,
  BadmintonIcon,
  TrackIcon,
} from '../components/SportIcons';
import SportFollowButton from '../components/SportFollowButton';
import {
  IS_PROTOTYPE,
  LAUNCH_SEASON,
  LAUNCH_TEAM_SPORTS,
  isLaunchTeamSelection,
} from '../config/launchSports';
import { SPORT_CATALOG, teamsForSport } from '../config/teamCatalog';

interface TeamsScreenProps {
  onSelectTeam: (sport: SportTab, division: DivisionTab, gender: GenderTab) => void;
}

interface SportDirectory {
  id: SportTab;
  label: string;
  season: string;
  status: string;
  icon: React.FC<{ size?: number | string }>;
  teams: ReturnType<typeof teamsForSport>;
}

const sportIcons = {
  Soccer: SoccerIcon,
  Volleyball: VolleyballIcon,
  Basketball: BasketballIcon,
  Badminton: BadmintonIcon,
  TrackAndField: TrackIcon,
};

const allSports: SportDirectory[] = SPORT_CATALOG.map((sport) => ({
  id: sport.id,
  label: sport.label,
  season: IS_PROTOTYPE ? sport.prototypeSeason : LAUNCH_SEASON,
  status: sport.status,
  icon: sportIcons[sport.id],
  teams: teamsForSport(sport.id),
}));

const sports = allSports
  .filter((sport) => LAUNCH_TEAM_SPORTS.includes(sport.id))
  .map((sport) => ({
    ...sport,
    teams: sport.teams.filter((team) => (
      isLaunchTeamSelection(sport.id, team.division, team.gender)
    )),
  }));
const visibleSportCount = sports.length;
const visibleTeamCount = sports.reduce((total, sport) => total + sport.teams.length, 0);
const visibleSeasonCount = IS_PROTOTYPE ? 4 : 1;

export default function TeamsScreen({ onSelectTeam }: TeamsScreenProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen pb-24 px-4 sm:px-6 lg:px-8 mt-5 space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-border/10 bg-subcard/40 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.16)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(181,65,63,0.16),transparent_34%)]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#B5413F]">
              SPH LV Eagles
            </p>
            <h1 className="mt-2 text-4xl font-black uppercase tracking-[0.08em] text-foreground leading-none">
              Teams
            </h1>
            <p className="mt-3 max-w-xl text-xs font-semibold leading-relaxed text-foreground/45">
              Choose a program to view team pages, standings, schedules, and future roster updates.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:min-w-[260px]">
            <div className="rounded-2xl border border-border/10 bg-foreground/[0.025] p-3 text-center">
              <p className="text-2xl font-black text-[#B5413F]">{visibleSportCount}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-foreground/35">Sports</p>
            </div>
            <div className="rounded-2xl border border-border/10 bg-foreground/[0.025] p-3 text-center">
              <p className="text-2xl font-black text-foreground">{visibleTeamCount}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-foreground/35">Teams</p>
            </div>
            <div className="rounded-2xl border border-border/10 bg-foreground/[0.025] p-3 text-center">
              <p className="text-2xl font-black text-foreground">{visibleSeasonCount}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-foreground/35">Seasons</p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-2">
        {sports.map((sport) => {
          const Icon = sport.icon;
          const isSoccer = sport.id === 'Soccer';

          return (
            <article
              key={sport.id}
              className={`relative overflow-hidden rounded-3xl border p-4 shadow-[0_18px_55px_rgba(0,0,0,0.16)] ${
                isSoccer
                  ? 'border-[#B5413F]/25 bg-gradient-to-br from-[#5A1C2C]/32 via-subcard to-subcard'
                  : 'border-border/10 bg-subcard'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
                    isSoccer
                      ? 'border-[#B5413F]/25 bg-[#B5413F]/12 text-[#D85A57]'
                      : 'border-border/10 bg-foreground/[0.035] text-foreground/45'
                  }`}>
                    <Icon size={25} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B5413F]">
                      {sport.season}
                    </p>
                    <h2 className="truncate text-2xl font-black uppercase tracking-tight text-foreground">
                      {sport.label}
                    </h2>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] ${
                    isSoccer
                      ? 'border-green-500/20 bg-green-500/10 text-green-400'
                      : 'border-border/10 bg-foreground/[0.025] text-foreground/40'
                  }`}>
                    {sport.status}
                  </span>
                  <SportFollowButton sport={sport.id} compact />
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {sport.teams.map((team) => (
                  <button
                    key={`${sport.id}-${team.division}-${team.gender}`}
                    type="button"
                    onClick={() => onSelectTeam(sport.id, team.division, team.gender)}
                    className="group flex min-h-[74px] items-center justify-between gap-3 rounded-2xl border border-border/10 bg-foreground/[0.025] px-4 py-3 text-left transition-colors hover:border-[#B5413F]/35 hover:bg-[#B5413F]/10"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-base font-black uppercase tracking-wide text-foreground">
                        {team.shortName}
                      </p>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/35">
                        {team.note}
                      </p>
                    </div>
                    <ChevronRight size={18} className="shrink-0 text-foreground/35 transition-transform group-hover:translate-x-1 group-hover:text-[#B5413F]" />
                  </button>
                ))}
              </div>

              {isSoccer && (
                <button
                  type="button"
                  onClick={() => onSelectTeam('Soccer', 'SMA', 'Boys')}
                  className="mt-4 flex w-full items-center justify-between gap-3 rounded-2xl border border-[#B5413F]/20 bg-[#B5413F]/12 px-4 py-3 text-left transition-colors hover:bg-[#B5413F]/18"
                >
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B5413F]">
                      Featured
                    </p>
                    <p className="text-sm font-black uppercase tracking-wide text-foreground">
                      Varsity Boys Soccer
                    </p>
                  </div>
                  <ArrowUpRight size={18} className="text-[#B5413F]" />
                </button>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}
