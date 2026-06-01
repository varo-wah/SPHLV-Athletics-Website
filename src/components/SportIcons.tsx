import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const BasketballIcon = ({ size = 24, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M5.636 5.636a9 9 0 0 1 12.728 12.728" />
    <path d="M18.364 5.636a9 9 0 0 0-12.728 12.728" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
  </svg>
);

export const VolleyballIcon = ({ size = 24, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20" />
    <path d="M2.5 9.5L12 12" />
    <path d="M21.5 9.5L12 12" />
    <path d="M12 22l-4-9" />
    <path d="M12 22l4-9" />
  </svg>
);

export const SoccerIcon = ({ size = 24, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 7l3.5 2.5-1.5 4.5h-4L8.5 9.5z" />
    <line x1="12" y1="7" x2="12" y2="2" />
    <line x1="15.5" y1="9.5" x2="20.5" y2="7.5" />
    <line x1="8.5" y1="9.5" x2="3.5" y2="7.5" />
    <line x1="14" y1="14" x2="17.5" y2="18.5" />
    <line x1="10" y1="14" x2="6.5" y2="18.5" />
  </svg>
);

export const BadmintonIcon = ({ size = 24, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" {...props}>
    <path d="M12 21a3 3 0 0 0 3-3V16H9v2a3 3 0 0 0 3 3z" />
    <path d="M9 16L4 4l3-1 2 5" />
    <path d="M15 16l5-12-3-1-2 5" />
    <path d="M12 16V4" />
    <path d="M10 9h4" />
    <path d="M11 13h2" />
  </svg>
);

export const TrackIcon = ({ size = 24, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" {...props}>
    <circle cx="15" cy="5" r="2" />
    <path d="M13 7l-2 5" />
    <path d="M11 12l-4-2-2 3" />
    <path d="M13 7l4-1 2 2" />
    <path d="M11 12l-1 5-4 1" />
    <path d="M11 12l3 4v5" />
  </svg>
);

export const SwimmingIcon = ({ size = 24, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" {...props}>
    <path d="M2 13c2 0 3-1 5-1s3 1 5 1 3-1 5-1 3 1 5 1" />
    <path d="M2 17c2 0 3-1 5-1s3 1 5 1 3-1 5-1 3 1 5 1" />
    <path d="M2 21c2 0 3-1 5-1s3 1 5 1 3-1 5-1 3 1 5 1" />
    <circle cx="16" cy="6" r="2" />
    <path d="M5 9l5-2 4 2 2-3" />
  </svg>
);
