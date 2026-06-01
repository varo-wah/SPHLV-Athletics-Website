import { motion } from 'motion/react';
import { MatchStage } from '../types';

interface HeaderProps {
  title: string;
  activeStage: MatchStage;
  onStageChange: (stage: MatchStage) => void;
}

export default function Header({ title, activeStage, onStageChange }: HeaderProps) {
  const stages: MatchStage[] = ['APR-7', 'APR-8', 'APR-9', 'APR-10', 'APR-11'];

  return (
    <header className="sticky top-0 z-40 bg-[#2a1f24]/80 backdrop-blur-xl border-b border-border/6 pt-12 pb-3">
      <div className="px-6 mb-4">
        <div className="text-[11px] uppercase tracking-[0.24em] text-pink-300/80 mb-2">
          ACSC Girls Soccer
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
        {stages.map((stage) => {
          const isActive = activeStage === stage;

          return (
            <button
              key={stage}
              onClick={() => onStageChange(stage)}
              className={`relative px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-colors border ${
                isActive
                  ? 'text-foreground border-pink-400/20 bg-pink-500/12'
                  : 'text-slate-400 border-border/6 bg-foreground/4 hover:text-foreground'
              }`}
            >
              {stage}
              {isActive && (
                <motion.div
                  layoutId="activeStagePill"
                  className="absolute inset-0 rounded-full border border-pink-400/20 shadow-[0_0_30px_rgba(244,114,182,0.18)]"
                />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
