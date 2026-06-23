import { useState, type FormEvent } from 'react';
import { Bell, LogOut, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { authError, firebaseReady, sendMagicLink, signOutUser, user } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (!email.trim()) {
      setLocalError('Enter an email address first.');
      return;
    }

    setStatus('sending');
    try {
      await sendMagicLink(email);
      setStatus('sent');
    } catch (error) {
      console.error('Failed to send Firebase sign-in link', error);
      setLocalError('The sign-in link could not be sent. Check Firebase Auth settings.');
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
              Save followed sports now. Match alerts and score notifications can be added after login and follows are stable.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Mail, title: 'Email link', copy: 'No password needed' },
                { icon: Bell, title: 'Follows', copy: 'Save sports' },
                { icon: ShieldCheck, title: 'Private', copy: 'Your account only' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-border/10 bg-foreground/[0.025] p-4">
                    <Icon size={20} className="text-[#C1121F] dark:text-[#D85A57]" />
                    <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/38">
                      {item.copy}
                    </p>
                  </div>
                );
              })}
            </div>
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
                      {user.email}
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
                    Email address
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

                {(localError || authError) && (
                  <p className="rounded-2xl border border-[#C1121F]/20 bg-[#FEE2E2] px-4 py-3 text-sm font-bold text-[#7F1D1D] dark:bg-[#B5413F]/12 dark:text-[#FCA5A5]">
                    {localError || authError}
                  </p>
                )}

                {status === 'sent' && (
                  <p className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-bold text-green-700 dark:text-green-300">
                    Check your email, then open the sign-in link on this same device.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!firebaseReady || status === 'sending'}
                  className="flex w-full items-center justify-center rounded-2xl bg-[#C1121F] px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition-all hover:-translate-y-0.5 hover:bg-[#991B1B] disabled:cursor-not-allowed disabled:opacity-45 dark:bg-[#B5413F] dark:hover:bg-[#8F3432]"
                >
                  {status === 'sending' ? 'Sending link' : 'Send magic link'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
