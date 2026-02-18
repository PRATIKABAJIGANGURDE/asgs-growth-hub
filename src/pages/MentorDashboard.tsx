import { useState } from "react";
import Navbar from "@/components/Navbar";
import { MOCK_MEMBERS, MOCK_PROJECTS } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import {
  Radio, Users, AlertTriangle, TrendingUp, Clock, Activity,
  CheckCircle2, XCircle, Minus, UserPlus, X, Check, UserCheck,
  Eye, EyeOff, Mail, User, Lock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const statusIcon = (status: string) => {
  if (status === "active") return <span className="w-2 h-2 rounded-full bg-signal-green status-dot-active inline-block" />;
  if (status === "idle") return <span className="w-2 h-2 rounded-full bg-amber inline-block" />;
  return <span className="w-2 h-2 rounded-full bg-muted-foreground inline-block" />;
};

export default function MentorDashboard() {
  const { pendingRequests, approveRequest, rejectRequest, addMember } = useAuth();
  const activeMembers = MOCK_MEMBERS.filter(m => m.status === "active");
  const inactiveMembers = MOCK_MEMBERS.filter(m => m.streak === 0 || m.attendance < 60);
  const stalledProjects = MOCK_PROJECTS.filter(p => p.status === "stalled");

  // Add Member modal state
  const [showAddMember, setShowAddMember] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addShowPass, setAddShowPass] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);
    setTimeout(() => {
      const result = addMember(addName, addEmail, addPassword);
      if (result.success) {
        setAddSuccess(true);
        setAddName(""); setAddEmail(""); setAddPassword("");
      } else {
        setAddError(result.error || "Failed to add member.");
      }
      setAddLoading(false);
    }, 500);
  };

  const closeAddModal = () => {
    setShowAddMember(false);
    setAddError("");
    setAddSuccess(false);
    setAddName(""); setAddEmail(""); setAddPassword("");
  };

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
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-mono">Last updated</p>
              <p className="text-sm font-mono text-foreground">Just now</p>
            </div>
            <button
              onClick={() => setShowAddMember(true)}
              className="flex items-center gap-2 bg-gradient-primary text-background text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-glow-cyan"
            >
              <UserPlus size={15} />
              Add Member
            </button>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="bg-cyan/5 border border-cyan/20 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-cyan/20 flex items-center gap-3">
              <UserCheck size={16} className="text-cyan" />
              <h2 className="font-semibold text-sm text-cyan">Pending Access Requests</h2>
              <span className="ml-auto bg-cyan/20 text-cyan text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan/30">
                {pendingRequests.length} pending
              </span>
            </div>
            <div className="divide-y divide-border">
              {pendingRequests.map(req => (
                <div key={req.id} className="flex items-center gap-5 px-6 py-4">
                  <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {req.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{req.name}</p>
                    <p className="text-xs text-muted-foreground">{req.email}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono">Requested at {req.requestedAt}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveRequest(req.id)}
                      className="flex items-center gap-1.5 bg-signal-green/10 border border-signal-green/30 text-signal-green text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-signal-green/20 transition-colors"
                    >
                      <Check size={12} />
                      Approve
                    </button>
                    <button
                      onClick={() => rejectRequest(req.id)}
                      className="flex items-center gap-1.5 bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-destructive/20 transition-colors"
                    >
                      <X size={12} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

      {/* ── Add Member Modal ── */}
      {showAddMember && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <UserPlus size={15} className="text-background" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Add New Member</h3>
                  <p className="text-[10px] text-muted-foreground">Directly add a member without approval flow</p>
                </div>
              </div>
              <button onClick={closeAddModal} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {addSuccess ? (
                <div className="flex flex-col items-center gap-4 text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-signal-green/10 border border-signal-green/30 flex items-center justify-center">
                    <CheckCircle2 size={28} className="text-signal-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Member Added!</h4>
                    <p className="text-muted-foreground text-sm">They can now sign in with their credentials.</p>
                  </div>
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => { setAddSuccess(false); }}
                      className="flex-1 h-10 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Add Another
                    </button>
                    <button
                      onClick={closeAddModal}
                      className="flex-1 h-10 bg-gradient-primary text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-name" className="text-xs text-muted-foreground">Full Name</Label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="add-name"
                        value={addName}
                        onChange={e => setAddName(e.target.value)}
                        placeholder="Member's full name"
                        className="pl-9 bg-muted border-border h-10 text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-email" className="text-xs text-muted-foreground">College Email</Label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="add-email"
                        type="email"
                        value={addEmail}
                        onChange={e => setAddEmail(e.target.value)}
                        placeholder="name@atharvacoe.ac.in"
                        className="pl-9 bg-muted border-border h-10 text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-password" className="text-xs text-muted-foreground">Set Password</Label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="add-password"
                        type={addShowPass ? "text" : "password"}
                        value={addPassword}
                        onChange={e => setAddPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="pl-9 pr-10 bg-muted border-border h-10 text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setAddShowPass(!addShowPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {addShowPass ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>

                  {addError && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2.5 text-xs text-destructive">
                      {addError}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={closeAddModal}
                      className="flex-1 h-10 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addLoading}
                      className="flex-1 h-10 bg-gradient-primary text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {addLoading ? "Adding..." : <><UserPlus size={14} /> Add Member</>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
