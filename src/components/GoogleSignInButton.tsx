import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getFirebaseAuthMessage } from '../utils/firebaseAuthErrors';

interface GoogleSignInButtonProps {
  className?: string;
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] shrink-0">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.33 2.98-7.39Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.98-.9 6.63-2.38l-3.24-2.53c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.92A6 6 0 0 1 6.08 12c0-.67.11-1.32.31-1.92V7.47H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.53l3.35-2.61Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.95c1.47 0 2.79.51 3.83 1.5l2.87-2.88A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.47l3.35 2.61C7.18 7.71 9.39 5.95 12 5.95Z"
      />
    </svg>
  );
}

export default function GoogleSignInButton({ className = '' }: GoogleSignInButtonProps) {
  const { firebaseReady, signInWithGoogle } = useAuth();
  const [status, setStatus] = useState<'idle' | 'checking'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setStatus('checking');
    setError(null);

    try {
      await signInWithGoogle();
    } catch (signInError) {
      console.error('Firebase Google sign-in failed', signInError);
      setError(getFirebaseAuthMessage(signInError, 'Google sign-in could not be completed.'));
      setStatus('idle');
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        type="button"
        onClick={() => void handleGoogleSignIn()}
        disabled={!firebaseReady || status === 'checking'}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border/12 bg-white px-4 py-3 text-sm font-black text-[#202124] shadow-[0_10px_28px_rgba(0,0,0,0.12)] transition-all hover:-translate-y-0.5 hover:bg-[#F8FAFD] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'checking' ? (
          <LoaderCircle size={18} className="animate-spin text-[#4285F4]" />
        ) : (
          <GoogleMark />
        )}
        {status === 'checking' ? 'Connecting to Google' : 'Continue with Google'}
      </button>

      {error && (
        <p className="rounded-xl border border-[#C1121F]/20 bg-[#FEE2E2] px-3 py-2 text-xs font-bold text-[#7F1D1D] dark:bg-[#B5413F]/12 dark:text-[#FCA5A5]">
          {error}
        </p>
      )}
    </div>
  );
}
