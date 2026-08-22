import { useState } from 'react';
import { teamLogoForName } from '../utils/teamGamePresentation';

interface TeamLogoProps {
  name: string | null | undefined;
  className?: string;
}

export default function TeamLogo({ name, className = 'h-8 w-8' }: TeamLogoProps) {
  const [failed, setFailed] = useState(false);
  const logo = teamLogoForName(name);

  if (!logo || failed) {
    const fallbackInitial = name?.trim().charAt(0).toUpperCase() || '';

    return (
      <span
        aria-hidden="true"
        className={`${className} flex shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-[0.7em] font-black uppercase text-foreground/45`}
      >
        {fallbackInitial}
      </span>
    );
  }

  return (
    <span className={`${className} flex shrink-0 items-center justify-center overflow-hidden rounded-full`}>
      <img
        src={logo}
        alt={`${name} logo`}
        className="h-full w-full scale-[1.08] rounded-full object-cover"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
