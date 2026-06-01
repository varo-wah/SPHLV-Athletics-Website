import { SportTab, DivisionTab, GenderTab } from '../types';
import { Users, Info, Trophy, MapPin, Search, BarChart3, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TeamPageScreenProps {
  sport: SportTab;
  division: DivisionTab;
  gender: GenderTab;
  onNavigateToACSC?: () => void;
}

export default function TeamPageScreen({ sport, division, gender, onNavigateToACSC }: TeamPageScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const isCustomBanner = sport === 'Soccer' && division === 'Varsity' && gender === 'Boys';

  const defaultCarouselImages = [
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // blank transparent
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  ];

  const customCarouselImages = [
    'https://res.cloudinary.com/dpgt445lg/image/upload/v1780241030/Varsity_soccer_boys_teampic_2_dyv7mz.jpg',
    'https://res.cloudinary.com/dpgt445lg/image/upload/v1780241126/Varsity_boys_soccer_team_pic_resized_i1ezdp.jpg',
  ];

  const carouselImages = isCustomBanner ? customCarouselImages : defaultCarouselImages;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const sportLabels: Record<SportTab, string> = {
    Basketball: 'Basketball',
    Volleyball: 'Volleyball',
    Soccer: 'Soccer',
    Badminton: 'Badminton',
    TrackAndField: 'Track & Field',
    Swimming: 'Swimming',
  };

  const getHeroImage = () => {
    switch (sport) {
      case 'Basketball': return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80';
      case 'Soccer': return 'https://images.unsplash.com/photo-1518605368461-1e1296221f8c?auto=format&fit=crop&w=800&q=80';
      case 'Volleyball': return 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=800&q=80';
      case 'Badminton': return 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80';
      case 'Swimming': return 'https://images.unsplash.com/photo-1519315901367-f34f9274ceb3?auto=format&fit=crop&w=800&q=80';
      case 'TrackAndField': return 'https://images.unsplash.com/photo-1552674605-15c2145eba11?auto=format&fit=crop&w=800&q=80';
      default: return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80';
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 cursor-default">
      {/* Hero Header */}
      <div className="relative w-full border-b-[8px] border-[#5A1C2C] border-t-[8px]">
        <div className="aspect-[21/6] relative w-full overflow-hidden bg-black">
          {isCustomBanner ? (
            <img 
              src="https://res.cloudinary.com/dpgt445lg/image/upload/v1780125729/Varsity_boys_soccer_banner_mqpohw.png" 
              alt="Varsity Boys Soccer" 
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <img 
                src={getHeroImage()} 
                alt={`${division} ${gender} ${sportLabels[sport]}`} 
                className="w-full h-full object-cover blur-sm opacity-60 mix-blend-multiply"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h2 className="text-4xl md:text-5xl font-black text-center uppercase tracking-tighter" style={{
                   WebkitTextStroke: '2px rgba(255,255,255,0.8)',
                   color: '#5A1C2C',
                   textShadow: '0px 4px 10px rgba(0,0,0,0.5)'
                }}>
                  {division}<br />
                  {gender} {sportLabels[sport]}
                </h2>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-4 mt-8 space-y-12">
        <button 
           onClick={onNavigateToACSC}
           className="w-full bg-[#5A1C2C] text-white p-4 rounded-xl font-bold flex items-center justify-between hover:bg-[#431420] transition-colors shadow-md border border-[#431420]/50 group"
        >
           <div className="flex items-center gap-3">
              <Trophy className="text-yellow-400 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col items-start leading-none gap-1">
                 <span className="uppercase tracking-widest text-xs opacity-80">Tournament Results</span>
                 <span className="text-lg font-black tracking-tight drop-shadow-sm">View ACSC Live Results</span>
              </div>
           </div>
           <ChevronRight />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Team Standings */}
          <section className="space-y-4">
            <div className="flex justify-between items-center font-bold tracking-widest uppercase">
               <span className="text-sm text-foreground">League Standings</span>
               <span className="bg-foreground/[0.05] border border-border/10 px-3 py-1 rounded text-[10px] text-foreground/70">WEEK 12</span>
            </div>
            
            <div className="bg-subcard rounded-xl border border-border/10 overflow-hidden shadow-md">
               <div className="p-4 border-b border-border/10 flex justify-between items-center bg-foreground/[0.02]">
                  <div className="flex items-center gap-3">
                     <span className="font-serif italic font-black text-2xl px-2 py-1 bg-[#5A1C2C]/10 text-[#5A1C2C] rounded border border-[#5A1C2C]/20 tracking-tighter">
                        JAAC
                     </span>
                     <span className="font-serif italic text-xl text-foreground">
                        Standings
                     </span>
                  </div>
                  <BarChart3 size={24} className="text-foreground/40" />
               </div>
               
               {/* Table Header */}
               <div className="grid grid-cols-12 px-4 py-3 bg-[#5A1C2C]/5 border-b border-[#5A1C2C]/10 text-[#B5413F] text-[11px] font-black tracking-widest uppercase">
                  <div className="col-span-6">TEAM</div>
                  <div className="col-span-1 text-center">GP</div>
                  <div className="col-span-1 text-center">W</div>
                  <div className="col-span-1 text-center">L</div>
                  <div className="col-span-3 text-right">PCT</div>
               </div>

               {/* Table Body */}
               <div className="flex flex-col">
                  {[
                    { id: '01', team: 'SPH', gp: 12, w: 10, l: 2, pct: '.833' },
                    { id: '02', team: 'JIS', gp: 11, w: 8, l: 3, pct: '.727' },
                    { id: '03', team: 'BSJ', gp: 12, w: 7, l: 5, pct: '.583' },
                    { id: '04', team: 'ACS', gp: 12, w: 6, l: 6, pct: '.500' },
                    { id: '05', team: 'GJS', gp: 11, w: 3, l: 8, pct: '.272' },
                    { id: '06', team: 'AIS', gp: 11, w: 2, l: 9, pct: '.181' },
                    { id: '07', team: 'ACG', gp: 11, w: 1, l: 10, pct: '.091' },
                    { id: '08', team: 'STL', gp: 11, w: 0, l: 11, pct: '.000' },
                  ].map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 px-4 py-5 border-b border-border/5 items-center relative group">
                       {idx === 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B5413F]" />}
                       <div className="col-span-6 flex items-center gap-3">
                         <span className="font-mono text-sm font-bold text-foreground/50">{row.id}</span>
                         <span className="font-bold text-sm tracking-wide text-foreground uppercase pt-0.5 leading-tight w-24 sm:w-auto break-words">{row.team}</span>
                       </div>
                       <div className="col-span-1 text-center font-mono text-sm">{row.gp}</div>
                       <div className="col-span-1 text-center font-mono text-sm">{row.w}</div>
                       <div className="col-span-1 text-center font-mono text-sm">{row.l}</div>
                       <div className="col-span-3 text-right font-mono text-sm font-bold text-[#B5413F]">{row.pct}</div>
                    </div>
                  ))}
               </div>

               {/* Footer */}
               <div className="px-5 py-4 bg-foreground/[0.02] flex justify-between items-center">
                  <span className="italic text-foreground/40 text-xs font-serif">Last updated today 4:12 PM</span>
                  <span className="text-[#B5413F] font-bold text-[10px] tracking-widest uppercase flex items-center gap-1">
                     FULL TABLE <ChevronRight size={14} />
                  </span>
               </div>
            </div>
          </section>

          {/* Schedule & Results */}
          <section className="space-y-4">
            <h3 className="text-2xl font-black tracking-tight text-foreground uppercase italic border-l-4 border-[#5A1C2C] pl-3">
              Match Schedule
            </h3>
            <div className="space-y-3">
              {[
                { opponent: 'JIS', type: 'HOME', date: 'FRI, NOV 15', score: '2-0', win: true },
                { opponent: 'BSJ', type: 'AWAY', date: 'SAT, NOV 23', score: '1-1', win: null },
                { opponent: 'ISKL', type: 'AWAY', date: 'FRI, DEC 06', score: '0-1', win: false },
                { opponent: 'ACS', type: 'HOME', date: 'SAT, DEC 14', score: '3-0', win: true },
                { opponent: 'ACG', type: 'HOME', date: 'SAT, JAN 11', score: null, win: null },
              ].map((match, idx) => (
                <div key={idx} className="bg-subcard rounded-xl p-4 border border-border/10 shadow-sm flex items-center justify-between relative overflow-hidden group">
                  <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${match.win === true ? 'bg-green-500' : match.win === false ? 'bg-red-500' : match.score ? 'bg-yellow-500' : 'bg-border/20'}`} />
                  <div className="pl-3">
                    <p className="font-bold text-foreground text-[16px] uppercase tracking-wide flex items-center gap-2">
                      vs {match.opponent}
                      {match.score && (
                         <span className={`px-2 py-0.5 rounded textxs font-black tracking-widest ${match.win === true ? 'bg-green-500/10 text-green-600' : match.win === false ? 'bg-red-500/10 text-red-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                           {match.win === true ? 'W' : match.win === false ? 'L' : 'D'}
                         </span>
                      )}
                    </p>
                    <p className="text-xs text-[#5A1C2C] uppercase font-bold tracking-wider mt-1">
                      {match.type}
                    </p>
                  </div>
                  <div className="text-right text-foreground flex flex-col items-end">
                    {match.score ? (
                       <span className="font-black text-2xl tracking-tighter text-foreground">{match.score}</span>
                    ) : (
                       <>
                         <p className="text-sm font-bold mb-0.5 whitespace-nowrap">{match.date}</p>
                         <p className="text-xs font-mono opacity-70">16:00</p>
                       </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* JAAC Bracket using ACSC styling specs */}
        {isCustomBanner && (
          <section className="space-y-4">
             <div className="flex items-center justify-between border-b border-border/5 pb-2">
               <h3 className="text-lg font-black tracking-tight uppercase flex items-center gap-2">
                 <Trophy size={18} className="text-[#5A1C2C]" />
                 JAAC Tournament Bracket
               </h3>
             </div>
             <div className="bg-[#5A1C2C] rounded-2xl border border-[#5A1C2C]/50 shadow-xl overflow-hidden p-5">
                <div className="flex items-center justify-between text-white mb-4">
                  <p className="text-sm text-white/90 font-medium tracking-wide">
                    @BSJ - Final Round
                  </p>
                  <span className="text-xs uppercase tracking-widest font-bold opacity-80">2025</span>
                </div>
                <div className="bg-[#03142E] rounded-xl p-6 border-4 border-[#03142E] shadow-inner text-center">
                   <div className="text-center text-white mb-6">
                     <h4 className="text-2xl font-black uppercase tracking-tight mb-1 font-sans text-yellow-400 drop-shadow-md">JAAC CHAMPIONSHIP</h4>
                     <p className="text-sm font-bold uppercase tracking-widest opacity-80">Playoffs</p>
                   </div>
                   
                   <div className="flex flex-col gap-4 text-left">
                      <div className="bg-white/10 rounded-lg p-1 border border-white/10 relative overflow-hidden">
                         <div className="absolute top-0 bottom-0 left-0 w-2 bg-yellow-400" />
                         <div className="grid grid-cols-12 items-center">
                            <div className="col-span-8 p-3 flex flex-col gap-2">
                               <div className="flex justify-between items-center bg-white/10 px-3 py-1.5 rounded text-white font-bold text-sm">
                                  <span>SPH</span>
                                  <span className="font-black text-yellow-400">2</span>
                               </div>
                               <div className="flex justify-between items-center px-3 py-1.5 rounded text-white/60 text-sm font-medium">
                                  <span>BSJ</span>
                                  <span>0</span>
                               </div>
                            </div>
                            <div className="col-span-4 border-l border-white/10 h-full flex items-center justify-center bg-white/[0.02]">
                               <span className="font-black tracking-widest text-xs uppercase text-white/50 transform -rotate-90 md:rotate-0 whitespace-nowrap">FINAL</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-1 border border-white/5 relative">
                           <p className="text-[10px] text-white/40 uppercase font-black tracking-widest italic text-center mb-1 pt-1">SF 1</p>
                           <div className="flex flex-col gap-1 px-2 pb-2">
                              <div className="flex justify-between items-center bg-white/10 px-2 py-1 rounded text-white font-bold text-xs">
                                 <span>SPH</span><span>3</span>
                              </div>
                              <div className="flex justify-between items-center px-2 py-1 rounded text-white/60 text-xs font-medium">
                                 <span>JIS</span><span>1</span>
                              </div>
                           </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-1 border border-white/5 relative">
                           <p className="text-[10px] text-white/40 uppercase font-black tracking-widest italic text-center mb-1 pt-1">SF 2</p>
                           <div className="flex flex-col gap-1 px-2 pb-2">
                              <div className="flex justify-between items-center bg-white/10 px-2 py-1 rounded text-white font-bold text-xs">
                                 <span>BSJ</span><span>2</span>
                              </div>
                              <div className="flex justify-between items-center px-2 py-1 rounded text-white/60 text-xs font-medium">
                                 <span>ACS</span><span>0</span>
                              </div>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        )}

        {/* Team Photo */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/5 pb-2">
            <h3 className="text-lg font-black tracking-tight uppercase flex items-center gap-2">
              <Users size={18} className="text-[#5A1C2C]" />
              Team Photo
            </h3>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border/5 relative bg-foreground/10 aspect-[4/3]">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={carouselImages[currentImageIndex]}
                alt={`Team Photo ${currentImageIndex}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </AnimatePresence>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
              {carouselImages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'}`} 
                />
              ))}
            </div>
          </div>
        </section>

        {/* Player Roster */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/5 pb-2">
            <h3 className="text-lg font-black tracking-tight uppercase flex items-center gap-2">
              <Search size={18} className="text-[#5A1C2C]" />
              Players 2025-26
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {isCustomBanner ? (
              [
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780314657/729b06f6-c63a-4d58-bd8a-59dc421c34c9_sgb10l.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780314660/85e9e894-a666-41b1-8a62-cc23c91d5739_hs1d1a.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780314198/bff29ebb-3b20-46c5-b982-61e07cf9e5b1_zy4fdd.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780314197/b8e4ceee-cb88-425a-b4e5-e0534dad7b34_kgvglj.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780314177/c0b46a7a-328d-49c0-bd35-3d2a9f18474b_lidfgc.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313965/87727527-0b43-429d-b6cf-bca8b5e40242_fwt2v3.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313965/52b7153b-d6ec-499f-afb8-66d0a49cdd12_zfobkg.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313965/a73ad134-3a3b-44e5-8e9c-eb3eaa6d3b80_dqjmkh.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313965/c223e878-f9ed-44b1-8a2d-2a030c1ffaf1_czfwvj.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313965/33c86d0b-1408-4a93-9454-6a0340e55d85_zshgwq.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313964/3e92cad7-318a-4420-a4fc-78c2c18431aa_b0xgpz.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313963/4b3e6de7-7081-4085-850d-0d4c90aba1df_d7z0gp.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313963/9c57e7bd-7945-422c-b9a9-0019e35648a0_w0zfpl.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313962/1b739ec8-9f95-4512-9bfc-4e893388e447_yyhlsv.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286730/aa15e6aa-96ac-46e2-806f-5c377fc0016d_lzievt.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286729/932c02c4-239d-4156-b662-96913a2dda4f_kiblr9.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286729/82c8bc76-dd0c-4292-bcd4-766ed486cc89_cathhd.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286729/87b44f76-93a4-4913-b01b-d185a528194e_w1rsyr.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286729/b3f31b3a-07ec-4d02-97a9-68dfca7f9c73_uhdqzv.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286728/062fed6c-1f9e-4aa4-a066-a605d10eeb89_uv2win.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286727/cef8db89-1d57-46ea-b42e-0993d4d50858_zcywog.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286727/fc0d8979-a00f-4af2-93a7-544f756eda7f_izigrx.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286727/29405bbc-115f-4f62-b52b-e80296f83a9e_u6sono.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286726/c2cddcb4-00e2-4237-8947-e75257c20b4f_iohgtj.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286725/ec2d0470-a2af-4e6a-9bda-afd82356df72_ldi1hx.webp",
                "https://res.cloudinary.com/dpgt445lg/image/upload/v1780315354/85f6440e-79b5-4a1b-92d3-7e37513c5e18_l8xtxc.webp"
              ].map((src, idx) => (
                <div key={idx} className="aspect-square bg-foreground/10 relative overflow-hidden flex items-center justify-center">
                  <img 
                    src={src} 
                    alt={`Player ${idx + 1}`} 
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                </div>
              ))
            ) : (
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((player, idx) => (
                <div key={idx} className="aspect-square bg-foreground/10 relative overflow-hidden flex items-center justify-center">
                  <img 
                    src={`https://i.pravatar.cc/300?u=${idx + sport + gender + 'player'}`} 
                    alt={`Player ${idx + 1}`} 
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
