import type { OfficialStandingMatchup } from '../data/officialStandings';

interface LadderRow {
  team: string;
  points: number;
}

interface StandingsLadderMatrixProps {
  title: string;
  rows: readonly LadderRow[];
  matchups: readonly OfficialStandingMatchup[];
  accent: string;
}

function scoreFor(
  rowTeam: string,
  columnTeam: string,
  matchups: readonly OfficialStandingMatchup[],
) {
  const matchup = matchups.find(
    ({ teamA, teamB }) =>
      (teamA === rowTeam && teamB === columnTeam) ||
      (teamA === columnTeam && teamB === rowTeam),
  );

  if (!matchup) return '';

  return matchup.teamA === rowTeam
    ? `${matchup.scoreA}-${matchup.scoreB}`
    : `${matchup.scoreB}-${matchup.scoreA}`;
}

export default function StandingsLadderMatrix({
  title,
  rows,
  matchups,
  accent,
}: StandingsLadderMatrixProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border/10 bg-white shadow-[0_4px_12px_rgba(15,23,42,0.06)] dark:bg-subcard dark:shadow-[0_4px_12px_rgba(0,0,0,0.16)]">
      <div
        className="px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-white"
        style={{ backgroundColor: accent }}
      >
        {title}
      </div>

      <div className="overflow-x-auto overscroll-x-contain">
        <table className="min-w-[760px] border-collapse text-center text-[10px] font-bold text-foreground">
          <caption className="sr-only">{title} head-to-head results</caption>
          <thead>
            <tr className="bg-[#F1F2F3] dark:bg-muted">
              <th className="sticky left-0 z-20 w-20 border border-border/15 bg-[#F1F2F3] px-2 py-2 text-left uppercase tracking-wide dark:bg-muted">
                Team
              </th>
              {rows.map(({ team }) => (
                <th
                  key={team}
                  className="min-w-16 border border-border/15 px-2 py-2 uppercase tracking-wide"
                >
                  {team}
                </th>
              ))}
              <th className="min-w-16 border border-border/15 bg-[#DCEAF4] px-2 py-2 uppercase tracking-wide text-[#003049] dark:bg-[#669BBC]/25 dark:text-[#8FC1DD]">
                Points
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map(({ team, points }) => (
              <tr key={team}>
                <th className="sticky left-0 z-10 border border-border/15 bg-white px-2 py-2 text-left uppercase tracking-wide dark:bg-subcard">
                  {team}
                </th>
                {rows.map(({ team: opponent }) => {
                  const isSelf = opponent === team;
                  const score = isSelf ? '' : scoreFor(team, opponent, matchups);

                  return (
                    <td
                      key={opponent}
                      aria-label={
                        isSelf
                          ? `${team} against itself`
                          : score
                            ? `${team} ${score} ${opponent}`
                            : `${team} versus ${opponent}, not played`
                      }
                      className={`h-9 border border-border/15 font-mono ${
                        isSelf
                          ? 'bg-[#111111] dark:bg-black'
                          : 'bg-white dark:bg-subcard'
                      }`}
                    >
                      {score}
                    </td>
                  );
                })}
                <td className="border border-border/15 bg-[#DCEAF4] px-2 py-2 font-mono text-xs font-black text-[#003049] dark:bg-[#669BBC]/25 dark:text-[#8FC1DD]">
                  {points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="border-t border-border/10 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-foreground/40">
        Scroll sideways to view every opponent
      </p>
    </section>
  );
}
