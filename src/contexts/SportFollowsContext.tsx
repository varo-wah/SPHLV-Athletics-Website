import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseDb } from '../lib/firebase';
import { SportTab } from '../types';
import { useAuth } from './AuthContext';

interface SportFollowsContextValue {
  followedSports: SportTab[];
  loading: boolean;
  isFollowingSport: (sport: SportTab) => boolean;
  toggleSportFollow: (sport: SportTab) => Promise<void>;
}

const SportFollowsContext = createContext<SportFollowsContextValue | null>(null);

export function SportFollowsProvider({ children }: { children: ReactNode }) {
  const { user, openLoginModal } = useAuth();
  const [followedSports, setFollowedSports] = useState<SportTab[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!firebaseDb || !user) {
      setFollowedSports([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const followsRef = collection(firebaseDb, 'users', user.uid, 'sportFollows');
    const unsubscribe = onSnapshot(
      followsRef,
      (snapshot) => {
        setFollowedSports(snapshot.docs.map((followDoc) => followDoc.id as SportTab));
        setLoading(false);
      },
      (error) => {
        console.warn('Failed to load sport follows', error);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user]);

  const followedSet = useMemo(() => new Set(followedSports), [followedSports]);

  const isFollowingSport = useCallback(
    (sport: SportTab) => followedSet.has(sport),
    [followedSet],
  );

  const toggleSportFollow = useCallback(
    async (sport: SportTab) => {
      if (!user || !firebaseDb) {
        openLoginModal();
        return;
      }

      const userRef = doc(firebaseDb, 'users', user.uid);
      const followRef = doc(firebaseDb, 'users', user.uid, 'sportFollows', sport);

      if (followedSet.has(sport)) {
        await deleteDoc(followRef);
        await setDoc(userRef, { email: user.email, updatedAt: serverTimestamp() }, { merge: true });
        return;
      }

      await setDoc(
        userRef,
        {
          email: user.email,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      await setDoc(followRef, { sportKey: sport, createdAt: serverTimestamp() });
    },
    [followedSet, openLoginModal, user],
  );

  const value = useMemo<SportFollowsContextValue>(
    () => ({
      followedSports,
      loading,
      isFollowingSport,
      toggleSportFollow,
    }),
    [followedSports, isFollowingSport, loading, toggleSportFollow],
  );

  return <SportFollowsContext.Provider value={value}>{children}</SportFollowsContext.Provider>;
}

export function useSportFollows() {
  const context = useContext(SportFollowsContext);
  if (!context) {
    throw new Error('useSportFollows must be used within SportFollowsProvider');
  }
  return context;
}
