import { useAuth } from '@/app/context/AuthContext';
import SeoHead from '@/app/components/SeoHead';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { getUserFacingErrorMessage } from '@/lib/api/userError';
import * as authApi from '@/lib/api/auth';
import { isMagicLinkLoginEnabled } from '@/lib/env';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [magicBusy, setMagicBusy] = useState(false);
  const magicEnabled = isMagicLinkLoginEnabled();
  /** Magic link first when enabled; otherwise password only. */
  const [usePassword, setUsePassword] = useState(!magicEnabled);

  const onPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      toast.success('Signed in');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = getUserFacingErrorMessage(err, 'Could not sign in');
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const onMagicRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setMagicBusy(true);
    try {
      const msg = await authApi.requestMagicLink(email.trim());
      toast.success(msg || 'If that email exists, a magic link has been sent');
    } catch (err) {
      toast.error(getUserFacingErrorMessage(err, 'Could not send link'));
    } finally {
      setMagicBusy(false);
    }
  };

  return (
    <>
      <SeoHead title="Sign in — FITLOCKA" description="Sign in to your FITLOCKA account." canonicalPath="/login" />
      <section className="min-h-screen px-5 lg:px-[60px] py-12 lg:py-20 pb-24 lg:pb-20 max-w-md mx-auto">
        <div className="mb-2.5 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Account
        </div>
        <h1 className="mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px', letterSpacing: '0.02em', lineHeight: '1' }}>
          SIGN IN
        </h1>

        {magicEnabled && !usePassword ? (
          <>
            <div className="mb-4 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Magic link <span className="text-[var(--black)]">(default)</span>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">
              Enter your email and we&apos;ll send a one-time sign-in link. It opens <code className="text-xs">/auth/magic-link</code> in your browser.
            </p>
            <form onSubmit={onMagicRequest} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-none border-[var(--black)]"
                />
              </div>
              <Button type="submit" disabled={magicBusy} className="w-full rounded-none bg-[var(--black)] text-[var(--white)] hover:bg-[var(--accent)]">
                {magicBusy ? 'Sending link…' : 'Email me a magic link'}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-[var(--muted-foreground)]">
              Can&apos;t use email link?{' '}
              <button
                type="button"
                onClick={() => setUsePassword(true)}
                className="bg-transparent border-none p-0 cursor-pointer text-[var(--accent)] underline font-inherit text-sm"
              >
                Sign in with password
              </button>
            </p>
          </>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {magicEnabled ? 'Password' : 'Sign in'}
              </span>
              {magicEnabled ? (
                <button
                  type="button"
                  onClick={() => {
                    setUsePassword(false);
                    setPassword('');
                  }}
                  className="bg-transparent border-none p-0 cursor-pointer text-[var(--accent)] text-sm underline"
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                >
                  ← Magic link instead
                </button>
              ) : null}
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">
              {magicEnabled ? 'Use the email and password for your account.' : 'Sign in with your email and password.'}
            </p>
            <form onSubmit={onPasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email-pw">Email</Label>
                <Input
                  id="email-pw"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-none border-[var(--black)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-none border-[var(--black)]"
                />
              </div>
              <Button type="submit" disabled={busy} className="w-full rounded-none bg-[var(--black)] text-[var(--white)] hover:bg-[var(--accent)]">
                {busy ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </>
        )}

        <p className="mt-10 text-sm text-[var(--muted-foreground)]">
          No account?{' '}
          <Link to="/register" className="text-[var(--accent)] underline">
            Create one
          </Link>
        </p>
      </section>
    </>
  );
}
