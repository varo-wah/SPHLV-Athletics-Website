import { LoaderCircle, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useTeamFavorites } from '../contexts/TeamFavoritesContext';
import { DivisionTab, GenderTab, SportTab } from '../types';
import {
  FALLBACK_TEAM_VISUAL_THEME,
  teamAccentProperties,
} from '../config/teamVisualThemes';
import type { TeamVisualTheme } from '../config/teamVisualThemes';
import { PRESS_SCALE, QUICK_TRANSITION, STANDARD_SPRING } from '../config/motion';

interface TeamFavoriteButtonProps {
  sport: SportTab;
  division: DivisionTab;
  gender: GenderTab;
  theme?: TeamVisualTheme;
  className?: string;
}

export default function TeamFavoriteButton({
  sport,
  division,
  gender,
  theme = FALLBACK_TEAM_VISUAL_THEME,
  className = '',
}: TeamFavoriteButtonProps) {
  const { user } = useAuth();
  const {
    isFavoriteTeam,
    isUpdatingTeam,
    toggleTeamFavorite,
  } = useTeamFavorites();
  const favorite = isFavoriteTeam(sport, division, gender);
  const updating = isUpdatingTeam(sport, division, gender);

  return (
    <motion.button
      type="button"
      onClick={() => void toggleTeamFavorite(sport, division, gender)}
      disabled={updating}
      style={teamAccentProperties(theme)}
      aria-pressed={user ? favorite : false}
      aria-label={
        !user
          ? 'Sign in to favorite this team'
          : favorite
            ? 'Remove this team from favorites'
            : 'Add this team to favorites'
      }
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border p-0 shadow-[0_3px_10px_rgba(0,0,0,0.10)] transition-all hover:-translate-y-0.5 focus-visible:outline-none disabled:cursor-wait disabled:opacity-65 ${
        favorite
          ? 'border-[#F4C95D]/35 bg-[#F4C95D] text-[#251600]'
          : 'team-accent-favorite'
      } ${className}`}
      whileTap={{ scale: PRESS_SCALE }}
      animate={{ scale: favorite ? 1.04 : 1 }}
      transition={STANDARD_SPRING}
    >
      <AnimatePresence mode="wait" initial={false}>
        {updating ? (
          <motion.span key="loading" className="flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={QUICK_TRANSITION}>
            <LoaderCircle size={17} className="animate-spin" />
          </motion.span>
        ) : (
          <motion.span
            key={favorite ? 'favorite' : 'not-favorite'}
            className="flex"
            initial={{ opacity: 0, rotate: -18, scale: 0.75 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 18, scale: 0.75 }}
            transition={QUICK_TRANSITION}
          >
            <Star size={19} fill={favorite ? 'currentColor' : 'none'} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
