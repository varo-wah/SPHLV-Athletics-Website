export interface AcscBracketRound {
  id: string;
  title: string;
  matchIds: string[];
}

export interface AcscBracketEdge {
  from: string;
  to: string;
  outcome: 'winner' | 'loser';
}

export interface AcscBracketLane {
  id: string;
  title: string;
  description?: string;
  rounds: AcscBracketRound[];
  edges: AcscBracketEdge[];
  /** Zero-based vertical slots; fractional positions may sit between two feeders. */
  rowByMatchId?: Record<string, number>;
}

export interface AcscBracketDefinition {
  teamId: string;
  lanes: AcscBracketLane[];
}

const edge = (from: string, to: string, outcome: AcscBracketEdge['outcome'] = 'winner'): AcscBracketEdge => ({ from, to, outcome });
const soccer = (game: string) => `acsc-soccer-2026-${game}`;
const girls = (game: number) => `acsc-girls-volleyball-2026-g${game}`;
const boys = (game: number | 'exhibition') => `acsc-bvb-2026-playoff-${game}`;

/** Connections only: scores, schools, times and awards remain in the reviewed result snapshots. */
export const ACSC_BRACKETS: AcscBracketDefinition[] = [
  {
    teamId: 'soccer-sma-boys',
    lanes: [
      {
        id: 'complete', title: 'Complete tournament bracket',
        description: 'Follow every team from the quarterfinals to its final placement. Solid lines show winners advancing; dashed lines show losers entering consolation or placement matches.',
        rounds: [
          { id: 'quarterfinals', title: 'Quarterfinals', matchIds: ['q1', 'q2', 'q3', 'q4'].map(soccer) },
          { id: 'semifinals', title: 'Semifinals & consolation', matchIds: ['g6', 'g8', 'g5', 'g7'].map(soccer) },
          { id: 'placements', title: 'Final & placement matches', matchIds: ['final', 'g11', 'g9', 'g10'].map(soccer) },
        ],
        edges: [
          edge(soccer('q1'), soccer('g6')), edge(soccer('q2'), soccer('g6')),
          edge(soccer('q3'), soccer('g8')), edge(soccer('q4'), soccer('g8')),
          edge(soccer('q1'), soccer('g5'), 'loser'), edge(soccer('q2'), soccer('g5'), 'loser'),
          edge(soccer('q3'), soccer('g7'), 'loser'), edge(soccer('q4'), soccer('g7'), 'loser'),
          edge(soccer('g6'), soccer('final')), edge(soccer('g8'), soccer('final')),
          edge(soccer('g6'), soccer('g11'), 'loser'), edge(soccer('g8'), soccer('g11'), 'loser'),
          edge(soccer('g5'), soccer('g9')), edge(soccer('g7'), soccer('g9')),
          edge(soccer('g5'), soccer('g10'), 'loser'), edge(soccer('g7'), soccer('g10'), 'loser'),
        ],
      },
    ],
  },
  {
    teamId: 'volleyball-sma-girls',
    lanes: [
      {
        id: 'complete', title: 'Complete tournament bracket',
        description: 'Follow every team from the quarterfinals to its final placement. Solid lines show winners advancing; dashed lines show losers entering consolation or placement matches.',
        rounds: [
          { id: 'quarterfinals', title: 'Quarterfinals', matchIds: [1, 2, 3, 4].map(girls) },
          { id: 'semifinals', title: 'Semifinals & consolation', matchIds: [7, 8, 5, 6].map(girls) },
          { id: 'placements', title: 'Final & placement matches', matchIds: [11, 12, 9, 10].map(girls) },
        ],
        edges: [
          edge(girls(1), girls(7)), edge(girls(2), girls(7)),
          edge(girls(3), girls(8)), edge(girls(4), girls(8)),
          edge(girls(1), girls(5), 'loser'), edge(girls(2), girls(5), 'loser'),
          edge(girls(3), girls(6), 'loser'), edge(girls(4), girls(6), 'loser'),
          edge(girls(7), girls(11)), edge(girls(8), girls(11)),
          edge(girls(7), girls(12), 'loser'), edge(girls(8), girls(12), 'loser'),
          edge(girls(5), girls(9)), edge(girls(6), girls(9)),
          edge(girls(5), girls(10), 'loser'), edge(girls(6), girls(10), 'loser'),
        ],
      },
    ],
  },
  {
    teamId: 'volleyball-sma-boys',
    lanes: [
      {
        id: 'double-elimination', title: 'Double-elimination bracket',
        description: 'Faith enters at M4 with a bye. M7 eliminates seventh place; M10 decides fifth/sixth; the losers of M11 and M12 finish fourth and third. Exact match scores remain unreported.',
        rounds: [
          { id: 'opening', title: 'Opening matches', matchIds: [1, 2, 3].map(boys) },
          { id: 'upper-lower', title: 'Upper & lower paths', matchIds: [4, 5, 7].map(boys) },
          { id: 'advancement', title: 'Advancement matches', matchIds: [6, 8, 9].map(boys) },
          { id: 'placements', title: 'Placement matches', matchIds: [11, 10].map(boys) },
          { id: 'qualifier', title: 'Final qualifier', matchIds: [12].map(boys) },
          { id: 'championship', title: 'Championship', matchIds: [13].map(boys) },
        ],
        // Explicit Winner/Loser feeders were published in the October 23 bracket,
        // retained at commit 161715eb; the final named bracket confirms these paths.
        edges: [
          edge(boys(1), boys(4)), edge(boys(1), boys(9), 'loser'),
          edge(boys(2), boys(5)), edge(boys(2), boys(7), 'loser'),
          edge(boys(3), boys(5)), edge(boys(3), boys(7), 'loser'),
          edge(boys(4), boys(6)), edge(boys(4), boys(8), 'loser'),
          edge(boys(5), boys(6)), edge(boys(5), boys(9), 'loser'),
          edge(boys(7), boys(8)),
          edge(boys(8), boys(11)), edge(boys(8), boys(10), 'loser'),
          edge(boys(9), boys(11)), edge(boys(9), boys(10), 'loser'),
          edge(boys(6), boys(13)), edge(boys(6), boys(12), 'loser'),
          edge(boys(11), boys(12)), edge(boys(12), boys(13)),
        ],
        rowByMatchId: Object.fromEntries([
          [1, 0], [2, 1], [3, 2], [4, 0], [5, 1], [7, 2], [6, 0], [8, 1], [9, 2],
          [11, 1], [10, 2], [12, 0.5], [13, 0],
        ].map(([game, row]) => [boys(game), row])),
      },
      {
        id: 'exhibition', title: 'Exhibition',
        description: 'SPH vs ICS Bangkok is listed separately as an exhibition. It does not change the final standings.',
        rounds: [{ id: 'exhibition', title: 'Exhibition match', matchIds: [boys('exhibition')] }],
        edges: [],
      },
    ],
  },
];

export function acscBracketForTeam(teamId?: string): AcscBracketDefinition | undefined {
  return ACSC_BRACKETS.find(bracket => bracket.teamId === teamId);
}
