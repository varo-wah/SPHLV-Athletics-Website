import { acscMatchFinished, acscResultsForTeam } from '../data/acscCompetitionResults2026';
import type { AcscCompetitionMatch, AcscCompetitionSnapshot } from '../data/acscCompetitionTypes';
import { ACSC_LOGO, acscSchoolForName } from '../data/acscSchools';
import { scheduleTimeLabel } from '../utils/scheduleTime';
import AcscBracket from './AcscBracket';

function School({ name, compact = false }: { name: string; compact?: boolean }) {
  const school = acscSchoolForName(name);
  const label = compact && (school?.code === 'ICS-HK' || school?.code === 'ICS-BKK')
    ? school.code.replace('-', ' ') : school?.shortName ?? name;
  return <span className={`inline-flex min-w-0 max-w-full items-center ${compact ? 'gap-1' : 'gap-1.5'}`}>
    {school && <img src={school.logo} alt="" className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} shrink-0 rounded-full bg-white object-contain p-0.5`} />}
    {compact ? <span className="truncate" title={school?.name ?? name}><span aria-hidden="true">{label}</span><span className="sr-only">{school?.name ?? name}</span></span> : <span>{label}</span>}
  </span>;
}

function Match({ match, snapshot }: { key?: string; match: AcscCompetitionMatch; snapshot: AcscCompetitionSnapshot }) {
  const finished = acscMatchFinished(match);
  const date = new Date(`${match.date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  return <li className={`rounded-xl border p-3 ${match.home === 'SPH' || match.away === 'SPH' ? 'border-brand-maroon/25 bg-brand-maroon/[0.04]' : 'border-border/10'}`}>
    <p className="text-[10px] font-bold text-foreground/55">{date} · {match.stage}</p>
    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
      <School name={match.home} />
      <span className="font-mono text-base font-black">{finished ? `${match.homeScore}–${match.awayScore}` : 'vs'}</span>
      <School name={match.away} />
    </div>
    <p className="mt-2 text-[10px] font-semibold text-foreground/60">{finished ? 'Final' : snapshot.complete ? 'Score unreported' : scheduleTimeLabel({ date: match.date, time: match.time, timeZone: snapshot.timeZone })}{match.venue ? ` · ${match.venue}` : ''}</p>
    {match.penalties && <p className="mt-1 text-[10px] font-bold">Penalties: {match.penalties.homeScore}–{match.penalties.awayScore}</p>}
    {match.notes && <p className="mt-1 text-[10px] leading-relaxed text-foreground/60">{match.notes}</p>}
  </li>;
}

/** Host tournament tables stay separate from the domestic JAAC standings. */
export default function AcscCompetitionPanel({ teamId }: { teamId?: string }) {
  const snapshot = acscResultsForTeam(teamId);
  if (!snapshot) return null;
  const results = snapshot.matches.filter(acscMatchFinished);
  const playoffs = snapshot.matches.filter(match => match.kind === 'playoff');
  const sphAwards = snapshot.awards?.filter(award => award.school === 'SPH') ?? [];
  const next = snapshot.complete ? [] : snapshot.matches.filter(match => !acscMatchFinished(match) && (match.home === 'SPH' || match.away === 'SPH'));
  return <section aria-label="ACSC standings and playoffs" className="acsc-competition-panel space-y-4 rounded-2xl border border-brand-maroon/20 bg-subcard/50 p-4">
    <div className="flex items-center gap-3">
      <img src={ACSC_LOGO} alt="ACSC" className="h-11 w-11 rounded-xl bg-white object-contain p-1" />
      <div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-brand-red">International tournament</p><h2 className="text-lg font-black uppercase">ACSC results & playoffs</h2></div>
    </div>
    <p className="text-xs font-semibold leading-relaxed">{snapshot.summary}</p>
    {snapshot.caveat && <p className="text-xs leading-relaxed text-foreground/60">{snapshot.caveat}</p>}
    <div className="acsc-overview-grid space-y-4">
    {snapshot.finalPlacements && <div>
      <h3 className="mb-2 text-xs font-black uppercase tracking-wide">Final tournament standings</h3>
      <ol className="overflow-hidden rounded-xl border border-border/10">
        {snapshot.finalPlacements.map(row => <li key={row.school} className={`flex items-center gap-3 border-b border-border/10 px-3 py-2 text-xs last:border-b-0 ${row.school === 'SPH' ? 'bg-brand-maroon/[0.07] font-black' : 'font-semibold'}`}>
          <span className="w-4 font-mono">{row.rank}</span><School name={row.school} />
        </li>)}
      </ol>
    </div>}
    <div className="acsc-team-highlights space-y-4">
    {sphAwards.length > 0 && <div>
      <h3 className="mb-2 text-xs font-black uppercase tracking-wide">SPH tournament awards</h3>
      <ul className="space-y-2">{sphAwards.map(award => <li key={`${award.school}-${award.label}-${award.recipient ?? ''}`} className="rounded-xl border border-brand-maroon/15 bg-brand-maroon/[0.04] p-3 text-xs">
        <p className="font-black">{award.recipient ?? acscSchoolForName(award.school)?.shortName ?? award.school}</p>
        <p className="mt-1 text-foreground/60">{award.label}</p>
      </li>)}</ul>
    </div>}
    {snapshot.playerStats && <div className="max-w-md">
      <h3 className="mb-2 text-xs font-black uppercase tracking-wide">{snapshot.playerStats.label}</h3>
      <div className="overflow-hidden rounded-xl border border-border/10">
        <table className="w-full table-fixed text-xs tabular-nums">
          <caption className="sr-only">{snapshot.playerStats.label}</caption>
          <colgroup><col /><col className="w-16" /><col className="w-16" /></colgroup>
          <thead className="bg-brand-maroon/5 text-[10px] uppercase text-foreground/60"><tr>
            <th scope="col" className="px-3 py-2 text-left">Player</th>
            <th scope="col" className="py-2 text-center">Goals</th>
            <th scope="col" className="py-2 text-center">Assists</th>
          </tr></thead>
          <tbody>{snapshot.playerStats.players.map(player => <tr key={player.name} className="border-t border-border/10">
            <th scope="row" className="px-3 py-2 text-left font-semibold">{player.name}</th>
            <td className="py-2 text-center font-bold">{player.goals ?? <span aria-label="Not reported">—</span>}</td>
            <td className="py-2 text-center font-bold">{player.assists ?? <span aria-label="Not reported">—</span>}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-foreground/55">{snapshot.playerStats.sourceLabel}. — = not reported.</p>
    </div>}
    </div>
    </div>
    {next.length > 0 && <div>
      <h3 className="mb-2 text-xs font-black uppercase tracking-wide">Confirmed SPH fixtures</h3>
      <ul className="space-y-2">{next.map(match => <Match key={match.id} match={match} snapshot={snapshot} />)}</ul>
    </div>}
    <div className="acsc-pools-grid space-y-4">
    {snapshot.pools.map(pool => <div key={pool.name}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs font-black uppercase tracking-wide">{pool.name}</h3>
        <span className="rounded-full bg-foreground/[0.05] px-2 py-1 text-[9px] font-semibold text-foreground/55">{pool.complete ? 'Pool play complete' : snapshot.complete ? 'Official pool standings' : 'Results so far'}</span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border/10">
        <table className="w-full min-w-[17rem] table-fixed text-[11px] tabular-nums">
          <caption className="sr-only">{pool.name} ACSC standings</caption>
          <colgroup>
            <col className="w-[22px]" /><col />
            <col className="w-6" /><col className="w-6" />{snapshot.sport === 'Soccer' && <col className="w-6" />}<col className="w-6" />
            <col className="w-11" />
            {pool.rows.some(row => row.points !== undefined) && <col className="w-[30px]" />}
          </colgroup>
          <thead className="bg-brand-maroon/5 text-[9px] uppercase text-foreground/60"><tr>
            <th className="py-2.5 text-center" scope="col" aria-label="Rank">#</th><th className="pl-1 text-left" scope="col">School</th>
            <th className="text-center" scope="col" aria-label="Played">P</th><th className="text-center" scope="col" aria-label="Wins">W</th>{snapshot.sport === 'Soccer' && <th className="text-center" scope="col" aria-label="Draws">D</th>}<th className="text-center" scope="col" aria-label="Losses">L</th>
            <th className="text-center" scope="col">{snapshot.sport === 'Soccer' ? 'Goals' : 'Sets'}</th>
            {pool.rows.some(row => row.points !== undefined) && <th className="border-l border-border/10 text-center" scope="col" aria-label="Points">Pts</th>}
          </tr></thead>
          <tbody>{pool.rows.map(row => <tr key={row.school} className={`border-t border-border/10 ${row.school === 'SPH' ? 'bg-brand-maroon/[0.07] font-black' : 'font-semibold'}`}>
            <td className="py-2.5 text-center text-foreground/60">{row.rank ?? '—'}</td><th className="py-2.5 pl-1 pr-1 text-left" scope="row"><School name={row.school} compact /></th>
            <td className="text-center">{row.played}</td><td className="text-center">{row.wins}</td>{snapshot.sport === 'Soccer' && <td className="text-center">{row.draws ?? 0}</td>}<td className="text-center">{row.losses}</td>
            <td className="whitespace-nowrap text-center">{row.forValue !== undefined && row.againstValue !== undefined ? `${row.forValue}–${row.againstValue}` : '—'}</td>
            {pool.rows.some(item => item.points !== undefined) && <td className="border-l border-border/10 text-center font-black">{row.points ?? '—'}</td>}
          </tr>)}</tbody>
        </table>
      </div>
    </div>)}
    </div>
    <AcscBracket key={snapshot.teamId} snapshot={snapshot} />
    <details className="rounded-xl border border-border/10 p-3">
      <summary className="cursor-pointer text-xs font-black uppercase">Playoff match list</summary>
      <p className="my-2 text-[10px] leading-relaxed text-foreground/60">{snapshot.complete ? 'Tournament complete. Unpublished or conflicting scores remain unreported.' : 'Winner and loser labels are conditional. A scheduled match is not a confirmed result.'}</p>
      <ul className="acsc-match-grid space-y-2">{playoffs.map(match => <Match key={match.id} match={match} snapshot={snapshot} />)}</ul>
    </details>
    <details className="rounded-xl border border-border/10 p-3">
      <summary className="cursor-pointer text-xs font-black uppercase">All schools · {results.length} confirmed results</summary>
      <ul className="acsc-match-grid mt-3 space-y-2">{results.map(match => <Match key={match.id} match={match} snapshot={snapshot} />)}</ul>
    </details>
    <p className="text-[10px] leading-relaxed text-foreground/55">Verified {new Date(snapshot.verifiedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })} WIB · <a href={snapshot.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-maroon underline underline-offset-2">{snapshot.sourceLabel}</a></p>
  </section>;
}
