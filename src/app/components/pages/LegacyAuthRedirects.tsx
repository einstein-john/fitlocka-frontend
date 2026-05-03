import { Navigate, useLocation } from 'react-router';

/** Backend misconfigs sometimes set MAGIC_LINK_REDIRECT_URL to …/login/auth/magic-link — normalize to the real route. */
export function LegacyMagicLinkRedirect() {
  const { search } = useLocation();
  return <Navigate to={`/auth/magic-link${search}`} replace />;
}

/** Same for email confirmation if redirect URL incorrectly includes /login/. */
export function LegacyEmailConfirmationRedirect() {
  const { search } = useLocation();
  return <Navigate to={`/auth/email-confirmation${search}`} replace />;
}
