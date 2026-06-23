import { useState, type FormEvent } from 'react';
import { LockKeyhole, LogOut, Mail, UserRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { authError, createAccountWithPassword, firebaseReady, signInWithPassword, signOutUser, user } = useAuth();
  const [authMode, setAuthMode] = useState<'sign-in' | 'create'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking'>('idle');
  const [localError, setLocalError] = useState<string | null>(null);

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
      setLocalError(authMode === 'create' ? 'Could not create that account.' : 'Email or password is incorrect.');
      setStatus('idle');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen px-4 pb-24 pt-5 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/10 bg-subcard p-5 shadow-[0_24px_70px_rgba(0,0,0,0.16)] sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(193,18,31,0.16),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(181,65,63,0.18),transparent_34%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#C1121F] dark:text-[#D85A57]">
              SPHLV account
            </p>
            <h1 className="mt-3 text-5xl font-black uppercase leading-[0.9] tracking-tight text-foreground sm:text-6xl">
              Sign in
            </h1>
            <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-foreground/55">
              Use your email and password to save followed sports. Match alerts and score notifications can be added after follows are stable.
            </p>
          </div>

          <div className="relative rounded-[1.75rem] border border-border/10 bg-canvas/70 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.14)] dark:bg-foreground/[0.025]">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-2xl border border-border/10 bg-foreground/[0.03] p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#C1121F] text-white dark:bg-[#B5413F]">
                    <UserRound size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-foreground/40">
                      Signed in
                    </p>
                    <p className="truncate text-sm font-black text-foreground">
                      {user.email || 'SPHLV passcode account'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={signOutUser}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border/10 bg-foreground/[0.035] px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/65 transition-all hover:-translate-y-0.5 hover:border-[#C1121F]/35 hover:text-[#C1121F] dark:hover:text-[#D85A57]"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {!firebaseReady && (
                  <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm font-bold text-yellow-700 dark:text-yellow-200">
                    Firebase env vars are missing in this build.
                  </div>
                )}

                <label className="block space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-foreground/45">
                    Email
                  </span>
                  <div className="flex items-center gap-3 rounded-2xl border border-border/10 bg-foreground/[0.035] px-4 py-3">
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
                  <div className="flex items-center gap-3 rounded-2xl border border-border/10 bg-foreground/[0.035] px-4 py-3">
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
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
