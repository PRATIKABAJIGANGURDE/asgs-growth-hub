import Navbar from "@/components/Navbar";
import { MOCK_MEMBERS, MOCK_PROJECTS } from "@/data/mockData";
import {
  Radio, Users, AlertTriangle, TrendingUp, Clock, Activity,
  CheckCircle2, XCircle, Minus,
} from "lucide-react";

const statusIcon = (status: string) => {
  if (status === "active") return <span className="w-2 h-2 rounded-full bg-signal-green status-dot-active inline-block" />;
  if (status === "idle") return <span className="w-2 h-2 rounded-full bg-amber inline-block" />;
  return <span className="w-2 h-2 rounded-full bg-muted-foreground inline-block" />;
};

export default function MentorDashboard() {
  const activeMembers = MOCK_MEMBERS.filter(m => m.status === "active");
  const inactiveMembers = MOCK_MEMBERS.filter(m => m.streak === 0 || m.attendance < 60);
  const stalledProjects = MOCK_PROJECTS.filter(p => p.status === "stalled");

  return (
    <div className="flex min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 ml-60 p-8 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-signal-green status-dot-active" />
              <span className="text-xs font-mono text-signal-green uppercase tracking-widest">Live Monitor</span>
            </div>
            <h1 className="text-2xl font-bold">Mentor Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Real-time lab activity overview</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-mono">Last updated</p>
            <p className="text-sm font-mono text-foreground">Just now</p>
          </div>
        </div>

        {/* Alert — stalled / inactive */}
        {(stalledProjects.length > 0 || inactiveMembers.length > 0) && (
          <div className="bg-amber/5 border border-amber/30 rounded-xl p-4 flex items-start gap-4">
            <AlertTriangle size={18} className="text-amber mt-0.5 flex-shrink-0" />
            <div className="space-y-1 text-sm">
              {stalledProjects.length > 0 && (
                <p className="text-amber font-medium">{stalledProjects.length} stalled project(s): {stalledProjects.map(p => p.name).join(", ")}</p>
              )}
              {inactiveMembers.length > 0 && (
                <p className="text-muted-foreground">{inactiveMembers.length} member(s) with low attendance or broken streak — need attention.</p>
              )}
            </div>
          </div>
        )}

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Active Now", value: activeMembers.length, total: MOCK_MEMBERS.length, icon: Radio, color: "text-signal-green", bg: "border-signal-green/20 bg-signal-green/5" },
            { label: "Total Members", value: MOCK_MEMBERS.length, icon: Users, color: "text-cyan", bg: "border-cyan/20 bg-cyan/5" },
            { label: "Active Projects", value: MOCK_PROJECTS.filter(p => p.status === "active").length, icon: Activity, color: "text-amber", bg: "border-amber/20 bg-amber/5" },
            { label: "Avg Attendance", value: `${Math.round(MOCK_MEMBERS.reduce((a, m) => a + m.attendance, 0) / MOCK_MEMBERS.length)}%`, icon: TrendingUp, color: "text-signal-purple", bg: "border-purple-500/20 bg-purple-500/5" },
          ].map(stat => (
            <div key={stat.label} className={`rounded-xl border p-5 ${stat.bg} flex items-center gap-4`}>
              <stat.icon size={22} className={stat.color} />
              <div>
                <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Live activity */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <Radio size={15} className="text-signal-green" />
            <h2 className="font-semibold text-sm">Live Lab Activity</h2>
            <span className="ml-auto text-[10px] font-mono text-muted-foreground">Auto-refreshes every 30s</span>
          </div>
          <div className="divide-y divide-border">
            {MOCK_MEMBERS.map(m => (
              <div key={m.id} className="flex items-center gap-5 px-6 py-4 hover:bg-secondary/20 transition">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-background">
                    {m.avatar}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5">{statusIcon(m.status)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{m.currentProject}</p>
                  <p className="text-[10px] text-muted-foreground">Current Project</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-mono font-bold text-cyan">{m.todayHours}h</p>
                  <p className="text-[10px] text-muted-foreground">Today</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-mono">{m.attendance}%</p>
                  <p className="text-[10px] text-muted-foreground">Attendance</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-mono text-amber">{m.streak}d</p>
                  <p className="text-[10px] text-muted-foreground">Streak</p>
                </div>
                <div>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
                    m.status === "active" ? "text-signal-green bg-signal-green/10 border-signal-green/30" :
                    m.status === "idle" ? "text-amber bg-amber/10 border-amber/30" :
                    "text-muted-foreground bg-muted border-border"
                  }`}>
                    {m.status === "active" ? "IN LAB" : m.status === "idle" ? "IDLE" : "OFFLINE"}
                  </span>
                </div>
                <div className="text-right text-[10px] text-muted-foreground font-mono w-20">
                  {m.lastActive}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member skill progress + Project status */}
        <div className="grid grid-cols-5 gap-6">

          {/* Skill overview */}
          <div className="col-span-3 bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-sm mb-5 flex items-center gap-2">
              <TrendingUp size={15} className="text-cyan" />
              Member Performance Overview
            </h2>
            <div className="space-y-4">
              {MOCK_MEMBERS.map(m => (
                <div key={m.id} className="flex items-center gap-4">
                  <div className="w-7 h-7 rounded-full bg-secondary text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                    {m.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium truncate">{m.name.split(" ")[0]}</span>
                      <span className="text-[10px] font-mono text-muted-foreground ml-2">{m.score.toLocaleString()} XP</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-primary"
                        style={{ width: `${(m.score / 5000) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${m.attendance >= 80 ? "text-signal-green" : "text-signal-red"}`}>
                      {m.attendance >= 80 ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    </div>
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${m.streak >= 7 ? "text-amber" : "text-muted-foreground"}`}>
                      <Minus size={12} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-5 pt-4 border-t border-border text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-signal-green" /> Attendance ≥ 80%</span>
              <span className="flex items-center gap-1"><XCircle size={10} className="text-signal-red" /> Attendance &lt; 80%</span>
            </div>
          </div>

          {/* Project status */}
          <div className="col-span-2 bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-sm mb-5 flex items-center gap-2">
              <Activity size={15} className="text-amber" />
              Project Status
            </h2>
            <div className="space-y-4">
              {MOCK_PROJECTS.map(p => (
                <div key={p.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{p.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      p.status === "active" ? "text-signal-green bg-signal-green/10" :
                      "text-amber bg-amber/10"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${p.status === "stalled" ? "bg-gradient-amber" : "bg-gradient-primary"}`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {p.contributors.join(", ")} · Updated {p.lastUpdate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly AI summary */}
        <div className="bg-gradient-card border border-cyan/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Clock size={14} className="text-background" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">Weekly AI Summary</h2>
              <p className="text-[10px] text-muted-foreground">Auto-generated — Week of Feb 17, 2025</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-xs font-mono text-cyan uppercase tracking-wide mb-2">Lab Trends</p>
              <p className="text-muted-foreground leading-relaxed text-xs">
                Embedded Systems and IoT skills are most active this week. 3 members showed significant growth in sensor calibration and debugging.
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-amber uppercase tracking-wide mb-2">Skill Gaps</p>
              <p className="text-muted-foreground leading-relaxed text-xs">
                RF Communication and Signal Processing are underrepresented. Consider a lab session on communication protocols to address this gap.
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-signal-green uppercase tracking-wide mb-2">Suggested Focus</p>
              <p className="text-muted-foreground leading-relaxed text-xs">
                PCB Ground Station is stalling — assign 2 more contributors. Priya's IoT Dashboard shows potential to integrate AI telemetry analysis next week.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
