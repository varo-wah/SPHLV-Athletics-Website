import { Maximize2, Minus, Plus, RotateCcw, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { acscBracketForTeam } from '../data/acscBrackets2026';
import { acscMatchFinished } from '../data/acscCompetitionResults2026';
import type { AcscCompetitionMatch, AcscCompetitionSnapshot } from '../data/acscCompetitionTypes';
import { ACSC_LOGO, acscSchoolForName } from '../data/acscSchools';
import { acscTournamentForTeam } from '../data/acscTournaments2026';
import { bracketLayout, CARD_WIDTH, CARD_HEIGHT, COLUMN_GAP, EDGE } from '../utils/acscBracketLayout';

function matchWinner(match: AcscCompetitionMatch): string | null {
  if (!acscMatchFinished(match)) return null;
  if (match.homeScore !== match.awayScore) return match.homeScore! > match.awayScore! ? match.home : match.away;
  if (match.penalties && match.penalties.homeScore !== match.penalties.awayScore) {
    return match.penalties.homeScore > match.penalties.awayScore ? match.home : match.away;
  }
  return null;
}

function BracketCard({ match }: { match: AcscCompetitionMatch }) {
  const winner = matchWinner(match);
  const hasSph = match.home === 'SPH' || match.away === 'SPH';
  const finished = acscMatchFinished(match);
  const date = new Date(`${match.date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  return <article aria-label={`${match.stage}: ${acscSchoolForName(match.home)?.shortName ?? match.home} versus ${acscSchoolForName(match.away)?.shortName ?? match.away}`} className={`flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm ${hasSph ? 'border-brand-maroon/50 ring-1 ring-brand-maroon/10 dark:border-red-400/50 dark:ring-red-400/10' : 'border-border/20'}`}>
    <div className="flex min-h-8 items-center justify-between gap-2 border-b border-border/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide text-foreground/60">
      <span className="truncate" title={match.stage}>{match.stage}</span><span className="shrink-0">{date}</span>
    </div>
    {([{ name: match.home, score: match.homeScore }, { name: match.away, score: match.awayScore }]).map(team => {
      const school = acscSchoolForName(team.name);
      return <div key={team.name} className={`flex min-h-9 items-center gap-2 px-3 ${winner === team.name ? 'bg-brand-maroon/[0.07] font-black' : 'font-semibold'}`}>
        {school && <img src={school.logo} alt="" className="h-5 w-5 shrink-0 rounded-full bg-white object-contain p-0.5" />}
        <span className="min-w-0 flex-1 truncate text-xs" title={school?.name ?? team.name}>{school?.shortName ?? team.name}{team.name === 'SPH' && <span className="sr-only"> · SPH fixture</span>}</span>
        <span className="min-w-5 text-right font-mono text-base tabular-nums">{finished ? team.score : '—'}</span>
      </div>;
    })}
    <p className="mt-auto border-t border-border/10 px-3 py-1.5 text-[9px] font-semibold text-foreground/55">
      {finished ? match.penalties ? `Final · penalties ${match.penalties.homeScore}–${match.penalties.awayScore}` : 'Final' : 'Score unreported'}
    </p>
  </article>;
}

function BracketView({ snapshot, expanded = false }: { key?: string; snapshot: AcscCompetitionSnapshot; expanded?: boolean }) {
  const definition = acscBracketForTeam(snapshot.teamId)!;
  const [selected, setSelected] = useState(definition.lanes[0].id);
  const [scale, setScale] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lane = definition.lanes.find(item => item.id === selected) ?? definition.lanes[0];
  const matches = new Map(snapshot.matches.map(match => [match.id, match]));
  const { positions, width, height, paths } = bracketLayout(lane, matches);
  const changeLane = (id: string) => { setSelected(id); scrollRef.current?.scrollTo({ top: 0, left: 0 }); };
  const fit = () => {
    const viewport = scrollRef.current;
    if (viewport) setScale(Math.max(0.1, Math.min(1, (viewport.clientWidth - 16) / width, (viewport.clientHeight - 16) / height)));
  };
  return <div className={`flex min-h-0 flex-col ${expanded ? 'h-full' : ''}`}>
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/10 p-3">
      {definition.lanes.length > 1 ? <div className="flex flex-wrap gap-1.5" role="group" aria-label="Bracket paths">
        {definition.lanes.map(item => <button key={item.id} type="button" onClick={() => changeLane(item.id)} aria-pressed={lane.id === item.id} className={`min-h-9 rounded-lg px-3 text-[11px] font-bold ${lane.id === item.id ? 'bg-brand-maroon text-white' : 'border border-border/15 bg-subcard text-foreground/70 hover:bg-foreground/5'}`}>{item.title}</button>)}
      </div> : <p className="text-xs font-bold">{lane.title}</p>}
      <div className="flex items-center gap-1" role="group" aria-label="Bracket zoom">
        <button type="button" aria-label="Zoom bracket out" disabled={scale <= 0.35} onClick={() => setScale(value => Math.max(0.35, value - 0.15))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/15 disabled:opacity-30"><Minus size={15} /></button>
        <output aria-live="polite" className="w-10 text-center text-[10px] font-bold tabular-nums">{Math.round(scale * 100)}%</output>
        <button type="button" aria-label="Zoom bracket in" disabled={scale >= 1.6} onClick={() => setScale(value => Math.min(1.6, value + 0.15))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/15 disabled:opacity-30"><Plus size={15} /></button>
        <button type="button" onClick={fit} className="h-9 rounded-lg border border-border/15 px-2 text-[10px] font-bold">Fit</button>
        <button type="button" aria-label="Reset bracket zoom" onClick={() => setScale(1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/15"><RotateCcw size={13} /></button>
      </div>
    </div>
    <div className="space-y-1.5 border-b border-border/10 px-3 py-2 text-[10px] leading-relaxed text-foreground/60">
      {lane.description && <p>{lane.description}</p>}
      <p className="flex flex-wrap gap-x-4 gap-y-1"><span className="inline-flex items-center gap-1.5"><span className="w-5 border-t-2 border-brand-maroon/75 dark:border-red-400/80" />Winner advances</span><span className="inline-flex items-center gap-1.5"><span className="w-5 border-t-2 border-dashed border-brand-navy/70 dark:border-brand-sky" />Loser advances</span><span>SPH fixtures outlined</span></p>
      <ul className="sr-only" aria-label="Bracket progression">{lane.edges.map(edge => <li key={`${edge.from}-${edge.to}-${edge.outcome}`}>{edge.outcome} of {matches.get(edge.from)?.stage} advances to {matches.get(edge.to)?.stage}.</li>)}</ul>
    </div>
    <div ref={scrollRef} tabIndex={0} role="region" aria-label={`${lane.title} bracket, scroll to explore`} className={`overflow-auto overscroll-contain bg-subcard outline-offset-[-2px] ${expanded ? 'min-h-0 flex-1' : 'h-[420px]'}`}>
      <div className="mx-auto" style={{ width: width * scale, height: height * scale }}>
        <div className="relative origin-top-left" style={{ width, height, transform: `scale(${scale})` }}>
          <svg width={width} height={height} aria-hidden="true" className="pointer-events-none absolute inset-0">
            {paths.map(edge => <g key={`${edge.from}-${edge.to}-${edge.outcome}`}>
              <title>{`${edge.outcome === 'winner' ? 'Winner' : 'Loser'} of ${matches.get(edge.from)?.stage} → ${matches.get(edge.to)?.stage}`}</title>
              <path d={edge.d} fill="none" stroke="var(--subcard)" strokeWidth="6" strokeLinejoin="round" />
              <path d={edge.d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeDasharray={edge.outcome === 'loser' ? '7 5' : undefined} className={edge.outcome === 'loser' ? 'text-brand-navy/70 dark:text-brand-sky' : 'text-brand-maroon/75 dark:text-red-400/80'} />
            </g>)}
          </svg>
          {lane.rounds.map((round, column) => <div key={round.id}>
            <h4 className="absolute text-center text-[10px] font-black uppercase tracking-wider text-foreground/60" style={{ top: 16, left: EDGE + column * (CARD_WIDTH + COLUMN_GAP), width: CARD_WIDTH }}>{round.title}</h4>
            {round.matchIds.map(id => {
              const match = matches.get(id); const position = positions.get(id);
              return match && position ? <div key={id} className="absolute" style={{ left: position.x, top: position.y, width: CARD_WIDTH, height: CARD_HEIGHT }}><BracketCard match={match} /></div> : null;
            })}
          </div>)}
        </div>
      </div>
    </div>
  </div>;
}

export default function AcscBracket({ snapshot }: { key?: string; snapshot: AcscCompetitionSnapshot }) {
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const title = acscTournamentForTeam(snapshot.teamId)?.title ?? 'ACSC tournament';
  useEffect(() => {
    if (!expanded) return;
    const dialog = dialogRef.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [expanded]);
  if (!acscBracketForTeam(snapshot.teamId)) return null;
  return <section aria-label="Visual tournament bracket" className="overflow-hidden rounded-xl border border-brand-maroon/20 bg-card">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/10 px-3 py-3">
      <div><h3 className="text-sm font-black uppercase">Tournament bracket</h3><p className="mt-1 text-[10px] text-foreground/55">Scroll across rounds, or open the large view.</p></div>
      <button ref={triggerRef} type="button" onClick={() => setExpanded(true)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-brand-maroon px-3 text-xs font-bold text-white"><Maximize2 size={15} />Open large bracket</button>
    </div>
    <BracketView key={snapshot.teamId} snapshot={snapshot} />
    {expanded && createPortal(<dialog ref={dialogRef} onClose={() => setExpanded(false)} aria-labelledby={titleId} className="fixed inset-0 m-auto h-[calc(100dvh-24px)] max-h-none w-[calc(100vw-24px)] max-w-none overflow-hidden rounded-2xl border border-border/20 bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/60">
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex shrink-0 items-center gap-3 border-b border-border/10 px-4 py-3">
          <img src={ACSC_LOGO} alt="ACSC" className="h-10 w-10 rounded-lg bg-white object-contain p-1" />
          <div className="min-w-0 flex-1"><h2 id={titleId} className="text-sm font-black uppercase">{title}</h2><p className="mt-0.5 text-[10px] text-foreground/60">Tournament bracket · verified results</p></div>
          <button autoFocus type="button" aria-label="Close large bracket" onClick={() => setExpanded(false)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/15"><X size={18} /></button>
        </div>
        <div className="min-h-0 flex-1"><BracketView key={snapshot.teamId} snapshot={snapshot} expanded /></div>
      </div>
    </dialog>, document.body)}
  </section>;
}
