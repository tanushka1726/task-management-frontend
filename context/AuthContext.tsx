"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import api, { API_PATHS } from "../services/api";
import { clearToken, getToken, setToken } from "../utils/token";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => Promise<void>;
  loadingCheck: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setAuthToken] = useState<string | null>(null);
  const [loadingCheck, setLoadingCheck] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const storedToken = getToken();

      if (!storedToken) {
        setLoadingCheck(false);
        return;
      }

      setAuthToken(storedToken);

      try {
        await api.get(API_PATHS.AUTH.CHECK_LOGIN, {
          headers: { Authorization: `Bearer ${storedToken}` },
          withCredentials: true,
        });
      } catch (err) {
        console.error("Error checking login status:", err);

        // Best-effort server cleanup; do not block UI state reset on this request.
        void api
          .post(API_PATHS.AUTH.LOGOUT, {}, { withCredentials: true })
          .catch(() => {});

        clearToken();
        setAuthToken(null);
      } finally {
        setLoadingCheck(false);
      }
    };

    checkLogin();
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    setAuthToken(newToken);
  };

  const logout = async () => {
    try {
      await api.post(API_PATHS.AUTH.LOGOUT, {}, { withCredentials: true });
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      clearToken();
      setAuthToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loadingCheck }}>
      {children}
    </AuthContext.Provider>
  );
};
