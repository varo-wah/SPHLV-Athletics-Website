import type { CSSProperties } from 'react';

export type ProductionTeamCode = 'VBS' | 'VGS' | 'VBV' | 'VGV' | 'SMPBB' | 'SMPGB';

export interface TeamVisualTheme {
  code: ProductionTeamCode | 'ALL' | 'FALLBACK';
  accent: string;
  accentBright: string;
  soft: string;
  border: string;
  shadow: string;
  onAccent: '#FFFFFF';
  emoji: string;
  aliases: readonly string[];
}

export type TeamAccentProperties = CSSProperties & {
  '--team-accent': string;
  '--team-accent-bright': string;
  '--team-accent-soft': string;
  '--team-accent-border': string;
  '--team-accent-shadow': string;
  '--team-on-accent': string;
  '--team-accent-secondary': string;
  '--team-accent-secondary-bright': string;
};

export const TEAM_VISUAL_THEMES: Record<ProductionTeamCode, TeamVisualTheme> = {
  VBS: {
    code: 'VBS',
    accent: '#C1121F',
    accentBright: '#F87171',
    soft: 'rgba(193, 18, 31, 0.10)',
    border: 'rgba(193, 18, 31, 0.42)',
    shadow: 'rgba(193, 18, 31, 0.24)',
    onAccent: '#FFFFFF',
    emoji: '⚽',
    aliases: ['vbs', 'varsity boys soccer', 'sma boys soccer'],
  },
  VGS: {
    code: 'VGS',
    accent: '#603090',
    accentBright: '#C084FC',
    soft: 'rgba(96, 48, 144, 0.10)',
    border: 'rgba(96, 48, 144, 0.42)',
    shadow: 'rgba(96, 48, 144, 0.24)',
    onAccent: '#FFFFFF',
    emoji: '⚽',
    aliases: ['vgs', 'varsity girls soccer', 'sma girls soccer'],
  },
  VBV: {
    code: 'VBV',
    accent: '#1050A0',
    accentBright: '#60A5FA',
    soft: 'rgba(16, 80, 160, 0.10)',
    border: 'rgba(16, 80, 160, 0.42)',
    shadow: 'rgba(16, 80, 160, 0.24)',
    onAccent: '#FFFFFF',
    emoji: '🏐',
    aliases: ['vbv', 'varsity boys volleyball', 'sma boys volleyball'],
  },
  VGV: {
    code: 'VGV',
    accent: '#C02060',
    accentBright: '#F472B6',
    soft: 'rgba(192, 32, 96, 0.10)',
    border: 'rgba(192, 32, 96, 0.42)',
    shadow: 'rgba(192, 32, 96, 0.24)',
    onAccent: '#FFFFFF',
    emoji: '🏐',
    aliases: ['vgv', 'varsity girls volleyball', 'sma girls volleyball'],
  },
  SMPBB: {
    code: 'SMPBB',
    accent: '#C2410C',
    accentBright: '#FB923C',
    soft: 'rgba(194, 65, 12, 0.10)',
    border: 'rgba(194, 65, 12, 0.42)',
    shadow: 'rgba(194, 65, 12, 0.24)',
    onAccent: '#FFFFFF',
    emoji: '🏀',
    aliases: ['smpbb', 'smp boys basketball', 'smp boys basketball a'],
  },
  SMPGB: {
    code: 'SMPGB',
    accent: '#008080',
    accentBright: '#2DD4BF',
    soft: 'rgba(0, 128, 128, 0.10)',
    border: 'rgba(0, 128, 128, 0.42)',
    shadow: 'rgba(0, 128, 128, 0.24)',
    onAccent: '#FFFFFF',
    emoji: '🏀',
    aliases: ['smpgb', 'smp girls basketball', 'smp girls basketball a'],
  },
};

export const ALL_TEAMS_VISUAL_THEME: TeamVisualTheme = {
  code: 'ALL',
  accent: '#669BBC',
  accentBright: '#8FC1DD',
  soft: 'rgba(102, 155, 188, 0.12)',
  border: 'rgba(102, 155, 188, 0.42)',
  shadow: 'rgba(102, 155, 188, 0.24)',
  onAccent: '#FFFFFF',
  emoji: '🏆',
  aliases: ['all'],
};

export const FALLBACK_TEAM_VISUAL_THEME: TeamVisualTheme = {
  code: 'FALLBACK',
  accent: '#64748B',
  accentBright: '#CBD5E1',
  soft: 'rgba(100, 116, 139, 0.10)',
  border: 'rgba(100, 116, 139, 0.38)',
  shadow: 'rgba(100, 116, 139, 0.18)',
  onAccent: '#FFFFFF',
  emoji: '🏆',
  aliases: [],
};

const COMBINED_TEAM_PAIRS: ReadonlyArray<{
  matches: readonly string[];
  themes: readonly [ProductionTeamCode, ProductionTeamCode];
}> = [
  { matches: ['soccer', 'varsity'], themes: ['VBS', 'VGS'] },
  { matches: ['soccer', 'sma'], themes: ['VBS', 'VGS'] },
  { matches: ['volleyball', 'varsity'], themes: ['VBV', 'VGV'] },
  { matches: ['volleyball', 'sma'], themes: ['VBV', 'VGV'] },
  { matches: ['basketball', 'smp'], themes: ['SMPBB', 'SMPGB'] },
];

function normalizeTeamName(value: string) {
  return value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9&]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function teamVisualThemeForCode(code: string | null | undefined) {
  if (!code) return FALLBACK_TEAM_VISUAL_THEME;
  return TEAM_VISUAL_THEMES[code.toUpperCase() as ProductionTeamCode]
    ?? FALLBACK_TEAM_VISUAL_THEME;
}

export function teamVisualThemesForName(teamName: string): readonly TeamVisualTheme[] {
  const normalized = normalizeTeamName(teamName);
  const isCombined = /boys\s*(?:&|and)\s*girls/.test(normalized);

  if (isCombined) {
    const pair = COMBINED_TEAM_PAIRS.find(({ matches }) => (
      matches.every((match) => normalized.includes(match))
    ));
    if (pair) return pair.themes.map((code) => TEAM_VISUAL_THEMES[code]);
  }

  const theme = Object.values(TEAM_VISUAL_THEMES).find(({ aliases }) => (
    aliases.some((alias) => normalized.includes(normalizeTeamName(alias)))
  ));

  return theme ? [theme] : [];
}

export function teamVisualThemeForName(teamName: string) {
  return teamVisualThemesForName(teamName)[0] ?? FALLBACK_TEAM_VISUAL_THEME;
}

export function teamAccentProperties(
  primary: TeamVisualTheme,
  secondary: TeamVisualTheme = primary,
): TeamAccentProperties {
  return {
    '--team-accent': primary.accent,
    '--team-accent-bright': primary.accentBright,
    '--team-accent-soft': primary.soft,
    '--team-accent-border': primary.border,
    '--team-accent-shadow': primary.shadow,
    '--team-on-accent': primary.onAccent,
    '--team-accent-secondary': secondary.accent,
    '--team-accent-secondary-bright': secondary.accentBright,
  };
}
