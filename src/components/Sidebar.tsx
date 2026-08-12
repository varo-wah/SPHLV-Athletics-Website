import * as React from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { DivisionTab, GenderTab, SportTab } from '../types';
import {
  BasketballIcon,
  VolleyballIcon,
  SoccerIcon,
  BadmintonIcon,
  TrackIcon,
} from './SportIcons';
import {
  IS_PROTOTYPE,
  LAUNCH_TEAM_SPORTS,
  isLaunchTeamSelection,
} from '../config/launchSports';
import { SPORT_CATALOG, teamsForSport } from '../config/teamCatalog';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome: () => void;
  onSelectTeam: (sport: SportTab, division: DivisionTab, gender: GenderTab) => void;
}

const sportIcons = {
  Soccer: SoccerIcon,
  Volleyball: VolleyballIcon,
  Basketball: BasketballIcon,
  Badminton: BadmintonIcon,
  TrackAndField: TrackIcon,
};

const teamNames: Record<string, string> = {
  'Soccer-SMA-Boys': "Varsity Boys' Soccer",
  'Soccer-SMA-Girls': "Varsity Girls' Soccer",
  'Volleyball-SMA-Boys': "Varsity Boys' Volleyball",
  'Volleyball-SMA-Girls': "Varsity Girls' Volleyball",
  'Basketball-SMP-Boys': "SMP Boys' Basketball",
  'Basketball-SMP-Girls': "SMP Girls' Basketball",
};

const sports = SPORT_CATALOG.filter((sport) => LAUNCH_TEAM_SPORTS.includes(sport.id));

export default function Sidebar({ isOpen, onClose, onNavigateHome, onSelectTeam }: SidebarProps) {
  const teamGroups = React.useMemo(() => sports.map((sport) => ({
    ...sport,
    Icon: sportIcons[sport.id],
    teams: teamsForSport(sport.id).filter((team) => (
      isLaunchTeamSelection(sport.id, team.division, team.gender)
    )),
  })), []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 27, stiffness: 220 }}
            aria-label="Teams menu"
            className="fixed bottom-0 left-0 top-0 z-50 flex w-[22rem] max-w-[90vw] flex-col overflow-hidden border-r border-[#B5413F]/20 bg-[#10070a] shadow-[24px_0_90px_rgba(0,0,0,0.58)]"
          >
            <div className="relative border-b border-white/[0.065] px-4 py-3.5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(181,65,63,0.24),transparent_44%)]" />
              <div className="relative flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    onNavigateHome();
                    onClose();
                  }}
                  className="flex min-w-0 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06865]"
                  aria-label="Go to Home"
                >
                  <span className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white shadow-[0_12px_34px_rgba(0,0,0,0.26)]">
                    <img
                      src="https://res.cloudinary.com/dpgt445lg/image/upload/v1775384563/image_13_obe33c.png"
                      alt=""
                      className="h-10 w-12 object-contain"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black uppercase tracking-[0.13em] text-foreground">
                      LV Eagle App
                    </span>
                    <span className="mt-0.5 block text-[9px] font-black uppercase tracking-[0.18em] text-[#F06865]">
                      Choose your team
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close teams menu"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-foreground/55 transition-colors hover:bg-white hover:text-black"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-3.5 py-3.5">
              {teamGroups.map((sport, index) => {
                const Icon = sport.Icon;

                return (
                  <section
                    key={sport.id}
                    aria-labelledby={`menu-${sport.id}`}
                    className="overflow-hidden rounded-2xl border border-white/[0.065] bg-white/[0.025] p-3 shadow-[0_14px_38px_rgba(0,0,0,0.18)]"
                  >
                    <div className="mb-2.5 flex items-center justify-between gap-3">
                      <h2 id={`menu-${sport.id}`} className="flex min-w-0 items-center gap-2.5 text-xs font-black uppercase tracking-[0.13em] text-foreground">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#B5413F]/25 bg-[#B5413F]/14 text-[#F06865]" aria-hidden="true">
                          <Icon size={18} />
                        </span>
                        {sport.label}
                      </h2>
                      <span className="text-[8px] font-black uppercase tracking-[0.18em] text-foreground/28">
                        0{index + 1}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {sport.teams.map((team) => {
                        const key = `${sport.id}-${team.division}-${team.gender}`;
                        const name = teamNames[key] ?? team.displayName;

                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              onSelectTeam(sport.id, team.division, team.gender);
                              onClose();
                            }}
                            className="group flex min-h-[54px] items-center justify-between gap-1.5 rounded-xl border border-white/[0.065] bg-black/18 px-2.5 py-2 text-left transition-colors hover:border-[#B5413F]/30 hover:bg-[#B5413F]/12"
                          >
                            <span className="text-[9px] font-black uppercase leading-snug tracking-[0.035em] text-foreground/74 group-hover:text-foreground">
                              {name}
                            </span>
                            <ArrowUpRight size={12} className="shrink-0 text-foreground/25 group-hover:text-[#F06865]" aria-hidden="true" />
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>

            {IS_PROTOTYPE && (
              <div className="border-t border-white/[0.06] px-4 py-2.5 text-center text-[8px] font-black uppercase tracking-[0.18em] text-amber-300/65">
                Prototype catalog
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
