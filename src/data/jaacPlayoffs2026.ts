import type { SheetMatch } from '../services/parsers';
import { jaacSchoolForName } from './jaacSchools';

type Stage = 'Semifinal' | 'Final' | 'Third place';

export interface JaacPlayoffMatch {
  stage: Stage;
  schools: [string, string];
  scores: [number, number] | null;
  date?: string;
}

// Other schools' named matches from the league's 2026/27 standings and schedule tabs.
// SPH fixtures below reuse the same reviewed results displayed on the team's Games tab.
const otherPlayoffMatches: Record<string, JaacPlayoffMatch[]> = {
  'volleyball-sma-boys': [
    { stage: 'Semifinal', schools: ['GJS', 'BSJ'], scores: [3, 2], date: '2026-10-31' },
    { stage: 'Third place', schools: ['STL', 'BSJ'], scores: [2, 1], date: '2026-10-31' },
  ],
  'soccer-sma-boys': [
    { stage: 'Semifinal', schools: ['GJS', 'STL'], scores: [4, 1] },
    { stage: 'Final', schools: ['GJS', 'BSJ'], scores: null },
  ],
  'soccer-sma-girls': [
    { stage: 'Semifinal', schools: ['STL', 'SPH-KV'], scores: [4, 3], date: '2026-10-24' },
  ],
};

export function jaacPlayoffsForTeam(teamId: string, matches: readonly SheetMatch[]): JaacPlayoffMatch[] {
  const games = [...(otherPlayoffMatches[teamId] ?? [])];
  for (const match of matches) {
    if (match.teamId !== teamId || !match.reviewedFixtureId || match.tournament !== 'JAAC' ||
        match.status !== 'Finished' || match.scoreFor == null || match.scoreAgainst == null) continue;
    const stage = match.matchType === 'JAAC semifinal' ? 'Semifinal' : match.matchType === 'JAAC final' ? 'Final' : null;
    if (!stage) continue;
    const school = jaacSchoolForName(match.opponent);
    const opponent = school?.code === 'SSL' ? 'STL' : school?.code ?? match.opponent;
    games.push({ stage, schools: ['SPH-LV', opponent], scores: [match.scoreFor, match.scoreAgainst], date: match.date || undefined });
  }
  return games;
}
