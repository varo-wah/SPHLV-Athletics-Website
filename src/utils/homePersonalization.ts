import { ScheduleEvent } from '../data/scheduleTypes';
import { scheduleTimestamp } from './scheduleTime';
import { isCompetitiveScheduleEvent } from '../services/masterScheduleParser';
import { SheetMatch } from '../services/parsers';
import { DivisionTab, GenderTab, SportTab } from '../types';
import { FavoriteTeam } from './teamFavorites';

export interface FavoriteTeamSummary {
  favorite: FavoriteTeam;
  nextEvent: ScheduleEvent | null;
  recentMatch: SheetMatch | null;
}

interface TeamIdentity {
  sportKey?: SportTab;
  level?: DivisionTab;
  genderGroup?: GenderTab;
}


function matchTimestamp(match: SheetMatch) {
  const parsed = new Date(`${match.date || match.reportedDate || ''} ${match.time || '00:00'}`).getTime();
  return Number.isNaN(parsed) ? Number.MIN_SAFE_INTEGER : parsed;
}

export function buildFavoriteTeamSummaries(
  favorites: readonly FavoriteTeam[],
  events: readonly ScheduleEvent[],
  matches: readonly SheetMatch[],
  todayIso: string,
  isVisibleEvent: (event: ScheduleEvent) => boolean,
): FavoriteTeamSummary[] {
  return favorites.map((favorite) => {
    const matchesFavorite = ({ sportKey, level, genderGroup }: TeamIdentity) => (
      sportKey === favorite.sport
      && level === favorite.division
      && genderGroup === favorite.gender
    );

    const nextEvent = events
      .filter((event) => (
        matchesFavorite(event)
        && isCompetitiveScheduleEvent(event)
        && Boolean(event.date && event.date >= todayIso)
        && isVisibleEvent(event)
      ))
      .sort((a, b) => scheduleTimestamp(a) - scheduleTimestamp(b))[0] || null;

    const recentMatch = matches
      .filter((match) => (
        matchesFavorite(match)
        && match.status === 'Finished'
        && match.scoreFor !== null
        && match.scoreAgainst !== null
      ))
      .sort((a, b) => matchTimestamp(b) - matchTimestamp(a))[0] || null;

    return { favorite, nextEvent, recentMatch };
  });
}
