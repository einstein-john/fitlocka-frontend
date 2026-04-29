import { useAuth } from '@/app/context/AuthContext';
import SeoHead from '@/app/components/SeoHead';
import * as authApi from '@/lib/api/auth';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

export default function MagicLinkCallback() {
  const [params] = useSearchParams();
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setError('Missing token');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await authApi.magicLinkExchange(token);
        if (cancelled) return;
        if (!res?.token || !res.user) {
          setError('Could not complete sign-in');
          return;
        }
        setSession(res.token, res.user);
        toast.success('Signed in');
        navigate('/account', { replace: true });
      } catch {
        if (!cancelled) setError('Link expired or invalid');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params, setSession, navigate]);

  return (
    <>
      <SeoHead title="Signing in — FITLOCKA" description="Completing secure sign-in." canonicalPath="/auth/magic-link" noindex />
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px' }}>{error ?? 'Signing you in…'}</h1>
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
