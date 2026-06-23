import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseAuth, firebaseConfigComplete, firebaseDb } from '../lib/firebase';
import LoginModal from '../components/LoginModal';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  firebaseReady: boolean;
  authError: string | null;
  loginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  createAccountWithPassword: (email: string, password: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function syncUserProfile(user: User) {
  if (!firebaseDb) return;
  const userRef = doc(firebaseDb, 'users', user.uid);
  const userSnapshot = await getDoc(userRef);

  await setDoc(
    userRef,
    {
      email: user.email || null,
      authMode: user.isAnonymous ? 'anonymous' : 'email-password',
      updatedAt: serverTimestamp(),
      ...(!userSnapshot.exists() ? { createdAt: serverTimestamp() } : {}),
    },
    { merge: true },
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(firebaseConfigComplete);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const openLoginModal = useCallback(() => setLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setLoginModalOpen(false), []);

  useEffect(() => {
    if (!firebaseAuth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        try {
          await syncUserProfile(currentUser);
        } catch (error) {
          console.warn('Failed to sync Firebase user profile', error);
        }
      }
    });

    return unsubscribe;
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    if (!firebaseAuth) {
      setAuthError('Firebase is not configured for this build.');
      return;
    }

    setAuthError(null);
    const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim().toLowerCase(), password);
    await syncUserProfile(credential.user);
    setLoginModalOpen(false);
  }, []);

  const createAccountWithPassword = useCallback(async (email: string, password: string) => {
    if (!firebaseAuth) {
      setAuthError('Firebase is not configured for this build.');
      return;
    }

    setAuthError(null);
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim().toLowerCase(), password);
    await syncUserProfile(credential.user);
    setLoginModalOpen(false);
  }, []);

  const signOutUser = useCallback(async () => {
    if (!firebaseAuth) return;
    await signOut(firebaseAuth);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      firebaseReady: firebaseConfigComplete,
      authError,
      loginModalOpen,
      openLoginModal,
      closeLoginModal,
      createAccountWithPassword,
      signInWithPassword,
      signOutUser,
    }),
    [authError, closeLoginModal, createAccountWithPassword, loading, loginModalOpen, openLoginModal, signInWithPassword, signOutUser, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginModal />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
