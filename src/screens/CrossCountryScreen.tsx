import { useState } from 'react';
import { ArrowUpRight, Timer, Footprints } from 'lucide-react';
import type { AthleticsDataState } from '../hooks/useAthleticsData';
import { CROSS_COUNTRY_PERSONAL_BESTS, CROSS_COUNTRY_REPORT_DATE } from '../data/crossCountry';

const sections = ['Personal bests', 'Schedule', 'Athletes'] as const;
const dateLabel = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function CrossCountryScreen({ state }: { state: AthleticsDataState }) {
  const [section, setSection] = useState<typeof sections[number]>('Personal bests');
  const [practices, setPractices] = useState(false);
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const events = state.data.masterScheduleEvents.filter(event => /cross country/i.test(event.team))
    .filter(event => practices || event.eventType !== 'Practice')
    .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
  const groups = [
    { label: 'Upcoming', events: events.filter(event => event.date && event.date >= todayKey) },
    { label: 'Past schedule', events: events.filter(event => event.date && event.date < todayKey) },
  ];
  return <div className="mx-auto max-w-3xl px-4 pb-12 pt-4">
    <a href="#/teams" className="text-xs font-bold text-foreground/50">← All teams</a>
    <header className="relative my-5 overflow-hidden rounded-3xl bg-brand-maroon p-6 text-white">
      <Footprints className="absolute -right-3 -top-2 opacity-10" size={160} aria-hidden="true" />
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">SPH Lippo Village · Eagles</p>
      <h1 className="mt-3 text-3xl font-black uppercase tracking-tight">Cross Country</h1>
      <p className="mt-2 text-sm text-white/80">One team. Every stride.</p>
      <div className="mt-6 flex gap-8 border-t border-white/20 pt-4"><div><p className="text-2xl font-black">5 km</p><p className="text-xs text-white/70">Reported distance</p></div><div><p className="text-2xl font-black">{CROSS_COUNTRY_PERSONAL_BESTS.length}</p><p className="text-xs text-white/70">Recorded runners</p></div></div>
    </header>
    <div role="tablist" aria-label="Cross country sections" className="mb-5 grid grid-cols-3 gap-1 rounded-2xl border border-border/10 bg-card p-1.5">
      {sections.map((name, index) => <button key={name} type="button" role="tab" id={`xc-tab-${index}`} aria-selected={section === name} aria-controls="xc-panel" onClick={() => setSection(name)} className={`min-h-11 rounded-xl px-2 text-xs font-bold ${section === name ? 'bg-brand-maroon text-white' : 'text-foreground/60'}`}>{name}</button>)}
    </div>
    <section role="tabpanel" id="xc-panel" aria-labelledby={`xc-tab-${sections.indexOf(section)}`}>
      {section === 'Personal bests' && <>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black">5 km personal bests</h2><Timer size={20} className="text-brand-maroon" aria-hidden="true" /></div>
        <p className="mb-4 text-xs leading-relaxed text-foreground/60">Reported {dateLabel(CROSS_COUNTRY_REPORT_DATE)}. Times are personal bests, not race placings. Course and meet date were not supplied.</p>
        <div className="overflow-hidden rounded-2xl border border-border/10 bg-card">
          {CROSS_COUNTRY_PERSONAL_BESTS.map(runner => <article key={runner.name} className="flex items-center justify-between gap-4 border-b border-border/10 px-4 py-4 last:border-0"><div><h3 className="font-bold">{runner.name}</h3><p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-foreground/45">5 km · Personal best</p></div><p className="text-2xl font-black tabular-nums text-brand-maroon dark:text-white">{runner.time}</p></article>)}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-foreground/50">Times shown as minutes:seconds. Cross-country courses vary; these performances are not a league ranking.</p>
      </>}
      {section === 'Schedule' && <>
        <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-xl font-black">Meets & training</h2><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={practices} onChange={event => setPractices(event.target.checked)} />Show practices</label></div>
        <p className="mb-5 text-xs text-foreground/60">From the master schedule. Past events do not imply confirmed results.</p>
        {state.loading && <p role="status">Loading schedule…</p>}
        {state.data.masterScheduleErrorCount > 0 && <p role="status" className="mb-4 text-sm text-foreground/60">Some schedule sources could not refresh. Showing available entries.</p>}
        {groups.map(group => <div key={group.label} className="mb-6 space-y-3"><h3 className="text-xs font-bold uppercase tracking-widest text-foreground/50">{group.label}</h3>{group.events.length ? group.events.map(event => <article key={event.id} className="rounded-2xl border border-border/10 bg-card p-4"><p className="text-xs font-bold text-brand-maroon dark:text-white">{dateLabel(event.date!)} · {event.season}</p><h4 className="mt-2 font-bold">{event.eventText}</h4></article>) : <p className="text-sm text-foreground/50">No entries available.</p>}</div>)}
      </>}
      {section === 'Athletes' && <>
        <h2 className="text-xl font-black">Our runners</h2><p className="mb-4 mt-2 text-xs text-foreground/60">Athletes included in the latest personal-best report. Full roster details are pending.</p>
        <div className="grid grid-cols-2 gap-3">{CROSS_COUNTRY_PERSONAL_BESTS.map(runner => <article key={runner.name} className="rounded-2xl border border-border/10 bg-card p-4"><div aria-hidden="true" className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-maroon/10 font-black text-brand-maroon dark:text-white">{runner.name[0]}</div><h3 className="font-bold">{runner.name}</h3><p className="mt-2 text-xs text-foreground/50">5 km PB</p><p className="mt-1 text-xl font-black tabular-nums">{runner.time}</p></article>)}</div>
      </>}
    </section>
    <a href="#/teams" className="mt-6 flex items-center gap-2 text-xs font-bold text-foreground/60">Explore Eagles teams <ArrowUpRight size={14} /></a>
  </div>;
}
