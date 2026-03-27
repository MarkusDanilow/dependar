'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { fetchApi } from '@/lib/api';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  firstName?: string | null;
  lastName?: string | null;
}

export const AuthContext = createContext<{
  token: string | null;
  user: AuthUser | null;
  login: (jwt: string, user: AuthUser) => void;
  logout: () => void;
} | null>(null);

function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem('dependar_token');
    const storedUser = localStorage.getItem('dependar_user');
    
    if (stored) {
      setToken(stored);
      
      // Load stored user as initial state
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)); } catch {}
      } else {
        const payload = parseJwt(stored);
        if (payload) setUser({ 
          id: payload.id, 
          email: payload.email, 
          role: payload.role,
          firstName: payload.firstName,
          lastName: payload.lastName
        });
      }

      // Refresh user data from server to get latest firstName/lastName/etc
      fetchApi('/auth/me')
        .then((res: any) => {
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('dependar_user', JSON.stringify(res.data.user));
          }
        })
        .catch((err: any) => {
          console.error('Failed to refresh user data:', err);
          if (err.status === 404 || err.status === 401 || err.message?.includes('User not found')) {
            logout();
          }
        });

      if (pathname === '/login') router.replace('/');
    } else if (pathname !== '/login') {
      router.replace('/login');
    }
    setLoading(false);
  }, [pathname, router]);

  const login = (jwt: string, userData: AuthUser) => {
    localStorage.setItem('dependar_token', jwt);
    localStorage.setItem('dependar_user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('dependar_token');
    localStorage.removeItem('dependar_user');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {!loading && (token || pathname === '/login' ? children : null)}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
