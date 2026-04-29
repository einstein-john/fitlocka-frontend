import { createOrder } from '@/lib/api/orders';
import { checkout as payCheckout } from '@/lib/api/payments';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '@/lib/api/auth';
import { getMe } from '@/lib/api/users';
import type { AuthUser } from '@/lib/api/types';

const TOKEN_KEY = 'fitlocka_token';
const USER_KEY = 'fitlocka_user';

type AuthContextValue = {
  user: AuthUser | null;
  /** Session JWT from the backend — API helpers send `Authorization: Bearer …` plus `x-api-key` so requests run on behalf of this user. */
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: authApi.RegisterBody) => Promise<'session' | 'pending_confirmation'>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setSession: (token: string, user: AuthUser) => void;
  placeOrderAndPay: () => Promise<{ orderId: number }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const persist = useCallback((nextToken: string | null, nextUser: AuthUser | null) => {
    setToken(nextToken);
    setUser(nextUser);
    if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken);
    else localStorage.removeItem(TOKEN_KEY);
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(USER_KEY);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }
    const me = await getMe(token);
    if (me) {
      setUser(me);
      localStorage.setItem(USER_KEY, JSON.stringify(me));
    }
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await getMe(token);
        if (!cancelled && me) {
          setUser(me);
          localStorage.setItem(USER_KEY, JSON.stringify(me));
        }
      } catch {
        if (!cancelled) persist(null, null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, persist]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login({ email, password });
      if (!res?.token || !res.user) throw new Error('Login failed');
      persist(res.token, res.user);
    },
    [persist]
  );

  const register = useCallback(
    async (input: authApi.RegisterBody) => {
      const res = await authApi.register(input);
      if (res.kind === 'session') {
        persist(res.token, res.user);
        return 'session';
      }
      return 'pending_confirmation';
    },
    [persist]
  );

  const logout = useCallback(() => {
    persist(null, null);
  }, [persist]);

  const setSession = useCallback(
    (t: string, u: AuthUser) => {
      persist(t, u);
    },
    [persist]
  );

  const placeOrderAndPay = useCallback(async () => {
    if (!token) throw new Error('Sign in required');
    const order = await createOrder(token);
    const oid = order?.id;
    if (oid == null) throw new Error('Could not create order');
    await payCheckout(oid, token);
    return { orderId: oid };
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      refreshUser,
      setSession,
      placeOrderAndPay,
    }),
    [user, token, loading, login, register, logout, refreshUser, setSession, placeOrderAndPay]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useOptionalAuth() {
  return useContext(AuthContext);
}
