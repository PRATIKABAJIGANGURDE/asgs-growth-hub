import React, { createContext, useContext, useState } from "react";

export type UserRole = "member" | "mentor";

export interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface PendingRequest {
  id: string;
  name: string;
  email: string;
  password: string;
  requestedAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  pendingRequests: PendingRequest[];
  requestAccess: (name: string, email: string, password: string) => { success: boolean; error?: string };
  approveRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  addMember: (name: string, email: string, password: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo
const INITIAL_MOCK_USERS = [
  { email: "rahul.sharma@atharvacoe.ac.in", password: "demo123", name: "Rahul Sharma", role: "member" as UserRole, avatar: "RS" },
  { email: "priya.mehta@atharvacoe.ac.in", password: "demo123", name: "Priya Mehta", role: "member" as UserRole, avatar: "PM" },
  { email: "mentor@atharvacoe.ac.in", password: "mentor123", name: "Prof. Anand", role: "mentor" as UserRole, avatar: "PA" },
];

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mockUsers, setMockUsers] = useState(INITIAL_MOCK_USERS);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);

  const login = (email: string, password: string) => {
    if (!email.endsWith("@atharvacoe.ac.in")) {
      return { success: false, error: "Only @atharvacoe.ac.in emails are allowed." };
    }
    // Check if user has a pending request
    const isPending = pendingRequests.find(r => r.email === email);
    if (isPending) {
      return { success: false, error: "Your request is pending mentor approval. Please wait." };
    }
    const found = mockUsers.find(u => u.email === email && u.password === password);
    if (!found) {
      return { success: false, error: "Invalid credentials. Try demo accounts." };
    }
    setUser({ name: found.name, email: found.email, role: found.role, avatar: found.avatar });
    return { success: true };
  };

  const requestAccess = (name: string, email: string, password: string) => {
    if (!email.endsWith("@atharvacoe.ac.in")) {
      return { success: false, error: "Only @atharvacoe.ac.in emails are allowed." };
    }
    if (!name.trim() || name.trim().length < 2) {
      return { success: false, error: "Please enter your full name." };
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }
    const alreadyExists = mockUsers.find(u => u.email === email);
    if (alreadyExists) {
      return { success: false, error: "An account with this email already exists." };
    }
    const alreadyPending = pendingRequests.find(r => r.email === email);
    if (alreadyPending) {
      return { success: false, error: "A request for this email is already pending." };
    }
    const newRequest: PendingRequest = {
      id: Date.now().toString(),
      name: name.trim(),
      email,
      password,
      requestedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setPendingRequests(prev => [...prev, newRequest]);
    return { success: true };
  };

  const approveRequest = (id: string) => {
    const req = pendingRequests.find(r => r.id === id);
    if (!req) return;
    setMockUsers(prev => [
      ...prev,
      { email: req.email, password: req.password, name: req.name, role: "member", avatar: getInitials(req.name) },
    ]);
    setPendingRequests(prev => prev.filter(r => r.id !== id));
  };

  const rejectRequest = (id: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== id));
  };

  const addMember = (name: string, email: string, password: string) => {
    if (!email.endsWith("@atharvacoe.ac.in")) {
      return { success: false, error: "Only @atharvacoe.ac.in emails are allowed." };
    }
    if (!name.trim() || name.trim().length < 2) {
      return { success: false, error: "Please enter a valid name." };
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }
    const alreadyExists = mockUsers.find(u => u.email === email);
    if (alreadyExists) {
      return { success: false, error: "A member with this email already exists." };
    }
    setMockUsers(prev => [
      ...prev,
      { email, password, name: name.trim(), role: "member", avatar: getInitials(name) },
    ]);
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, pendingRequests, requestAccess, approveRequest, rejectRequest, addMember }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
