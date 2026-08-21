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
    return (
      <span
        aria-hidden="true"
        className={`${className} block shrink-0 rounded-full border border-slate-300/70 bg-slate-300 dark:border-slate-600 dark:bg-slate-600`}
      />
    );
  }

  return (
    <span className={`${className} flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/10 bg-white p-1`}>
      <img
        src={logo}
        alt={`${name} logo`}
        className="h-full w-full object-contain"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
