import { acscMatchFinished, acscResultsForTeam } from '../data/acscCompetitionResults2026';
import type { AcscCompetitionMatch, AcscCompetitionSnapshot } from '../data/acscCompetitionTypes';
import { ACSC_LOGO, acscSchoolForName } from '../data/acscSchools';
import { scheduleTimeLabel } from '../utils/scheduleTime';

function School({ name }: { name: string }) {
  const school = acscSchoolForName(name);
  return <span className="inline-flex min-w-0 items-center gap-1.5">
    {school && <img src={school.logo} alt="" className="h-5 w-5 shrink-0 rounded-full bg-white object-contain p-0.5" />}
    <span>{school?.shortName ?? name}</span>
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
  return <section aria-label="ACSC standings and playoffs" className="space-y-4 rounded-2xl border border-brand-maroon/20 bg-subcard/50 p-4">
    <div className="flex items-center gap-3">
      <img src={ACSC_LOGO} alt="ACSC" className="h-11 w-11 rounded-xl bg-white object-contain p-1" />
      <div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-brand-red">International tournament</p><h2 className="text-lg font-black uppercase">ACSC results & playoffs</h2></div>
    </div>
    <p className="text-xs font-semibold leading-relaxed">{snapshot.summary}</p>
    {snapshot.caveat && <p className="text-xs leading-relaxed text-foreground/60">{snapshot.caveat}</p>}
    {snapshot.finalPlacements && <div>
      <h3 className="mb-2 text-xs font-black uppercase tracking-wide">Final tournament standings</h3>
      <ol className="overflow-hidden rounded-xl border border-border/10">
        {snapshot.finalPlacements.map(row => <li key={row.school} className={`flex items-center gap-3 border-b border-border/10 px-3 py-2 text-xs last:border-b-0 ${row.school === 'SPH' ? 'bg-brand-maroon/[0.07] font-black' : 'font-semibold'}`}>
          <span className="w-4 font-mono">{row.rank}</span><School name={row.school} />
        </li>)}
      </ol>
    </div>}
    {sphAwards.length > 0 && <div>
      <h3 className="mb-2 text-xs font-black uppercase tracking-wide">SPH tournament awards</h3>
      <ul className="space-y-2">{sphAwards.map(award => <li key={`${award.school}-${award.label}-${award.recipient ?? ''}`} className="rounded-xl border border-brand-maroon/15 bg-brand-maroon/[0.04] p-3 text-xs">
        <p className="font-black">{award.recipient ?? acscSchoolForName(award.school)?.shortName ?? award.school}</p>
        <p className="mt-1 text-foreground/60">{award.label}</p>
      </li>)}</ul>
    </div>}
    {next.length > 0 && <div>
      <h3 className="mb-2 text-xs font-black uppercase tracking-wide">Confirmed SPH fixtures</h3>
      <ul className="space-y-2">{next.map(match => <Match key={match.id} match={match} snapshot={snapshot} />)}</ul>
    </div>}
    {snapshot.pools.map(pool => <div key={pool.name}>
      <h3 className="mb-2 text-xs font-black uppercase tracking-wide">{pool.name} · {pool.complete ? 'Pool play complete' : snapshot.complete ? 'Official pool standings' : 'Results so far'}</h3>
      <div className="overflow-x-auto rounded-xl border border-border/10">
        <table className="w-full text-left text-[11px]">
          <caption className="sr-only">{pool.name} ACSC standings</caption>
          <thead className="bg-brand-maroon/5 text-[9px] uppercase text-foreground/60"><tr>
            <th className="px-2 py-2" scope="col">#</th><th className="py-2" scope="col">School</th>
            <th scope="col">P</th><th scope="col">W</th>{snapshot.sport === 'Soccer' && <th scope="col">D</th>}<th scope="col">L</th>
            <th className="pr-2" scope="col">{snapshot.sport === 'Soccer' ? 'Goals' : 'Sets'}</th>
            {pool.rows.some(row => row.points !== undefined) && <th className="pr-2" scope="col">Pts</th>}
          </tr></thead>
          <tbody>{pool.rows.map(row => <tr key={row.school} className={`border-t border-border/10 ${row.school === 'SPH' ? 'bg-brand-maroon/[0.07] font-black' : 'font-semibold'}`}>
            <td className="px-2 py-2">{row.rank ?? '—'}</td><th className="py-2 pr-2" scope="row"><School name={row.school} /></th>
            <td>{row.played}</td><td>{row.wins}</td>{snapshot.sport === 'Soccer' && <td>{row.draws ?? 0}</td>}<td>{row.losses}</td>
            <td className="pr-2 whitespace-nowrap">{row.forValue !== undefined && row.againstValue !== undefined ? `${row.forValue}–${row.againstValue}` : '—'}</td>
            {pool.rows.some(item => item.points !== undefined) && <td className="pr-2">{row.points ?? '—'}</td>}
          </tr>)}</tbody>
        </table>
      </div>
    </div>)}
    <details open className="rounded-xl border border-border/10 p-3">
      <summary className="cursor-pointer text-xs font-black uppercase">Playoff bracket</summary>
      <p className="my-2 text-[10px] leading-relaxed text-foreground/60">{snapshot.complete ? 'Tournament complete. Unpublished or conflicting scores remain unreported.' : 'Winner and loser labels are conditional. A scheduled match is not a confirmed result.'}</p>
      <ul className="space-y-2">{playoffs.map(match => <Match key={match.id} match={match} snapshot={snapshot} />)}</ul>
    </details>
    <details className="rounded-xl border border-border/10 p-3">
      <summary className="cursor-pointer text-xs font-black uppercase">All schools · {results.length} confirmed results</summary>
      <ul className="mt-3 space-y-2">{results.map(match => <Match key={match.id} match={match} snapshot={snapshot} />)}</ul>
    </details>
    <p className="text-[10px] leading-relaxed text-foreground/55">Verified {new Date(snapshot.verifiedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })} WIB · <a href={snapshot.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-maroon underline underline-offset-2">{snapshot.sourceLabel}</a></p>
  </section>;
}
