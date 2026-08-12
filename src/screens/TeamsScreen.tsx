import { DivisionTab, GenderTab, SportTab } from '../types';
import {
  BasketballIcon,
  SoccerIcon,
  VolleyballIcon,
} from '../components/SportIcons';

interface TeamsScreenProps {
  onSelectTeam: (sport: SportTab, division: DivisionTab, gender: GenderTab) => void;
}

const sportGroups = [
  {
    sport: 'Soccer' as const,
    label: 'Soccer',
    Icon: SoccerIcon,
    teams: [
      { division: 'SMA' as const, gender: 'Boys' as const, name: "Varsity Boys' Soccer" },
      { division: 'SMA' as const, gender: 'Girls' as const, name: "Varsity Girls' Soccer" },
    ],
  },
  {
    sport: 'Volleyball' as const,
    label: 'Volleyball',
    Icon: VolleyballIcon,
    teams: [
      { division: 'SMA' as const, gender: 'Boys' as const, name: "Varsity Boys' Volleyball" },
      { division: 'SMA' as const, gender: 'Girls' as const, name: "Varsity Girls' Volleyball" },
    ],
  },
  {
    sport: 'Basketball' as const,
    label: 'Basketball',
    Icon: BasketballIcon,
    teams: [
      { division: 'SMP' as const, gender: 'Boys' as const, name: "SMP Boys' Basketball" },
      { division: 'SMP' as const, gender: 'Girls' as const, name: "SMP Girls' Basketball" },
    ],
  },
] satisfies ReadonlyArray<{
  sport: SportTab;
  label: string;
  Icon: typeof SoccerIcon;
  teams: ReadonlyArray<{
    division: DivisionTab;
    gender: GenderTab;
    name: string;
  }>;
}>;

export default function TeamsScreen({ onSelectTeam }: TeamsScreenProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto min-h-screen w-full max-w-3xl px-4 pb-24 pt-3 duration-500 sm:px-6">
      <section aria-label="Teams" className="space-y-2.5">
        {sportGroups.map((group) => {
          const Icon = group.Icon;

          return (
            <article
              key={group.sport}
              className="rounded-2xl border border-border/10 bg-subcard p-3 shadow-[0_12px_32px_rgba(0,0,0,0.12)] sm:p-4"
            >
              <h2 className="mb-2.5 flex items-center gap-2 text-base font-black uppercase tracking-[0.07em] text-foreground sm:text-lg">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#B5413F]/25 bg-[#B5413F]/12 text-[#D85A57]" aria-hidden="true">
                  <Icon size={21} />
                </span>
                {group.label}
              </h2>

              <div className="grid grid-cols-2 gap-2.5">
                {group.teams.map((team) => (
                  <button
                    key={`${group.sport}-${team.gender}`}
                    type="button"
                    onClick={() => onSelectTeam(group.sport, team.division, team.gender)}
                    className="flex min-h-[54px] items-center justify-center rounded-xl border border-[#B5413F]/20 bg-[#B5413F]/10 px-2.5 py-2 text-center text-[11px] font-black uppercase leading-tight tracking-[0.035em] text-foreground transition-colors hover:border-[#B5413F]/40 hover:bg-[#B5413F]/20 sm:text-sm"
                  >
                    {team.name}
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
