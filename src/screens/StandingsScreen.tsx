import { useState } from "react";
import { AthleticsDataState } from "../hooks/useAthleticsData";

interface StandingsScreenProps {
  athleticsDataState: AthleticsDataState;
}

export default function StandingsScreen({ athleticsDataState }: StandingsScreenProps) {
  const { data, loading, error } = athleticsDataState;
  const [levelFilter, setLevelFilter] = useState<"All" | "SMP" | "SMA">("All");
  const [genderFilter, setGenderFilter] = useState<"All" | "Boys" | "Girls" | "Combined">("All");

  const standings = data.soccerStandings.filter((standing) => {
    if (levelFilter !== "All" && standing.level !== levelFilter) return false;
    if (genderFilter !== "All" && standing.genderGroup !== genderFilter) return false;
    return true;
  });

  return (
    <div className="px-4 pb-24 space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-foreground/45">
          Google Sheets Sync
        </p>
        <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
          Soccer Standings
        </h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {(["All", "SMP", "SMA"] as const).map((level) => (
          <button
            key={level}
            onClick={() => setLevelFilter(level)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
              levelFilter === level
                ? "bg-[#7A001F] text-white border-[#BFD7EA]/30"
                : "bg-subcard text-foreground/50 border-border/10"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {(["All", "Boys", "Girls", "Combined"] as const).map((gender) => (
          <button
            key={gender}
            onClick={() => setGenderFilter(gender)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
              genderFilter === gender
                ? "bg-[#7A001F] text-white border-[#BFD7EA]/30"
                : "bg-subcard text-foreground/50 border-border/10"
            }`}
          >
            {gender}
          </button>
        ))}
      </div>

      {loading && (
        <div className="bg-subcard rounded-2xl p-6 border border-border/10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-foreground/50">
            Loading standings...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-subcard rounded-2xl p-6 border border-red-500/20 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-red-400">
            Google Sheets sync error
          </p>
          <p className="text-xs text-foreground/40 mt-2">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && standings.length === 0 && (
        <div className="bg-subcard rounded-2xl p-8 border border-border/10 text-center">
          <p className="text-sm font-black uppercase tracking-widest text-foreground/70">
            Standings will appear once uploaded
          </p>
          <p className="text-xs text-foreground/40 mt-2">
            Check the Soccer_Standings Google Sheet tab and confirm the headers.
          </p>
        </div>
      )}

      {!loading && !error && standings.length > 0 && (
        <div className="bg-subcard rounded-2xl border border-border/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/10 text-foreground/45 uppercase tracking-widest text-[10px]">
                  <th className="text-left p-3">Rank</th>
                  <th className="text-left p-3">Team</th>
                  <th className="text-left p-3">Level</th>
                  <th className="text-left p-3">Group</th>
                  <th className="text-left p-3">Tournament</th>
                  <th className="text-center p-3">W</th>
                  <th className="text-center p-3">D</th>
                  <th className="text-center p-3">L</th>
                  <th className="text-center p-3">Pts</th>
                  <th className="text-center p-3">For</th>
                  <th className="text-center p-3">Against</th>
                  <th className="text-center p-3">Diff</th>
                </tr>
              </thead>

              <tbody>
                {standings.map((standing) => (
                  <tr key={standing.id} className="border-b border-border/5 last:border-0">
                    <td className="p-3 font-black">{standing.rank ?? "-"}</td>
                    <td className="p-3 font-bold">{standing.team}</td>
                    <td className="p-3 text-foreground/60">{standing.level}</td>
                    <td className="p-3 text-foreground/60">{standing.genderGroup}</td>
                    <td className="p-3 text-foreground/60">{standing.tournament}</td>
                    <td className="p-3 text-center">{standing.wins ?? "-"}</td>
                    <td className="p-3 text-center">{standing.draws ?? "-"}</td>
                    <td className="p-3 text-center">{standing.losses ?? "-"}</td>
                    <td className="p-3 text-center font-black">{standing.points ?? "-"}</td>
                    <td className="p-3 text-center">{standing.forValue ?? "-"}</td>
                    <td className="p-3 text-center">{standing.againstValue ?? "-"}</td>
                    <td className="p-3 text-center">{standing.difference ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
