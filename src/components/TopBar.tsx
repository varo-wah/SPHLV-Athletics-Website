import { Images, Instagram, LogOut, Moon, Sheet, Sun, UserRound, Youtube } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { IS_PROTOTYPE } from '../config/launchSports';
import { PRESS_SCALE, PRESS_TRANSITION, QUICK_TRANSITION } from '../config/motion';

interface TopBarProps {
  isHome?: boolean;
  onOpenMenu: () => void;
  onOpenLogin: () => void;
}

const HOME_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/sphlv.athletics?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==', icon: Instagram },
  { label: 'YouTube', href: 'https://www.youtube.com/@SPH-LV-Athletics', icon: Youtube },
  { label: 'Game photos', href: 'https://photos.app.goo.gl/g4MqVW3TJPQ3WNSF6', icon: Images },
  {
    label: 'Official schedule spreadsheet',
    href: 'https://sphacid-my.sharepoint.com/:x:/g/personal/pe-lv_sph_ac_id/IQApbiLW2BKYSriawFHuP4m6Aa6EmT6xX_otnN_PWWLFWpY?e=Tn4JPh',
    icon: Sheet,
  },
] as const;

export default function TopBar({ isHome = false, onOpenLogin, onOpenMenu }: TopBarProps) {
  const { loading, signOutUser, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center justify-between px-4 py-4 sticky top-0 z-50 bg-header/90 backdrop-blur-md border-b border-border/70 dark:border-border/5">
      <div className="flex min-w-0 items-center gap-3">
        <motion.button
          type="button"
          aria-label="Open teams menu"
          className="flex h-10 w-14 items-center justify-center overflow-hidden rounded-xl border border-[#C1121F]/15 bg-white transition-colors hover:border-[#C1121F]/35 dark:border-white/10 dark:bg-white/90"
          onClick={onOpenMenu}
          whileTap={{ scale: PRESS_SCALE }}
          transition={PRESS_TRANSITION}
        >
          <img
            src="https://res.cloudinary.com/dpgt445lg/image/upload/v1775384563/image_13_obe33c.png"
            alt=""
            className="h-9 w-12 object-contain"
            aria-hidden="true"
          />
        </motion.button>
        {isHome ? (
          <nav aria-label="Athletics links" className="flex items-center gap-1.5">
            {HOME_LINKS.map(({ href, icon: Icon, label }) => href ? (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/10 bg-foreground/[0.035] text-foreground/55 transition-colors hover:border-brand-maroon/30 hover:text-brand-maroon"
                whileTap={{ scale: 0.94 }}
                transition={PRESS_TRANSITION}
              >
                <Icon size={16} aria-hidden="true" />
              </motion.a>
            ) : (
              <span
                key={label}
                aria-label={label}
                title={label}
                className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full border border-border/8 bg-foreground/[0.02] text-foreground/20"
              >
                <Icon size={16} aria-hidden="true" />
              </span>
            ))}
          </nav>
        ) : (
          <span className="truncate text-xs font-black uppercase tracking-[0.14em] text-[#1F2937] dark:text-foreground sm:text-sm">
            LV Eagle App
          </span>
        )}
        {IS_PROTOTYPE && (
          <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
            Prototype
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <motion.button
          type="button"
          onClick={toggleTheme}
          className="text-[#7F1D1D] hover:text-[#C1121F] flex items-center justify-center dark:text-foreground dark:hover:text-foreground/80"
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          aria-pressed={isDark}
          whileTap={{ scale: 0.9 }}
          transition={PRESS_TRANSITION}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isDark ? 'sun' : 'moon'}
              className="flex items-center justify-center"
              initial={{ opacity: 0, rotate: -28, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 28, scale: 0.8 }}
              transition={QUICK_TRANSITION}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        {user ? (
          <div className="flex min-w-0 items-center gap-2 rounded-full border border-border/10 bg-foreground/[0.035] px-3 py-1.5">
            <UserRound size={14} className="shrink-0 text-[#C1121F] dark:text-[#D85A57]" />
            <span className="hidden max-w-[150px] truncate text-[10px] font-black uppercase tracking-[0.12em] text-foreground/65 sm:block">
              {user.email}
            </span>
            <motion.button
              type="button"
              onClick={signOutUser}
              className="text-foreground/45 transition-colors hover:text-[#C1121F] dark:hover:text-[#D85A57]"
              aria-label="Sign out"
              whileTap={{ scale: 0.9 }}
              transition={PRESS_TRANSITION}
            >
              <LogOut size={14} />
            </motion.button>
          </div>
        ) : (
          <motion.button
            type="button"
            onClick={onOpenLogin}
            disabled={loading}
            className="rounded-full border border-[#C1121F]/25 bg-muted px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#7F1D1D] transition-colors hover:bg-[#C1121F] hover:text-white disabled:opacity-50 dark:border-[#B5413F]/35 dark:bg-muted dark:text-[#FCA5A5] dark:hover:bg-[#B5413F] dark:hover:text-white"
            whileTap={{ scale: PRESS_SCALE }}
            transition={PRESS_TRANSITION}
          >
            Sign in
          </motion.button>
        )}
      </div>
    </div>
  );
}
