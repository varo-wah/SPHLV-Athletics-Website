import * as React from 'react';
import { Home, CalendarDays, Newspaper, Users } from 'lucide-react';
import { AppTab } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs: { id: AppTab; label: string; icon: React.ElementType }[] = [
    { id: 'Home', label: 'HOME', icon: Home },
    { id: 'Teams', label: 'TEAMS', icon: Users },
    { id: 'Schedule', label: 'SCHEDULE', icon: CalendarDays },
    { id: 'News', label: 'NEWS', icon: Newspaper },
  ];

  return (
    <nav className="pointer-events-none fixed bottom-0 left-0 right-0 z-50">
      <div className="sph-bottom-nav-shell pointer-events-auto mx-auto flex h-20 w-full items-center justify-around border-x border-t border-border/80 bg-header/95 px-2 pb-safe shadow-[0_-4px_14px_rgba(0,0,0,0.12)] backdrop-blur-2xl dark:border-border/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="group relative flex h-full w-full flex-col items-center justify-center outline-none"
            >
              <div
                className={`relative flex h-10 w-14 items-center justify-center rounded-2xl transition-all group-focus-visible:ring-2 group-focus-visible:ring-brand-sky group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-header ${
                  isActive
                    ? 'bg-brand-sky text-brand-navy shadow-[0_10px_24px_rgba(102,155,188,0.24)]'
                    : 'text-[#6B7280] hover:text-brand-sky dark:text-foreground/50 dark:hover:text-brand-sky'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
              </div>

              <span
                className={`mt-1 text-[10px] sm:text-[11px] font-bold tracking-wider ${
                  isActive ? 'text-brand-sky' : 'text-[#6B7280] dark:text-foreground/50'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
