import { ArrowUpRight } from 'lucide-react';
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
    accent: 'border-[#D85A57]/30 bg-[linear-gradient(135deg,rgba(181,65,63,0.18),rgba(181,65,63,0.035)_58%,transparent)]',
    iconStyle: 'border-[#D85A57]/30 bg-[#B5413F]/18 text-[#F06865]',
    buttonStyle: 'hover:border-[#D85A57]/40 hover:bg-[#B5413F]/14',
    teams: [
      { division: 'SMA' as const, gender: 'Boys' as const, name: "Varsity Boys' Soccer" },
      { division: 'SMA' as const, gender: 'Girls' as const, name: "Varsity Girls' Soccer" },
    ],
  },
  {
    sport: 'Volleyball' as const,
    label: 'Volleyball',
    Icon: VolleyballIcon,
    accent: 'border-[#669BBC]/25 bg-[linear-gradient(135deg,rgba(102,155,188,0.15),rgba(102,155,188,0.025)_58%,transparent)]',
    iconStyle: 'border-[#669BBC]/30 bg-[#669BBC]/14 text-[#8FC1DD]',
    buttonStyle: 'hover:border-[#669BBC]/40 hover:bg-[#669BBC]/12',
    teams: [
      { division: 'SMA' as const, gender: 'Boys' as const, name: "Varsity Boys' Volleyball" },
      { division: 'SMA' as const, gender: 'Girls' as const, name: "Varsity Girls' Volleyball" },
    ],
  },
  {
    sport: 'Basketball' as const,
    label: 'Basketball',
    Icon: BasketballIcon,
    accent: 'border-[#F4C95D]/25 bg-[linear-gradient(135deg,rgba(244,201,93,0.12),rgba(244,201,93,0.02)_58%,transparent)]',
    iconStyle: 'border-[#F4C95D]/30 bg-[#F4C95D]/12 text-[#F4C95D]',
    buttonStyle: 'hover:border-[#F4C95D]/35 hover:bg-[#F4C95D]/10',
    teams: [
      { division: 'SMP' as const, gender: 'Boys' as const, name: "SMP Boys' Basketball" },
      { division: 'SMP' as const, gender: 'Girls' as const, name: "SMP Girls' Basketball" },
    ],
  },
] satisfies ReadonlyArray<{
  sport: SportTab;
  label: string;
  Icon: typeof SoccerIcon;
  accent: string;
  iconStyle: string;
  buttonStyle: string;
  teams: ReadonlyArray<{
    division: DivisionTab;
    gender: GenderTab;
    name: string;
  }>;
}>;

export default function TeamsScreen({ onSelectTeam }: TeamsScreenProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto min-h-screen w-full max-w-3xl px-4 pb-24 pt-3 duration-500 sm:px-6 sm:pt-5">
      <section aria-label="Teams" className="space-y-3">
        {sportGroups.map((group, groupIndex) => {
          const Icon = group.Icon;

          return (
            <article
              key={group.sport}
              className={`relative overflow-hidden rounded-[1.35rem] border p-3.5 shadow-[0_18px_48px_rgba(0,0,0,0.16)] sm:p-4 ${group.accent}`}
            >
              <div className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-white/[0.025] blur-2xl" />

              <div className="relative mb-3 flex items-center justify-between gap-3">
                <h2 className="flex min-w-0 items-center gap-3 text-base font-black uppercase tracking-[0.08em] text-foreground sm:text-lg">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border shadow-[0_10px_25px_rgba(0,0,0,0.16)] ${group.iconStyle}`} aria-hidden="true">
                    <Icon size={23} />
                  </span>
                  {group.label}
                </h2>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/35">
                  0{groupIndex + 1} · 2 teams
                </span>
              </div>

              <div className="relative grid grid-cols-2 gap-2.5">
                {group.teams.map((team) => (
                  <button
                    key={`${group.sport}-${team.gender}`}
                    type="button"
                    onClick={() => onSelectTeam(group.sport, team.division, team.gender)}
                    className={`group flex min-h-[64px] items-center justify-between gap-2 rounded-2xl border border-white/[0.075] bg-black/15 px-3 py-2.5 text-left transition-all hover:-translate-y-0.5 sm:min-h-[70px] sm:px-4 ${group.buttonStyle}`}
                  >
                    <span className="text-[11px] font-black uppercase leading-snug tracking-[0.045em] text-foreground sm:text-sm">
                      {team.name}
                    </span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.075] bg-white/[0.045] text-foreground/42 transition-colors group-hover:bg-white/10 group-hover:text-foreground" aria-hidden="true">
                      <ArrowUpRight size={13} />
                    </span>
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
