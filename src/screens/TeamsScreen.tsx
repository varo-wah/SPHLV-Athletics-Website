import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import FavoriteTeamsSection from '../components/FavoriteTeamsSection';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { DivisionTab, GenderTab, SportTab } from '../types';
import { IS_PROTOTYPE } from '../config/launchSports';
import { SPORT_CATALOG, TEAM_CATALOG } from '../config/teamCatalog';
import { PRESS_SCALE, PRESS_TRANSITION, QUICK_TRANSITION, staggerDelay } from '../config/motion';

interface TeamsScreenProps {
  onSelectTeam: (sport: SportTab, division: DivisionTab, gender: GenderTab) => void;
  athleticsDataState: AthleticsDataState;
}

const sportVisuals: Record<SportTab, {
  accent: string;
  iconStyle: string;
}> = {
  Soccer: {
    accent: 'border-border/10 bg-card',
    iconStyle: 'border-border/10 bg-foreground/[0.025] text-foreground',
  },
  Volleyball: {
    accent: 'border-border/10 bg-card',
    iconStyle: 'border-border/10 bg-foreground/[0.025] text-foreground',
  },
  Basketball: {
    accent: 'border-border/10 bg-card',
    iconStyle: 'border-border/10 bg-foreground/[0.025] text-foreground',
  },
  Badminton: {
    accent: 'border-border/10 bg-card',
    iconStyle: 'border-border/10 bg-foreground/[0.025] text-foreground',
  },
  TrackAndField: {
    accent: 'border-border/10 bg-card',
    iconStyle: 'border-border/10 bg-foreground/[0.025] text-foreground',
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

export default function TeamsScreen({ onSelectTeam, athleticsDataState }: TeamsScreenProps) {
  const reduceMotion = useReducedMotion();

  const browseTeams = () => {
    document.getElementById('all-teams')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto min-h-screen w-full max-w-3xl px-4 pb-24 pt-3 duration-500 sm:px-6 sm:pt-5">
      <FavoriteTeamsSection
        athleticsDataState={athleticsDataState}
        onNavigateToTeam={onSelectTeam}
        onBrowseTeams={browseTeams}
      />

      <section id="all-teams" aria-label="All teams" className="scroll-mt-20 space-y-3">
        {sportGroups.map((group, groupIndex) => {
          return (
            <motion.article
              key={group.sport}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...QUICK_TRANSITION, delay: staggerDelay(groupIndex) }}
              className={`relative overflow-hidden rounded-[1.35rem] border p-3 shadow-[0_3px_9px_rgba(0,0,0,0.07)] ${group.accent}`}
            >
              <div className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-white/[0.025] blur-2xl" />

              <div className="relative mb-2.5 flex items-center justify-between gap-3">
                <h2 className="flex min-w-0 items-center gap-2.5 text-sm font-black uppercase tracking-[0.07em] text-foreground sm:text-base">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${group.iconStyle}`} aria-hidden="true">
                    <span className="text-lg leading-none" aria-hidden="true">{group.ballGlyph}</span>
                  </span>
                  {group.label}
                </h2>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/35">
                  0{groupIndex + 1} · {group.teams.length} team{group.teams.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="relative grid grid-cols-2 gap-2">
                {group.teams.map((team) => (
                    <motion.button
                      key={team.id}
                      type="button"
                      onClick={() => onSelectTeam(group.sport, team.division, team.gender)}
                      whileTap={{ scale: PRESS_SCALE }}
                      transition={PRESS_TRANSITION}
                      className="group flex min-h-12 items-center justify-between gap-2 rounded-xl border border-border/10 bg-foreground/[0.025] px-3 py-2 text-left transition-all hover:-translate-y-0.5 hover:border-brand-maroon/25 hover:bg-brand-maroon/[0.04] focus-visible:outline-none [container-type:inline-size]"
                    >
                      <span className="text-[clamp(0.9rem,8cqi,1.2rem)] font-black uppercase leading-none tracking-[0.06em] text-foreground">
                        {team.menuCode}
                      </span>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/10 bg-subcard text-foreground/45 transition-colors group-hover:border-brand-maroon/25 group-hover:text-brand-maroon" aria-hidden="true">
                        <ArrowUpRight size={12} />
                      </span>
                    </motion.button>
                  ))}
              </div>
            </motion.article>
          );
        })}
      </section>
    </div>
  );
}
