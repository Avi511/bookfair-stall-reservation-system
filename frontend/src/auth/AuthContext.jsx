import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { decodeJwt, getRoleFromToken } from "./jwt";

const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = "accessToken";
const LEGACY_TOKEN_KEY = "token";

const readStoredToken = () =>
  localStorage.getItem(ACCESS_TOKEN_KEY) ||
  localStorage.getItem(LEGACY_TOKEN_KEY);

const persistToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(LEGACY_TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = readStoredToken();
    if (!stored) return;

    const role = getRoleFromToken(stored);
    const payload = decodeJwt(stored);
    setToken(stored);
    setUser({ role, payload });
  }, []);

  const login = (newToken) => {
    if (!newToken) return;
    persistToken(newToken);

    const role = getRoleFromToken(newToken);
    const payload = decodeJwt(newToken);
    setToken(newToken);
    setUser({ role, payload });
  };

  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
