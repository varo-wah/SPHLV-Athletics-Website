import * as React from 'react';
import { SportTab, DivisionTab, GenderTab } from '../types';
import { 
  BasketballIcon, 
  VolleyballIcon, 
  SoccerIcon, 
  BadmintonIcon, 
  TrackIcon
} from '../components/SportIcons';

interface TeamsScreenProps {
  onSelectTeam: (sport: SportTab, division: DivisionTab, gender: GenderTab) => void;
}

export default function TeamsScreen({ onSelectTeam }: TeamsScreenProps) {
  const sports: { id: SportTab; label: string; icon: React.FC<any>; hasSubDivisions: boolean }[] = [
    { id: 'Basketball', label: 'BASKETBALL', icon: BasketballIcon, hasSubDivisions: true },
    { id: 'Volleyball', label: 'VOLLEYBALL', icon: VolleyballIcon, hasSubDivisions: true },
    { id: 'Soccer', label: 'SOCCER', icon: SoccerIcon, hasSubDivisions: true },
    { id: 'Badminton', label: 'BADMINTON', icon: BadmintonIcon, hasSubDivisions: true },
    { id: 'TrackAndField', label: 'TRACK & FIELD', icon: TrackIcon, hasSubDivisions: false },
  ];

  return (
    <div className="pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen">
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-xl border-b border-border/10 px-6 pt-12 pb-4">
        <h1 className="text-3xl font-black tracking-tighter text-[#5A1C2C] uppercase font-serif italic">Teams List</h1>
        <p className="text-xs text-foreground/50 tracking-widest uppercase font-bold mt-1">SPH Eagles</p>
      </header>

      <div className="p-6 space-y-12">
        {sports.map((sport) => {
          const Icon = sport.icon;
          return (
            <div key={sport.id} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-[#5A1C2C]">
                  <Icon size={32} />
                </div>
                <h2 className="text-2xl font-black uppercase text-foreground tracking-tight">
                  {sport.label}
                </h2>
                <div className="flex-1 h-px bg-border/20"></div>
              </div>

              {sport.hasSubDivisions ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-[#5A1C2C] blur-xl opacity-30 rounded-full transition-opacity group-hover:opacity-50"></div>
                    <button
                      onClick={() => onSelectTeam(sport.id, 'SMP', 'Boys')}
                      className="relative w-full bg-[#5A1C2C] text-white px-5 py-3 rounded-full font-bold text-sm z-10 hover:scale-[1.02] active:scale-95 transition-all shadow-md flex items-center justify-center uppercase tracking-wide border border-white/20"
                    >
                      SMP Boys
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-[#5A1C2C] blur-xl opacity-30 rounded-full transition-opacity group-hover:opacity-50"></div>
                    <button
                      onClick={() => onSelectTeam(sport.id, 'SMP', 'Girls')}
                      className="relative w-full bg-[#5A1C2C] text-white px-5 py-3 rounded-full font-bold text-sm z-10 hover:scale-[1.02] active:scale-95 transition-all shadow-md flex items-center justify-center uppercase tracking-wide border border-white/20"
                    >
                      SMP Girls
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-[#5A1C2C] blur-xl opacity-30 rounded-full transition-opacity group-hover:opacity-50"></div>
                    <button
                      onClick={() => onSelectTeam(sport.id, 'SMA', 'Boys')}
                      className="relative w-full bg-[#5A1C2C] text-white px-5 py-3 rounded-full font-bold text-sm z-10 hover:scale-[1.02] active:scale-95 transition-all shadow-md flex items-center justify-center uppercase tracking-wide border border-white/20"
                    >
                      SMA Boys
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-[#5A1C2C] blur-xl opacity-30 rounded-full transition-opacity group-hover:opacity-50"></div>
                    <button
                      onClick={() => onSelectTeam(sport.id, 'SMA', 'Girls')}
                      className="relative w-full bg-[#5A1C2C] text-white px-5 py-3 rounded-full font-bold text-sm z-10 hover:scale-[1.02] active:scale-95 transition-all shadow-md flex items-center justify-center uppercase tracking-wide border border-white/20"
                    >
                      SMA Girls
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative group max-w-[200px]">
                  <div className="absolute -inset-2 bg-[#5A1C2C] blur-xl opacity-30 rounded-full transition-opacity group-hover:opacity-50"></div>
                  <button
                    onClick={() => onSelectTeam(sport.id, 'SMA', 'Combined')}
                    className="relative w-full bg-[#5A1C2C] text-white px-5 py-3 rounded-full font-bold text-sm z-10 hover:scale-[1.02] active:scale-95 transition-all shadow-md flex items-center justify-center uppercase tracking-wide border border-white/20"
                  >
                    SMA Combined
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
