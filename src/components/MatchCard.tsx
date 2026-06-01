import { motion } from 'motion/react';
import { Clock3, MapPin, CalendarDays } from 'lucide-react';
import { ScheduleItem, Match } from '../types';

interface MatchCardProps {
  match: ScheduleItem;
  variant?: 'default' | 'compact' | 'featured';
  highlightLive?: boolean;
  key?: string | number;
}

function statusClasses(status: Match['status']) {
  switch (status) {
    case 'Live':
      return 'bg-red-500/20 text-red-200 border-red-400/40 shadow-[0_0_16px_rgba(239,68,68,0.35)] animate-pulse';
    case 'Finished':
      return 'bg-foreground/10 text-slate-300 border-border/15';
    default:
      return 'bg-[#5B86D6]/20 text-[#BFD3FF] border-[#5B86D6]/35 shadow-[0_0_12px_rgba(91,134,214,0.18)]';
  }
}

export default function MatchCard({ match, variant = 'default', highlightLive = false }: MatchCardProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';

  if (match.type === 'event') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`ucl-panel border border-border/8 ${
          isFeatured ? 'rounded-[24px] p-5' : 'rounded-[22px] p-4'
        } bg-gradient-to-br from-white/5 to-transparent`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-pink-500/10 text-pink-300 border-pink-400/20">
              Event
            </div>
          </div>
          {match.venue && (
            <div className="flex items-center gap-1 text-foreground/30">
              <MapPin className="w-3 h-3" />
              <span className="text-[10px] font-medium">{match.venue}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center border border-border/5">
            <CalendarDays className="w-5 h-5 text-foreground/50" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground tracking-wide">{match.title}</span>
            <div className="flex items-center gap-2 mt-1 text-foreground/40">
              <Clock3 className="w-3 h-3" />
              <span className="text-xs font-medium">{match.time}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const isLive = match.status === 'Live';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden ucl-panel ${
        highlightLive
          ? 'border border-red-400/50 shadow-[0_0_30px_rgba(239,68,68,0.22),0_0_60px_rgba(239,68,68,0.12)]'
          : 'border border-border/8'
      } ${isFeatured ? 'rounded-[24px] p-5' : 'rounded-[22px] p-4'}`}
    >
      {highlightLive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/12 via-red-400/6 to-transparent" />
          <div className="absolute -inset-6 bg-red-500/10 blur-3xl" />
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusClasses(match.status)}`}>
              {match.status === 'Live' ? (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.9)] animate-ping" />
                  {match.minuteText || 'Live'}
                </span>
              ) : match.status}
            </div>
            {match.competitionLabel && (
              <span className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest">
                {match.competitionLabel}
              </span>
            )}
          </div>
          {!isCompact && match.venue && (
            <div className="flex items-center gap-1 text-foreground/30">
              <MapPin className="w-3 h-3" />
              <span className="text-[10px] font-medium">{match.venue}</span>
            </div>
          )}
        </div>

        <div className={`flex items-center ${isLive ? 'justify-center gap-10' : 'justify-between gap-4'}`}>
          {/* Home Team */}
          <div className={`flex flex-col items-center flex-1 ${isCompact ? 'gap-2' : 'gap-3'}`}>
            <div className={`${
              isLive
                ? 'w-20 h-20'
                : isFeatured
                  ? 'w-16 h-16'
                  : 'w-12 h-12'
            } rounded-full bg-foreground/5 flex items-center justify-center p-2 border border-border/5 shadow-inner shadow-white/5`}>
              {match.homeTeam ? (
                <div className={`w-full h-full rounded-full flex items-center justify-center ${match.homeTeam?.id === 'fa' ? 'bg-foreground p-1' : ''}`}>
                  <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-foreground/10 flex items-center justify-center text-foreground/30 text-xs font-bold">?</div>
              )}
            </div>
            <span className={`${isFeatured ? 'text-sm' : 'text-xs'} font-bold text-foreground text-center uppercase tracking-wider`}>
              {match.homeTeam ? match.homeTeam.shortName : match.homeTeamPlaceholder}
            </span>
          </div>

          {!isLive && (
            <div className="flex flex-col items-center min-w-[80px]">
              {match.status === 'Upcoming' ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl font-bold text-foreground tracking-tight">{match.time}</span>
                  <div className="flex items-center gap-1 text-foreground/30">
                    <Clock3 className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{match.displayDate}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-3">
                    <span className={`${isFeatured ? 'text-3xl' : 'text-2xl'} font-bold text-foreground tracking-tighter`}>
                      {match.homeScore ?? '-'}
                    </span>
                    <span className="text-foreground/20 font-bold">-</span>
                    <span className={`${isFeatured ? 'text-3xl' : 'text-2xl'} font-bold text-foreground tracking-tighter`}>
                      {match.awayScore ?? '-'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Away Team */}
          <div className={`flex flex-col items-center flex-1 ${isCompact ? 'gap-2' : 'gap-3'}`}>
            <div className={`${
              isLive
                ? 'w-20 h-20'
                : isFeatured
                  ? 'w-16 h-16'
                  : 'w-12 h-12'
            } rounded-full bg-foreground/5 flex items-center justify-center p-2 border border-border/5 shadow-inner shadow-white/5`}>
              {match.awayTeam ? (
                <div className={`w-full h-full rounded-full flex items-center justify-center ${match.awayTeam?.id === 'fa' ? 'bg-foreground p-1' : ''}`}>
                  <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-foreground/10 flex items-center justify-center text-foreground/30 text-xs font-bold">?</div>
              )}
            </div>
            <span className={`${isFeatured ? 'text-sm' : 'text-xs'} font-bold text-foreground text-center uppercase tracking-wider`}>
              {match.awayTeam ? match.awayTeam.shortName : match.awayTeamPlaceholder}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
