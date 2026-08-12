export type ColorTheme = 'light' | 'dark';

export function isColorTheme(value: unknown): value is ColorTheme {
  return value === 'light' || value === 'dark';
}
