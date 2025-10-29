"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check cookies for authentication status on mount
    const storedAuth = Cookies.get("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string) => {
    console.log("Attempting login for:", username);
    if (username === "admin" && password === "password") {
      Cookies.set("isAuthenticated", "true", { expires: 7 }); // Cookie expires in 7 days
      setIsAuthenticated(true);
      console.log("Login successful. isAuthenticated:", true);
      return true;
    }
    console.log("Login failed. Invalid credentials.");
    return false;
  };

  const logout = () => {
    Cookies.remove("isAuthenticated");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
