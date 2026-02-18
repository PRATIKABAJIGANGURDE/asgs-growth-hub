import Navbar from "@/components/Navbar";
import { useState } from "react";
import { SKILL_TAGS, MOCK_PROJECTS } from "@/data/mockData";
import { Clock, Upload, CheckCircle2, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function WorkLogPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [hours, setHours] = useState("2");
  const [submitted, setSubmitted] = useState(false);

  const toggleSkill = (s: string) => {
    setSelectedSkills(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 ml-60 flex items-center justify-center">
          <div className="text-center space-y-4 animate-slide-up">
            <div className="w-20 h-20 rounded-full bg-signal-green/10 border-2 border-signal-green mx-auto flex items-center justify-center">
              <CheckCircle2 size={40} className="text-signal-green" />
            </div>
            <h2 className="text-2xl font-bold">Log Submitted!</h2>
            <p className="text-muted-foreground max-w-sm">
              Your work session has been recorded. AI will generate a test based on your skills next session.
            </p>
            <div className="bg-cyan/10 border border-cyan/20 rounded-xl p-4 text-sm text-muted-foreground max-w-sm mx-auto">
              <span className="text-cyan font-medium">+150 XP earned</span> · AI analyzing your log...
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition underline"
            >
              Log another session
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 ml-60 p-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Log Today's Work</h1>
          <p className="text-muted-foreground text-sm">Record what you worked on — AI will generate tests and feedback from this.</p>
        </div>

        <form
          onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
          className="space-y-6"
        >
          {/* Project */}
          <div className="space-y-2">
            <Label>Project</Label>
            <select className="w-full h-11 bg-muted border border-border rounded-lg px-3 text-sm focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan/30">
              <option value="">Select project...</option>
              {MOCK_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
              <option value="new">+ New Project</option>
            </select>
          </div>

          {/* Time spent */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock size={14} className="text-cyan" /> Time Spent (hours)
            </Label>
            <div className="flex gap-2">
              {["1", "1.5", "2", "2.5", "3", "4", "5+"].map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHours(h)}
                  className={`px-4 py-2 rounded-lg text-sm font-mono transition border ${
                    hours === h
                      ? "bg-cyan/10 border-cyan text-cyan"
                      : "bg-muted border-border text-muted-foreground hover:border-foreground/30"
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Skills Used <span className="text-muted-foreground text-xs">(select all that apply)</span></Label>
            <div className="flex flex-wrap gap-2">
              {SKILL_TAGS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSkill(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    selectedSkills.includes(s)
                      ? "bg-cyan/15 border-cyan text-cyan"
                      : "bg-muted border-border text-muted-foreground hover:border-foreground/30"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Work done */}
          <div className="space-y-2">
            <Label>What did you work on?</Label>
            <Textarea
              placeholder="Describe what you built, debugged, or learned today..."
              className="bg-muted border-border focus:border-cyan focus:ring-1 focus:ring-cyan/30 min-h-24 resize-none"
            />
          </div>

          {/* Problems faced */}
          <div className="space-y-2">
            <Label>Problems Faced <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Textarea
              placeholder="Any bugs, blockers, or challenges you encountered..."
              className="bg-muted border-border focus:border-cyan focus:ring-1 focus:ring-cyan/30 min-h-16 resize-none"
            />
          </div>

          {/* Learning */}
          <div className="space-y-2">
            <Label>Key Learning / Outcome</Label>
            <Textarea
              placeholder="What did you learn? Any breakthrough or insight?"
              className="bg-muted border-border focus:border-cyan focus:ring-1 focus:ring-cyan/30 min-h-16 resize-none"
            />
          </div>

          {/* Proof upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Upload size={14} className="text-amber" /> Upload Proof <span className="text-muted-foreground text-xs">(optional — boosts credibility score)</span>
            </Label>
            <div className="border-2 border-dashed border-border hover:border-cyan/40 rounded-xl p-8 text-center cursor-pointer transition group">
              <Upload size={24} className="mx-auto text-muted-foreground group-hover:text-cyan transition mb-2" />
              <p className="text-sm text-muted-foreground">Drop files here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">Photos, videos, code screenshots, PCB files — max 50MB</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-gradient-primary text-background font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition shadow-glow-cyan"
          >
            Submit Work Log
            <ChevronRight size={18} />
          </button>
        </form>
      </main>
    </div>
  );
}
