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
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInAnonymously,
  signInWithEmailLink,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseAuth, firebaseConfigComplete, firebaseDb } from '../lib/firebase';
import LoginModal from '../components/LoginModal';

const AUTH_EMAIL_STORAGE_KEY = 'sphlv-auth-email-link';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  firebaseReady: boolean;
  authError: string | null;
  loginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  sendMagicLink: (email: string) => Promise<void>;
  signInWithPasscode: (passcode: string) => Promise<void>;
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
      authMode: user.isAnonymous ? 'passcode' : 'email-link',
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

  useEffect(() => {
    if (!firebaseAuth || typeof window === 'undefined') return;
    if (!isSignInWithEmailLink(firebaseAuth, window.location.href)) return;

    let cancelled = false;

    async function completeEmailLinkSignIn() {
      setLoading(true);
      setAuthError(null);

      try {
        const storedEmail = window.localStorage.getItem(AUTH_EMAIL_STORAGE_KEY);
        const email = storedEmail || window.prompt('Confirm the email address used for sign in.');

        if (!email) {
          setAuthError('Email confirmation is required to complete sign in.');
          return;
        }

        const credential = await signInWithEmailLink(firebaseAuth, email, window.location.href);
        window.localStorage.removeItem(AUTH_EMAIL_STORAGE_KEY);
        await syncUserProfile(credential.user);

        if (!cancelled) {
          setLoginModalOpen(false);
          window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
        }
      } catch (error) {
        console.error('Firebase email-link sign in failed', error);
        if (!cancelled) {
          setAuthError('That sign-in link could not be completed. Request a fresh link and try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    completeEmailLinkSignIn();

    return () => {
      cancelled = true;
    };
  }, []);

  const sendMagicLink = useCallback(async (email: string) => {
    if (!firebaseAuth) {
      setAuthError('Firebase is not configured for this build.');
      return;
    }

    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    const actionCodeSettings = {
      url: `${window.location.origin}${window.location.pathname}`,
      handleCodeInApp: true,
    };

    window.localStorage.setItem(AUTH_EMAIL_STORAGE_KEY, cleanEmail);
    await sendSignInLinkToEmail(firebaseAuth, cleanEmail, actionCodeSettings);
  }, []);

  const signInWithPasscode = useCallback(async (passcode: string) => {
    if (!firebaseAuth) {
      setAuthError('Firebase is not configured for this build.');
      return;
    }

    const configuredPasscode = import.meta.env.VITE_LOGIN_PASSCODE;
    if (!configuredPasscode) {
      setAuthError('Login passcode is not configured for this build.');
      return;
    }

    if (passcode.trim() !== configuredPasscode) {
      setAuthError('Incorrect passcode.');
      throw new Error('Incorrect passcode');
    }

    setAuthError(null);
    const credential = await signInAnonymously(firebaseAuth);
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
      sendMagicLink,
      signInWithPasscode,
      signOutUser,
    }),
    [authError, closeLoginModal, loading, loginModalOpen, openLoginModal, sendMagicLink, signInWithPasscode, signOutUser, user],
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
