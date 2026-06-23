import { Bell, BellRing } from 'lucide-react';
import { SportTab } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useSportFollows } from '../contexts/SportFollowsContext';

interface SportFollowButtonProps {
  sport: SportTab;
  compact?: boolean;
  className?: string;
}

export default function SportFollowButton({ sport, compact = false, className = '' }: SportFollowButtonProps) {
  const { user } = useAuth();
  const { isFollowingSport, loading, toggleSportFollow } = useSportFollows();
  const following = isFollowingSport(sport);
  const Icon = following ? BellRing : Bell;

  return (
    <button
      type="button"
      onClick={() => toggleSportFollow(sport)}
      disabled={loading}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full border font-black uppercase tracking-[0.14em] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${
        compact ? 'px-3 py-2 text-[9px]' : 'px-3.5 py-2.5 text-[10px]'
      } ${
        following
          ? 'border-[#C1121F] bg-[#C1121F] text-white shadow-[0_12px_24px_rgba(193,18,31,0.18)] dark:border-[#B5413F]/40 dark:bg-[#B5413F]'
          : 'border-border/10 bg-foreground/[0.035] text-foreground/55 hover:border-[#C1121F]/35 hover:bg-[#FEE2E2] hover:text-[#C1121F] dark:bg-foreground/[0.04] dark:hover:bg-[#B5413F]/12 dark:hover:text-[#D85A57]'
      } ${className}`}
    >
      <Icon size={compact ? 13 : 14} />
      {following ? 'Following' : user ? 'Follow' : 'Sign in'}
    </button>
  );
}
