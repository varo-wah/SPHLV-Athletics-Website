import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseDb } from '../lib/firebase';
import { isColorTheme, type ColorTheme } from './theme';

export type { ColorTheme } from './theme';

const cacheKey = (userId: string) => `sphlv-theme:${userId}`;

export function readCachedTheme(userId: string): ColorTheme | null {
  if (typeof window === 'undefined') return null;

  try {
    const cachedTheme = window.localStorage.getItem(cacheKey(userId));
    return isColorTheme(cachedTheme) ? cachedTheme : null;
  } catch {
    return null;
  }
}

export function cacheTheme(userId: string, theme: ColorTheme) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(cacheKey(userId), theme);
  } catch {
    // Firebase remains the source of truth when browser storage is unavailable.
  }
}

export async function readCloudTheme(userId: string): Promise<ColorTheme | null> {
  if (!firebaseDb) return null;

  const snapshot = await getDoc(doc(firebaseDb, 'users', userId));
  const theme = snapshot.data()?.themePreference;
  return isColorTheme(theme) ? theme : null;
}

export async function saveCloudTheme(userId: string, theme: ColorTheme) {
  if (!firebaseDb) return;

  await setDoc(
    doc(firebaseDb, 'users', userId),
    {
      themePreference: theme,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
