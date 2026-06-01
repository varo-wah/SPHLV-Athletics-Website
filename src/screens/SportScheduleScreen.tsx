import { GenderTab, SportTab } from '../types';
import { MapPin } from 'lucide-react';

interface Game {
  date: string;
  opponent: string;
  location: string;
  time: string;
  isHome: boolean;
}

const WEEKS = [
  {
    weekLabel: "THIS WEEK (NOV 12 - NOV 18)",
    games: [
      { date: "Fri, Nov 15", time: "7:00 PM", opponent: "JIS", location: "SPH Stadium", isHome: true },
      { date: "Sat, Nov 16", time: "10:30 AM", opponent: "BSJ", location: "BSJ Field", isHome: false }
    ]
  },
  {
    weekLabel: "NEXT WEEK (NOV 19 - NOV 25)",
    games: [
      { date: "Tue, Nov 19", time: "6:00 PM", opponent: "ACS", location: "SPH Stadium", isHome: true },
      { date: "Fri, Nov 22", time: "7:30 PM", opponent: "GJS", location: "GJS Arena", isHome: false }
    ]
  }
];

export default function SportScheduleScreen({ sport, gender, onSportChange }: { sport: SportTab, gender: GenderTab, onSportChange: (sport: SportTab) => void }) {
  const formatSportName = (s: SportTab) => {
    switch (s) {
      case 'TrackAndField': return 'Track & Field';
      default: return s;
    }
  };

  const SPORTS_LIST: SportTab[] = ['Basketball', 'Volleyball', 'Soccer', 'Badminton', 'TrackAndField', 'Swimming'];

  return (
    <div className="animate-in fade-in duration-500 pb-8 px-4 space-y-8 mt-4">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-foreground leading-[1] mb-6 tracking-tight uppercase px-2">
          Tournament Schedule
        </h2>
        
        {/* Sport selection pills */}
        <div className="flex overflow-x-auto gap-3 pb-4 px-2 -mx-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
          {SPORTS_LIST.map((s) => (
            <button
              key={s}
              onClick={() => onSportChange(s)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-[24px] font-bold text-sm tracking-wide transition-all ${
                sport === s
                  ? 'bg-transparent border-2 border-[#B5413F] text-foreground'
                  : 'bg-subcard border-2 border-border/10 text-foreground/50 hover:text-foreground/80'
              }`}
            >
              {formatSportName(s)}
            </button>
          ))}
        </div>
      </div>

      {sport === 'Soccer' && gender === 'Boys' ? (
        <div className="space-y-6">
          <div className="rounded-2xl overflow-hidden border border-border/5 relative bg-card shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1518605368461-1e1296221f8c?auto=format&fit=crop&w=600&q=80" 
              alt="Boys Soccer Banner" 
              className="w-full h-48 object-cover mix-blend-luminosity opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-shadow via-shadow/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 z-20 text-left">
              <span className="px-3 py-1 bg-[#B5413F] text-white text-[10px] font-bold tracking-widest uppercase rounded">VARSITY BOYS SOCCER</span>
              <h3 className="text-xl font-bold text-white mt-2 drop-shadow-md">SPH EAGLES</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#5A1C2C] to-[#5c0e2b] p-5 rounded-2xl flex flex-col items-start gap-4 border border-border/10 relative overflow-hidden">
              <div className="text-left">
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">NEXT MATCH</h3>
                <p className="text-[10px] text-white/60 tracking-widest mt-1">FRI, NOV 15 @ 7:00 PM</p>
                <p className="text-sm text-white font-bold mt-2">vs JIS</p>
              </div>
            </div>

            <div className="bg-subcard p-5 rounded-2xl flex flex-col items-start gap-4 border border-border/5 relative shadow-inner">
              <div className="text-left w-full absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-10 rounded-2xl"></div>
              <div className="relative z-10 text-left w-full">
                <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">TEAM NEWS</h3>
                <p className="text-[10px] text-foreground/40 tracking-widest mt-2 uppercase font-mono">UPDATED ROUND ROBIN</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        WEEKS.map((week, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="flex-1 h-px bg-foreground/10"></div>
               <p className="text-[10px] text-foreground/40 font-bold tracking-widest uppercase">
                 {week.weekLabel}
               </p>
               <div className="flex-1 h-px bg-foreground/10"></div>
            </div>
            
            <div className="space-y-3">
               {week.games.map((game, gIdx) => (
                 <div key={gIdx} className="bg-subcard rounded-xl p-4 border border-border/5 hover:border-border/20 transition-all group shadow-sm">
                   <div className="flex justify-between items-start mb-3 border-b border-border/5 pb-3">
                      <div>
                        <p className="font-bold text-foreground text-[15px] uppercase tracking-wide leading-tight">
                          vs {game.opponent}
                        </p>
                        <p className="text-xs text-foreground/40 uppercase font-bold tracking-wider mt-1">
                          {game.isHome ? 'HOME' : 'AWAY'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground mb-0.5">{game.date}</p>
                        <p className="text-xs font-mono text-foreground/60">{game.time}</p>
                      </div>
                   </div>
                   
                   <div className="flex gap-2 items-center text-[11px] text-foreground/50 font-bold tracking-widest uppercase">
                     <MapPin size={12} className="text-[#B5413F]" />
                     {game.location}
                   </div>
                 </div>
               ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
