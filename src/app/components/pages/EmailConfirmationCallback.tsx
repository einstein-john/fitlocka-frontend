import { useAuth } from '@/app/context/AuthContext';
import SeoHead from '@/app/components/SeoHead';
import * as authApi from '@/lib/api/auth';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

/** Consumes `?token=` from `EMAIL_CONFIRMATION_REDIRECT_URL` → `GET /auth/register/confirm-email` */
export default function EmailConfirmationCallback() {
  const [params] = useSearchParams();
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setError('Missing token');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const outcome = await authApi.confirmEmail(token);
        if (cancelled) return;
        if (outcome.kind === 'session') {
          setSession(outcome.token, outcome.user);
          toast.success('Email confirmed — you are signed in');
          navigate('/account', { replace: true });
          return;
        }
        setMessage(outcome.message);
        toast.success(outcome.message || 'Email confirmed');
      } catch {
        if (!cancelled) setError('Invalid or expired confirmation link');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params, setSession, navigate]);

  return (
    <>
      <SeoHead
        title="Confirm email — FITLOCKA"
        description="Confirm your FITLOCKA account email."
        canonicalPath="/auth/email-confirmation"
        noindex
      />
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px' }}>
            {error ?? message ?? 'Confirming your email…'}
          </h1>
          {message && !error ? (
            <div className="mt-8 space-y-4">
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">{message}</p>
              <button type="button" className="underline" onClick={() => navigate('/login', { replace: true })}>
                Sign in
              </button>
            </div>
          ) : null}
          {error ? (
            <button type="button" className="mt-6 underline" onClick={() => navigate('/login')}>
              Back to sign in
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
