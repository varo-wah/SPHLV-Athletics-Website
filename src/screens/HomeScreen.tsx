import { Trophy } from 'lucide-react';

export default function HomeScreen({ onNavigateToNews }: { onNavigateToNews?: () => void }) {
  return (
    <div className="animate-in fade-in duration-500 pb-8 px-4 space-y-6 mt-4">
      {/* New LV Athletics Banner */}
      <div className="hero-image-card">
        <img
          src="https://res.cloudinary.com/dpgt445lg/image/upload/v1780358463/ACSC_Girls_football_26_1_o8grc8.png"
          alt="LV Athletics Banner"
          className="hero-banner-img"
        />
        <div className="hero-image-overlay" />
      </div>

      {/* Quick Feature Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-[#6B1730] via-[#5A1C2C] to-[#431420] p-5 rounded-2xl flex flex-col items-start gap-4 border border-[#BFD7EA]/10 relative overflow-hidden shadow-[0_18px_45px_rgba(90,28,44,0.35)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(191,215,234,0.14),transparent_36%)] pointer-events-none" />

          <div className="text-left w-full relative z-10">
            <h3 className="text-[13px] font-black text-white tracking-[0.22em] uppercase drop-shadow-md">
              NEXT MATCH
            </h3>
            <p className="text-lg font-black text-white mt-4 uppercase tracking-wide leading-snug">
              Varsity Girls<br />
              Soccer vs BSJ
            </p>
            <p className="text-[10px] text-white/70 tracking-widest mt-4 uppercase font-medium">
              FRI, NOV 15 @ 7:00 PM
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToNews}
          className="text-left bg-subcard p-5 rounded-2xl flex flex-col items-start gap-4 border border-border/5 relative shadow-lg overflow-hidden group hover:bg-subcard-hover transition-colors"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity rounded-2xl grayscale mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-[#5A1C2C]/20 pointer-events-none" />

          <div className="relative z-10 w-full">
            <h3 className="text-[13px] font-black text-white tracking-[0.22em] uppercase drop-shadow-md">
              TEAM NEWS
            </h3>
            <p className="text-[10px] text-white/70 tracking-widest mt-4 uppercase font-medium drop-shadow-md">
              UPDATED ROUND ROBIN
            </p>
          </div>
        </button>
      </div>

      {/* Recent Results Header */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-3">
          <Trophy size={22} className="text-[#5A1C2C]" />
          <h2 className="text-2xl font-black uppercase italic tracking-[0.18em] text-foreground">
            Recent Results
          </h2>
        </div>

        <div className="bg-subcard rounded-2xl border border-border/10 overflow-hidden shadow-md">
          <div className="p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#B5413F]">
                Result
              </p>
              <h3 className="text-lg font-black text-foreground mt-1">
                Girls’ Soccer wins against JIS
              </h3>
              <p className="text-xs text-foreground/45 mt-1">
                Latest match result from connected sheets.
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-black text-foreground">
                2–0
              </p>
              <p className="text-xs font-black uppercase tracking-widest text-green-400">
                W
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
