import { useAuth } from '@/app/context/AuthContext';
import type { ReactNode } from 'react';
import { Link, Navigate } from 'react-router';

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading, token } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <span style={{ fontFamily: "'Space Mono', monospace" }}>Loading…</span>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: '/__admin' }} />;
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center bg-[var(--background)]">
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px' }}>Admin access required</h1>
        <p className="text-[var(--muted-foreground)] max-w-md">
          This panel is only available to administrators. Sign in with an admin account or return to the store.
        </p>
        <Link
          to="/"
          className="bg-[var(--black)] text-[var(--white)] px-6 py-3 no-underline"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
        >
          Back to store
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
