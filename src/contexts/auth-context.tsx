"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api, endpoints, type User, type LoginResponse } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // check if user is already logged in
    const token = localStorage.getItem("admin-token");
    if (token) {
      // validate token by making a request
      api
        .get(endpoints.users)
        .then(() => {
          // if request succeeds, user is authenticated
          const userData = localStorage.getItem("admin-user");
          if (userData) {
            setUser(JSON.parse(userData));
          }
        })
        .catch(() => {
          // if request fails, clear invalid token
          localStorage.removeItem("admin-token");
          localStorage.removeItem("admin-user");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<LoginResponse>(endpoints.auth.login, {
        email,
        password,
      });

      const { user: userData, accessToken } = response.data;

      localStorage.setItem("admin-token", accessToken);
      localStorage.setItem("admin-user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin-token");
    localStorage.removeItem("admin-user");
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
