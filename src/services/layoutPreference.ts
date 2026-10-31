export type LayoutPreference = 'wide' | 'phone';

export const LAYOUT_PREFERENCE_KEY = 'sphlv-layout-preference';

export function readLayoutPreference(storage?: Pick<Storage, 'getItem'>): LayoutPreference {
  try {
    const value = (storage ?? window.localStorage).getItem(LAYOUT_PREFERENCE_KEY);
    return value === 'phone' ? 'phone' : 'wide';
  } catch {
    return 'wide';
  }
}

export function saveLayoutPreference(value: LayoutPreference, storage?: Pick<Storage, 'setItem'>): void {
  try {
    (storage ?? window.localStorage).setItem(LAYOUT_PREFERENCE_KEY, value);
  } catch {
    // The current view still works when storage is blocked or unavailable.
  }
}
