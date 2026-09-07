import { IS_PROTOTYPE, LAUNCH_SEASON } from '../config/launchSports';
import { TEAM_CATALOG } from '../config/teamCatalog';
import { useHashRoute } from '../hooks/useHashRoute';
import { AthleticsDataState } from '../hooks/useAthleticsData';

export default function DataStatus({ state, tab, teamId }: { state: AthleticsDataState; tab: string; teamId?: string }) {
  const scheduleSeason = new URLSearchParams(useHashRoute().split('?')[1] ?? '').get('season') ?? LAUNCH_SEASON;
  const team = TEAM_CATALOG.find(team => team.id === teamId);
  const teamSource = state.data.resultSourceStates.find(source => source.teamId === teamId);
  const sources = state.remoteSources.filter(source => tab === 'Schedule' ? IS_PROTOTYPE && source.kind === 'schedule' && source.label === scheduleSeason : tab === 'Standings' ? source.kind === 'standings' : tab === 'TeamPage' ? source.id === teamSource?.sourceId || source.id === `${team?.sport.toLowerCase()}-standings` : source.kind === 'results');
  const unavailable = sources.some(source => source.failed || !source.configured);
  const resultStates = tab === 'TeamPage' ? state.data.resultSourceStates.filter(source => source.teamId === teamId) : state.data.resultSourceStates;
  const missingResults = ['Home', 'TeamPage'].includes(tab) && resultStates.some(source => !source.configured);
  return (
    <section aria-label="Data status" className="mx-4 mt-3 rounded-xl border border-border/10 bg-subcard px-3 py-2 text-xs text-foreground/70">
      <div role="status" aria-live="polite">
        {state.loading ? <p>Loading published results…</p> : <>
          {tab === 'Schedule' && <p>Season 1 uses the published schedule included with this website. Refresh checks remote feeds only.</p>}
          {tab === 'Standings' && <p>Standings use the official published records included with this website.</p>}
          {state.error && <p>Data is temporarily unavailable. Please retry.</p>}
          {missingResults && <p>Some results are not available yet.</p>}
          {sources.length > 0 && <details>
            <summary className="cursor-pointer py-1">{unavailable ? 'Some data is unavailable — view details' : 'Data freshness — view details'}</summary>
          {sources.map(source => <p className="mt-1" key={source.id}>
            {source.label}: {!source.configured ? 'not available yet' : source.failed ? source.fromCache ? 'showing saved data; refresh failed' : 'temporarily unavailable' : 'published data loaded'}
            {source.publishedAt && <> · Snapshot {new Date(source.publishedAt).toLocaleString()}</>}
            {source.lastSuccess && <> · Last checked {new Date(source.lastSuccess).toLocaleString()}</>}
          </p>)}
          </details>}
          {state.data.invalidResultRowCount > 0 && ['Home', 'TeamPage'].includes(tab) && <p>Some incomplete results could not be displayed.</p>}
        </>}
      </div>
      <button type="button" disabled={state.loading || state.refreshing} onClick={() => void state.refresh()} className="mt-2 min-h-11 rounded-lg border border-border/20 px-3 font-semibold focus-visible:outline focus-visible:outline-2 disabled:opacity-50">
        {state.loading ? 'Loading…' : state.refreshing ? 'Refreshing…' : unavailable || missingResults || state.error ? 'Retry' : 'Refresh data'}
      </button>
    </section>
  );
}
