import { useState } from 'react';
import { ArrowUpRight, Waves, Play, Timer } from 'lucide-react';
import type { AthleticsDataState } from '../hooks/useAthleticsData';
import { ACSC_LOGO, acscSchoolByCode } from '../data/acscSchools';
import { ACSC_SWIMMING_2026, SWIMMING_ACSC_SESSIONS } from '../data/swimming';
import { scheduleTimeLabel, scheduleTimestamp } from '../utils/scheduleTime';

const sections = ['Schedule', 'Results', 'Athletes'] as const;
const dateLabel = (date: string) => new Date(`${date}T12:00:00+07:00`).toLocaleDateString('en-GB', { timeZone: 'Asia/Jakarta', weekday: 'short', day: 'numeric', month: 'short' });
const jakartaTime = (date: string, time: string) => new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
}).format(new Date(scheduleTimestamp({ date, time, timeZone: 'Asia/Seoul' })));

export default function SwimmingScreen({ state }: { state: AthleticsDataState }) {
  const [section, setSection] = useState<typeof sections[number]>('Schedule');
  const [practices, setPractices] = useState(false);
  const otherEvents = state.data.masterScheduleEvents
    .filter(event => /swim/i.test(event.team) && !/\bacsc\b/i.test(event.eventText))
    .filter(event => event.date && (practices || event.eventType !== 'Practice'))
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

  return <div className="mx-auto max-w-3xl px-4 pb-12 pt-4">
    <a href="#/teams" className="text-xs font-bold text-foreground/50">← All teams</a>
    <header className="relative my-5 overflow-hidden rounded-3xl bg-brand-maroon p-6 text-white">
      <Waves className="absolute -right-3 -top-2 opacity-10" size={160} aria-hidden="true" />
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">SPH Lippo Village · Eagles</p>
      <h1 className="mt-3 text-3xl font-black uppercase tracking-tight">Varsity Swimming</h1>
      <p className="mt-2 text-sm text-white/80">ACSC Championship · Seoul, South Korea</p>
      <div className="mt-6 flex gap-8 border-t border-white/20 pt-4">
        <div><p className="text-2xl font-black">29–31 Oct</p><p className="text-xs text-white/70">2026 championship</p></div>
        <div><p className="text-2xl font-black">Seoul</p><p className="text-xs text-white/70">Host city</p></div>
      </div>
    </header>

    <section aria-label="ACSC swimming championship" className="mb-5 rounded-2xl border border-border/10 bg-card p-4">
      <div className="flex items-center gap-3">
        <img src={ACSC_LOGO} alt="ACSC" className="h-12 w-12 rounded-xl bg-white object-contain p-1" />
        <div className="min-w-0 flex-1"><h2 className="text-base font-black">ACSC Swimming</h2><p className="mt-1 text-xs text-foreground/60">Guardian Pool · YISS, Seoul</p></div>
        <img src={acscSchoolByCode('YISS').logo} alt="YISS host school" className="h-10 w-10 rounded-full bg-white object-contain p-1" />
      </div>
      <a href={ACSC_SWIMMING_2026.livestreamUrl} target="_blank" rel="noreferrer" className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-maroon px-4 py-3 text-sm font-bold text-white"><Play size={16} aria-hidden="true" />Watch on YISSPN<ArrowUpRight size={15} aria-hidden="true" /></a>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-foreground/60">
        <a href={ACSC_SWIMMING_2026.bookletUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">Meet booklet<ArrowUpRight size={12} aria-hidden="true" /></a>
        <a href={ACSC_SWIMMING_2026.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">Official championship page<ArrowUpRight size={12} aria-hidden="true" /></a>
      </div>
    </section>

    <div role="tablist" aria-label="Swimming sections" className="mb-5 grid grid-cols-3 gap-1 rounded-2xl border border-border/10 bg-card p-1.5">
      {sections.map((name, index) => <button key={name} type="button" role="tab" id={`swim-tab-${index}`} aria-selected={section === name} aria-controls="swim-panel" onClick={() => setSection(name)} className={`min-h-11 rounded-xl px-2 text-xs font-bold ${section === name ? 'bg-brand-maroon text-white' : 'text-foreground/60'}`}>{name}</button>)}
    </div>
    <section role="tabpanel" id="swim-panel" aria-labelledby={`swim-tab-${sections.indexOf(section)}`}>
      {section === 'Schedule' && <>
        <h2 className="text-xl font-black">Championship schedule</h2>
        <p className="mb-4 mt-2 text-xs leading-relaxed text-foreground/60">All five meet sessions from the official booklet. Jakarta times are shown first; Seoul is two hours ahead.</p>
        <div className="space-y-3">{SWIMMING_ACSC_SESSIONS.map(session => <article key={session.number} className="rounded-2xl border border-border/10 bg-card p-4">
          <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold text-brand-maroon dark:text-white">{dateLabel(session.date)}</p><span className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Session {session.number}</span></div>
          <h3 className="mt-3 text-xl font-black tabular-nums">{jakartaTime(session.date, session.start)}–{jakartaTime(session.date, session.end)} <span className="text-xs font-bold text-foreground/60">WIB</span></h3>
          <p className="mt-1 text-xs tabular-nums text-foreground/60">{session.start}–{session.end} KST · Guardian Pool</p>
          <p className="mt-3 border-t border-border/10 pt-3 text-xs tabular-nums text-foreground/50">Warm-up: {jakartaTime(session.date, session.warmupStart)}–{jakartaTime(session.date, session.warmupEnd)} WIB</p>
        </article>)}</div>
        <div className="mb-3 mt-7 flex items-center justify-between gap-3"><h2 className="text-lg font-black">Meets & training</h2><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={practices} onChange={event => setPractices(event.target.checked)} />Show practices</label></div>
        <p className="mb-4 text-xs text-foreground/60">Other entries from the master schedule. Past events do not imply confirmed results.</p>
        {state.loading && <p role="status" className="mb-3 text-sm text-foreground/60">Loading school schedule…</p>}
        <div className="space-y-3">{otherEvents.length ? otherEvents.map(event => <article key={event.id} className="rounded-2xl border border-border/10 bg-card p-4"><p className="text-xs font-bold text-brand-maroon dark:text-white">{dateLabel(event.date!)} · {event.season}</p><h3 className="mt-2 font-bold">{event.eventText}</h3>{event.time && <p className="mt-2 text-xs text-foreground/60">{scheduleTimeLabel(event)}</p>}</article>) : <p className="text-sm text-foreground/50">No other meets listed.</p>}</div>
      </>}
      {section === 'Results' && <div className="rounded-2xl border border-border/10 bg-card p-5">
        <Timer size={24} className="text-brand-maroon dark:text-white" aria-hidden="true" /><h2 className="mt-3 text-xl font-black">Race results</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/65">Verified race times, placings and team points have not been added yet. Follow the championship through the official results page and livestream.</p>
        <a href={ACSC_SWIMMING_2026.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-maroon dark:text-white">Official meet results<ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>}
      {section === 'Athletes' && <div className="rounded-2xl border border-border/10 bg-card p-5">
        <h2 className="text-xl font-black">Our ACSC swimmers</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/65">SPH's 2026 meet entries are awaiting confirmation. The team roster will be added once confirmed.</p>
        <a href={ACSC_SWIMMING_2026.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-maroon dark:text-white">Published ACSC roster<ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>}
    </section>
    <a href="#/teams" className="mt-6 flex items-center gap-2 text-xs font-bold text-foreground/60">Explore Eagles teams<ArrowUpRight size={14} aria-hidden="true" /></a>
  </div>;
}
