import { LogOut, Menu, Moon, Sun, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface TopBarProps {
  onOpenMenu: () => void;
}

export default function TopBar({ onOpenMenu }: TopBarProps) {
  const [isDark, setIsDark] = useState(true);
  const { loading, openLoginModal, signOutUser, user } = useAuth();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="flex items-center justify-between px-4 py-4 sticky top-0 z-50 bg-header/90 backdrop-blur-md border-b border-border/70 dark:border-border/5">
      <div className="flex items-center gap-3">
        <button className="text-[#7F1D1D] hover:text-[#C1121F] dark:text-foreground dark:hover:text-foreground/80" onClick={onOpenMenu}>
          <Menu size={24} />
        </button>
        <span className="text-[#1F2937] font-bold tracking-wider text-sm dark:text-foreground">ATHLETICS DEPT</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setIsDark(!isDark)}
          className="text-[#7F1D1D] hover:text-[#C1121F] flex items-center justify-center dark:text-foreground dark:hover:text-foreground/80"
          aria-label="Toggle color theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {user ? (
          <div className="flex min-w-0 items-center gap-2 rounded-full border border-border/10 bg-foreground/[0.035] px-3 py-1.5">
            <UserRound size={14} className="shrink-0 text-[#C1121F] dark:text-[#D85A57]" />
            <span className="hidden max-w-[150px] truncate text-[10px] font-black uppercase tracking-[0.12em] text-foreground/65 sm:block">
              {user.email}
            </span>
            <button
              type="button"
              onClick={signOutUser}
              className="text-foreground/45 transition-colors hover:text-[#C1121F] dark:hover:text-[#D85A57]"
              aria-label="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={openLoginModal}
            disabled={loading}
            className="rounded-full border border-[#C1121F]/20 bg-[#FEE2E2] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#7F1D1D] transition-colors hover:bg-[#C1121F] hover:text-white disabled:opacity-50 dark:border-[#B5413F]/25 dark:bg-[#B5413F]/12 dark:text-[#FCA5A5] dark:hover:bg-[#B5413F] dark:hover:text-white"
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
}
