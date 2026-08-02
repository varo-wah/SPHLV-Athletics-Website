import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { collection, doc, onSnapshot, serverTimestamp, writeBatch } from 'firebase/firestore';
import { firebaseDb } from '../lib/firebase';
import { DivisionTab, GenderTab, SportTab } from '../types';
import {
  FavoriteTeam,
  getTeamFavoriteKey,
  getTeamFavoriteLabel,
} from '../utils/teamFavorites';
import { useAuth } from './AuthContext';
import { isLaunchTeamSelection } from '../config/launchSports';

interface TeamFavoritesContextValue {
  favoriteTeams: FavoriteTeam[];
  loading: boolean;
  error: string | null;
  isFavoriteTeam: (sport: SportTab, division: DivisionTab, gender: GenderTab) => boolean;
  isUpdatingTeam: (sport: SportTab, division: DivisionTab, gender: GenderTab) => boolean;
  toggleTeamFavorite: (sport: SportTab, division: DivisionTab, gender: GenderTab) => Promise<void>;
}

const TeamFavoritesContext = createContext<TeamFavoritesContextValue | null>(null);
const supportedSports: SportTab[] = ['Basketball', 'Volleyball', 'Soccer', 'Badminton', 'TrackAndField'];
const supportedDivisions: DivisionTab[] = ['SMP', 'SMA'];
const supportedGenders: GenderTab[] = ['Boys', 'Girls', 'Combined'];

function isFavoriteTeamDocument(value: Record<string, unknown>): value is {
  sportKey: SportTab;
  division: DivisionTab;
  gender: GenderTab;
} {
  return (
    supportedSports.includes(value.sportKey as SportTab)
    && supportedDivisions.includes(value.division as DivisionTab)
    && supportedGenders.includes(value.gender as GenderTab)
  );
}

export function TeamFavoritesProvider({ children }: { children: ReactNode }) {
  const { user, openLoginModal } = useAuth();
  const [favoriteTeams, setFavoriteTeams] = useState<FavoriteTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingKeys, setUpdatingKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!firebaseDb || !user) {
      setFavoriteTeams([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    const favoritesRef = collection(firebaseDb, 'users', user.uid, 'teamFavorites');
    const unsubscribe = onSnapshot(
      favoritesRef,
      (snapshot) => {
        const nextFavorites = snapshot.docs.flatMap((favoriteDoc) => {
          const data = favoriteDoc.data();
          if (
            !isFavoriteTeamDocument(data)
            || !isLaunchTeamSelection(data.sportKey, data.division, data.gender)
          ) return [];

          return [{
            key: favoriteDoc.id,
            sport: data.sportKey,
            division: data.division,
            gender: data.gender,
          }];
        });

        setFavoriteTeams(nextFavorites);
        setLoading(false);
      },
      (snapshotError) => {
        console.warn('Failed to load team favorites', snapshotError);
        setError('Favorites could not be loaded.');
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user]);

  const favoriteKeys = useMemo(
    () => new Set(favoriteTeams.map((favorite) => favorite.key)),
    [favoriteTeams],
  );

  const isFavoriteTeam = useCallback(
    (sport: SportTab, division: DivisionTab, gender: GenderTab) => (
      favoriteKeys.has(getTeamFavoriteKey(sport, division, gender))
    ),
    [favoriteKeys],
  );

  const isUpdatingTeam = useCallback(
    (sport: SportTab, division: DivisionTab, gender: GenderTab) => (
      updatingKeys.has(getTeamFavoriteKey(sport, division, gender))
    ),
    [updatingKeys],
  );

  const toggleTeamFavorite = useCallback(
    async (sport: SportTab, division: DivisionTab, gender: GenderTab) => {
      if (!isLaunchTeamSelection(sport, division, gender)) return;

      if (!user || !firebaseDb) {
        openLoginModal();
        return;
      }

      const key = getTeamFavoriteKey(sport, division, gender);
      if (updatingKeys.has(key)) return;

      setUpdatingKeys((current) => new Set(current).add(key));
      setError(null);

      try {
        const userRef = doc(firebaseDb, 'users', user.uid);
        const favoriteRef = doc(firebaseDb, 'users', user.uid, 'teamFavorites', key);
        const batch = writeBatch(firebaseDb);

        if (favoriteKeys.has(key)) {
          batch.delete(favoriteRef);
        } else {
          batch.set(
            favoriteRef,
            {
              sportKey: sport,
              division,
              gender,
              label: getTeamFavoriteLabel({ sport, division, gender }),
              createdAt: serverTimestamp(),
            },
          );
        }

        batch.set(
          userRef,
          {
            email: user.email || null,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
        await batch.commit();
      } catch (writeError) {
        console.warn('Failed to update team favorite', writeError);
        setError('Favorite could not be updated.');
      } finally {
        setUpdatingKeys((current) => {
          const next = new Set(current);
          next.delete(key);
          return next;
        });
      }
    },
    [favoriteKeys, openLoginModal, updatingKeys, user],
  );

  const value = useMemo<TeamFavoritesContextValue>(
    () => ({
      favoriteTeams,
      loading,
      error,
      isFavoriteTeam,
      isUpdatingTeam,
      toggleTeamFavorite,
    }),
    [error, favoriteTeams, isFavoriteTeam, isUpdatingTeam, loading, toggleTeamFavorite],
  );

  return (
    <TeamFavoritesContext.Provider value={value}>
      {children}
    </TeamFavoritesContext.Provider>
  );
}

export function useTeamFavorites() {
  const context = useContext(TeamFavoritesContext);
  if (!context) {
    throw new Error('useTeamFavorites must be used within TeamFavoritesProvider');
  }
  return context;
}
