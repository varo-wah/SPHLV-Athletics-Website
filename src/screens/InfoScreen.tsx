import { MapPin, Users, Wifi, Bus, Banknote, BriefcaseMedical, Map, Gavel, Coffee, ArrowRight, Clock, Calendar, Star } from 'lucide-react';

export default function InfoScreen() {
  return (
    <div className="pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="sticky top-0 z-30 bg-[#2a1f24]/80 backdrop-blur-xl border-b border-border/6 px-6 pt-12 pb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">ACSC Tournament</h1>
        <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center border border-border/20 overflow-hidden">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-pink-400 p-1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 7.5l-3 2.5v4l3 2.5 3-2.5v-4z"/>
            <path d="M12 7.5V2.5"/>
            <path d="M15 10l4.5-2.5"/>
            <path d="M9 10L4.5 7.5"/>
            <path d="M15 14l4.5 2.5"/>
            <path d="M9 14l-4.5 2.5"/>
            <path d="M12 16.5v5"/>
          </svg>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <section className="mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-[10px] font-bold text-pink-300 uppercase tracking-widest mb-4">
            Venue Intelligence
          </div>
          <h2 className="text-4xl font-black text-foreground tracking-tight leading-none mb-4">
            SPH CAMPUS<br />GUIDE
          </h2>
          <p className="text-sm text-foreground/60 leading-relaxed">
            Your essential toolkit for navigating the ACSC Varsity Soccer Championship at Lippo Village.
          </p>
        </section>

        <section className="ucl-panel rounded-[24px] p-5 border border-border/8 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Area Navigation</h3>
              <p className="text-[11px] text-foreground/50">Lippo Village Surroundings & Team Hotel</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-pink-900/40 border border-pink-500/20 text-[9px] font-bold text-pink-300 uppercase tracking-widest text-center leading-tight">
              Route<br/>Active
            </div>
          </div>
          
          <div className="relative h-64 rounded-xl overflow-hidden bg-slate-800/50 border border-border/10 mt-4">
            <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dpgt445lg/image/upload/v1775219772/undefined_2_onudn4.png')] bg-cover bg-center"></div>
          </div>

          <details className="mt-4 group">
            <summary className="cursor-pointer list-none flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-border/10 hover:bg-foreground/10 transition-colors">
              <span className="text-sm font-bold text-foreground uppercase tracking-wider">Starred Locations</span>
              <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center group-open:rotate-180 transition-transform">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/70"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </summary>
            <div className="pt-4 px-2 space-y-4 pb-2">
              <div>
                <a
                  href="https://maps.app.goo.gl/idTXNQFU61Ch5R5d6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-foreground text-sm font-bold hover:text-pink-300 transition-colors"
                >
                  <Star className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" fill="currentColor" />
                  <span>
                    Aryaduta Lippo Village (team hotel)
                    <span className="block text-[10px] text-pink-300/70 font-medium mt-0.5">
                      *Click to open in Maps
                    </span>
                  </span>
                </a>
                <ul className="mt-2 ml-6 space-y-1.5 text-sm text-foreground/70">
                  <li className="flex items-start gap-2"><span className="text-foreground/30 text-[10px] mt-1">○</span><span>McDonald’s and KFC (right next to hotel)</span></li>
                  <li className="flex items-start gap-2"><span className="text-foreground/30 text-[10px] mt-1">○</span><span>Rumah Buah (grocery store beside hotel)</span></li>
                </ul>
              </div>

              <div>
                <a
                  href="https://maps.app.goo.gl/nUMJnwdV1oq1DB7D9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-foreground text-sm font-bold hover:text-pink-300 transition-colors"
                >
                  <Star className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" fill="currentColor" />
                  <span>
                    Elvee Retail Street (across the street from hotel)
                    <span className="block text-[10px] text-pink-300/70 font-medium mt-0.5">
                      *Click to open in Maps
                    </span>
                  </span>
                </a>
                <ul className="mt-2 ml-6 space-y-1.5 text-sm text-foreground/70">
                  <li className="flex items-start gap-2"><span className="text-foreground/30 text-[10px] mt-1">○</span><span>Subway restaurant</span></li>
                  <li className="flex items-start gap-2"><span className="text-foreground/30 text-[10px] mt-1">○</span><span>Ranch Market (high-end grocery store)</span></li>
                </ul>
              </div>

              <div>
                <a
                  href="https://maps.app.goo.gl/YkE7AbiTfRRHt3qv9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-foreground text-sm font-bold hover:text-pink-300 transition-colors"
                >
                  <Star className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" fill="currentColor" />
                  <span>
                    MaxxBox Lippo Village (short walk from hotel)
                    <span className="block text-[10px] text-pink-300/70 font-medium mt-0.5">
                      *Click to open in Maps
                    </span>
                  </span>
                </a>
                <ul className="mt-2 ml-6 space-y-1.5 text-sm text-foreground/70">
                  <li className="flex items-start gap-2"><span className="text-foreground/30 text-[10px] mt-1">○</span><span>Lamian Palace (Chinese food)</span></li>
                  <li className="flex items-start gap-2"><span className="text-foreground/30 text-[10px] mt-1">○</span><span>Coffee shops</span></li>
                  <li className="flex items-start gap-2"><span className="text-foreground/30 text-[10px] mt-1">○</span><span>Primo (grocery store)</span></li>
                </ul>
              </div>

              <div>
                <a
                  href="https://maps.app.goo.gl/8x1oyjNKKzMRoxwg6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-foreground text-sm font-bold hover:text-pink-300 transition-colors"
                >
                  <Star className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" fill="currentColor" />
                  <span>
                    Supermal Karawaci <span className="bg-pink-700/30 text-pink-300 px-1.5 py-0.5 rounded text-xs ml-1 inline-block mt-1 sm:mt-0">(FOR SAFETY only cross road using sky bridge at MaxxBox)</span>
                    <span className="block text-[10px] text-pink-300/70 font-medium mt-0.5">
                      *Click to open in Maps
                    </span>
                  </span>
                </a>
                <ul className="mt-2 ml-6 space-y-1.5 text-sm text-foreground/70">
                  <li className="flex items-start gap-2"><span className="text-foreground/30 text-[10px] mt-1">○</span><span>High-end shopping</span></li>
                  <li className="flex items-start gap-2"><span className="text-foreground/30 text-[10px] mt-1">○</span><span>Restaurants (Burger King, Pizza Marzano, Popeyes, PepperLunch, Starbucks, and dozens more)</span></li>
                </ul>
              </div>

              <div>
                <a
                  href="https://maps.app.goo.gl/PG8CvAyAr4fxQa9r8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-foreground text-sm font-bold hover:text-pink-300 transition-colors"
                >
                  <Star className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" fill="currentColor" />
                  <span>
                    Benton Junction (next to Supermal)
                    <span className="block text-[10px] text-pink-300/70 font-medium mt-0.5">
                      *Click to open in Maps
                    </span>
                  </span>
                </a>
                <ul className="mt-2 ml-6 space-y-1.5 text-sm text-foreground/70">
                  <li className="flex items-start gap-2"><span className="text-foreground/30 text-[10px] mt-1">○</span><span>Convenience stores, restaurants, ice cream shops</span></li>
                  <li className="flex items-start gap-2"><span className="text-foreground/30 text-[10px] mt-1">○</span><span>Taman Sari (opposite side) has many restaurants</span></li>
                </ul>
              </div>

              <div>
                <a
                  href="https://maps.app.goo.gl/cTtsfkLtPTsX9i1T9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-foreground text-sm font-bold hover:text-pink-300 transition-colors"
                >
                  <Star className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" fill="currentColor" />
                  <span>
                    Rumah Sakit Siloam (Siloam Hospital)
                    <span className="block text-[10px] text-pink-300/70 font-medium mt-0.5">
                      *Click to open in Maps
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </details>
        </section>

        <section className="ucl-panel rounded-[24px] p-6 border border-pink-500/20 bg-gradient-to-br from-[#5A0F2E]/40 to-transparent">
          <div className="flex items-center gap-2 text-[10px] font-bold text-pink-300 uppercase tracking-widest mb-2">
            <Users className="w-4 h-4" />
            Next Briefing
          </div>
          <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-6">Coaches Meeting</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-pink-400/70" />
              <span className="text-sm font-medium text-foreground">Tuesday, April 7</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-pink-400/70" />
              <span className="text-sm font-medium text-foreground">7:30pm — 8:30pm</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-pink-400/70" />
              <span className="text-sm font-medium text-foreground">Room J100, SPH Campus</span>
            </div>
          </div>
        </section>

        <section className="ucl-panel rounded-[24px] p-6 border border-border/8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-4">
              <Wifi className="w-4 h-4" />
              Campus Connect
            </div>
            <div className="mb-3">
              <div className="text-[9px] text-foreground/40 uppercase tracking-widest mb-1">Network SSID</div>
              <div className="text-lg font-bold text-foreground">SPH-ACSC</div>
            </div>
            <div>
              <div className="text-[9px] text-foreground/40 uppercase tracking-widest mb-1">Password</div>
              <div className="text-lg font-bold text-pink-300">Acsc2026</div>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(244,114,182,0.5)] self-start mt-1"></div>
        </section>

        <h2 className="text-3xl font-black text-foreground uppercase tracking-tight leading-none mt-12 mb-6">
          Tournament<br />Logistics
        </h2>

        <div className="space-y-4">
          <section className="ucl-panel rounded-[24px] p-6 border border-border/8 border-l-4 border-l-pink-500">
            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4">
              <Bus className="w-5 h-5 text-pink-300" />
            </div>
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-4">Transportation</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                </div>
                Blue Bird bus shuttle available daily
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                </div>
                Hotel Departure: 15 mins before first game
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                </div>
                Drop-off: Main SPH Campus Gate
              </li>
            </ul>
          </section>

          <section className="ucl-panel rounded-[24px] p-6 border border-border/8 border-l-4 border-l-pink-500">
            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4">
              <Banknote className="w-5 h-5 text-pink-300" />
            </div>
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-4">Money & Currency</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                </div>
                Local Currency: Indonesian Rupiah (IDR)
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                </div>
                -OVO, Gojek, or DANA (App Store or Google Play Store).
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                </div>
                -Credit cards like BCA Flazz card or Mandiri e-money card, both available at convenience stores.
              </li>
            </ul>
          </section>

          <section className="ucl-panel rounded-[24px] p-6 border border-border/8 border-l-4 border-l-pink-500">
            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4">
              <BriefcaseMedical className="w-5 h-5 text-pink-300" />
            </div>
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-2">First Aid & Medical</h3>
            <p className="text-xs font-bold text-pink-300 mb-4">Siloam Hospital Partnership</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                </div>
                Contact: Dona Cooper (Campus Nurse)
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                </div>
                Emergency: 1500-911
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                </div>
                On-field medical tent active 24/7
              </li>
            </ul>
          </section>

          <section className="ucl-panel rounded-[24px] p-6 border border-border/8 border-l-4 border-l-pink-500">
            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4">
              <Map className="w-5 h-5 text-pink-300" />
            </div>
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-4">Venue & Fields</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                </div>
                Main Field (FIFA Standard Turf)
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                </div>
                Side Fields (Grass Surface)
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                </div>
                Locker rooms available in Gym Block
              </li>
            </ul>
          </section>

          <section className="ucl-panel rounded-[24px] p-6 border border-border/8 border-l-4 border-l-pink-500">
            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4">
              <Gavel className="w-5 h-5 text-pink-300" />
            </div>
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-3">Tournament Rules</h3>
            <p className="text-sm text-foreground/70 mb-6">
              Full technical regulations and eligibility requirements are detailed in the official handbook.
            </p>
            <button className="flex items-center gap-2 text-[11px] font-bold text-pink-300 uppercase tracking-widest hover:text-pink-200 transition-colors">
              View Handbook <ArrowRight className="w-4 h-4" />
            </button>
          </section>

          <section className="ucl-panel rounded-[24px] p-6 border border-border/8 border-l-4 border-l-pink-500">
            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4">
              <Coffee className="w-5 h-5 text-pink-300" />
            </div>
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-4">Hospitality</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                </div>
                Room K400: Daily Lunch & Rest Area
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                </div>
                Coaches' Hospitality Room in J-Block
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                </div>
                Refreshed snacks & hydration stations
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
