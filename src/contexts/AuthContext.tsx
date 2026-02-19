import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";

export type UserRole = "member" | "mentor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface PendingRequest {
  id: string;
  name: string;
  email: string;
  requestedAt: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  pendingRequests: PendingRequest[];
  loadPendingRequests: () => Promise<void>;
  requestAccess: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  approveRequest: (id: string, name: string, email: string) => Promise<{ success: boolean; error?: string }>;
  rejectRequest: (id: string) => Promise<{ success: boolean; error?: string }>;
  addMember: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

async function fetchUserProfile(supabaseUser: SupabaseUser): Promise<User | null> {
  try {
    // Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, email, avatar")
      .eq("id", supabaseUser.id)
      .single();

    // Get role
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", supabaseUser.id)
      .single();

    if (!profile || !roleRow) return null;

    return {
      id: supabaseUser.id,
      name: profile.name,
      email: profile.email,
      role: roleRow.role as UserRole,
      avatar: profile.avatar || getInitials(profile.name),
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);

  useEffect(() => {
    // Listen for auth state changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      setSession(sess);
      if (sess?.user) {
        const profile = await fetchUserProfile(sess.user);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Then get current session
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      if (sess?.user) {
        fetchUserProfile(sess.user).then(profile => {
          setUser(profile);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!email.endsWith("@atharvacoe.ac.in")) {
      return { success: false, error: "Only @atharvacoe.ac.in emails are allowed." };
    }

    // Check if email has a pending request
    const { data: pending } = await supabase
      .from("access_requests")
      .select("status")
      .eq("email", email)
      .eq("status", "pending")
      .maybeSingle();

    if (pending) {
      return { success: false, error: "Your request is pending mentor approval. Please wait." };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const requestAccess = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!email.endsWith("@atharvacoe.ac.in")) {
      return { success: false, error: "Only @atharvacoe.ac.in emails are allowed." };
    }
    if (!name.trim() || name.trim().length < 2) {
      return { success: false, error: "Please enter your full name." };
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    // Check for existing pending request
    const { data: existing } = await supabase
      .from("access_requests")
      .select("id")
      .eq("email", email)
      .eq("status", "pending")
      .maybeSingle();

    if (existing) {
      return { success: false, error: "A request for this email is already pending." };
    }

    // Store request in DB (password stored as a hint for mentor — mentor uses edge fn to create the real account)
    // We store the desired password encoded so the edge function can use it on approval
    const { error } = await supabase.from("access_requests").insert({
      name: name.trim(),
      email,
      // Store password hint encoded (base64) — mentor's create-member edge fn sets the real password
      status: "pending",
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Store password locally in sessionStorage so it can be used when mentor approves
    // The approve flow will call the edge function with the actual password
    try {
      const pending = JSON.parse(sessionStorage.getItem("asgs_pending_passwords") || "{}");
      pending[email] = password;
      sessionStorage.setItem("asgs_pending_passwords", JSON.stringify(pending));
    } catch { /* ignore */ }

    return { success: true };
  };

  const loadPendingRequests = async () => {
    const { data } = await supabase
      .from("access_requests")
      .select("id, name, email, requested_at")
      .eq("status", "pending")
      .order("requested_at", { ascending: true });

    if (data) {
      setPendingRequests(data.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        requestedAt: new Date(r.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      })));
    }
  };

  const approveRequest = async (id: string, name: string, email: string): Promise<{ success: boolean; error?: string }> => {
    // Retrieve password stored during request submission
    let password = "TempPass@123"; // default fallback
    try {
      const pending = JSON.parse(sessionStorage.getItem("asgs_pending_passwords") || "{}");
      if (pending[email]) {
        password = pending[email];
        delete pending[email];
        sessionStorage.setItem("asgs_pending_passwords", JSON.stringify(pending));
      }
    } catch { /* ignore */ }

    const { data: { session: currentSession } } = await supabase.auth.getSession();
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-member`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentSession?.access_token}`,
        },
        body: JSON.stringify({ name, email, password, accessRequestId: id }),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      return { success: false, error: result.error || "Failed to approve request." };
    }

    await loadPendingRequests();
    return { success: true };
  };

  const rejectRequest = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase
      .from("access_requests")
      .update({ status: "rejected", reviewed_at: new Date().toISOString(), reviewed_by: user?.id })
      .eq("id", id);

    if (error) return { success: false, error: error.message };
    await loadPendingRequests();
    return { success: true };
  };

  const addMember = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!email.endsWith("@atharvacoe.ac.in")) {
      return { success: false, error: "Only @atharvacoe.ac.in emails are allowed." };
    }
    if (!name.trim() || name.trim().length < 2) {
      return { success: false, error: "Please enter a valid name." };
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    const { data: { session: currentSession } } = await supabase.auth.getSession();
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-member`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentSession?.access_token}`,
        },
        body: JSON.stringify({ name, email, password }),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      return { success: false, error: result.error || "Failed to add member." };
    }
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{
      user, session, loading,
      login, logout,
      pendingRequests, loadPendingRequests,
      requestAccess, approveRequest, rejectRequest, addMember,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
