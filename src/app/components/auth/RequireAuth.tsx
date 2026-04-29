import { useAuth } from '@/app/context/AuthContext';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center" style={{ fontFamily: "'Space Mono', monospace" }}>
        Loading…
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
