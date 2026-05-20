import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authAPI } from '@/services/api';

const AuthContext = createContext(null);

function getAuthErrorMessage(err, fallback) {
  if (!err.response) {
    const isNetwork =
      err.code === 'ERR_NETWORK' ||
      err.message === 'Network Error' ||
      err.message?.includes('Network Error');
    if (isNetwork) {
      return 'Cannot reach the API server. Start the backend: cd Backend && python app.py';
    }
    return err.message || fallback;
  }
  const { message, errors } = err.response.data || {};
  if (message) return message;
  if (Array.isArray(errors) && errors.length > 0) return errors.join('; ');
  return fallback;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const response = await authAPI.getCurrentUser();
          setUser(response.data.data);
        }
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      const { user, tokens } = response.data.data;
      
      localStorage.setItem('accessToken', tokens.access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      return user;
    } catch (err) {
      const message = getAuthErrorMessage(err, 'Login failed');
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, phone, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register({
        full_name: fullName,
        email,
        phone,
        password,
      });
      const { user, tokens } = response.data.data;
      
      localStorage.setItem('accessToken', tokens.access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      return user;
    } catch (err) {
      const message = getAuthErrorMessage(err, 'Registration failed');
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      loading,
      error,
      login,
      register,
      logout,
    }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
