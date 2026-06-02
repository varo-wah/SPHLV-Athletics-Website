import { SportTab, DivisionTab, GenderTab } from '../types';
import { Users, Search, Trophy, ChevronRight, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { SheetMatch } from '../services/parsers';

interface TeamPageScreenProps {
  sport: SportTab;
  division: DivisionTab;
  gender: GenderTab;
  onNavigateToACSC?: () => void;
  athleticsDataState?: AthleticsDataState;
}

export default function TeamPageScreen({
  sport,
  division,
  gender,
  onNavigateToACSC,
  athleticsDataState,
}: TeamPageScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isCustomBanner = sport === 'Soccer' && division === 'SMA' && gender === 'Boys';

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
  }, [carouselImages.length]);

  const sportLabels: Record<SportTab, string> = {
    Basketball: 'Basketball',
    Volleyball: 'Volleyball',
    Soccer: 'Soccer',
    Badminton: 'Badminton',
    TrackAndField: 'Track & Field',
  };

  const getHeroImage = () => {
    switch (sport) {
      case 'Basketball':
        return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80';
      case 'Soccer':
        return 'https://images.unsplash.com/photo-1518605368461-1e1296221f8c?auto=format&fit=crop&w=800&q=80';
      case 'Volleyball':
        return 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=800&q=80';
      case 'Badminton':
        return 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80';
      case 'TrackAndField':
        return 'https://images.unsplash.com/photo-1552674605-15c2145eba11?auto=format&fit=crop&w=800&q=80';
      default:
        return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80';
    }
  };

  const displayDivision = division === 'SMA' ? 'SMA / Varsity' : 'SMP';

  const currentStandings = (athleticsDataState?.data?.soccerStandings || []).filter((standing) => {
    return (
      standing.sportKey === sport &&
      standing.level === division &&
      standing.genderGroup === gender
    );
  });

  const currentMatches = (athleticsDataState?.data?.soccerMatches || []).filter((match) => {
    return (
      match.sportKey === sport &&
      match.level === division &&
      match.genderGroup === gender
    );
  });

  const upcomingMatches = currentMatches.filter((match) => match.status !== 'Finished');
  const finishedMatches = currentMatches.filter((match) => match.status === 'Finished');

  const formatScore = (match: SheetMatch) => {
    if (match.scoreFor === null || match.scoreAgainst === null) {
      return '-';
    }
    return `${match.scoreFor}–${match.scoreAgainst}`;
  };

  const resultColor = (result: string) => {
    if (result === 'W') return 'text-green-400';
    if (result === 'L') return 'text-red-400';
    if (result === 'D') return 'text-yellow-300';
    return 'text-foreground/40';
  };

  const resultBadgeClass = (result: string) => {
    if (result === 'W') return 'bg-green-500/15 text-green-400 border-green-500/20';
    if (result === 'L') return 'bg-red-500/15 text-red-400 border-red-500/20';
    if (result === 'D') return 'bg-yellow-400/15 text-yellow-300 border-yellow-400/20';
    return 'bg-[#BFD7EA]/10 text-[#BFD7EA] border-[#BFD7EA]/20';
  };

  const matchAccentClass = (match: SheetMatch) => {
    if (match.result === 'W') return 'border-l-green-500';
    if (match.result === 'L') return 'border-l-red-500';
    if (match.result === 'D') return 'border-l-yellow-400';
    return 'border-l-[#BFD7EA]/40';
  };

  const matchLocationText = (match: SheetMatch) => {
    return (match.locationType || 'TBD').toUpperCase();
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
                  {displayDivision}<br />
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
           className="w-full bg-gradient-to-r from-[#5A1C2C] via-[#7A001F] to-[#3A101B] text-white p-4 rounded-2xl font-bold flex items-center justify-between hover:brightness-110 transition-all shadow-[0_18px_45px_rgba(90,28,44,0.35)] border border-[#BFD7EA]/10 group overflow-hidden relative"
        >
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(191,215,234,0.18),transparent_35%)] pointer-events-none" />

           <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                 <Trophy className="text-yellow-300 group-hover:scale-110 transition-transform" />
              </div>

              <div className="flex flex-col items-start leading-none gap-1">
                 <span className="uppercase tracking-[0.22em] text-[10px] opacity-75">
                    ACSC Results
                 </span>
                 <span className="text-lg font-black tracking-tight drop-shadow-sm">
                    View ACSC Results
                 </span>
              </div>
           </div>

           <ChevronRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-[0.22em] text-foreground leading-tight">
              League<br />Standings
            </h2>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-end">
            {(athleticsDataState?.loading || athleticsDataState?.refreshing) && (
              <span className="text-[10px] font-black lowercase tracking-[0.18em] text-[#B5413F] animate-pulse">
                syncing...
              </span>
            )}

            {athleticsDataState?.lastUpdated && (
              <span className="hidden sm:inline text-[10px] font-mono text-foreground/35">
                {athleticsDataState.lastUpdated}
              </span>
            )}

            <button
              type="button"
              onClick={() => athleticsDataState?.refresh()}
              className="shrink-0 rounded-lg border border-border/10 bg-subcard px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/65 hover:border-[#B5413F]/40 hover:text-foreground transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* STANDINGS COLUMN */}
          <section className="space-y-4">
            <div className="bg-subcard rounded-2xl border border-border/10 overflow-hidden shadow-md">

               
               {/* Table Header */}
               <div className="grid grid-cols-12 px-4 py-3 bg-[#5A1C2C]/5 border-b border-[#5A1C2C]/10 text-[#B5413F] text-[11px] font-black tracking-widest uppercase">
                  <div className="col-span-1">RK</div>
                  <div className="col-span-5">TEAM</div>
                  <div className="col-span-1 text-center">GP</div>
                  <div className="col-span-1 text-center">W</div>
                  <div className="col-span-1 text-center">D</div>
                  <div className="col-span-1 text-center">L</div>
                  <div className="col-span-2 text-right">PTS</div>
               </div>

               {/* Table Body */}
               <div className="flex flex-col">
                  {athleticsDataState?.loading && currentStandings.length === 0 ? (
                    <div className="p-6 text-center text-xs font-medium text-foreground/40 animate-pulse">
                      Fetching live standings from Google Sheets...
                    </div>
                  ) : athleticsDataState?.error ? (
                    <div className="p-6 text-center text-xs font-semibold text-red-500 bg-red-500/5">
                      Failed to load. {athleticsDataState.error}
                    </div>
                  ) : currentStandings.length === 0 ? (
                    <div className="p-8 text-center text-xs font-medium text-foreground/40 space-y-2">
                      <p className="font-bold text-foreground/60">Standings will appear once uploaded</p>
                      <p>
                        No standings matches for {sportLabels[sport]} · {displayDivision} · {gender}.
                      </p>
                    </div>
                  ) : (
                    currentStandings.map((row, idx) => {
                      const wins = row.wins ?? 0;
                      const draws = row.draws ?? 0;
                      const losses = row.losses ?? 0;
                      const gp = wins + draws + losses;
                      const pts = row.points ?? ((wins * 3) + draws);
                      const rank = row.rank !== null ? String(row.rank) : String(idx + 1);

                      return (
                        <div key={row.id || idx} className="grid grid-cols-12 px-4 py-4 border-b border-border/5 items-center relative group">
                          {idx === 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B5413F]" />}
                          <div className="col-span-1">
                            <span className="font-mono text-xs font-bold text-foreground/50">{rank}</span>
                          </div>
                          <div className="col-span-5 flex items-center pr-1">
                            <span className="font-bold text-sm tracking-wide text-foreground uppercase pt-0.5 leading-tight break-words">{row.team}</span>
                          </div>
                          <div className="col-span-1 text-center font-mono text-xs">{gp}</div>
                          <div className="col-span-1 text-center font-mono text-xs">{wins}</div>
                          <div className="col-span-1 text-center font-mono text-xs">{draws}</div>
                          <div className="col-span-1 text-center font-mono text-xs">{losses}</div>
                          <div className="col-span-2 text-right font-mono text-sm font-bold text-[#B5413F]">{pts}</div>
                        </div>
                      );
                    })
                  )}
               </div>

               {/* Footer */}
               <div className="px-5 py-4 bg-foreground/[0.02] flex justify-between items-center text-[10px] text-foreground/40 font-mono">
                  <span>Google Sheets Synced</span>
                  <span>Live Data</span>
               </div>
            </div>
          </section>

          {/* UPCOMING MATCHES COLUMN */}
          <section className="space-y-4">
            <h3 className="text-3xl font-black tracking-tight text-foreground uppercase italic border-l-4 border-[#5A1C2C] pl-5">
              Upcoming Matches
            </h3>

            <div className="space-y-4">
              {athleticsDataState?.loading && upcomingMatches.length === 0 ? (
                <div className="bg-subcard rounded-2xl p-8 border border-border/10 text-center animate-pulse">
                  <p className="text-sm font-black uppercase tracking-widest text-foreground/50">
                    Loading matches from Google Sheets...
                  </p>
                </div>
              ) : athleticsDataState?.error ? (
                <div className="bg-subcard rounded-2xl p-8 border border-red-500/20 text-center">
                  <p className="text-sm font-black uppercase tracking-widest text-red-400">
                    Match sync error
                  </p>
                  <p className="text-xs text-foreground/40 mt-2">
                    {athleticsDataState.error}
                  </p>
                </div>
              ) : upcomingMatches.length === 0 ? (
                <div className="bg-subcard rounded-2xl p-8 border border-border/10 text-center bg-[#5A1C2C]/5">
                  <p className="text-sm font-black uppercase tracking-widest text-foreground/70">
                    No upcoming matches
                  </p>
                  <p className="text-xs text-foreground/40 mt-2">
                    Upcoming matches will appear when the sheet status is not Finished.
                  </p>
                </div>
              ) : (
                upcomingMatches.map((match) => (
                  <div
                    key={match.id}
                    className={`relative bg-subcard rounded-2xl p-5 border border-border/10 border-l-[6px] ${matchAccentClass(match)} shadow-md overflow-hidden`}
                  >
                    <div className="flex items-center justify-between gap-5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xl font-black tracking-wide text-foreground uppercase">
                            VS {match.opponent || 'TBD'}
                          </h4>

                          <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-widest border ${resultBadgeClass(match.result)}`}>
                            {match.result || match.status}
                          </span>
                        </div>

                        <p className="mt-3 text-xs font-black uppercase tracking-[0.22em] text-[#B5413F]">
                          {matchLocationText(match)}
                        </p>

                        {(match.date || match.time || match.venue) && (
                          <p className="mt-2 text-xs text-foreground/45">
                            {match.date || 'Date TBD'} {match.time ? `· ${match.time}` : ''} {match.venue ? `· ${match.venue}` : ''}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-black uppercase tracking-widest text-foreground">
                          {match.date || 'TBD'}
                        </p>
                        <p className="text-xs text-foreground/45 mt-1">
                          {match.time || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* MATCH RESULTS SECTION */}
        <section className="space-y-4 mt-10">
          <h3 className="text-3xl font-black tracking-tight text-foreground uppercase italic border-l-4 border-[#5A1C2C] pl-5">
            Match Results
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {athleticsDataState?.loading && finishedMatches.length === 0 ? (
              <div className="bg-subcard rounded-2xl p-8 border border-border/10 text-center animate-pulse lg:col-span-2">
                <p className="text-sm font-black uppercase tracking-widest text-foreground/50">
                  Loading results from Google Sheets...
                </p>
              </div>
            ) : finishedMatches.length === 0 ? (
              <div className="bg-subcard rounded-2xl p-8 border border-border/10 text-center bg-[#5A1C2C]/5 lg:col-span-2">
                <p className="text-sm font-black uppercase tracking-widest text-foreground/70">
                  No match results yet
                </p>
                <p className="text-xs text-foreground/40 mt-2">
                  Finished matches will appear here after scores are entered.
                </p>
              </div>
            ) : (
              finishedMatches.map((match) => (
                <div
                  key={match.id}
                  className={`relative bg-subcard rounded-2xl p-5 border border-border/10 border-l-[6px] ${matchAccentClass(match)} shadow-md overflow-hidden`}
                >
                  <div className="flex items-center justify-between gap-5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xl font-black tracking-wide text-foreground uppercase">
                          VS {match.opponent || 'TBD'}
                        </h4>

                        <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-widest border ${resultBadgeClass(match.result)}`}>
                          {match.result || match.status}
                        </span>
                      </div>

                      <p className="mt-3 text-xs font-black uppercase tracking-[0.22em] text-[#B5413F]">
                        {matchLocationText(match)}
                      </p>

                      {(match.date || match.time || match.venue) && (
                        <p className="mt-2 text-xs text-foreground/45">
                          {match.date || 'Date TBD'} {match.time ? `· ${match.time}` : ''} {match.venue ? `· ${match.venue}` : ''}
                        </p>
                      )}

                      {match.notes && (
                        <p className="text-xs text-foreground/40 mt-2 italic bg-foreground/[0.02] p-2 rounded border border-border/5">
                          {match.notes}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      {match.scoreFor !== null && match.scoreAgainst !== null ? (
                        <p className="text-4xl font-black tracking-tight text-foreground">
                          {formatScore(match)}
                        </p>
                      ) : (
                        <p className="text-lg font-black text-foreground/40">
                          —
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* JAAC Bracket */}
        {sport === 'Soccer' && division === 'SMA' && gender === 'Boys' && (
          <section className="space-y-4 mt-10">
            <div className="flex items-center justify-between border-b border-border/5 pb-2">
              <h3 className="text-2xl font-black tracking-tight text-foreground uppercase italic border-l-4 border-[#5A1C2C] pl-3">
                JAAC Bracket
              </h3>

              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-foreground/35">
                Semifinals & Final
              </span>
            </div>

            <div className="bg-[#5A1C2C] rounded-2xl p-4 border border-[#BFD7EA]/10 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60">
                  @BSJ · Final Round
                </p>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60">
                  2025
                </p>
              </div>

              <div className="bg-[#061126] rounded-xl p-5 border border-white/5">
                <div className="text-center mb-5">
                  <h4 className="text-lg font-black uppercase tracking-[0.18em] text-yellow-300">
                    JAAC Championship
                  </h4>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/50 mt-1">
                    Playoffs
                  </p>
                </div>

                {/* Final */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center mb-5">
                  <div className="rounded-lg overflow-hidden border border-white/10 border-l-4 border-l-yellow-400 bg-white/5">
                    <div className="grid grid-cols-[1fr_48px] border-b border-white/5">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white/55">
                        SPH
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-white/55">
                        0
                      </div>
                    </div>

                    <div className="grid grid-cols-[1fr_48px] bg-white/10">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white">
                        BSJ
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-yellow-300">
                        2
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white/5 border border-white/10 min-h-[72px] flex items-center justify-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                      Final
                    </p>
                  </div>
                </div>

                {/* Semifinals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                    <div className="px-3 py-2 border-b border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        Semifinals 1
                      </p>
                    </div>

                    <div className="grid grid-cols-[1fr_48px] bg-white/10">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white">
                        SPH
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-white">
                        3
                      </div>
                    </div>

                    <div className="grid grid-cols-[1fr_48px] border-t border-white/5">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white/55">
                        JIS
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-white/55">
                        1
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                    <div className="px-3 py-2 border-b border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        Semifinals 2
                      </p>
                    </div>

                    <div className="grid grid-cols-[1fr_48px] bg-white/10">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white">
                        BSJ
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-white">
                        2
                      </div>
                    </div>

                    <div className="grid grid-cols-[1fr_48px] border-t border-white/5">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white/55">
                        ACS
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-white/55">
                        0
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
