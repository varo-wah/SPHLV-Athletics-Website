import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { Team, Player } from '../types';
import { useEffect, useLayoutEffect, useRef } from 'react';

interface TeamDetailScreenProps {
  team: Team;
  onClose: () => void;
}

function createPlaceholderRoster(count = 10): Player[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `placeholder-${index + 1}`,
    name: '—',
    grade: '—',
    jersey: '—',
    position: '—',
  }));
}

export default function TeamDetailScreen({ team, onClose }: TeamDetailScreenProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const roster = team.roster && team.roster.length > 0
    ? team.roster
    : createPlaceholderRoster(10);

  useLayoutEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTop = 0;

    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    });

    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    }, 50);
  }, [team.id]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        className="absolute inset-0 z-30 bg-black/80"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 28, rotateX: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-3 top-24 bottom-6 z-40"
        style={{ transformOrigin: 'top center', perspective: 1200 }}
      >
        <div className="h-full rounded-[32px] border border-[#5a3a45] bg-[#2a1f24] shadow-[0_28px_100px_rgba(0,0,0,0.55)] overflow-hidden flex flex-col">
          <div className="px-5 pt-5 pb-4 border-b border-border/8 bg-gradient-to-r from-pink-500/10 to-transparent">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-full bg-foreground/6 border border-border/10 flex items-center justify-center p-3 shadow-inner shadow-white/5 shrink-0">
                  <div className={`w-full h-full rounded-full flex items-center justify-center ${team.id === 'fa' ? 'bg-foreground p-1' : ''}`}>
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-pink-300/80 mb-1">
                    Team Lineup
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground leading-tight truncate">
                    {team.name}
                  </h1>
                  {team.country && (
                    <p className="text-sm text-foreground/45 uppercase tracking-wider mt-1">
                      {team.country}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-foreground/6 border border-border/10 flex items-center justify-center text-foreground/70 hover:text-foreground hover:border-pink-400/20 hover:bg-foreground/10 transition-all shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div key={team.id} ref={scrollRef} className="flex-1 overflow-auto p-5 space-y-5">
            {team.rosterImage && (
              <section className="rounded-[24px] border border-border/8 overflow-hidden bg-[#241b1f]">
                <img
                  src={team.rosterImage}
                  alt={`${team.name} roster`}
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </section>
            )}

            <section className="rounded-[24px] border border-border/8 overflow-hidden bg-[#241b1f]">
              <div className="px-5 py-4 border-b border-border/8 bg-[#31252b]">
                <div className="text-[11px] font-bold text-pink-300/80 uppercase tracking-[0.24em]">
                  Roster Table
                </div>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full min-w-[620px] border-collapse">
                  <thead>
                    <tr className="bg-foreground/[0.06] text-foreground">
                      <th className="text-left px-5 py-4 text-sm font-bold border-b border-border/8">Name</th>
                      <th className="text-left px-5 py-4 text-sm font-bold border-b border-border/8">Grade</th>
                      <th className="text-left px-5 py-4 text-sm font-bold border-b border-border/8">Jersey</th>
                      <th className="text-left px-5 py-4 text-sm font-bold border-b border-border/8">Position</th>
                    </tr>
                  </thead>

                  <tbody>
                    {roster.map((player, index) => (
                      <tr
                        key={player.id}
                        className={`border-b border-border/6 text-foreground/88 ${
                          index % 2 === 0 ? 'bg-foreground/[0.025]' : 'bg-foreground/[0.055]'
                        } hover:bg-pink-500/[0.06] transition-colors`}
                      >
                        <td className="px-5 py-4 text-[15px] font-medium">{player.name || '—'}</td>
                        <td className="px-5 py-4 text-[15px] text-foreground/70">{player.grade || '—'}</td>
                        <td className="px-5 py-4 text-[15px] text-foreground/70">{player.jersey || '—'}</td>
                        <td className="px-5 py-4 text-[15px] text-pink-200/90">{player.position || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </>
  );
}
