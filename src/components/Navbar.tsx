import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import asgsHero from "@/assets/asgs-hero.png";
import {
  LayoutDashboard, BookOpen, Trophy, FolderKanban, LogOut, Radio, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const memberNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/log", label: "Work Log", icon: BookOpen },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

const mentorNav = [
  { to: "/mentor", label: "Monitor", icon: Radio },
  { to: "/mentor/members", label: "Members", icon: Users },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nav = user?.role === "mentor" ? mentorNav : memberNav;

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col bg-[hsl(220_28%_6%)] border-r border-border z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <img src={asgsHero} alt="ASGS" className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan" />
        <div>
          <p className="text-xs font-mono text-cyan tracking-widest">ASGS</p>
          <p className="text-[10px] text-muted-foreground leading-tight">Skill & Lab Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-cyan/10 text-cyan border border-cyan/30 shadow-glow-cyan"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon size={16} className={active ? "text-cyan" : ""} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      {user && (
        <div className="px-3 pb-5 border-t border-border pt-4">
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-background">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
