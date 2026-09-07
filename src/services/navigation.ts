import { TEAM_CATALOG } from '../config/teamCatalog';
import { AppTab } from '../types';

const pages: Record<string, AppTab> = { home: 'Home', schedule: 'Schedule', teams: 'Teams', standings: 'Standings', news: 'News', login: 'Login' };
export function parseRoute(hash: string, prototype = false) {
  const [path, query = ''] = hash.replace(/^#\/?/, '').split('?');
  const parts = path.split('/');
  if (parts[0] === 'teams' && parts.length > 1) {
    const team = TEAM_CATALOG.find(team => team.id === parts[1] && parts.length === 2 && (prototype || team.production));
    return { tab: team ? 'TeamPage' as const : 'Teams' as const, team, query };
  }
  return { tab: pages[path] ?? 'Home', team: undefined, query };
}
export function parseScheduleQuery(query: string, seasons: readonly string[], defaultSeason: string) {
  const params = new URLSearchParams(query);
  const season = params.get('season') ?? '';
  const team = params.get('team') ?? '';
  return {
    season: seasons.includes(season) ? season : defaultSeason,
    team: ['All', 'VBS', 'VGS', 'VBV', 'VGV', 'SMPBB', 'SMPGB'].includes(team) ? team : 'All',
    scope: params.get('scope') === 'practices' ? 'practices' as const : 'games' as const,
    view: params.get('view') === 'calendar' ? 'calendar' as const : 'list' as const,
  };
}
