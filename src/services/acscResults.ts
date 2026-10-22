import { ACSC_COMPETITION_RESULTS, acscMatchFinished } from '../data/acscCompetitionResults2026';
import { acscSchoolForName } from '../data/acscSchools';
import type { GameDayUpdate } from '../data/gamedayUpdates';
import type { ScheduleEvent } from '../data/scheduleTypes';
import { acscTournamentForTeam } from '../data/acscTournaments2026';

export function acscGameDayUpdates(): GameDayUpdate[] {
  return ACSC_COMPETITION_RESULTS.flatMap(snapshot => snapshot.matches
    .filter(match => (match.home === 'SPH' || match.away === 'SPH') && acscMatchFinished(match))
    .map(match => {
      const sphHome = match.home === 'SPH';
      return {
        teamId: snapshot.teamId, date: match.date, fixtureId: match.fixtureId ?? match.id,
        opponent: acscSchoolForName(sphHome ? match.away : match.home)?.shortName ?? (sphHome ? match.away : match.home),
        scoreFor: (sphHome ? match.homeScore : match.awayScore)!,
        scoreAgainst: (sphHome ? match.awayScore : match.homeScore)!,
        newFixture: { time: match.time ?? '', venue: match.venue ?? '', locationType: 'Neutral' as const },
        details: {
          tournament: 'ACSC' as const, matchType: `ACSC ${match.stage}`,
          statLeaders: match.statLeaders,
          setScores: match.setScores?.map(score => sphHome ? score : score.split(/[–-]/).reverse().join('–')),
          highlights: match.notes ? [match.notes] : undefined,
        },
      };
    }));
}

/** Reflect confirmed matches in the shared calendar without losing its completed fixtures. */
export function mergeAcscCompetitionSchedule(events: ScheduleEvent[]): ScheduleEvent[] {
  const merged = [...events];
  for (const snapshot of ACSC_COMPETITION_RESULTS) {
    const base = events.find(event => event.tournamentId === snapshot.tournamentId);
    if (!base) continue;
    for (const match of snapshot.matches.filter(item => item.home === 'SPH' || item.away === 'SPH')) {
      const id = match.fixtureId ?? match.id;
      const sphHome = match.home === 'SPH';
      const opponent = acscSchoolForName(sphHome ? match.away : match.home)?.shortName ?? (sphHome ? match.away : match.home);
      let index = merged.findIndex(event => event.id === id);
      if (index < 0) {
        const sameOpponent = merged.map((event, position) => ({ event, position })).filter(({ event }) => (
          event.tournamentId === snapshot.tournamentId && event.date === match.date
          && acscSchoolForName(event.opponent)?.code === acscSchoolForName(opponent)?.code
        ));
        if (sameOpponent.length === 1) index = sameOpponent[0].position;
      }
      const finished = acscMatchFinished(match);
      const resultScore = finished ? `${sphHome ? match.homeScore : match.awayScore}–${sphHome ? match.awayScore : match.homeScore}` : undefined;
      const fixture: ScheduleEvent = {
        ...base, ...(index >= 0 ? merged[index] : {}),
        id, date: match.date, time: match.time, opponent,
        day: new Date(`${match.date}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
        eventText: `ACSC ${match.stage}: SPH vs ${opponent}`,
        timeZone: snapshot.timeZone, location: match.venue ?? base.location,
        details: match.notes ?? match.stage, status: finished ? 'Finished' : 'Scheduled', resultScore,
        sourceUrl: finished ? snapshot.sourceUrl : acscTournamentForTeam(snapshot.teamId)?.scheduleUrl ?? base.sourceUrl,
        sourceLabel: finished ? snapshot.sourceLabel : 'Official ACSC schedule',
        raw: `Verified ${snapshot.verifiedAt}: ${snapshot.sourceLabel}. ${match.id}`,
      };
      if (index >= 0) merged[index] = fixture;
      else merged.push(fixture);
    }
  }
  return merged;
}
