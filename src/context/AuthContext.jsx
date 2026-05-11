import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { mockApi } from '@/services/api';

const AuthContext = createContext(null);

const storageKey = 'neobankx-auth';

const readStoredUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        window.localStorage.setItem(storageKey, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(storageKey);
      }
    }
  }, [user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await mockApi.login(credentials);
      setUser(response.data.user);
      return response.data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await mockApi.register(payload);
      setUser(response.data.user);
      return response.data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      loading,
      login,
      register,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
