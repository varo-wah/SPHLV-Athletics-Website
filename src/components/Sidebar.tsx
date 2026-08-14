import * as React from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { DivisionTab, GenderTab, SportTab } from '../types';
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

const sports = SPORT_CATALOG.filter((sport) => LAUNCH_TEAM_SPORTS.includes(sport.id));

export default function Sidebar({ isOpen, onClose, onNavigateHome, onSelectTeam }: SidebarProps) {
  const teamGroups = React.useMemo(() => sports.map((sport) => ({
    ...sport,
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
            className="fixed inset-0 z-50 bg-brand-navy/35 backdrop-blur-sm dark:bg-black/65"
          />

          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 27, stiffness: 220 }}
            aria-label="Teams menu"
            className="fixed bottom-0 left-0 top-0 z-50 flex w-[22rem] max-w-[90vw] flex-col overflow-hidden border-r border-brand-maroon/15 bg-[linear-gradient(160deg,#FFFFFF_0%,#F8FAFC_62%,rgba(193,18,31,0.08)_100%)] shadow-[24px_0_90px_rgba(120,0,0,0.20)] dark:border-[#B5413F]/20 dark:bg-none dark:bg-[#10070a] dark:shadow-[24px_0_90px_rgba(0,0,0,0.58)]"
          >
            <div className="relative border-b border-brand-maroon/10 px-4 py-3.5 dark:border-white/[0.065]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(193,18,31,0.14),transparent_46%)] dark:bg-[radial-gradient(circle_at_12%_0%,rgba(181,65,63,0.24),transparent_44%)]" />
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
                  <span className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-brand-maroon/10 bg-white shadow-[0_12px_34px_rgba(120,0,0,0.14)] dark:border-white/10 dark:shadow-[0_12px_34px_rgba(0,0,0,0.26)]">
                    <img
                      src="https://res.cloudinary.com/dpgt445lg/image/upload/v1775384563/image_13_obe33c.png"
                      alt=""
                      className="h-10 w-12 object-contain"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black uppercase tracking-[0.13em] text-brand-navy dark:text-foreground">
                      LV Eagle App
                    </span>
                    <span className="mt-0.5 block text-[9px] font-black uppercase tracking-[0.18em] text-brand-red dark:text-[#F06865]">
                      Choose your team
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close teams menu"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-maroon/10 bg-muted text-brand-navy/55 transition-colors hover:border-brand-red/25 hover:bg-white hover:text-brand-red dark:border-white/10 dark:bg-white/[0.035] dark:text-foreground/55 dark:hover:bg-white dark:hover:text-black"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="team-overlay-scroll flex-1 space-y-3 overflow-y-auto px-3.5 py-3.5">
              {teamGroups.map((sport, index) => {
                return (
                  <section
                    key={sport.id}
                    aria-labelledby={`menu-${sport.id}`}
                    className="overflow-hidden rounded-2xl border border-brand-maroon/10 bg-white/72 p-3 shadow-[0_14px_38px_rgba(120,0,0,0.08)] dark:border-white/[0.065] dark:bg-white/[0.025] dark:shadow-[0_14px_38px_rgba(0,0,0,0.18)]"
                  >
                    <div className="mb-2.5 flex items-center justify-between gap-3">
                      <h2 id={`menu-${sport.id}`} className="flex min-w-0 items-center gap-2.5 text-xs font-black uppercase tracking-[0.13em] text-brand-navy dark:text-foreground">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-brand-red/20 bg-brand-red/10 text-brand-red dark:border-[#B5413F]/25 dark:bg-[#B5413F]/14 dark:text-[#F06865]" aria-hidden="true">
                          <span className="text-[18px] leading-none">{sport.ballGlyph}</span>
                        </span>
                        {sport.label}
                      </h2>
                      <span className="text-[8px] font-black uppercase tracking-[0.18em] text-brand-maroon/35 dark:text-foreground/28">
                        0{index + 1}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {sport.teams.map((team) => {
                        const key = `${sport.id}-${team.division}-${team.gender}`;
                        return (
                          <button
                            key={key}
                            type="button"
                            aria-label={team.displayName}
                            title={team.displayName}
                            onClick={() => {
                              onSelectTeam(sport.id, team.division, team.gender);
                              onClose();
                            }}
                            className="group flex min-h-11 items-center justify-center rounded-xl border border-brand-maroon/10 bg-muted/70 px-2.5 py-2 text-center transition-colors hover:border-brand-red/25 hover:bg-brand-red/8 dark:border-white/[0.065] dark:bg-black/18 dark:hover:border-[#B5413F]/30 dark:hover:bg-[#B5413F]/12"
                          >
                            <span className="text-sm font-black uppercase tracking-[0.12em] text-brand-navy/80 group-hover:text-brand-navy dark:text-foreground/80 dark:group-hover:text-foreground">
                              {team.menuCode}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>

            {IS_PROTOTYPE && (
              <div className="border-t border-brand-maroon/10 px-4 py-2.5 text-center text-[8px] font-black uppercase tracking-[0.18em] text-brand-maroon/55 dark:border-white/[0.06] dark:text-amber-300/65">
                Prototype catalog
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
