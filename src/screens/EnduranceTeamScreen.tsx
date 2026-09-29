import { useState } from 'react';
import type { AthleticsDataState } from '../hooks/useAthleticsData';

type EnduranceSport = 'swimming' | 'cross-country';
const samples = {
  swimming: [
    { athlete: 'Sample swimmer A', event: '50 m Freestyle', time: '28.42', place: '2nd', best: '28.42', change: '−0.64 s' },
    { athlete: 'Sample swimmer B', event: '100 m Backstroke', time: '1:14.80', place: '4th', best: '1:14.80', change: '−1.20 s' },
    { athlete: 'Sample swimmer C', event: '100 m Freestyle', time: '1:05.32', place: '3rd', best: '1:04.90', change: '+0.42 s' },
  ],
  'cross-country': [
    { athlete: 'Sample runner A', event: '5 km · Boys', time: '19:42', place: '3rd', best: '19:42', change: '−0:18' },
    { athlete: 'Sample runner B', event: '5 km · Girls', time: '23:16', place: '5th', best: '23:16', change: '−0:32' },
    { athlete: 'Sample runner C', event: '3 km · Mixed', time: '13:08', place: '8th', best: '12:55', change: '+0:13' },
  ],
};

export default function EnduranceTeamScreen({ sport, state }: { sport: EnduranceSport; state: AthleticsDataState }) {
  const [section, setSection] = useState<'schedule' | 'results' | 'athletes'>('schedule');
  const [showPractices, setShowPractices] = useState(false);
  const swimming = sport === 'swimming';
  const title = swimming ? 'Varsity Swimming' : 'Cross Country';
  const schedule = state.data.masterScheduleEvents.filter(event => swimming ? /swim/i.test(event.team) : /cross country/i.test(event.team))
    .filter(event => showPractices || event.eventType !== 'Practice')
    .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
  const today = new Date().toLocaleDateString('en-CA');
  const upcoming = schedule.filter(event => event.date && event.date >= today);
  const past = schedule.filter(event => !event.date || event.date < today);
  const card = 'rounded-2xl border border-border/10 bg-card p-4';
  return <div className="mx-auto max-w-3xl px-4 pb-12 pt-5">
    <a href="#/teams" className="text-sm text-foreground/60">← All teams</a>
    <header className="my-5">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-sky">SPH Lippo Village · Eagles</p>
      <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-foreground/60">{swimming ? 'Every length counts.' : 'Find your stride.'}</p>
    </header>
    <aside className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
      <strong>Prototype preview.</strong> Schedule entries come from the master schedule. All athlete names, times and placings below are fictional samples.
    </aside>
    <div role="tablist" aria-label={`${title} sections`} className="mb-5 flex gap-2 rounded-2xl bg-card p-2">
      {(['schedule', 'results', 'athletes'] as const).map(tab => <button key={tab} role="tab" aria-selected={section === tab} aria-controls="endurance-panel" id={`endurance-${tab}`} onClick={() => setSection(tab)} className={`flex-1 rounded-xl px-2 py-3 text-sm font-bold capitalize ${section === tab ? 'bg-brand-maroon text-white' : 'text-foreground/60'}`}>{tab}</button>)}
    </div>
    <section role="tabpanel" id="endurance-panel" aria-labelledby={`endurance-${section}`}>
      {section === 'schedule' && <>
        <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Meets & training</h2><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={showPractices} onChange={event => setShowPractices(event.target.checked)} />Show practices</label></div>
        <p className="mb-4 text-xs text-foreground/60">Master schedule · dates and event descriptions as supplied. Past entries do not imply confirmed results.</p>
        {state.loading && <p role="status">Loading schedule…</p>}
        {state.data.masterScheduleErrorCount > 0 && <p role="status" className="mb-3 text-sm">Some schedule sources could not refresh. Showing available entries.</p>}
        {[{ name: 'Upcoming', events: upcoming }, { name: 'Past schedule', events: past }].map(group => <div key={group.name} className="mb-6 space-y-3"><h3 className="text-xs font-bold uppercase tracking-widest text-foreground/50">{group.name}</h3>{group.events.length === 0 ? <p className="text-sm text-foreground/60">No entries available.</p> : group.events.map(event => <article key={event.id} className={card}><p className="text-xs font-bold text-brand-maroon">{event.date ? new Date(`${event.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date to be confirmed'} · {event.season}</p><h4 className="mt-2 font-bold">{event.eventText}</h4><p className="mt-2 text-xs text-foreground/50">{event.team}</p></article>)}</div>)}
      </>}
      {section === 'results' && <>
        <h2 className="text-xl font-bold">Sample meet results</h2><p className="mb-4 mt-2 text-sm text-foreground/60">Fictional demonstration meet · no official results submitted.</p>
        <div className="space-y-3">{samples[sport].map(result => <article key={result.athlete} className={card}><div className="flex items-start justify-between gap-3"><div><p className="text-xs uppercase text-foreground/50">{result.event}</p><h3 className="mt-1 font-bold">{result.athlete}</h3></div><span className="rounded-full bg-foreground/5 px-3 py-1 text-xs font-bold">{result.place}</span></div><p className="mt-4 text-3xl font-black tabular-nums">{result.time}</p><p className="mt-2 text-xs text-foreground/60">{result.change} against previous personal best · Sample</p></article>)}</div>
        <p className="mt-4 text-xs text-foreground/60">{swimming ? 'Official results should include pool length, stroke and age group.' : 'Cross-country times depend on course and conditions; compare like-for-like distances.'}</p>
      </>}
      {section === 'athletes' && <><h2 className="text-xl font-bold">Sample athlete profiles</h2><p className="mb-4 mt-2 text-sm text-foreground/60">Placeholder roster · replace with confirmed athletes and performances.</p><div className="space-y-3">{samples[sport].map(result => <article key={result.athlete} className={card}><h3 className="font-bold">{result.athlete}</h3><p className="mt-1 text-sm text-foreground/60">{result.event}</p><div className="mt-3 flex items-center justify-between"><span className="text-xs uppercase tracking-widest">Sample personal best</span><span className="font-bold tabular-nums">{result.best}</span></div></article>)}</div></>}
    </section>
  </div>;
}
