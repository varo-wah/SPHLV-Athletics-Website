export const APPLE_EASE = [0.22, 1, 0.36, 1] as const;

export const PAGE_TRANSITION = {
  duration: 0.28,
  ease: APPLE_EASE,
} as const;

export const QUICK_TRANSITION = {
  duration: 0.18,
  ease: APPLE_EASE,
} as const;

export const PRESS_TRANSITION = {
  duration: 0.12,
  ease: APPLE_EASE,
} as const;

export const STANDARD_SPRING = {
  type: 'spring',
  stiffness: 420,
  damping: 36,
  mass: 0.8,
} as const;

export const SOFT_SPRING = {
  type: 'spring',
  stiffness: 300,
  damping: 32,
  mass: 0.9,
} as const;

export const PRESS_SCALE = 0.98;
export const LIST_STAGGER_SECONDS = 0.045;

export function staggerDelay(index: number) {
  return Math.min(index, 5) * LIST_STAGGER_SECONDS;
}
