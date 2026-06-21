import * as React from 'react';
import { X, ChevronDown, ChevronUp, ChevronRight, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SportTab, GenderTab, DivisionTab } from '../types';
import {
  BasketballIcon,
  VolleyballIcon,
  SoccerIcon,
  BadmintonIcon,
  TrackIcon,
} from './SportIcons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeam: (sport: SportTab, division: DivisionTab, gender: GenderTab) => void;
}

type SportMenuItem = {
  id: SportTab;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
  status: string;
  featured?: boolean;
};

const sports: SportMenuItem[] = [
  { id: 'Basketball', label: 'BASKETBALL', icon: BasketballIcon, status: 'Schedule' },
  { id: 'Volleyball', label: 'VOLLEYBALL', icon: VolleyballIcon, status: 'Schedule' },
  { id: 'Soccer', label: 'SOCCER', icon: SoccerIcon, status: 'Live', featured: true },
  { id: 'Badminton', label: 'BADMINTON', icon: BadmintonIcon, status: 'Schedule' },
  { id: 'TrackAndField', label: 'TRACK & FIELD', icon: TrackIcon, status: 'Schedule' },
];

const standardTeams: { label: string; division: DivisionTab; gender: GenderTab }[] = [
  { label: 'SMP Boys', division: 'SMP', gender: 'Boys' },
  { label: 'SMP Girls', division: 'SMP', gender: 'Girls' },
  { label: 'SMA Boys', division: 'SMA', gender: 'Boys' },
  { label: 'SMA Girls', division: 'SMA', gender: 'Girls' },
];

const combinedTeams: { label: string; division: DivisionTab; gender: GenderTab }[] = [
  { label: 'SMP Combined', division: 'SMP', gender: 'Combined' },
  { label: 'SMA Combined', division: 'SMA', gender: 'Combined' },
];

export default function Sidebar({ isOpen, onClose, onSelectTeam }: SidebarProps) {
  const [openSport, setOpenSport] = React.useState<SportTab | null>(null);

  const handleSportToggle = (sport: SportTab) => {
    setOpenSport((current) => (current === sport ? null : sport));
  };

  const getTeamsForSport = (sport: SportTab) => {
    if (sport === 'Badminton' || sport === 'TrackAndField') {
      return combinedTeams;
    }

    return standardTeams;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 top-0 z-50 flex w-[21rem] max-w-[88vw] flex-col overflow-hidden border-r border-[#B5413F]/20 bg-[#13090d] shadow-[24px_0_90px_rgba(0,0,0,0.5)]"
          >
            <div className="relative overflow-hidden border-b border-white/[0.06] p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,rgba(181,65,63,0.28),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.055),transparent_52%)]" />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-[#F06865] shadow-[0_16px_42px_rgba(0,0,0,0.22)]">
                    <Shield size={21} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#F06865]">
                    SPH LV Eagles
                  </p>
                  <h2 className="mt-1 text-2xl font-black uppercase leading-none tracking-[0.1em] text-foreground">
                    Athletic Teams
                  </h2>
                  <p className="mt-2 text-xs font-bold leading-relaxed text-foreground/45">
                    Select a sport and division.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close teams menu"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/20 text-foreground/55 transition-colors hover:bg-white hover:text-black"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
              {sports.map((sport) => {
                const Icon = sport.icon;
                const isOpenSport = openSport === sport.id;
                const teams = getTeamsForSport(sport.id);

                return (
                  <div
                    key={sport.id}
                    className={`overflow-hidden rounded-2xl border transition-colors ${
                      isOpenSport
                        ? 'border-[#B5413F]/28 bg-[#5A1C2C]/18'
                        : 'border-white/[0.055] bg-white/[0.025] hover:border-white/10 hover:bg-white/[0.04]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSportToggle(sport.id)}
                      className="flex w-full items-center justify-between gap-3 px-3.5 py-3.5 text-left transition-colors"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                          isOpenSport
                            ? 'border-[#B5413F]/25 bg-[#B5413F]/16 text-[#F06865]'
                            : 'border-white/[0.075] bg-black/18 text-foreground/55'
                        }`}>
                          <Icon size={20} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-black uppercase tracking-[0.14em] text-foreground">
                              {sport.label}
                            </span>
                            {sport.featured && (
                              <Sparkles size={12} className="shrink-0 text-[#F06865]" />
                            )}
                          </div>
                          <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.17em] text-foreground/36">
                            {teams.length} teams
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className={`rounded-full border px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em] ${
                          sport.status === 'Live'
                            ? 'border-green-400/20 bg-green-400/10 text-green-300'
                            : 'border-white/[0.08] bg-white/[0.035] text-foreground/38'
                        }`}>
                          {sport.status}
                        </span>
                        {isOpenSport ? (
                          <ChevronUp size={17} className="text-foreground/45" />
                        ) : (
                          <ChevronDown size={17} className="text-foreground/45" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpenSport && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-t border-white/[0.055] bg-black/16 px-3 pb-3"
                        >
                          <div className="grid grid-cols-1 gap-2 pt-3">
                            {teams.map((team) => (
                              <button
                                key={`${sport.id}-${team.division}-${team.gender}`}
                                type="button"
                                onClick={() => {
                                  onSelectTeam(sport.id, team.division, team.gender);
                                  onClose();
                                }}
                                className="group flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3 text-left transition-colors hover:border-[#B5413F]/25 hover:bg-[#B5413F]/12"
                              >
                                <div>
                                  <p className="text-xs font-black uppercase tracking-[0.18em] text-foreground/72 group-hover:text-foreground">
                                    {team.label}
                                  </p>
                                  <p className="mt-1 text-[9px] font-black uppercase tracking-[0.14em] text-foreground/30">
                                    {sport.label}
                                  </p>
                                </div>
                                <ChevronRight size={15} className="text-foreground/28 transition-transform group-hover:translate-x-0.5 group-hover:text-[#F06865]" />
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-white/[0.06] bg-black/16 p-4">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">
                  Athletics Department
                </p>
                <p className="mt-1 text-xs font-bold text-foreground/34">
                  Soccer sheets live · master schedule local
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
