import { ArrowLeft, Trophy } from 'lucide-react';

interface AcscScreenProps {
  onBack?: () => void;
}

export default function AcscScreen({ onBack }: AcscScreenProps) {
  return (
    <div className="animate-in fade-in duration-500 pb-24 px-4 space-y-8">
      <div className="flex items-center gap-3 pt-2">
        {onBack && (
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-subcard border border-border/10 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-foreground/40">
            Tournament Results
          </p>
          <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
            ACSC Results
          </h1>
        </div>
      </div>

      {/* ACSC Hero */}
      <section className="rounded-[28px] overflow-hidden border border-border/10 bg-gradient-to-br from-[#111827] via-[#2A1020] to-[#5A1C2C] shadow-[0_24px_80px_rgba(0,0,0,0.35)] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(191,215,234,0.12),transparent_38%)] pointer-events-none" />

        <div className="relative z-10 min-h-[300px] flex flex-col items-center justify-center text-center px-8 py-12">
          <div className="w-24 h-24 rounded-full bg-black/25 border border-white/10 flex items-center justify-center mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <Trophy size={42} className="text-yellow-300" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-[0.28em] text-white leading-tight">
            Asia<br />
            Christian<br />
            Schools<br />
            Conference
          </h2>

          <div className="mt-8 rounded-full bg-[#B5413F] px-8 py-3 border border-white/10">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-white">
              Boys Soccer
            </p>
          </div>
        </div>
      </section>

      {/* Tournament Result Summary */}
      <section className="rounded-[24px] overflow-hidden bg-[#5A1C2C] border border-[#BFD7EA]/10 shadow-md">
        <div className="px-5 py-4 flex items-center justify-between text-white/80">
          <p className="text-xs font-black tracking-[0.18em]">
            @Yongsan International School of Seoul · Final Round
          </p>
          <p className="text-xs font-black tracking-[0.18em]">
            2025
          </p>
        </div>

        <div className="p-5">
          <div className="bg-[#061126] rounded-xl p-5 border border-white/5">
            <div className="text-center mb-5">
              <h3 className="text-lg font-black uppercase tracking-[0.18em] text-yellow-300">
                ACSC Boys Soccer
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/50 mt-1">
                Tournament Results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Final Standing
                  </p>
                </div>

                <div className="grid grid-cols-[1fr_80px] bg-white/10">
                  <div className="px-4 py-3 text-sm font-black uppercase tracking-widest text-white">
                    LV Eagles
                  </div>
                  <div className="px-4 py-3 text-sm font-black text-right text-yellow-300">
                    4th
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Location
                  </p>
                </div>

                <div className="px-4 py-3 text-sm font-black uppercase tracking-widest text-white">
                  YISS · Seoul
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Static ACSC/JAAC-style bracket visual */}
      <section className="space-y-4">
        <h3 className="text-2xl font-black tracking-tight text-foreground uppercase italic border-l-4 border-[#5A1C2C] pl-3">
          Tournament Bracket
        </h3>

        <div className="bg-[#5A1C2C] rounded-2xl p-4 border border-[#BFD7EA]/10 shadow-md">
          <div className="bg-[#061126] rounded-xl p-5 border border-white/5">
            <div className="text-center mb-5">
              <h4 className="text-lg font-black uppercase tracking-[0.18em] text-yellow-300">
                Championship Bracket
              </h4>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/50 mt-1">
                Semifinals & Final
              </p>
            </div>

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
    </div>
  );
}
