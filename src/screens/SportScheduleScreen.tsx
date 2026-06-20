import { GenderTab, SportTab, DivisionTab } from '../types';
import { MapPin } from 'lucide-react';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { SheetMatch } from '../services/parsers';
import { useEffect } from 'react';

interface SportScheduleScreenProps {
  sport: SportTab;
  gender: GenderTab;
  division: DivisionTab;
  onSportChange: (sport: SportTab) => void;
  athleticsDataState: AthleticsDataState;
}

export default function SportScheduleScreen({
  sport,
  gender,
  division,
  onSportChange,
  athleticsDataState,
}: SportScheduleScreenProps) {
  const { data, loading, error } = athleticsDataState;

  const formatSportName = (s: SportTab) => {
    switch (s) {
      case 'TrackAndField': return 'Track & Field';
      default: return s;
    }
  };

  const SPORTS_LIST: SportTab[] = ['Soccer'];

  useEffect(() => {
    if (sport !== 'Soccer') {
      onSportChange('Soccer');
    }
  }, [onSportChange, sport]);

  const currentMatches = data.soccerMatches.filter((match) => {
    return (
      match.sportKey === sport &&
      match.level === division &&
      match.genderGroup === gender
    );
  });

  const displayDivision = division === 'SMA' ? 'SMA / Varsity' : 'SMP';

  return (
    <div className="animate-in fade-in duration-500 pb-8 px-4 space-y-6 mt-4">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-foreground leading-[1] mb-6 tracking-tight uppercase px-2">
          Soccer Schedule
        </h2>
        <p className="px-2 mb-4 text-xs font-bold uppercase tracking-[0.18em] text-foreground/45">
          Live from published Google Sheets
        </p>
        
        {/* Sport selection pills */}
        <div className="flex overflow-x-auto gap-3 pb-4 px-2 -mx-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
          {SPORTS_LIST.map((s) => (
            <button
              key={s}
              onClick={() => onSportChange(s)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-[24px] font-bold text-sm tracking-wide transition-all ${
                sport === s
                  ? 'bg-transparent border-2 border-[#B5413F] text-foreground'
                  : 'bg-subcard border-2 border-border/10 text-foreground/50 hover:text-foreground/80'
              }`}
            >
              {formatSportName(s)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
           <p className="text-[10px] text-foreground/40 font-bold tracking-widest uppercase">
             {formatSportName(sport)} · {displayDivision} · {gender}
           </p>
           <div className="flex-1 h-px bg-foreground/10"></div>
        </div>

        {loading && (
          <div className="bg-subcard rounded-2xl p-8 border border-border/10 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-foreground/50 animate-pulse">
              Loading matches...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-subcard rounded-2xl p-8 border border-red-500/20 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-red-400">
              Google Sheets sync error
            </p>
            <p className="text-xs text-foreground/45 mt-2">{error}</p>
          </div>
        )}

        {!loading && !error && currentMatches.length === 0 && (
          <div className="bg-subcard rounded-2xl p-8 border border-border/10 text-center shadow-md">
            <p className="text-sm font-black uppercase tracking-widest text-foreground/70">
              Schedule not available yet
            </p>
            <p className="text-xs text-foreground/40 mt-2">
              Soccer is the only live schedule enabled in this stage. Confirm the sheet rows match the selected level and gender.
            </p>
          </div>
        )}

        {!loading && !error && currentMatches.length > 0 && (
          <div className="space-y-3">
            {currentMatches.map((match: SheetMatch) => (
              <div key={match.id} className="bg-subcard rounded-xl p-4 border border-border/5 hover:border-border/20 transition-all group shadow-sm">
                <div className="flex justify-between items-start mb-3 border-b border-border/5 pb-3">
                   <div>
                     <p className="text-[10px] font-bold text-[#B5413F] uppercase tracking-widest mb-1">
                       {match.tournament}
                     </p>
                     <p className="font-bold text-foreground text-[15px] uppercase tracking-wide leading-tight">
                       vs {match.opponent || 'TBD'}
                     </p>
                     <p className="text-xs text-foreground/40 uppercase font-bold tracking-wider mt-1">
                       {match.locationType || 'MATCH'}
                     </p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-bold text-foreground mb-0.5">{match.date || 'TBD'}</p>
                     <p className="text-xs font-mono text-foreground/60">{match.time || ''}</p>
                   </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex gap-2 items-center text-[11px] text-foreground/50 font-bold tracking-widest uppercase">
                    <MapPin size={12} className="text-[#B5413F]" />
                    {match.venue || 'TBD'}
                  </div>
                  {(match.scoreFor !== null && match.scoreAgainst !== null) && (
                    <div className="font-mono text-xs font-black text-foreground">
                      Score: <span className="text-[#B5413F] text-sm">{match.scoreFor}–{match.scoreAgainst}</span> {match.result ? `(${match.result})` : ''}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
