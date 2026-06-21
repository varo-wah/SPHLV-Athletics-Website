import { Menu, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TopBarProps {
  onOpenMenu: () => void;
}

export default function TopBar({ onOpenMenu }: TopBarProps) {
  const [isDark, setIsDark] = useState(true);

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
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsDark(!isDark)}
          className="text-[#7F1D1D] hover:text-[#C1121F] flex items-center justify-center dark:text-foreground dark:hover:text-foreground/80"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <img
          src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=100&auto=format&fit=crop"
          alt="Profile"
          className="w-8 h-8 rounded-full border border-border object-cover dark:border-border/10"
        />
      </div>
    </div>
  );
}
