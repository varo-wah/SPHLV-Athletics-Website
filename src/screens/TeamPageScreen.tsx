import { SportTab, DivisionTab, GenderTab } from '../types';
import { Users, Search, Trophy, ChevronLeft, ChevronRight, MapPin, ChevronDown, ChevronUp, CalendarDays, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AthleticsDataState } from '../hooks/useAthleticsData';
import { SheetMatch } from '../services/parsers';

interface TeamPageScreenProps {
  sport: SportTab;
  division: DivisionTab;
  gender: GenderTab;
  athleticsDataState?: AthleticsDataState;
}

export default function TeamPageScreen({
  sport,
  division,
  gender,
  athleticsDataState,
}: TeamPageScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showUpcomingMatches, setShowUpcomingMatches] = useState(true);
  const [showMatchResults, setShowMatchResults] = useState(false);

  const isCustomBanner = sport === 'Soccer' && division === 'SMA' && gender === 'Boys';

  const getCustomBannerUrl = (): string | null => {
    if (sport === 'Soccer' && division === 'SMA') {
      if (gender === 'Girls') {
        return "https://res.cloudinary.com/dpgt445lg/image/upload/v1780443630/ACSC_Girls_football_26_2_bcdvak.png";
      }
    }
    return null;
  };

  const customBannerUrl = getCustomBannerUrl();
  const isVarsityBoysSoccer = sport === 'Soccer' && division === 'SMA' && gender === 'Boys';

  const defaultCarouselImages = [
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // blank transparent
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  ];

  const customCarouselImages = [
    'https://res.cloudinary.com/dpgt445lg/image/upload/v1780241030/Varsity_soccer_boys_teampic_2_dyv7mz.jpg',
    'https://res.cloudinary.com/dpgt445lg/image/upload/v1780241126/Varsity_boys_soccer_team_pic_resized_i1ezdp.jpg',
  ];

  const carouselImages = isCustomBanner ? customCarouselImages : defaultCarouselImages;
  const varsityBoysPlayerImages = [
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780314657/729b06f6-c63a-4d58-bd8a-59dc421c34c9_sgb10l.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780314660/85e9e894-a666-41b1-8a62-cc23c91d5739_hs1d1a.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780314198/bff29ebb-3b20-46c5-b982-61e07cf9e5b1_zy4fdd.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780314197/b8e4ceee-cb88-425a-b4e5-e0534dad7b34_kgvglj.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780314177/c0b46a7a-328d-49c0-bd35-3d2a9f18474b_lidfgc.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313965/87727527-0b43-429d-b6cf-bca8b5e40242_fwt2v3.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313965/52b7153b-d6ec-499f-afb8-66d0a49cdd12_zfobkg.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313965/a73ad134-3a3b-44e5-8e9c-eb3eaa6d3b80_dqjmkh.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313965/c223e878-f9ed-44b1-8a2d-2a030c1ffaf1_czfwvj.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313965/33c86d0b-1408-4a93-9454-6a0340e55d85_zshgwq.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313964/3e92cad7-318a-4420-a4fc-78c2c18431aa_b0xgpz.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313963/4b3e6de7-7081-4085-850d-0d4c90aba1df_d7z0gp.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313963/9c57e7bd-7945-422c-b9a9-0019e35648a0_w0zfpl.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780313962/1b739ec8-9f95-4512-9bfc-4e893388e447_yyhlsv.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286730/aa15e6aa-96ac-46e2-806f-5c377fc0016d_lzievt.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286729/932c02c4-239d-4156-b662-96913a2dda4f_kiblr9.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286729/82c8bc76-dd0c-4292-bcd4-766ed486cc89_cathhd.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286729/87b44f76-93a4-4913-b01b-d185a528194e_w1rsyr.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286729/b3f31b3a-07ec-4d02-97a9-68dfca7f9c73_uhdqzv.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286728/062fed6c-1f9e-4aa4-a066-a605d10eeb89_uv2win.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286727/cef8db89-1d57-46ea-b42e-0993d4d50858_zcywog.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286727/fc0d8979-a00f-4af2-93a7-544f756eda7f_izigrx.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286727/29405bbc-115f-4f62-b52b-e80296f83a9e_u6sono.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286726/c2cddcb4-00e2-4237-8947-e75257c20b4f_iohgtj.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780286725/ec2d0470-a2af-4e6a-9bda-afd82356df72_ldi1hx.webp",
    "https://res.cloudinary.com/dpgt445lg/image/upload/v1780315354/85f6440e-79b5-4a1b-92d3-7e37513c5e18_l8xtxc.webp"
  ];
  const playerImages = isCustomBanner
    ? varsityBoysPlayerImages
    : Array.from({ length: 10 }, (_, idx) => `https://i.pravatar.cc/300?u=${idx + sport + gender + 'player'}`);

  const goToPreviousPhoto = () => {
    setCurrentImageIndex((current) => (current - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToNextPhoto = () => {
    setCurrentImageIndex((current) => (current + 1) % carouselImages.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const sportLabels: Record<SportTab, string> = {
    Basketball: 'Basketball',
    Volleyball: 'Volleyball',
    Soccer: 'Soccer',
    Badminton: 'Badminton',
    TrackAndField: 'Track & Field',
  };

  const getHeroImage = () => {
    switch (sport) {
      case 'Basketball':
        return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80';
      case 'Soccer':
        return 'https://images.unsplash.com/photo-1518605368461-1e1296221f8c?auto=format&fit=crop&w=800&q=80';
      case 'Volleyball':
        return 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=800&q=80';
      case 'Badminton':
        return 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80';
      case 'TrackAndField':
        return 'https://images.unsplash.com/photo-1552674605-15c2145eba11?auto=format&fit=crop&w=800&q=80';
      default:
        return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80';
    }
  };

  const displayDivision = division === 'SMA' ? 'SMA / Varsity' : 'SMP';

  const currentStandings = (athleticsDataState?.data?.standings || []).filter((standing) => {
    return (
      standing.sportKey === sport &&
      standing.level === division &&
      standing.genderGroup === gender
    );
  });

  const currentMatches = (athleticsDataState?.data?.matches || []).filter((match) => {
    return (
      match.sportKey === sport &&
      match.level === division &&
      match.genderGroup === gender
    );
  });

  const upcomingMatches = currentMatches.filter((match) => match.status !== 'Finished');
  const finishedMatches = currentMatches.filter((match) => match.status === 'Finished');
  const standingsRows = currentStandings
    .map((row, idx) => {
      const wins = row.wins ?? 0;
      const draws = row.draws ?? 0;
      const losses = row.losses ?? 0;
      const gp = wins + draws + losses;
      const pts = row.points ?? ((wins * 3) + draws);
      const goalsFor = row.forValue ?? 0;
      const diff = row.difference ?? (
        row.forValue !== null && row.againstValue !== null ? row.forValue - row.againstValue : 0
      );

      return { row, idx, wins, draws, losses, gp, pts, goalsFor, diff, rank: idx + 1 };
    })
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.diff !== a.diff) return b.diff - a.diff;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return a.row.team.localeCompare(b.row.team);
    })
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  const leader = standingsRows[0];
  const lvStanding = standingsRows.find((entry) => {
    const teamName = entry.row.team.trim().toLowerCase();
    return teamName === 'lv' || teamName.includes('sph lv') || teamName.includes('sphlv');
  }) ?? leader;

  const resultBadgeClass = (result: string) => {
    if (result === 'W') return 'bg-green-500/15 text-green-400 border-green-500/20';
    if (result === 'L') return 'bg-red-500/15 text-red-400 border-red-500/20';
    if (result === 'D') return 'bg-yellow-400/15 text-yellow-300 border-yellow-400/20';
    return 'bg-[#BFD7EA]/10 text-[#BFD7EA] border-[#BFD7EA]/20';
  };

  const matchAccentClass = (match: SheetMatch) => {
    if (match.result === 'W') return 'border-l-green-500';
    if (match.result === 'L') return 'border-l-red-500';
    if (match.result === 'D') return 'border-l-yellow-400';
    return 'border-l-[#BFD7EA]/40';
  };

  const matchLocationText = (match: SheetMatch) => {
    return (match.locationType || 'TBD').toUpperCase();
  };

  const SectionHeader = ({
    title,
    detail,
    count,
    expanded,
    onToggle,
  }: {
    title: string;
    detail: string;
    count?: number;
    expanded?: boolean;
    onToggle?: () => void;
  }) => {
    const content = (
      <>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#B5413F]">
            {detail}
          </p>
          <h3 className="mt-1 text-2xl sm:text-3xl font-black uppercase tracking-[0.08em] text-foreground leading-none">
            {title}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {typeof count === 'number' && (
            <span className="rounded-full border border-border/10 bg-subcard px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/55">
              {count}
            </span>
          )}

          {onToggle && (
            <span className="flex items-center gap-2 rounded-xl border border-border/10 bg-subcard px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#B5413F] transition-colors group-hover:border-[#B5413F]/30 group-hover:text-foreground">
              {expanded ? 'Hide' : 'Show'}
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </span>
          )}
        </div>
      </>
    );

    if (onToggle) {
      return (
        <button
          type="button"
          onClick={onToggle}
          className="group w-full rounded-2xl border border-border/10 bg-subcard/50 px-4 py-4 text-left shadow-sm transition-colors hover:border-[#B5413F]/25"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {content}
          </div>
        </button>
      );
    }

    return (
      <div className="rounded-2xl border border-border/10 bg-subcard/50 px-4 py-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {content}
        </div>
      </div>
    );
  };

  const EmptyPanel = ({ title, body }: { title: string; body: string }) => (
    <div className="rounded-2xl border border-border/10 bg-[#5A1C2C]/5 p-8 text-center">
      <p className="text-sm font-black uppercase tracking-widest text-foreground/70">
        {title}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-foreground/45">
        {body}
      </p>
    </div>
  );

  const teamInitials = (name: string) => {
    const cleaned = name.trim();
    if (!cleaned) return 'TBD';

    const parts = cleaned.split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase();

    return parts.map((part) => part[0]).join('').slice(0, 3).toUpperCase();
  };

  const renderMatchCard = (match: SheetMatch, idx: number) => {
    const badgeText = match.status || 'Scheduled';
    const details = [
      match.date || 'Date TBD',
      match.time,
      match.venue,
    ].filter(Boolean).join(' · ');

    return (
      <article
        key={`${match.id}-${idx}`}
        className={`group relative overflow-hidden rounded-3xl border border-border/10 border-l-[6px] ${matchAccentClass(match)} bg-subcard p-4 shadow-[0_18px_55px_rgba(0,0,0,0.18)] transition-transform hover:-translate-y-0.5 sm:p-5`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(191,215,234,0.11),transparent_34%)] opacity-80" />

        <div className="relative grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${resultBadgeClass(match.result)}`}>
                {badgeText}
              </span>
              <span className="rounded-full border border-border/10 bg-foreground/[0.03] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/55">
                {matchLocationText(match)}
              </span>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#B5413F]">
                {displayDivision} {gender} {sportLabels[sport]}
              </p>
              <h4 className="mt-2 text-2xl font-black uppercase leading-tight tracking-tight text-foreground sm:text-3xl">
                SPH LV <span className="text-foreground/35">vs</span> {match.opponent || 'TBD'}
              </h4>
            </div>

            <div className="grid gap-2 text-xs font-semibold text-foreground/50 sm:grid-cols-2">
              <div className="flex min-w-0 items-center gap-2">
                <CalendarDays size={15} className="shrink-0 text-[#B5413F]" />
                <span className="truncate">{match.date || 'Date TBD'}</span>
              </div>

              <div className="flex min-w-0 items-center gap-2">
                <Clock size={15} className="shrink-0 text-[#B5413F]" />
                <span className="truncate">{match.time || 'Time TBD'}</span>
              </div>

              <div className="flex min-w-0 items-center gap-2 sm:col-span-2">
                <MapPin size={15} className="shrink-0 text-[#B5413F]" />
                <span className="truncate">{match.venue || match.locationType || 'Venue TBD'}</span>
              </div>
            </div>

            {match.notes && (
              <p className="rounded-xl border border-border/5 bg-foreground/[0.02] p-3 text-xs italic leading-relaxed text-foreground/45">
                {match.notes}
              </p>
            )}
          </div>

          <div className="relative flex items-center justify-between gap-4 rounded-2xl border border-border/10 bg-foreground/[0.025] p-4 md:min-w-[150px] md:flex-col md:items-end md:text-right">
            <span className="rounded-full border border-[#BFD7EA]/15 bg-[#BFD7EA]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#BFD7EA]">
              Next
            </span>
            <div className="text-right">
              <p className="text-base font-black uppercase tracking-[0.12em] text-foreground">
                {match.date || 'TBD'}
              </p>
              <p className="mt-1 text-xs font-semibold text-foreground/45">
                {match.time || 'Time TBD'}
              </p>
            </div>
          </div>
        </div>

        {details && (
          <div className="relative mt-4 border-t border-border/5 pt-3 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/35">
            {details}
          </div>
        )}
      </article>
    );
  };

  const renderResultCard = (match: SheetMatch, idx: number) => {
    const opponent = match.opponent || 'TBD';
    const hasScore = match.scoreFor !== null && match.scoreAgainst !== null;
    const resultLabel = match.result || 'Final';

    return (
      <article
        key={`${match.id}-${idx}`}
        className={`relative overflow-hidden rounded-3xl border border-border/10 border-l-[6px] ${matchAccentClass(match)} bg-subcard p-4 shadow-[0_18px_55px_rgba(0,0,0,0.18)] sm:p-5`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(90,28,44,0.18),transparent_34%,rgba(191,215,234,0.08))]" />

        <div className="relative flex items-center justify-between gap-2 sm:gap-5">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/10 bg-foreground/[0.04] text-xs font-black uppercase tracking-wider text-foreground/60 sm:h-12 sm:w-12">
              LV
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#B5413F] sm:text-[10px]">
                Home
              </p>
              <h4 className="truncate text-sm font-black uppercase leading-tight text-foreground sm:text-lg md:text-xl">
                SPH LV Eagles
              </h4>
            </div>
          </div>

          <div className="shrink-0 text-center">
            <span className={`mx-auto mb-2 block w-fit rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] sm:text-[10px] ${resultBadgeClass(match.result)}`}>
              {resultLabel}
            </span>

            <div className="rounded-2xl bg-[#101733] px-3 py-2 shadow-[0_14px_35px_rgba(0,0,0,0.28)] sm:px-5">
              {hasScore ? (
                <p className="whitespace-nowrap text-2xl font-black leading-none tracking-tight text-white sm:text-4xl">
                  {match.scoreFor} : {match.scoreAgainst}
                </p>
              ) : (
                <p className="text-2xl font-black leading-none text-white/45 sm:text-4xl">-</p>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right sm:gap-4">
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#B5413F] sm:text-[10px]">
                Opponent
              </p>
              <h4 className="truncate text-sm font-black uppercase leading-tight text-foreground sm:text-xl md:text-2xl">
                {opponent}
              </h4>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/10 bg-foreground/[0.04] text-xs font-black uppercase tracking-wider text-foreground/60 sm:h-16 sm:w-16 sm:text-base">
              {teamInitials(opponent)}
            </div>
          </div>
        </div>

        {match.notes && (
          <p className="relative mt-4 rounded-xl border border-border/5 bg-foreground/[0.02] p-3 text-xs italic leading-relaxed text-foreground/45">
            {match.notes}
          </p>
        )}
      </article>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 cursor-default">
      {/* Hero Header */}
      <div className={`relative w-full ${isVarsityBoysSoccer ? '' : 'border-b-[8px] border-[#5A1C2C] border-t-[8px]'}`}>
        <div className={`${isVarsityBoysSoccer ? 'relative w-full min-h-[300px] overflow-hidden bg-black sm:min-h-[340px]' : 'aspect-[21/6] relative w-full overflow-hidden bg-black'}`}>
          {isVarsityBoysSoccer ? (
            <section className="varsity-boys-soccer-hero" aria-label="Varsity Boys Soccer">
              <div className="varsity-boys-soccer-hero__field" aria-hidden="true">
                <div className="varsity-boys-soccer-hero__circle" />
                <div className="varsity-boys-soccer-hero__box varsity-boys-soccer-hero__box--left" />
                <div className="varsity-boys-soccer-hero__box varsity-boys-soccer-hero__box--right" />
                <div className="varsity-boys-soccer-hero__runner varsity-boys-soccer-hero__runner--one" />
                <div className="varsity-boys-soccer-hero__runner varsity-boys-soccer-hero__runner--two" />
              </div>

              <div className="varsity-boys-soccer-hero__content">
                <div className="varsity-boys-soccer-hero__copy">
                  <p>SPH LV Eagles</p>
                  <h1>Varsity Boys Soccer</h1>
                </div>

                <div className="varsity-boys-soccer-hero__meta" aria-label="Team status">
                  <span>{currentStandings[0]?.rank ? `Table #${currentStandings[0].rank}` : 'Live Table'}</span>
                  <span>{upcomingMatches.length} Upcoming</span>
                </div>
              </div>
            </section>
          ) : customBannerUrl ? (
            <img 
              src={customBannerUrl} 
              alt={`${division} ${gender} ${sportLabels[sport]}`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <img 
                src={getHeroImage()} 
                alt={`${division} ${gender} ${sportLabels[sport]}`} 
                className="w-full h-full object-cover blur-sm opacity-60 mix-blend-multiply"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h2 className="text-4xl md:text-5xl font-black text-center uppercase tracking-tighter" style={{
                   WebkitTextStroke: '2px rgba(255,255,255,0.8)',
                   color: '#5A1C2C',
                   textShadow: '0px 4px 10px rgba(0,0,0,0.5)'
                }}>
                  {displayDivision}<br />
                  {gender} {sportLabels[sport]}
                </h2>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 mt-5 space-y-8">
        <a
          href="https://acscconference.com/boys-soccer/"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-border/10 bg-subcard/70 px-4 py-3 text-white shadow-[0_14px_38px_rgba(0,0,0,0.16)] transition-colors hover:border-[#B5413F]/30 hover:bg-subcard group"
        >
          <div className="absolute inset-y-0 left-0 w-1 bg-[#B5413F]" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#B5413F]/20 bg-[#B5413F]/10">
              <Trophy size={19} className="text-[#B5413F] group-hover:scale-110 transition-transform" />
            </div>

            <div className="flex min-w-0 flex-col items-start gap-1 leading-none">
              <span className="uppercase tracking-[0.22em] text-[9px] font-black text-foreground/40">
                ACSC Website
              </span>
              <span className="truncate text-sm font-black tracking-tight text-foreground sm:text-base">
                Open ACSC Results
              </span>
            </div>
          </div>

          <ChevronRight size={20} className="relative z-10 text-foreground/45 transition-transform group-hover:translate-x-1 group-hover:text-[#B5413F]" />
        </a>

        <div className="grid grid-cols-1 gap-10 2xl:grid-cols-[minmax(620px,1.04fr)_minmax(560px,0.96fr)] 2xl:items-start">
          {/* STANDINGS COLUMN */}
          <section className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-border/10 bg-subcard/40 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.16)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#B5413F]">
                    Live table
                  </p>
                  <h2 className="mt-2 text-3xl font-black uppercase tracking-[0.16em] text-foreground leading-tight sm:text-4xl">
                    League<br />Standings
                  </h2>
                </div>

            <div className="flex flex-wrap items-center gap-3">
              {(athleticsDataState?.loading || athleticsDataState?.refreshing) && (
                <span className="rounded-full border border-[#B5413F]/20 bg-[#B5413F]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#B5413F] animate-pulse">
                  Syncing
                </span>
              )}

              {athleticsDataState?.lastUpdated && (
                <span className="rounded-full border border-border/10 bg-foreground/[0.025] px-3 py-2 text-[10px] font-mono uppercase tracking-[0.14em] text-foreground/40">
                  Updated {athleticsDataState.lastUpdated}
                </span>
              )}

              <button
                type="button"
                onClick={() => athleticsDataState?.refresh()}
                className="shrink-0 rounded-2xl border border-border/10 bg-subcard px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/65 transition-colors hover:border-[#B5413F]/40 hover:text-foreground"
              >
                Refresh
              </button>
            </div>
          </div>

          {lvStanding && (
            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="rounded-2xl border border-[#B5413F]/20 bg-gradient-to-r from-[#5A1C2C]/35 via-[#5A1C2C]/14 to-transparent p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#B5413F]">
                  LV status
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#B5413F] text-sm font-black text-white shadow-[0_12px_30px_rgba(181,65,63,0.28)]">
                    #{lvStanding.rank}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-2xl font-black uppercase tracking-tight text-foreground">
                      {lvStanding.rank === 1 ? 'LV leads the table' : `LV is #${lvStanding.rank}`}
                    </p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/40">
                      {lvStanding.wins}W · {lvStanding.draws}D · {lvStanding.losses}L
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:min-w-[230px]">
                <div className="rounded-2xl border border-border/10 bg-foreground/[0.025] p-3 text-center">
                  <p className="text-2xl font-black text-[#B5413F]">{lvStanding.pts}</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-foreground/35">Pts</p>
                </div>
                <div className="rounded-2xl border border-border/10 bg-foreground/[0.025] p-3 text-center">
                  <p className="text-2xl font-black text-foreground">{lvStanding.gp}</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-foreground/35">GP</p>
                </div>
                <div className="rounded-2xl border border-border/10 bg-foreground/[0.025] p-3 text-center">
                  <p className="text-2xl font-black text-foreground">
                    {lvStanding.diff !== null && lvStanding.diff > 0 ? `+${lvStanding.diff}` : lvStanding.diff ?? '-'}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-foreground/35">GD</p>
                </div>
              </div>
            </div>
          )}
        </div>

            <div className="overflow-hidden rounded-3xl border border-border/10 bg-subcard shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
               <div className="grid grid-cols-[48px_minmax(0,1fr)_64px_70px] gap-2 border-b border-[#5A1C2C]/10 bg-[#5A1C2C]/10 px-4 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-[#B5413F] sm:grid-cols-[56px_minmax(0,1fr)_52px_52px_52px_52px_70px]">
                  <div>Rank</div>
                  <div>Club</div>
                  <div className="text-center">GP</div>
                  <div className="hidden text-center sm:block">W</div>
                  <div className="hidden text-center sm:block">D</div>
                  <div className="hidden text-center sm:block">L</div>
                  <div className="text-right">Pts</div>
               </div>

               <div className="flex flex-col">
                  {athleticsDataState?.loading && currentStandings.length === 0 ? (
                    <div className="p-6 text-center text-xs font-medium text-foreground/40 animate-pulse">
                      Fetching live standings from Google Sheets...
                    </div>
                  ) : athleticsDataState?.error ? (
                    <div className="p-6 text-center text-xs font-semibold text-red-500 bg-red-500/5">
                      Failed to load. {athleticsDataState.error}
                    </div>
                  ) : standingsRows.length === 0 ? (
                    <div className="p-8 text-center text-xs font-medium text-foreground/40 space-y-2">
                      <p className="font-bold text-foreground/60">Standings will appear once uploaded</p>
                      <p>
                        No standings matches for {sportLabels[sport]} · {displayDivision} · {gender}.
                      </p>
                    </div>
                  ) : (
                    standingsRows.map(({ row, idx, wins, draws, losses, gp, pts, rank, diff }) => {
                      return (
                        <div
                          key={`${row.id || idx}-${idx}`}
                          className={`relative grid grid-cols-[48px_minmax(0,1fr)_64px_70px] gap-2 border-b border-border/5 px-4 py-4 transition-colors hover:bg-foreground/[0.025] sm:grid-cols-[56px_minmax(0,1fr)_52px_52px_52px_52px_70px] ${
                            idx === 0 ? 'bg-[#B5413F]/[0.055]' : ''
                          }`}
                        >
                          {idx === 0 && <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-[#B5413F]" />}
                          <div className="flex items-center">
                            <span className={`flex h-9 w-9 items-center justify-center rounded-2xl border text-xs font-black ${
                              idx === 0
                                ? 'border-[#B5413F]/30 bg-[#B5413F] text-white shadow-[0_10px_24px_rgba(181,65,63,0.26)]'
                                : 'border-border/10 bg-foreground/[0.035] text-foreground/55'
                            }`}>
                              {rank}
                            </span>
                          </div>

                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border/10 bg-foreground/[0.035] text-[10px] font-black uppercase tracking-wider text-foreground/55">
                              {teamInitials(row.team)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-base font-black uppercase tracking-wide text-foreground">
                                {row.team}
                              </p>
                              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-foreground/35 sm:hidden">
                                {wins}W · {draws}D · {losses}L
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-center font-mono text-sm text-foreground/80">
                            {gp}
                          </div>
                          <div className="hidden items-center justify-center font-mono text-sm text-foreground/70 sm:flex">
                            {wins}
                          </div>
                          <div className="hidden items-center justify-center font-mono text-sm text-foreground/70 sm:flex">
                            {draws}
                          </div>
                          <div className="hidden items-center justify-center font-mono text-sm text-foreground/70 sm:flex">
                            {losses}
                          </div>
                          <div className="flex items-center justify-end">
                            <div className="text-right">
                              <p className="font-mono text-xl font-black text-[#B5413F]">{pts}</p>
                              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-foreground/30">
                                GD {diff !== null && diff > 0 ? `+${diff}` : diff ?? '-'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
               </div>

               <div className="flex flex-col gap-2 bg-foreground/[0.025] px-5 py-4 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/35 sm:flex-row sm:items-center sm:justify-between">
                  <span>Google Sheets Synced</span>
                  <span>{standingsRows.length} Teams · Live Data</span>
               </div>
            </div>
          </section>

          {/* UPCOMING MATCHES COLUMN */}
          <section className="space-y-4">
            <SectionHeader
              title="Upcoming Matches"
              detail="Live schedule"
              count={upcomingMatches.length}
              expanded={showUpcomingMatches}
              onToggle={() => setShowUpcomingMatches((current) => !current)}
            />

            {showUpcomingMatches && (
              <div className="space-y-4">
                {athleticsDataState?.loading && upcomingMatches.length === 0 ? (
                  <div className="bg-subcard rounded-2xl p-8 border border-border/10 text-center animate-pulse">
                    <p className="text-sm font-black uppercase tracking-widest text-foreground/50">
                      Loading matches from Google Sheets...
                    </p>
                  </div>
                ) : athleticsDataState?.error ? (
                  <div className="bg-subcard rounded-2xl p-8 border border-red-500/20 text-center">
                    <p className="text-sm font-black uppercase tracking-widest text-red-400">
                      Match sync error
                    </p>
                    <p className="text-xs text-foreground/40 mt-2">
                      {athleticsDataState.error}
                    </p>
                  </div>
                ) : upcomingMatches.length === 0 ? (
                  <EmptyPanel
                    title="No upcoming matches"
                    body="Upcoming matches will appear when the sheet status is not Finished."
                  />
                ) : (
                  upcomingMatches.map((match, idx) => renderMatchCard(match, idx))
                )}
              </div>
            )}
          </section>
        </div>

        {/* MATCH RESULTS SECTION */}
        <section className="space-y-4 mt-10">
          <SectionHeader
            title="Match Results"
            detail="Completed fixtures"
            count={finishedMatches.length}
            expanded={showMatchResults}
            onToggle={() => setShowMatchResults((current) => !current)}
          />

          {showMatchResults && (
            <div className="space-y-4">
              {athleticsDataState?.loading && finishedMatches.length === 0 ? (
                <div className="bg-subcard rounded-2xl p-8 border border-border/10 text-center animate-pulse">
                  <p className="text-sm font-black uppercase tracking-widest text-foreground/50">
                    Loading results from Google Sheets...
                  </p>
                </div>
              ) : finishedMatches.length === 0 ? (
                <EmptyPanel
                  title="No match results yet"
                  body="Finished matches will appear here after scores are entered."
                />
              ) : (
                finishedMatches.map((match, idx) => renderResultCard(match, idx))
              )}
            </div>
          )}
        </section>

        {/* JAAC Bracket */}
        {sport === 'Soccer' && division === 'SMA' && gender === 'Boys' && (
          <section className="space-y-4 mt-10">
            <SectionHeader
              title="JAAC Bracket"
              detail="Semifinals & final"
            />

            <div className="bg-[#5A1C2C] rounded-2xl p-4 border border-[#BFD7EA]/10 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60">
                  @BSJ · Final Round
                </p>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60">
                  2025
                </p>
              </div>

              <div className="bg-[#061126] rounded-xl p-5 border border-white/5">
                <div className="text-center mb-5">
                  <h4 className="text-lg font-black uppercase tracking-[0.18em] text-yellow-300">
                    JAAC Championship
                  </h4>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/50 mt-1">
                    Playoffs
                  </p>
                </div>

                {/* Final */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center mb-5">
                  <div className="rounded-lg overflow-hidden border border-white/10 border-l-4 border-l-yellow-400 bg-white/5">
                    <div className="grid grid-cols-[1fr_48px] border-b border-white/5">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white/55">
                        SPH
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-white/55">
                        0
                      </div>
                    </div>

                    <div className="grid grid-cols-[1fr_48px] bg-white/10">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white">
                        BSJ
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-yellow-300">
                        2
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white/5 border border-white/10 min-h-[72px] flex items-center justify-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                      Final
                    </p>
                  </div>
                </div>

                {/* Semifinals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                    <div className="px-3 py-2 border-b border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        Semifinals 1
                      </p>
                    </div>

                    <div className="grid grid-cols-[1fr_48px] bg-white/10">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white">
                        SPH
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-white">
                        3
                      </div>
                    </div>

                    <div className="grid grid-cols-[1fr_48px] border-t border-white/5">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white/55">
                        JIS
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-white/55">
                        1
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                    <div className="px-3 py-2 border-b border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        Semifinals 2
                      </p>
                    </div>

                    <div className="grid grid-cols-[1fr_48px] bg-white/10">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white">
                        BSJ
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-white">
                        2
                      </div>
                    </div>

                    <div className="grid grid-cols-[1fr_48px] border-t border-white/5">
                      <div className="px-3 py-2 text-xs font-black uppercase tracking-widest text-white/55">
                        ACS
                      </div>
                      <div className="px-3 py-2 text-xs font-black text-right text-white/55">
                        0
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Team Photo */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#C1121F] dark:text-[#B5413F]">
                <Users size={14} />
                Team Photo
              </p>
              <h3 className="mt-1 text-2xl font-black uppercase tracking-[0.08em] text-foreground dark:text-foreground">
                2025-26 Squad
              </h3>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/10 bg-subcard px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/45">
              <span>{currentImageIndex + 1}</span>
              <span className="text-foreground/20">/</span>
              <span>{carouselImages.length}</span>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[1.75rem] border border-border/10 bg-[#0b080a] shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
            <div className="relative aspect-[16/11] min-h-[260px] sm:aspect-[16/9]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={carouselImages[currentImageIndex]}
                  alt={`Varsity boys soccer team photo ${currentImageIndex + 1}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="absolute inset-0 h-full w-full object-contain object-center"
                />
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_45%,rgba(0,0,0,0.72))]" />
              <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                    SPH LV Eagles
                  </p>
                  <p className="mt-1 text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
                    Varsity Boys Soccer
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousPhoto}
                    aria-label="Previous team photo"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition-colors hover:bg-white hover:text-black"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={goToNextPhoto}
                    aria-label="Next team photo"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition-colors hover:bg-white hover:text-black"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 border-t border-white/[0.06] bg-white/[0.025] px-4 py-3">
              {carouselImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentImageIndex(idx)}
                  aria-label={`Show team photo ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex ? 'w-9 bg-[#F06865]' : 'w-2.5 bg-white/22 hover:bg-white/45'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Player Roster */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#C1121F] dark:text-[#B5413F]">
                <Search size={14} />
                Players
              </p>
              <h3 className="mt-1 text-2xl font-black uppercase tracking-[0.08em] text-foreground dark:text-foreground">
                2025-26 Roster
              </h3>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/10 bg-subcard px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/45">
              {playerImages.length} Players
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {playerImages.map((src, idx) => {
              const playerNumber = String(idx + 1).padStart(2, '0');

              return (
                <article
                  key={src}
                  className="group overflow-hidden rounded-2xl border border-border/10 bg-subcard shadow-[0_16px_45px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B5413F]/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.26)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-foreground/[0.035]">
                    <img
                      src={src}
                      alt={`Varsity boys soccer player ${idx + 1}`}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_44%,rgba(0,0,0,0.78))]" />
                    <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-sm font-black text-white backdrop-blur">
                      {playerNumber}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm font-black uppercase tracking-tight text-white">
                        Player {playerNumber}
                      </p>
                      <p className="mt-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/52">
                        Varsity Boys
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 px-3 py-3">
                    <span className="rounded-full border border-border/10 bg-foreground/[0.035] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-foreground/42">
                      Position TBD
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-[0.14em] text-[#B5413F]">
                      SPH LV
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
