import React, { createContext, useContext, useState } from "react";

export type UserRole = "member" | "mentor";

export interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo
const MOCK_USERS = [
  { email: "rahul.sharma@atharvacoe.ac.in", password: "demo123", name: "Rahul Sharma", role: "member" as UserRole, avatar: "RS" },
  { email: "priya.mehta@atharvacoe.ac.in", password: "demo123", name: "Priya Mehta", role: "member" as UserRole, avatar: "PM" },
  { email: "mentor@atharvacoe.ac.in", password: "mentor123", name: "Prof. Anand", role: "mentor" as UserRole, avatar: "PA" },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    if (!email.endsWith("@atharvacoe.ac.in")) {
      return { success: false, error: "Only @atharvacoe.ac.in emails are allowed." };
    }
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!found) {
      return { success: false, error: "Invalid credentials. Try demo accounts." };
    }
    setUser({ name: found.name, email: found.email, role: found.role, avatar: found.avatar });
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
