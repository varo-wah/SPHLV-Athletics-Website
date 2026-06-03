import * as React from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
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
};

const sports: SportMenuItem[] = [
  { id: 'Basketball', label: 'BASKETBALL', icon: BasketballIcon },
  { id: 'Volleyball', label: 'VOLLEYBALL', icon: VolleyballIcon },
  { id: 'Soccer', label: 'SOCCER', icon: SoccerIcon },
  { id: 'Badminton', label: 'BADMINTON', icon: BadmintonIcon },
  { id: 'TrackAndField', label: 'TRACK & FIELD', icon: TrackIcon },
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
            className="fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[86vw] bg-card border-r border-[#5A1C2C]/20 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/5">
              <span className="text-foreground font-black tracking-widest text-lg">
                ATHLETIC TEAMS
              </span>

              <button
                onClick={onClose}
                className="text-foreground/50 hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 py-4 overflow-y-auto">
              {sports.map((sport) => {
                const Icon = sport.icon;
                const isOpenSport = openSport === sport.id;
                const teams = getTeamsForSport(sport.id);

                return (
                  <div key={sport.id}>
                    <button
                      onClick={() => handleSportToggle(sport.id)}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#5A1C2C]/10 text-foreground/70 hover:text-foreground transition-colors border-l-2 border-transparent hover:border-border/40"
                    >
                      <div className="flex items-center gap-4">
                        <Icon size={20} className="text-foreground/60" />
                        <span className="font-bold tracking-wider text-sm">
                          {sport.label}
                        </span>
                      </div>

                      {isOpenSport ? (
                        <ChevronUp size={17} className="text-foreground/40" />
                      ) : (
                        <ChevronDown size={17} className="text-foreground/40" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isOpenSport && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-black/10 border-y border-border/5"
                        >
                          {teams.map((team) => (
                            <button
                              key={`${sport.id}-${team.division}-${team.gender}`}
                              onClick={() => {
                                onSelectTeam(sport.id, team.division, team.gender);
                                onClose();
                              }}
                              className="w-full pl-16 pr-6 py-3 text-left text-xs font-black uppercase tracking-[0.22em] text-foreground/45 hover:text-foreground hover:bg-[#5A1C2C]/10 transition-colors"
                            >
                              {team.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t border-border/5">
              <p className="text-xs font-bold text-foreground/50 tracking-widest">
                SPH LV EAGLES
              </p>
              <p className="text-[10px] text-foreground/30 tracking-wider">
                ATHLETICS DEPARTMENT
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
