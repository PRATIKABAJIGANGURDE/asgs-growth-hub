import Navbar from "@/components/Navbar";
import { MOCK_MEMBERS, ACTIVITY_DATA, SKILL_RADAR } from "@/data/mockData";
import {
  Clock, Flame, Trophy, BookOpen, CheckCircle2, AlertCircle,
  TrendingUp, Zap, Calendar, Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const me = MOCK_MEMBERS[0]; // Rahul is logged-in member

export default function MemberDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 ml-60 p-8 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
            <h1 className="text-2xl font-bold">
              Good morning, <span className="gradient-text-cyan">{user?.name?.split(" ")[0] ?? "Member"}</span> 👋
            </h1>
          </div>
          <button
            onClick={() => navigate("/log")}
            className="flex items-center gap-2 bg-gradient-primary text-background font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition shadow-glow-cyan text-sm"
          >
            <Plus size={16} />
            Log Work
          </button>
        </div>

        {/* Check-in banner */}
        <div className="bg-signal-green/10 border border-signal-green/30 rounded-xl p-4 flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-signal-green/20 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-signal-green" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-signal-green status-dot-active" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">You're checked in — Active in Lab</p>
            <p className="text-xs text-muted-foreground">Checked in at 10:30 AM · 2h 30m elapsed</p>
          </div>
          <button className="text-xs text-signal-green border border-signal-green/30 rounded-lg px-4 py-2 hover:bg-signal-green/10 transition">
            Check Out
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Today's Hours", value: "2.5h", icon: Clock, color: "text-cyan", bg: "bg-cyan/10 border-cyan/20" },
            { label: "Current Streak", value: `${me.streak} days`, icon: Flame, color: "text-amber", bg: "bg-amber/10 border-amber/20" },
            { label: "Leaderboard Rank", value: `#${me.rank}`, icon: Trophy, color: "text-signal-purple", bg: "bg-purple-500/10 border-purple-500/20" },
            { label: "Logs This Month", value: me.logsCount.toString(), icon: BookOpen, color: "text-signal-green", bg: "bg-signal-green/10 border-signal-green/20" },
          ].map(stat => (
            <div key={stat.label} className={`rounded-xl border p-5 ${stat.bg} flex items-start gap-4`}>
              <div className={`${stat.color} mt-0.5`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* Activity chart */}
          <div className="col-span-2 bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan" /> This Week's Activity
              </h2>
              <span className="text-xs font-mono text-muted-foreground">hours / day</span>
            </div>
            <div className="flex items-end gap-3" style={{ height: "120px" }}>
              {ACTIVITY_DATA.map(d => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex flex-col justify-end" style={{ height: "96px" }}>
                    <div
                      className="w-full rounded-t-md transition-all relative group"
                      style={{ 
                        height: `${(d.hours / 5) * 96}px`, 
                        minHeight: d.hours > 0 ? "4px" : "0",
                        background: "linear-gradient(135deg, hsl(186, 100%, 50%), hsl(200, 100%, 45%))"
                      }}
                    >
                      {d.hours > 0 && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan opacity-0 group-hover:opacity-100 transition">
                          {d.hours}h
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold flex items-center gap-2 mb-6">
              <Zap size={16} className="text-amber" /> Skill Growth
            </h2>
            <div className="space-y-3">
              {SKILL_RADAR.map(s => (
                <div key={s.skill}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{s.skill}</span>
                    <span className="font-mono text-foreground">{s.level}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-primary transition-all"
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI feedback + pending test */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-gradient-primary flex items-center justify-center">
                <Zap size={12} className="text-background" />
              </div>
              <h2 className="font-semibold text-sm">Latest AI Feedback</h2>
              <span className="ml-auto text-[10px] font-mono text-muted-foreground">Yesterday</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Great session on Antenna Tracker! Your work with PID control loops shows solid understanding.
              Focus next on optimizing the I²C communication speed — your logs suggest latency bottlenecks.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="px-2 py-0.5 bg-cyan/10 border border-cyan/20 rounded-full text-[10px] text-cyan font-mono">PID Control</span>
              <span className="px-2 py-0.5 bg-amber/10 border border-amber/20 rounded-full text-[10px] text-amber font-mono">I²C</span>
            </div>
          </div>

          <div className="bg-amber/5 border border-amber/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={16} className="text-amber" />
              <h2 className="font-semibold text-sm text-amber">AI Test Pending</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Based on your last 3 logs, an AI-generated test is ready on <strong className="text-foreground">Embedded Systems & Sensor Calibration</strong>. Complete it to boost your score.
            </p>
            <button className="w-full py-2.5 bg-gradient-amber text-background rounded-lg text-sm font-semibold hover:opacity-90 transition shadow-glow-amber">
              Take Test Now →
            </button>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold mb-5 flex items-center gap-2">
            <Calendar size={16} className="text-cyan" /> Recent Work Logs
          </h2>
          <div className="space-y-3">
            {[
              { project: "Antenna Tracker", skills: ["Embedded Systems", "Sensors"], hours: 3, date: "Yesterday" },
              { project: "Antenna Tracker", skills: ["Debugging", "Programming"], hours: 2.5, date: "2 days ago" },
              { project: "Antenna Tracker", skills: ["Communication Protocols"], hours: 4, date: "3 days ago" },
            ].map((log, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-cyan">
                  {log.hours}h
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{log.project}</p>
                  <div className="flex gap-1 mt-1">
                    {log.skills.map(s => (
                      <span key={s} className="px-1.5 py-0.5 bg-secondary rounded text-[10px] text-muted-foreground">{s}</span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{log.date}</span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
