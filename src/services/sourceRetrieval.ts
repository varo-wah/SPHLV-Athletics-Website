import { hasValidSheetUrl } from "../config/sheets";

export interface RemoteSourceState {
  id: string;
  label: string;
  kind: "results" | "standings" | "schedule";
  configured: boolean;
  failed: boolean;
  fromCache: boolean;
  lastSuccess: string | null;
  lastAttempt: string | null;
  publishedAt: string | null;
}

export function createSourceRetriever(cache: Map<string, { value: unknown; lastSuccess: string; publishedAt?: string | null }>, sourceStates: RemoteSourceState[], now = () => new Date().toISOString(), publishedAt: () => string | null = () => null) {
  return async function retrieve<T>(id: string, label: string, kind: RemoteSourceState['kind'], url: string, fetcher: (url: string) => Promise<T>, empty: T) {
      const configured = hasValidSheetUrl(url);
      const previous = cache.get(id);
      const state: RemoteSourceState = { id, label, kind, configured, failed: false, fromCache: false, lastSuccess: previous?.lastSuccess ?? null, publishedAt: previous?.publishedAt ?? null, lastAttempt: configured ? now() : null };
      sourceStates.push(state);
      if (!configured) return { rows: empty, failed: false };
      try {
        const value = await fetcher(url);
        state.lastSuccess = now();
        state.publishedAt = publishedAt();
        cache.set(id, { value, lastSuccess: state.lastSuccess, publishedAt: state.publishedAt });
        return { rows: value, failed: false };
      } catch {
        state.failed = true;
        state.fromCache = Boolean(previous);
        return { rows: (previous?.value as T) ?? empty, failed: true };
      }
    }
}
