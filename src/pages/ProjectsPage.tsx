import Navbar from "@/components/Navbar";
import { MOCK_PROJECTS } from "@/data/mockData";
import { FolderKanban, Users, Clock, TrendingUp } from "lucide-react";

const statusColors = {
  active: "text-signal-green bg-signal-green/10 border-signal-green/30",
  stalled: "text-amber bg-amber/10 border-amber/30",
  completed: "text-cyan bg-cyan/10 border-cyan/30",
};

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 ml-60 p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <FolderKanban size={24} className="text-cyan" />
              Projects
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Track lab projects and your contributions.</p>
          </div>
          <button className="flex items-center gap-2 border border-cyan/30 text-cyan bg-cyan/5 hover:bg-cyan/10 transition font-medium px-5 py-2.5 rounded-lg text-sm">
            + New Project
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {MOCK_PROJECTS.map(p => (
            <div key={p.id} className="bg-card border border-border hover:border-cyan/30 rounded-xl p-6 transition cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold group-hover:text-cyan transition">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
                </div>
                <span className={`text-[10px] font-mono px-2 py-1 rounded-full border ${statusColors[p.status as keyof typeof statusColors]}`}>
                  {p.status.toUpperCase()}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Progress</span>
                  <span className="font-mono">{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-primary transition-all"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users size={11} />
                  {p.contributors.join(", ")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={11} />
                  {p.lastUpdate}
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp size={11} />
                  {p.logs} logs
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {p.skills.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-muted rounded-full text-[10px] text-muted-foreground">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
