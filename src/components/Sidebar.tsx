import * as React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SportTab } from '../types';
import { 
  BasketballIcon, 
  VolleyballIcon, 
  SoccerIcon, 
  BadmintonIcon, 
  TrackIcon, 
  SwimmingIcon 
} from './SportIcons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSport: (sport: SportTab) => void;
}

export default function Sidebar({ isOpen, onClose, onSelectSport }: SidebarProps) {
  const sports: { id: SportTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'Basketball', label: 'BASKETBALL', icon: BasketballIcon },
    { id: 'Volleyball', label: 'VOLLEYBALL', icon: VolleyballIcon },
    { id: 'Soccer', label: 'SOCCER', icon: SoccerIcon },
    { id: 'Badminton', label: 'BADMINTON', icon: BadmintonIcon },
    { id: 'TrackAndField', label: 'TRACK & FIELD', icon: TrackIcon },
    { id: 'Swimming', label: 'SWIMMING', icon: SwimmingIcon },
  ];

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
            className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-card border-r border-[#5A1C2C]/20 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/5">
              <span className="text-foreground font-black tracking-widest text-lg">SPORTS</span>
              <button onClick={onClose} className="text-foreground/50 hover:text-foreground transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 py-4">
              {sports.map((sport) => {
                const Icon = sport.icon;
                return (
                  <button
                    key={sport.id}
                    onClick={() => onSelectSport(sport.id)}
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[#5A1C2C]/10 text-foreground/70 hover:text-foreground transition-colors border-l-2 border-transparent hover:border-border/40"
                  >
                    <Icon size={20} className="text-foreground/60" />
                    <span className="font-bold tracking-wider text-sm">{sport.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="p-6 border-t border-border/5">
              <img 
                src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=200&auto=format&fit=crop" 
                alt="Eagles Mascot" 
                className="w-12 h-12 rounded-full border-2 border-[#5A1C2C] object-cover mb-4"
              />
              <p className="text-xs font-bold text-foreground/50 tracking-widest">SPH LV EAGLES</p>
              <p className="text-[10px] text-foreground/30 tracking-wider">ATHLETICS DEPARTMENT</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
