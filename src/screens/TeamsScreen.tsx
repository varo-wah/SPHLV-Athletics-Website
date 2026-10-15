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

function teamButtonClasses(gender: GenderTab) {
  if (gender === 'Boys') {
    return 'border-[#9BC8DF] bg-[#EDF7FC] text-[#235B7A] hover:border-[#669BBC] hover:bg-[#DCEEF8] dark:border-[#669BBC]/35 dark:bg-[#669BBC]/15 dark:text-[#BFDFF0]';
  }

  if (gender === 'Girls') {
    return 'border-[#EBA8AF] bg-[#FFF0F2] text-[#8F2633] hover:border-[#C1121F]/55 hover:bg-[#FBE1E5] dark:border-[#C1121F]/35 dark:bg-[#C1121F]/15 dark:text-[#F5BBC1]';
  }

  return 'border-border/10 bg-foreground/[0.025] text-foreground';
}

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
              className={`relative overflow-hidden rounded-xl border p-3 ${group.accent}`}
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
                    aria-label={team.displayName}
                    whileTap={{ scale: PRESS_SCALE }}
                    transition={PRESS_TRANSITION}
                    className={`group flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/45 [container-type:inline-size] ${teamButtonClasses(team.gender)}`}
                  >
                    <span>
                      <span className="block text-base font-black leading-none">{team.gender === 'Combined' ? 'Mixed' : team.gender}</span>
                      <span className="mt-1.5 block text-[10px] font-bold tracking-[0.05em] opacity-70">{team.division === 'SMA' ? 'Varsity' : 'SMP'}</span>
                    </span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current/20 bg-white/55 text-current transition-colors dark:bg-black/10" aria-hidden="true">
                      <ArrowUpRight size={12} />
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.article>
          );
        })}
        <a href="#/teams/cross-country" className="flex min-h-16 items-center justify-between gap-3 rounded-xl border border-border/10 bg-card px-4 py-3 transition-colors hover:bg-foreground/[0.025]">
          <span className="flex items-center gap-3">
            <span className="text-xl" aria-hidden="true">🏃</span>
            <span><span className="block text-sm font-black">Cross Country</span><span className="mt-0.5 block text-xs text-foreground/55">Runners, meets & 5 km personal bests</span></span>
          </span>
          <ArrowUpRight size={17} className="shrink-0 text-foreground/45" />
        </a>
        {IS_PROTOTYPE && (
          <a href="#/teams/swimming" className="flex min-h-16 items-center justify-between gap-3 rounded-xl border border-brand-sky/25 bg-card px-4 py-3">
            <span><span className="block text-sm font-black">Swimming</span><span className="mt-0.5 block text-xs text-foreground/55">Preview · fictional sample performances</span></span>
            <ArrowUpRight size={17} className="shrink-0 text-foreground/45" />
          </a>
        )}
      </section>
    </div>
  );
}
