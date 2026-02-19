"use client";
import { createContext, useState, ReactNode, useEffect } from "react";
import api, { API_PATHS } from "../services/api";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loadingCheck: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
 const [loadingCheck, setLoadingCheck] = useState(true);
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const checkLogin = await api.get(API_PATHS.AUTH.CHECK_LOGIN, {
          withCredentials: true,    
        });
          if (checkLogin.data && checkLogin.data.token) {
          setToken(checkLogin.data.token);
        }
      } catch (err) {
        console.error("Error checking login status:", err);
      } finally {
        setLoadingCheck(false);
      }
    };
    checkLogin();
    
  }, []);


  const login = (newtoken: string) => {
    localStorage.setItem("token", newtoken);
    setToken(newtoken);
  };

  const logout = async() => {
    try {
      await api.post(API_PATHS.AUTH.LOGOUT, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout,loadingCheck }}>
      {children}
    </AuthContext.Provider>
  );
};
