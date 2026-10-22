import type { ScheduleEvent } from './scheduleTypes';
import { ACSC_SOCCER_2026 } from './acscSoccer2026';
import { ACSC_BOYS_VOLLEYBALL_2026 } from './acscBoysVolleyball2026';
import { ACSC_GIRLS_VOLLEYBALL_2026 } from './acscGirlsVolleyball2026';

export const ACSC_TOURNAMENTS = [
  {
    ...ACSC_SOCCER_2026,
    id: 'acsc-soccer-boys-2026',
    teamId: 'soccer-sma-boys',
    scheduleUrl: ACSC_SOCCER_2026.scheduleUrl,
    sourceNote: 'Pool play is complete. Playoff opponents depend on quarterfinal results.',
  },
  ACSC_GIRLS_VOLLEYBALL_2026,
  ACSC_BOYS_VOLLEYBALL_2026,
] as const;

export function acscTournamentForTeam(teamId?: string) {
  return ACSC_TOURNAMENTS.find(tournament => tournament.teamId === teamId);
}

export function acscTournamentForEvent(event: ScheduleEvent) {
  return ACSC_TOURNAMENTS.find(tournament => tournament.id === event.tournamentId);
}
