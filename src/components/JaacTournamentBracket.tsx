import { useEffect, useRef, useState } from 'react';
import { OFFICIAL_STANDINGS_SOURCES } from '../data/officialStandings';
import { jaacSchoolForName } from '../data/jaacSchools';
import { jaacPlayoffsForTeam, type JaacPlayoffMatch } from '../data/jaacPlayoffs2026';
import type { SheetMatch } from '../services/parsers';

function MatchCard({ match }: { key?: string; match: JaacPlayoffMatch }) {
  const date = match.date && new Date(`${match.date}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', timeZone: 'UTC',
  });
  return <li className="overflow-hidden rounded-xl border border-border/15 bg-card">
    <div className="flex items-center justify-between gap-2 border-b border-border/10 px-3 py-2 text-[10px] font-bold text-foreground/60">
      <span>{match.stage}</span>{date && <time dateTime={match.date}>{date}</time>}
    </div>
    {match.schools.map((name, index) => {
      const school = jaacSchoolForName(name);
      const won = match.scores && match.scores[index] > match.scores[1 - index];
      return <div key={name} data-school={school?.code ?? name} data-stage={match.stage} className={`flex items-center gap-2 px-3 py-2 text-sm ${won ? 'bg-brand-maroon/[0.06] font-black' : 'font-semibold'}`}>
        {school && <img src={school.logo} alt="" className="h-5 w-5 shrink-0 rounded-full bg-white object-contain" />}
        <span className="min-w-0 flex-1" title={school?.name}>{name}</span>
        <span className="font-mono tabular-nums">{match.scores?.[index] ?? '—'}</span>
      </div>;
    })}
    {!match.scores && <p className="px-3 pb-2 text-xs text-foreground/60">Score pending</p>}
  </li>;
}

export default function JaacTournamentBracket({ teamId, matches }: { teamId?: string; matches: readonly SheetMatch[] }) {
  const panel = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<{ school: string; path: string; third: boolean }[]>([]);
  useEffect(() => {
    const rounds: HTMLDivElement | null = panel.current;
    if (!rounds) return;
    const measure = () => {
      const bounds = rounds.getBoundingClientRect();
      const rows = Array.from(rounds.querySelectorAll<HTMLElement>('[data-school]'));
      const semis = rows.filter(row => row.dataset.stage === 'Semifinal');
      const edges = rows.filter(row => row.dataset.stage !== 'Semifinal').flatMap(row => {
        const source = semis.find(semi => semi.dataset.school === row.dataset.school);
        if (!source) return [];
        const from = source.getBoundingClientRect(), to = row.getBoundingClientRect();
        if (to.left <= from.right) return []; // Compact rounds stack vertically.
        return [{ x1: from.right - bounds.left, x2: to.left - bounds.left,
          y1: from.top + from.height / 2 - bounds.top, y2: to.top + to.height / 2 - bounds.top,
          school: row.dataset.school!, third: row.dataset.stage === 'Third place' }];
      });
      setPaths(edges.map(({ x1, x2, y1, y2, school, third }, index) => ({
        school, third, path: `M${x1} ${y1} H${x1 + (x2 - x1) * (index + 1) / (edges.length + 1)} V${y2} H${x2}`,
      })));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(rounds);
    return () => observer.disconnect();
  }, [teamId, matches]);
  if (!teamId) return null;
  const games = jaacPlayoffsForTeam(teamId, matches);
  if (!games.length) return null;
  const semis = games.filter(game => game.stage === 'Semifinal');
  const finals = [...games.filter(game => game.stage === 'Final'), ...games.filter(game => game.stage === 'Third place')];
  const sourceUrl = teamId.startsWith('soccer-') ? OFFICIAL_STANDINGS_SOURCES.Soccer :
    teamId.startsWith('volleyball-') ? OFFICIAL_STANDINGS_SOURCES.Volleyball : null;
  return <section aria-label="JAAC tournament bracket" className="mt-8 rounded-2xl border border-brand-maroon/15 bg-subcard/50 p-4">
    <h2 className="text-lg font-black uppercase">JAAC tournament bracket</h2>
    <div ref={panel} className="jaac-playoff-rounds relative mt-4 grid gap-8">
      <svg aria-hidden="true" width="100%" height="100%" className="pointer-events-none absolute inset-0">
        {paths.map(edge => <path key={edge.school} d={edge.path} fill="none" stroke="currentColor" strokeWidth="2"
          strokeDasharray={edge.third ? '5 4' : undefined} className={edge.third ? 'text-foreground/45' : 'text-brand-maroon/65 dark:text-red-300/70'} />)}
      </svg>
      {[{ label: 'Semifinals', games: semis }, { label: 'Finals', games: finals }].filter(round => round.games.length > 0).map(round =>
        <div key={round.label}>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-foreground/65">{round.label}</h3>
          <ul className="space-y-2">{round.games.map(game => <MatchCard key={game.schools.join('-')} match={game} />)}</ul>
        </div>)}
    </div>
    <p className="mt-3 text-[11px] font-semibold text-foreground/55">
      {sourceUrl ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Official JAAC fixtures &amp; results</a> : 'Source: GameDay Summaries'}
    </p>
  </section>;
}
