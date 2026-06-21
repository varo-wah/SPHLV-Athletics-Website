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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-header/95 backdrop-blur-2xl dark:border-border/10">
      <div className="w-full max-w-[1120px] mx-auto h-20 px-2 pb-safe flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center w-full h-full"
            >
              <div
                className={`relative h-10 w-14 rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#C1121F] text-white shadow-[0_10px_24px_rgba(193,18,31,0.2)] dark:bg-[#5A1C2C] dark:text-[#ffffff]'
                    : 'text-[#6B7280] hover:text-[#C1121F] dark:text-foreground/50 dark:hover:text-foreground/70'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
              </div>

              <span
                className={`mt-1 text-[10px] sm:text-[11px] font-bold tracking-wider ${
                  isActive ? 'text-[#C1121F] dark:text-foreground' : 'text-[#6B7280] dark:text-foreground/50'
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
