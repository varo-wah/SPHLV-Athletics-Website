import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft } from 'lucide-react';
import { GenderTab, SportTab, DivisionTab } from '../types';
import { 
  BasketballIcon, 
  VolleyballIcon, 
  SoccerIcon, 
  BadmintonIcon, 
  TrackIcon
} from './SportIcons';

interface TeamSelectionModalProps {
  sport: SportTab;
  onSelect: (division: DivisionTab, gender: GenderTab) => void;
  onClose: () => void;
}

export default function TeamSelectionModal({ sport, onSelect, onClose }: TeamSelectionModalProps) {
  const [selectedDivision, setSelectedDivision] = useState<DivisionTab | null>(null);

  const sportLabels: Record<SportTab, string> = {
    Basketball: 'Basketball',
    Volleyball: 'Volleyball',
    Soccer: 'Soccer',
    Badminton: 'Badminton',
    TrackAndField: 'Track & Field'
  };

  const getSportIcon = () => {
    switch (sport) {
      case 'Basketball': return <BasketballIcon size={32} />;
      case 'Volleyball': return <VolleyballIcon size={32} />;
      case 'Soccer': return <SoccerIcon size={32} />;
      case 'Badminton': return <BadmintonIcon size={32} />;
      case 'TrackAndField': return <TrackIcon size={32} />;
      default: return <BasketballIcon size={32} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-sm bg-card rounded-2xl overflow-hidden border border-[#5A1C2C]/30 shadow-2xl"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#5A1C2C] to-transparent" />
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              {selectedDivision && (
                <button 
                  onClick={() => setSelectedDivision(null)}
                  className="text-foreground/40 hover:text-foreground transition-colors p-1"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div>
                <p className="text-foreground/60 text-[10px] font-bold tracking-widest uppercase mb-1">
                  {selectedDivision ? 'Select Gender' : 'Select Division'}
                </p>
                <h3 className="text-xl font-black text-foreground tracking-widest uppercase">
                  {sportLabels[sport]}
                </h3>
              </div>
            </div>
            <button onClick={onClose} className="text-foreground/40 hover:text-foreground transition-colors p-1">
              <X size={20} />
            </button>
          </div>

          <div className="relative overflow-hidden min-h-[140px]">
            <AnimatePresence mode="wait">
              {!selectedDivision ? (
                <motion.div
                  key="division-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-2 gap-3 absolute inset-0"
                >
                  <button
                    onClick={() => setSelectedDivision('SMP')}
                    className="flex flex-col items-center justify-center p-6 bg-foreground/[0.02] border border-border/5 hover:border-[#5A1C2C]/50 hover:bg-[#5A1C2C]/10 rounded-xl transition-all group"
                  >
                    <span className="font-black tracking-tighter text-2xl text-foreground/80 group-hover:text-foreground uppercase mb-2 transition-all">
                      SMP
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-foreground/50 font-bold group-hover:text-foreground/80">
                      Middle School
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setSelectedDivision('SMA')}
                    className="flex flex-col items-center justify-center p-6 bg-foreground/[0.02] border border-border/5 hover:border-[#5A1C2C]/50 hover:bg-[#5A1C2C]/10 rounded-xl transition-all group"
                  >
                    <span className="font-black tracking-tighter text-2xl text-[#5A1C2C]/80 group-hover:text-[#5A1C2C] uppercase mb-2 transition-all">
                      SMA
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-foreground/50 font-bold group-hover:text-foreground/80">
                      High School / Varsity
                    </span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="gender-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-2 gap-3 absolute inset-0"
                >
                  {(sport === 'Badminton' || sport === 'TrackAndField') ? (
                    <button
                      onClick={() => onSelect(selectedDivision, 'Combined')}
                      className="col-span-2 flex flex-col items-center justify-center p-5 bg-foreground/[0.02] border border-border/5 hover:border-[#5A1C2C]/50 hover:bg-[#5A1C2C]/10 rounded-xl transition-all group"
                    >
                      <div className="mb-3 text-foreground/50 group-hover:text-[#5A1C2C] group-hover:scale-110 transition-all duration-300">
                        {getSportIcon()}
                      </div>
                      <span className="font-bold tracking-widest text-sm text-foreground/80 group-hover:text-foreground uppercase">
                        Combined
                      </span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => onSelect(selectedDivision, 'Boys')}
                        className="flex flex-col items-center justify-center p-5 bg-foreground/[0.02] border border-border/5 hover:border-[#5A1C2C]/50 hover:bg-[#5A1C2C]/10 rounded-xl transition-all group"
                      >
                        <div className="mb-3 text-foreground/50 group-hover:text-[#5A1C2C] group-hover:scale-110 transition-all duration-300">
                          {getSportIcon()}
                        </div>
                        <span className="font-bold tracking-widest text-sm text-foreground/80 group-hover:text-foreground uppercase">
                          Boys
                        </span>
                      </button>

                      <button
                        onClick={() => onSelect(selectedDivision, 'Girls')}
                        className="flex flex-col items-center justify-center p-5 bg-foreground/[0.02] border border-border/5 hover:border-[#5A1C2C]/50 hover:bg-[#5A1C2C]/10 rounded-xl transition-all group"
                      >
                        <div className="mb-3 text-foreground/50 group-hover:text-[#5A1C2C] group-hover:scale-110 transition-all duration-300">
                          {getSportIcon()}
                        </div>
                        <span className="font-bold tracking-widest text-sm text-foreground/80 group-hover:text-foreground uppercase">
                          Girls
                        </span>
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
