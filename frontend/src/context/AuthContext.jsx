import { createContext, useState, useContext, useEffect } from 'react';
import { getAccessToken, setAccessToken, clearAccessToken } from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user info and role

  // Initialize user from token if available (token parsing left to callers)
  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      const payload = JSON.parse(jsonPayload);
      const role = payload?.role || payload?.roles?.[0];
      setUser({ ...payload, role });
    } catch {
      // ignore malformed token
    }
  }, []);

  // Listen for logout events (dispatched by axios on session expiry)
  useEffect(() => {
    const handler = () => setUser(null);
    const storageHandler = (e) => {
      if (e.key === 'accessToken' && !e.newValue) setUser(null);
    };

    window.addEventListener('app:logout', handler);
    window.addEventListener('storage', storageHandler);

    return () => {
      window.removeEventListener('app:logout', handler);
      window.removeEventListener('storage', storageHandler);
    };
  }, []);

  const login = (userData, token) => {
    if (token) setAccessToken(token);
    setUser(userData);
  };

  const logout = () => {
    clearAccessToken();
    setUser(null);
    try { window.dispatchEvent(new Event('app:logout')); } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);