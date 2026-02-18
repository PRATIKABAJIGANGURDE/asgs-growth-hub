import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import MemberDashboard from "./pages/MemberDashboard";
import WorkLogPage from "./pages/WorkLogPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import MentorDashboard from "./pages/MentorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, requireRole }: { children: React.ReactNode; requireRole?: "member" | "mentor" }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (requireRole && user.role !== requireRole) {
    return <Navigate to={user.role === "mentor" ? "/mentor" : "/dashboard"} replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to={user.role === "mentor" ? "/mentor" : "/dashboard"} replace /> : <LoginPage />}
      />
      <Route path="/dashboard" element={<ProtectedRoute requireRole="member"><MemberDashboard /></ProtectedRoute>} />
      <Route path="/log" element={<ProtectedRoute requireRole="member"><WorkLogPage /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      <Route path="/mentor" element={<ProtectedRoute requireRole="mentor"><MentorDashboard /></ProtectedRoute>} />
      <Route path="/mentor/members" element={<ProtectedRoute requireRole="mentor"><MentorDashboard /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
