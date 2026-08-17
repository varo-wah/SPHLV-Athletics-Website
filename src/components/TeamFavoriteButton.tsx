import { LoaderCircle, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTeamFavorites } from '../contexts/TeamFavoritesContext';
import { DivisionTab, GenderTab, SportTab } from '../types';

interface TeamFavoriteButtonProps {
  sport: SportTab;
  division: DivisionTab;
  gender: GenderTab;
  className?: string;
}

export default function TeamFavoriteButton({
  sport,
  division,
  gender,
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
    <button
      type="button"
      onClick={() => void toggleTeamFavorite(sport, division, gender)}
      disabled={updating}
      aria-pressed={user ? favorite : false}
      aria-label={
        !user
          ? 'Sign in to favorite this team'
          : favorite
            ? 'Remove this team from favorites'
            : 'Add this team to favorites'
      }
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border p-0 shadow-[0_12px_32px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-65 ${
        favorite
          ? 'border-[#F4C95D]/35 bg-[#F4C95D] text-[#251600]'
          : 'border-white/12 bg-black/45 text-white/72 hover:border-[#F4C95D]/35 hover:bg-[#F4C95D]/12 hover:text-[#F4C95D]'
      } ${className}`}
    >
      {updating ? (
        <LoaderCircle size={18} className="animate-spin" />
      ) : (
        <Star size={18} fill={favorite ? 'currentColor' : 'none'} />
      )}
    </button>
  );
}
