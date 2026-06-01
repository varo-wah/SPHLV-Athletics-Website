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
    <div className="flex items-center justify-between px-4 py-4 sticky top-0 z-50 bg-header/90 backdrop-blur-md border-b border-border/5">
      <div className="flex items-center gap-3">
        <button className="text-foreground hover:text-foreground/80" onClick={onOpenMenu}>
          <Menu size={24} />
        </button>
        <span className="text-foreground font-bold tracking-wider text-sm">ATHLETICS DEPT</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsDark(!isDark)}
          className="text-foreground hover:text-foreground/80 flex items-center justify-center"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <img
          src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=100&auto=format&fit=crop"
          alt="Profile"
          className="w-8 h-8 rounded-full border border-border/10 object-cover"
        />
      </div>
    </div>
  );
}
