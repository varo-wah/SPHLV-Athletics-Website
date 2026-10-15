import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SheetMatch } from '../services/parsers';
import { reportsForPlayer } from '../utils/playerReports';

interface PlayerRosterProps {
  key?: string;
  players: readonly string[];
  teamId: string;
  teamName: string;
  matches: readonly SheetMatch[];
  accent: string;
  loading?: boolean;
  formatDate: (date: string | null) => string;
}

export default function PlayerRoster({ players, teamId, teamName, matches, accent, loading = false, formatDate }: PlayerRosterProps) {
  const [openPlayer, setOpenPlayer] = useState<string | null>(null);
  const listId = useId();

  return (
    <div>
      <p className="mb-3 text-xs leading-relaxed text-foreground/55">
        Select a player to see their reported game stats. Report coverage varies by game.
      </p>
      <ol className="overflow-hidden rounded-2xl border border-border/10 bg-subcard" aria-label={`${teamName} player roster`}>
        {players.map((player, index) => {
          const reports = reportsForPlayer(player, players, teamId, matches);
          const open = openPlayer === player;
          const panelId = `${listId}-player-${index}`;
          return (
            <li key={player} data-player-name={player} className="border-b border-border/10 last:border-b-0">
              <button
                type="button"
                id={`${panelId}-trigger`}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenPlayer(open ? null : player)}
                className="flex min-h-[76px] w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-foreground/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-sky"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white" style={{ backgroundColor: accent }} aria-hidden="true">
                  {player.split(/\s+/).map(part => part[0]).slice(0, 2).join('')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold leading-snug text-foreground">{player}</span>
                  <span className="mt-1 block text-[11px] text-foreground/55">
                    {reports.length ? `${reports.length} game report${reports.length === 1 ? '' : 's'}` : loading ? 'Loading game reports…' : 'Stats awaiting a report'}
                  </span>
                </span>
                <ChevronDown size={18} className={`shrink-0 text-foreground/50 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              <div id={panelId} role="region" aria-labelledby={`${panelId}-trigger`} hidden={!open} className="border-t border-border/8 bg-foreground/[0.025] px-4 py-4 sm:px-5">
                {open && (reports.length ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {reports.map(report => (
                      <article key={report.id} className="rounded-xl border border-border/10 bg-subcard p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/55">{formatDate(report.date)} · {report.competition}</p>
                        <h4 className="mt-1 text-sm font-bold text-foreground">vs {report.opponents.join(' / ')}</h4>
                        {report.sharedReport && <p className="mt-2 text-xs leading-relaxed text-foreground/60">Reported across the doubleheader; the individual opponent was not specified.</p>}
                        <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-foreground/80">
                          {report.stats.map(stat => <li key={stat}>{stat}</li>)}
                        </ul>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-foreground/60">{loading ? 'Loading available game reports…' : `No individual game stats have been reported for ${player} yet.`}</p>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
