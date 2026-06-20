import * as React from 'react';
import { Home, CalendarDays, Newspaper, Trophy, Users } from 'lucide-react';
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
    { id: 'Standings', label: 'TABLE', icon: Trophy },
    { id: 'News', label: 'NEWS', icon: Newspaper },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/10 bg-header/95 backdrop-blur-2xl">
      <div className="max-w-xl mx-auto h-20 px-2 pb-safe flex items-center justify-around">
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
                    ? 'bg-[#5A1C2C] text-[#ffffff]'
                    : 'text-foreground/50 hover:text-foreground/70'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
              </div>

              <span
                className={`mt-1 text-[10px] sm:text-[11px] font-bold tracking-wider ${
                  isActive ? 'text-foreground' : 'text-foreground/50'
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
