'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem('dependar_token');
    if (stored) {
      setToken(stored);
      if (pathname === '/login') {
        router.replace('/');
      }
    } else if (pathname !== '/login') {
      router.replace('/login');
    }
    setLoading(false);
  }, [pathname, router]);

  const login = (jwt: string) => {
    localStorage.setItem('dependar_token', jwt);
    setToken(jwt);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('dependar_token');
    setToken(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {!loading && (token || pathname === '/login' ? children : null)}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
