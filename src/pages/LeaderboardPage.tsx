import Navbar from "@/components/Navbar";
import { MOCK_MEMBERS } from "@/data/mockData";
import { Trophy, Flame, TrendingUp, Star, Zap } from "lucide-react";

const categories = [
  { label: "Most Consistent", key: "streak", icon: Flame, color: "text-amber", sorted: [...MOCK_MEMBERS].sort((a, b) => b.streak - a.streak) },
  { label: "Fastest Learner", key: "testsScore", icon: TrendingUp, color: "text-cyan", sorted: [...MOCK_MEMBERS].sort((a, b) => b.testsScore - a.testsScore) },
  { label: "Top Contributor", key: "logsCount", icon: Star, color: "text-signal-green", sorted: [...MOCK_MEMBERS].sort((a, b) => b.logsCount - a.logsCount) },
  { label: "Problem Solver", key: "totalHours", icon: Zap, color: "text-signal-purple", sorted: [...MOCK_MEMBERS].sort((a, b) => b.totalHours - a.totalHours) },
];

const overall = [...MOCK_MEMBERS].sort((a, b) => b.score - a.score);

const rankStyle = (i: number) => {
  if (i === 0) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
  if (i === 1) return "text-slate-300 bg-slate-300/10 border-slate-300/30";
  if (i === 2) return "text-amber bg-amber/10 border-amber/30";
  return "text-muted-foreground bg-muted border-border";
};

export default function LeaderboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 ml-60 p-8 space-y-8">

        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Trophy size={24} className="text-amber" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground text-sm">Competition drives growth. Keep pushing, ASGS team.</p>
        </div>

        {/* Podium — top 3 */}
        <div className="flex items-end justify-center gap-4 pt-4">
          {/* 2nd */}
          <div className="text-center flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-400/20 to-slate-600/20 border-2 border-slate-300/40 flex items-center justify-center text-lg font-bold text-slate-300">
              {overall[1]?.avatar}
            </div>
            <div className="w-20 bg-slate-300/5 border border-slate-300/20 rounded-t-lg pt-4 pb-3 px-2">
              <p className="text-xs font-mono text-slate-300">🥈 2nd</p>
              <p className="text-xs text-foreground font-medium truncate">{overall[1]?.name.split(" ")[0]}</p>
              <p className="text-xs font-mono text-muted-foreground">{overall[1]?.score.toLocaleString()}</p>
            </div>
          </div>

          {/* 1st */}
          <div className="text-center flex flex-col items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400 mx-auto animate-pulse" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400/30 to-amber/20 border-2 border-yellow-400/60 flex items-center justify-center text-xl font-bold text-yellow-300 shadow-glow-amber">
              {overall[0]?.avatar}
            </div>
            <div className="w-24 bg-yellow-400/5 border border-yellow-400/20 rounded-t-lg pt-5 pb-3 px-2">
              <p className="text-xs font-mono text-yellow-400">🏆 1st</p>
              <p className="text-xs text-foreground font-semibold truncate">{overall[0]?.name.split(" ")[0]}</p>
              <p className="text-xs font-mono text-yellow-400">{overall[0]?.score.toLocaleString()}</p>
            </div>
          </div>

          {/* 3rd */}
          <div className="text-center flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber/20 to-amber-dim/20 border-2 border-amber/40 flex items-center justify-center text-lg font-bold text-amber">
              {overall[2]?.avatar}
            </div>
            <div className="w-20 bg-amber/5 border border-amber/20 rounded-t-lg pt-3 pb-3 px-2">
              <p className="text-xs font-mono text-amber">🥉 3rd</p>
              <p className="text-xs text-foreground font-medium truncate">{overall[2]?.name.split(" ")[0]}</p>
              <p className="text-xs font-mono text-muted-foreground">{overall[2]?.score.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Full rankings */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-sm">Overall Rankings</h2>
            <span className="text-xs text-muted-foreground font-mono">Score based on consistency, tests & contributions</span>
          </div>
          <div className="divide-y divide-border">
            {overall.map((m, i) => (
              <div key={m.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-secondary/30 transition ${i < 3 ? "bg-secondary/10" : ""}`}>
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-mono font-bold ${rankStyle(i)}`}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-background">
                  {m.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.name}</p>
                  <div className="flex gap-3 mt-0.5 text-[10px] text-muted-foreground font-mono">
                    <span>🔥 {m.streak}d streak</span>
                    <span>📝 {m.logsCount} logs</span>
                    <span>⚡ {m.testsScore}% tests</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end max-w-48">
                  {m.skills.slice(0, 2).map(s => (
                    <span key={s} className="px-1.5 py-0.5 bg-muted rounded text-[10px] text-muted-foreground">{s}</span>
                  ))}
                </div>
                <div className="text-right ml-4">
                  <p className="font-mono font-bold text-sm gradient-text-cyan">{m.score.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category leaderboards */}
        <div className="grid grid-cols-2 gap-4">
          {categories.map(cat => (
            <div key={cat.label} className="bg-card border border-border rounded-xl p-5">
              <h3 className={`text-sm font-semibold flex items-center gap-2 mb-4 ${cat.color}`}>
                <cat.icon size={15} />
                {cat.label}
              </h3>
              <div className="space-y-2">
                {cat.sorted.slice(0, 3).map((m, i) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-4">#{i + 1}</span>
                    <div className="w-6 h-6 rounded-full bg-secondary text-[10px] flex items-center justify-center font-bold">{m.avatar}</div>
                    <span className="text-xs flex-1 truncate">{m.name.split(" ")[0]}</span>
                    <span className={`text-xs font-mono font-bold ${cat.color}`}>
                      {cat.key === "streak" ? `${m[cat.key as keyof typeof m]}d` :
                       cat.key === "testsScore" ? `${m[cat.key as keyof typeof m]}%` :
                       cat.key === "totalHours" ? `${m[cat.key as keyof typeof m]}h` :
                       m[cat.key as keyof typeof m]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
