import { Trophy } from 'lucide-react';
import type { SportTab, GenderTab } from '../types';

export default function AcscScreen({ sport = 'Soccer', gender = 'Boys' }: { sport?: SportTab, gender?: GenderTab }) {
  const sportName = `${gender} ${sport}`;

  return (
    <div className="animate-in fade-in duration-500 pb-8 px-4 space-y-4 mt-4">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-card border border-border/5 pt-12 pb-8 px-6 text-center shadow-lg mb-8">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay" style={{backgroundImage: "url('https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1600&auto=format&fit=crop')"}}></div>
        <div className="absolute inset-x-0 h-full top-0 bg-gradient-to-r from-[#17203E]/80 via-[#221021]/80 to-[#5B0F2B]/80 z-0" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center p-2 border-2 border-white/20 mb-4 shadow-2xl">
            <img src="https://res.cloudinary.com/dpgt445lg/image/upload/v1775195245/x_-_ACSC_Logo_-_HighRes_2022_version_-_Copy_zcjujj.png" alt="ACSC Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-black text-white leading-tight tracking-[0.2em] uppercase max-w-[200px] mb-2 drop-shadow-md">
            ASIA CHRISTIAN SCHOOLS CONFERENCE
          </h2>
          <div className="mt-4 px-4 py-1.5 bg-[#B5413F] text-white font-bold uppercase tracking-widest text-sm rounded-full shadow-md">
            {sportName}
          </div>
        </div>
      </div>

      {sportName === 'Boys Soccer' && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="bg-[#B5413F] rounded-2xl border border-[#B5413F]/50 shadow-xl overflow-hidden pb-5 px-5 pt-5">
            <div className="flex items-center justify-between text-white mb-4">
              <p className="text-sm text-white/90 font-medium tracking-wide">
                @Yongsan International School of Seoul - 4th Place
              </p>
              <span className="text-xs uppercase tracking-widest font-bold opacity-80">2025</span>
            </div>
            <div className="bg-[#042838] rounded-xl p-4 border border-[#042838] shadow-inner text-center mb-6">
              <div className="flex flex-col gap-3">
                <img src="https://res.cloudinary.com/dpgt445lg/image/upload/v1780321980/1a880821-9740-4ec0-a820-89ba3a958a20_zmtlxx.webp" alt="Pool Standings 1" className="w-full rounded-lg" />
                <img src="https://res.cloudinary.com/dpgt445lg/image/upload/v1780321982/bc6501b8-5fc1-4b0a-849c-48fe873182a1_mwootu.webp" alt="Pool Standings 2" className="w-full rounded-lg" />
              </div>
            </div>

            <div className="text-center text-white mb-4">
              <h4 className="text-lg font-black uppercase tracking-widest border-b border-white/10 pb-2 inline-block">
                All-Tournament Awards
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/10 border border-white/20 rounded-xl p-4 shadow-sm flex flex-col justify-center items-center h-28 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8ED4D6]/10 to-transparent pointer-events-none" />
                  <Trophy size={24} className="text-[#8ED4D6] opacity-50 absolute right-[-10px] bottom-[-10px] w-16 h-16" />
                  <div className="relative z-10 text-center">
                     <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase mb-1 block">ALL-TOURNAMENT</span>
                     <div className="font-black text-white text-lg uppercase tracking-wide">DAVID YI</div>
                  </div>
               </div>
               <div className="bg-white/10 border border-white/20 rounded-xl p-4 shadow-sm flex flex-col justify-center items-center h-28 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#EAB308]/10 to-transparent pointer-events-none" />
                  <Trophy size={24} className="text-[#EAB308] opacity-50 absolute right-[-10px] bottom-[-10px] w-16 h-16" />
                  <div className="relative z-10 text-center">
                     <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase mb-1 block">ALL-TOURNAMENT</span>
                     <div className="font-black text-white text-lg uppercase tracking-wide">HYOIN KIM</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {sportName === 'Girls Volleyball' && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="bg-[#B5413F] rounded-2xl border border-[#B5413F]/50 shadow-xl overflow-hidden pb-5 px-5 pt-5">
            <div className="flex items-center justify-between text-white mb-4">
              <p className="text-sm text-white/90 font-medium tracking-wide">
                @Grace International School - 5th Place
              </p>
              <span className="text-xs uppercase tracking-widest font-bold opacity-80">2025</span>
            </div>
            <div className="bg-[#03142E] p-5 rounded-xl border-4 border-[#03142E] shadow-inner">
               <div className="text-center text-white mb-6">
                 <h4 className="text-2xl font-black uppercase tracking-tight mb-1 font-sans">ACSC Girls Volleyball</h4>
                 <p className="text-sm font-bold uppercase tracking-widest opacity-80">Round Robin</p>
               </div>
               <div className="bg-white p-1 rounded-xl overflow-hidden">
                 <div className="grid grid-cols-2 gap-[1px] bg-slate-200">
                   <div className="bg-slate-50 p-3 text-center">
                     <span className="font-bold uppercase text-xs text-slate-800">ICS-BK</span>
                     <p className="text-xs font-mono text-slate-500 mt-1">4 Wins</p>
                   </div>
                   <div className="bg-slate-50 p-3 text-center">
                     <span className="font-bold uppercase text-xs text-slate-800">SPH</span>
                     <p className="text-xs font-mono text-slate-500 mt-1">2 Wins</p>
                   </div>
                   <div className="bg-slate-50 p-3 text-center">
                     <span className="font-bold uppercase text-xs text-slate-800">MAC</span>
                     <p className="text-xs font-mono text-slate-500 mt-1">7 Wins</p>
                   </div>
                   <div className="bg-slate-50 p-3 text-center">
                     <span className="font-bold uppercase text-xs text-slate-800">GIS</span>
                     <p className="text-xs font-mono text-slate-500 mt-1">0 Wins</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {sportName === 'Boys Volleyball' && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="bg-[#B5413F] rounded-2xl border border-[#B5413F]/50 shadow-xl overflow-hidden pb-5 px-5 pt-5">
            <div className="flex items-center justify-between text-white mb-4">
              <p className="text-sm text-white/90 font-medium tracking-wide">
                @Dalat International School - 6th Place
              </p>
              <span className="text-xs uppercase tracking-widest font-bold opacity-80">2025</span>
            </div>
            <div className="bg-[#1D1E62] p-5 rounded-xl border border-white/10 shadow-inner">
               <div className="text-center text-white mb-6">
                 <h4 className="text-3xl font-black italic tracking-tighter mb-1 text-yellow-400 drop-shadow-md">
                   2025 ACSC <span className="text-[#8ED4D6]">BOYS VOLLEYBALL</span> TOURNAMENT
                 </h4>
                 <p className="text-sm font-bold uppercase tracking-widest opacity-90 mt-2">Round Robin Standings</p>
               </div>
               
               <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden text-left">
                  <div className="grid grid-cols-4 bg-white/10 text-[10px] uppercase tracking-widest font-bold p-2 text-white/70">
                    <div className="col-span-2">Team</div>
                    <div className="text-center bg-yellow-400/20 text-yellow-400 rounded px-1">Win</div>
                    <div className="text-center bg-blue-400/20 text-blue-300 rounded px-1 ml-1">Loss</div>
                  </div>
                  <div className="grid grid-cols-4 text-sm font-bold text-white p-3 border-b border-white/5">
                    <div className="col-span-2 uppercase">Dalat</div>
                    <div className="text-center font-mono">6</div>
                    <div className="text-center font-mono text-white/70">1</div>
                  </div>
                  <div className="grid grid-cols-4 text-sm font-bold text-white p-3 border-b border-white/5">
                    <div className="col-span-2 uppercase">Grace</div>
                    <div className="text-center font-mono">6</div>
                    <div className="text-center font-mono text-white/70">1</div>
                  </div>
                  <div className="grid grid-cols-4 text-sm font-bold text-white p-3 border-b border-white/5">
                    <div className="col-span-2 uppercase">ICS-BKK</div>
                    <div className="text-center font-mono">6</div>
                    <div className="text-center font-mono text-white/70">1</div>
                  </div>
                  <div className="grid grid-cols-4 text-sm font-bold text-white p-3">
                    <div className="col-span-2 uppercase">Faith</div>
                    <div className="text-center font-mono">1</div>
                    <div className="text-center font-mono text-white/70">6</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {sportName === 'Boys Basketball' && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="bg-[#B5413F] rounded-2xl border border-[#B5413F]/50 shadow-xl overflow-hidden pb-5 px-5 pt-5">
            <div className="flex items-center justify-between text-white mb-4">
              <p className="text-sm text-white/90 font-medium tracking-wide">
                @Morrison Academy-Taichung - 2nd Place
              </p>
              <span className="text-xs uppercase tracking-widest font-bold opacity-80">2026</span>
            </div>
            
            <div className="bg-[#121212] p-5 rounded-xl border border-white/5 relative overflow-hidden shadow-inner">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/20 blur-3xl rounded-full mix-blend-screen pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/10 blur-3xl rounded-full mix-blend-screen pointer-events-none" />
               
               <div className="flex flex-col items-center justify-center text-center text-white relative z-10">
                 <div className="inline-block bg-[#8B5CF6] text-white px-4 py-1 skew-x-[-10deg] font-black italic text-2xl tracking-widest mb-3">
                   <div className="skew-x-[10deg]">2026</div>
                 </div>
                 <h4 className="text-4xl font-black italic tracking-tighter text-yellow-400 uppercase leading-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                   Pool <span className="text-white">Standings</span>
                 </h4>
               </div>
               
               <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
                 <div className="bg-white/5 rounded-lg p-3 text-center border border-yellow-400/20">
                   <h5 className="font-black italic text-yellow-400 uppercase tracking-widest text-lg mb-2">Pool A</h5>
                   <div className="space-y-1 text-sm font-bold text-white/80">
                     <div>ICS-HK</div>
                     <div>MAC</div>
                     <div>GIS</div>
                   </div>
                 </div>
                 <div className="bg-white/5 rounded-lg p-3 text-center border border-yellow-400/20">
                   <h5 className="font-black italic text-yellow-400 uppercase tracking-widest text-lg mb-2">Pool B</h5>
                   <div className="space-y-1 text-sm font-bold text-white/80">
                     <div>SPH</div>
                     <div>Faith</div>
                     <div>Dalat</div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {sportName === 'Girls Soccer' && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="bg-[#B5413F] rounded-2xl border border-[#B5413F]/50 shadow-xl overflow-hidden pb-5 px-5 pt-5">
            <div className="flex items-center justify-between text-white mb-4">
              <p className="text-sm text-white/90 font-medium tracking-wide">
                @SPH - Jakarta, Indonesia
              </p>
              <span className="text-xs uppercase tracking-widest font-bold opacity-80">2026</span>
            </div>
            
            <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-6 rounded-xl border border-white/10 shadow-inner flex flex-col items-center justify-center text-center">
               <h4 className="text-3xl font-black tracking-tight text-white uppercase drop-shadow-lg leading-tight mb-2">
                 Match Results
               </h4>
               <p className="text-xs text-white/70">
                 Live results, standings, and completed matches from connected sheets.
               </p>
               
               <div className="w-full bg-white/5 rounded-xl border border-white/10 mt-6 p-4">
                 <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Host School</p>
                 <div className="flex items-center justify-center gap-3 text-white font-bold text-lg">
                   <span>SPH Eagles</span>
                   <span className="px-2 py-0.5 bg-[#B5413F] text-xs rounded-full">HOST</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback for sports that don't have tournament data yet */}
      {!['Boys Soccer', 'Girls Volleyball', 'Boys Volleyball', 'Boys Basketball', 'Girls Soccer'].includes(sportName) && (
        <div className="bg-card border border-border/5 rounded-2xl p-8 text-center shadow-lg">
          <Trophy size={48} className="mx-auto text-foreground/20 mb-4" />
          <h3 className="text-xl font-bold tracking-tight text-foreground/50 uppercase">Match Results Pending</h3>
          <p className="text-sm text-foreground/40 mt-2">Data for the {sportName} ACSC tournament is not available at the moment.</p>
        </div>
      )}

    </div>
  );
}
