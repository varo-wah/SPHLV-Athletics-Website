import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import {
  cacheTheme,
  readCachedTheme,
  readCloudTheme,
  saveCloudTheme,
  type ColorTheme,
} from '../services/themePreference';

interface ThemeContextValue {
  theme: ColorTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: ColorTheme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.dataset.theme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { loading: authLoading, user } = useAuth();
  const [theme, setTheme] = useState<ColorTheme>('light');
  const themeRef = useRef<ColorTheme>('light');
  const manualChangeVersionRef = useRef(0);

  const selectTheme = useCallback((nextTheme: ColorTheme) => {
    themeRef.current = nextTheme;
    setTheme(nextTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      selectTheme('light');
      return;
    }

    let cancelled = false;
    const userId = user.uid;
    const cachedTheme = readCachedTheme(userId);
    const initialTheme = cachedTheme ?? themeRef.current;
    const restoreVersion = manualChangeVersionRef.current;

    selectTheme(initialTheme);

    void readCloudTheme(userId)
      .then(async (cloudTheme) => {
        if (cancelled || manualChangeVersionRef.current !== restoreVersion) return;

        if (cloudTheme) {
          cacheTheme(userId, cloudTheme);
          selectTheme(cloudTheme);
          return;
        }

        cacheTheme(userId, initialTheme);
        await saveCloudTheme(userId, initialTheme);
      })
      .catch((error) => {
        console.warn('Failed to restore theme preference', error);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, selectTheme, user]);

  const toggleTheme = useCallback(() => {
    manualChangeVersionRef.current += 1;
    const nextTheme: ColorTheme = themeRef.current === 'dark' ? 'light' : 'dark';
    selectTheme(nextTheme);

    if (!user) return;

    cacheTheme(user.uid, nextTheme);
    void saveCloudTheme(user.uid, nextTheme).catch((error) => {
      console.warn('Failed to save theme preference', error);
    });
  }, [selectTheme, user]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
