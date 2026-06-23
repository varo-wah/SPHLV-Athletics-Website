import { useState, type FormEvent } from 'react';
import { LockKeyhole, Mail, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getFirebaseAuthMessage } from '../utils/firebaseAuthErrors';

export default function LoginModal() {
  const {
    authError,
    closeLoginModal,
    createAccountWithPassword,
    firebaseReady,
    loginModalOpen,
    signInWithPassword,
  } = useAuth();
  const [authMode, setAuthMode] = useState<'sign-in' | 'create'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking'>('idle');
  const [localError, setLocalError] = useState<string | null>(null);

  if (!loginModalOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError('Enter your email and password first.');
      return;
    }

    setStatus('checking');
    try {
      if (authMode === 'create') {
        await createAccountWithPassword(email, password);
      } else {
        await signInWithPassword(email, password);
      }
      setStatus('idle');
    } catch (error) {
      console.error('Firebase email/password auth failed', error);
      setLocalError(getFirebaseAuthMessage(
        error,
        authMode === 'create' ? 'Could not create that account.' : 'Email or password is incorrect.',
      ));
      setStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/45 px-3 pb-24 pt-10 backdrop-blur-sm sm:items-center sm:pb-10">
      <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-border/10 bg-subcard shadow-[0_30px_90px_rgba(0,0,0,0.32)]">
        <div className="relative overflow-hidden bg-[#C1121F] px-5 py-5 text-white dark:bg-[#5A1C2C]">
          <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/12" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/65">
                SPHLV account
              </p>
              <h2 className="mt-1 text-2xl font-black uppercase tracking-tight">
                Sign in
              </h2>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-white/70">
                Use your email and password to save followed sports.
              </p>
            </div>
            <button
              type="button"
              onClick={closeLoginModal}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white hover:text-[#C1121F]"
              aria-label="Close sign in"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {!firebaseReady && (
            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm font-bold text-yellow-700 dark:text-yellow-200">
              Firebase env vars are missing in this build.
            </div>
          )}

          <label className="block space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-foreground/45">
              Email
            </span>
            <div className="flex items-center gap-3 rounded-2xl border border-border/10 bg-foreground/[0.025] px-4 py-3">
              <Mail size={18} className="shrink-0 text-[#C1121F] dark:text-[#D85A57]" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="min-w-0 flex-1 bg-transparent text-sm font-bold text-foreground outline-none placeholder:text-foreground/30"
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-foreground/45">
              Password
            </span>
            <div className="flex items-center gap-3 rounded-2xl border border-border/10 bg-foreground/[0.025] px-4 py-3">
              <LockKeyhole size={18} className="shrink-0 text-[#C1121F] dark:text-[#D85A57]" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="min-w-0 flex-1 bg-transparent text-sm font-bold text-foreground outline-none placeholder:text-foreground/30"
              />
            </div>
          </label>

          {(localError || authError) && (
            <p className="rounded-2xl border border-[#C1121F]/20 bg-[#FEE2E2] px-4 py-3 text-sm font-bold text-[#7F1D1D] dark:bg-[#B5413F]/12 dark:text-[#FCA5A5]">
              {localError || authError}
            </p>
          )}

          <button
            type="submit"
            disabled={!firebaseReady || status === 'checking'}
            className="flex w-full items-center justify-center rounded-2xl bg-[#C1121F] px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition-all hover:-translate-y-0.5 hover:bg-[#991B1B] disabled:cursor-not-allowed disabled:opacity-45 dark:bg-[#B5413F] dark:hover:bg-[#8F3432]"
          >
            {status === 'checking' ? 'Checking account' : authMode === 'create' ? 'Create account' : 'Sign in'}
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode((current) => current === 'sign-in' ? 'create' : 'sign-in');
              setLocalError(null);
            }}
            className="w-full text-center text-[10px] font-black uppercase tracking-[0.16em] text-foreground/45 transition-colors hover:text-[#C1121F] dark:hover:text-[#D85A57]"
          >
            {authMode === 'create' ? 'Already have an account? Sign in' : 'Need an account? Create one'}
          </button>
        </form>
      </div>
    </div>
  );
}
