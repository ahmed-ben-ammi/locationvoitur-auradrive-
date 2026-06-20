import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearAuthData, getAuthData, saveAuthData } from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getAuthData());

  useEffect(() => {
    if (auth && auth.token && auth.user) {
      saveAuthData(auth);
    } else {
      clearAuthData();
    }
  }, [auth]);

  const login = ({ token, user }) => {
    setAuth({ token, user });
  };

  const logout = () => {
    setAuth(null);
  };

  const value = useMemo(
    () => ({
      user: auth?.user || null,
      token: auth?.token || null,
      isLoggedIn: Boolean(auth?.token),
      isClient: Boolean(auth?.user?.role === 'client'),
      isAdmin: Boolean(auth?.user?.role === 'admin'),
      login,
      logout,
    }),
    [auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
