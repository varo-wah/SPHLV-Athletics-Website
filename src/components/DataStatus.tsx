import { RefreshCw } from 'lucide-react';
import { TEAM_CATALOG } from '../config/teamCatalog';
import type { AthleticsDataState } from '../hooks/useAthleticsData';

export default function DataStatus({ state, tab, teamId }: { state: AthleticsDataState; tab: string; teamId?: string }) {
  const team = TEAM_CATALOG.find(team => team.id === teamId);
  const teamSource = state.data.resultSourceStates.find(source => source.teamId === teamId);
  const sources = state.remoteSources.filter(source => tab === 'Standings'
    ? source.kind === 'standings'
    : tab === 'TeamPage'
      ? source.id === teamSource?.sourceId || source.id === `${team?.sport.toLowerCase()}-${team?.gender}-standings`
      : source.kind === 'results');
  const unavailable = Boolean(state.error) || sources.some(source => source.failed || !source.configured);
  const busy = state.loading || state.refreshing;
  const publishedAt = sources.map(source => source.publishedAt).filter((date): date is string => Boolean(date)).sort()[0];
  const dateLabel = publishedAt && !Number.isNaN(Date.parse(publishedAt))
    ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'Asia/Jakarta' })
    : null;

  return (
    <section aria-label="Data status" className="mx-6 mb-4 mt-8 flex items-center justify-between gap-4 border-t border-foreground/10 pt-4">
      <p role="status" aria-live="polite" className="text-xs leading-5 text-foreground/50">
        {busy ? 'Checking for updates…' : unavailable ? 'Couldn’t update all data. Try again.' : dateLabel ? `Data updated ${dateLabel}` : 'Published athletics data'}
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={() => void state.refresh()}
        aria-label={unavailable ? 'Retry data update' : 'Refresh athletics data'}
        className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-brand-maroon/15 bg-brand-maroon/5 px-4 text-xs font-semibold text-brand-maroon transition-colors hover:bg-brand-maroon/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-maroon disabled:cursor-wait disabled:opacity-50 dark:border-white/15 dark:bg-white/5 dark:text-white/75 dark:hover:bg-white/10"
      >
        <RefreshCw aria-hidden="true" size={14} className={busy ? 'motion-safe:animate-spin' : ''} />
        {busy ? 'Updating' : unavailable ? 'Retry' : 'Refresh'}
      </button>
    </section>
  );
}
