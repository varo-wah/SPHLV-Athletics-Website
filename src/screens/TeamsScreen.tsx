import { ArrowUpRight } from 'lucide-react';
import { DivisionTab, GenderTab, SportTab } from '../types';
import { IS_PROTOTYPE } from '../config/launchSports';
import { SPORT_CATALOG, TEAM_CATALOG } from '../config/teamCatalog';

interface TeamsScreenProps {
  onSelectTeam: (sport: SportTab, division: DivisionTab, gender: GenderTab) => void;
}

const sportVisuals: Record<SportTab, {
  accent: string;
  iconStyle: string;
  buttonStyle: string;
}> = {
  Soccer: {
    accent: 'border-[#D85A57]/30 bg-card',
    iconStyle: 'border-[#D85A57]/30 bg-[#B5413F]/18 text-[#F06865]',
    buttonStyle: 'hover:border-[#D85A57]/40 hover:bg-[#B5413F]/14',
  },
  Volleyball: {
    accent: 'border-[#669BBC]/25 bg-card',
    iconStyle: 'border-[#669BBC]/30 bg-[#669BBC]/14 text-[#8FC1DD]',
    buttonStyle: 'hover:border-[#669BBC]/40 hover:bg-[#669BBC]/12',
  },
  Basketball: {
    accent: 'border-[#F4C95D]/25 bg-card',
    iconStyle: 'border-[#F4C95D]/30 bg-[#F4C95D]/12 text-[#F4C95D]',
    buttonStyle: 'hover:border-[#F4C95D]/35 hover:bg-[#F4C95D]/10',
  },
  Badminton: {
    accent: 'border-emerald-400/25 bg-card',
    iconStyle: 'border-emerald-400/30 bg-emerald-400/12 text-emerald-300',
    buttonStyle: 'hover:border-emerald-400/35 hover:bg-emerald-400/10',
  },
  TrackAndField: {
    accent: 'border-violet-400/25 bg-card',
    iconStyle: 'border-violet-400/30 bg-violet-400/12 text-violet-300',
    buttonStyle: 'hover:border-violet-400/35 hover:bg-violet-400/10',
  },
};

const sportGroups = SPORT_CATALOG
  .map((sport) => ({
    sport: sport.id,
    label: sport.label,
    ballGlyph: sport.ballGlyph,
    ...sportVisuals[sport.id],
    teams: TEAM_CATALOG.filter((team) => (
      team.sport === sport.id
      && (IS_PROTOTYPE || team.production)
    )),
  }))
  .filter((group) => group.teams.length > 0);

const teamButtonVisuals: Record<string, {
  buttonStyle: string;
  arrowStyle: string;
}> = {
  VBS: {
    buttonStyle: 'border-[#EF4444]/35 bg-muted/70 hover:border-[#EF4444]/60 hover:bg-muted focus-visible:ring-[#EF4444]/45',
    arrowStyle: 'border-[#EF4444]/25 bg-[#EF4444]/12 text-[#B91C1C] group-hover:bg-[#EF4444]/22 dark:text-[#FCA5A5]',
  },
  VGS: {
    buttonStyle: 'border-[#F472B6]/35 bg-muted/70 hover:border-[#F472B6]/60 hover:bg-muted focus-visible:ring-[#F472B6]/45',
    arrowStyle: 'border-[#F472B6]/25 bg-[#F472B6]/12 text-[#BE185D] group-hover:bg-[#F472B6]/22 dark:text-[#F9A8D4]',
  },
  VBV: {
    buttonStyle: 'border-[#F59E0B]/35 bg-muted/70 hover:border-[#F59E0B]/60 hover:bg-muted focus-visible:ring-[#F59E0B]/45',
    arrowStyle: 'border-[#F59E0B]/25 bg-[#F59E0B]/12 text-[#92400E] group-hover:bg-[#F59E0B]/22 dark:text-[#FCD34D]',
  },
  VGV: {
    buttonStyle: 'border-[#A78BFA]/35 bg-muted/70 hover:border-[#A78BFA]/60 hover:bg-muted focus-visible:ring-[#A78BFA]/45',
    arrowStyle: 'border-[#A78BFA]/25 bg-[#A78BFA]/12 text-[#6D28D9] group-hover:bg-[#A78BFA]/22 dark:text-[#C4B5FD]',
  },
  SMPBB: {
    buttonStyle: 'border-[#3B82F6]/35 bg-muted/70 hover:border-[#3B82F6]/60 hover:bg-muted focus-visible:ring-[#3B82F6]/45',
    arrowStyle: 'border-[#3B82F6]/25 bg-[#3B82F6]/12 text-[#1D4ED8] group-hover:bg-[#3B82F6]/22 dark:text-[#93C5FD]',
  },
  SMPGB: {
    buttonStyle: 'border-[#22D3EE]/35 bg-muted/70 hover:border-[#22D3EE]/60 hover:bg-muted focus-visible:ring-[#22D3EE]/45',
    arrowStyle: 'border-[#22D3EE]/25 bg-[#22D3EE]/12 text-[#0E7490] group-hover:bg-[#22D3EE]/22 dark:text-[#67E8F9]',
  },
};

export default function TeamsScreen({ onSelectTeam }: TeamsScreenProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto min-h-screen w-full max-w-3xl px-4 pb-24 pt-3 duration-500 sm:px-6 sm:pt-5">
      <section aria-label="Teams" className="space-y-3">
        {sportGroups.map((group, groupIndex) => {
          return (
            <article
              key={group.sport}
              className={`relative overflow-hidden rounded-[1.35rem] border p-3.5 shadow-[0_4px_12px_rgba(0,0,0,0.10)] sm:p-4 ${group.accent}`}
            >
              <div className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-white/[0.025] blur-2xl" />

              <div className="relative mb-3 flex items-center justify-between gap-3">
                <h2 className="flex min-w-0 items-center gap-3 text-base font-black uppercase tracking-[0.08em] text-foreground sm:text-lg">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border shadow-[0_2px_7px_rgba(0,0,0,0.10)] ${group.iconStyle}`} aria-hidden="true">
                    <span className="text-[22px] leading-none" aria-hidden="true">{group.ballGlyph}</span>
                  </span>
                  {group.label}
                </h2>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/35">
                  0{groupIndex + 1} · {group.teams.length} team{group.teams.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="relative grid grid-cols-2 gap-2.5">
                {group.teams.map((team) => {
                  const teamVisual = teamButtonVisuals[team.menuCode];

                  return (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => onSelectTeam(group.sport, team.division, team.gender)}
                      className={`group flex min-h-[64px] items-center justify-between gap-2 rounded-2xl border px-3 py-2.5 text-left transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-[70px] sm:px-4 [container-type:inline-size] ${teamVisual?.buttonStyle || `border-white/[0.075] bg-black/15 ${group.buttonStyle}`}`}
                    >
                      <span className="text-[clamp(1.2rem,10cqi,2rem)] font-black uppercase leading-none tracking-[clamp(0.04em,0.8cqi,0.12em)] text-foreground">
                        {team.menuCode}
                      </span>
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${teamVisual?.arrowStyle || 'border-white/[0.075] bg-white/[0.045] text-foreground/42 group-hover:bg-white/10 group-hover:text-foreground'}`} aria-hidden="true">
                        <ArrowUpRight size={13} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
