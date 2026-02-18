import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import asgsHero from "@/assets/asgs-hero.png";
import { Lock, Mail, ChevronRight, Eye, EyeOff, UserPlus, LogIn, User, CheckCircle } from "lucide-react";

type Tab = "login" | "request";

export default function LoginPage() {
  const { login, requestAccess } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("login");

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Request access state
  const [reqName, setReqName] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [reqPassword, setReqPassword] = useState("");
  const [reqShowPassword, setReqShowPassword] = useState(false);
  const [reqError, setReqError] = useState("");
  const [reqLoading, setReqLoading] = useState(false);
  const [reqSuccess, setReqSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        if (email.includes("mentor")) {
          navigate("/mentor");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(result.error || "Login failed");
      }
      setLoading(false);
    }, 600);
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setReqError("");
    setReqLoading(true);
    setTimeout(() => {
      const result = requestAccess(reqName, reqEmail, reqPassword);
      if (result.success) {
        setReqSuccess(true);
      } else {
        setReqError(result.error || "Request failed");
      }
      setReqLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — branding */}
      <div className="hidden lg:flex flex-col flex-1 bg-gradient-card border-r border-border relative overflow-hidden p-12">
        <div className="absolute inset-0 scan-lines opacity-40" />
        <div className="absolute inset-0 bg-gradient-hero" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 rounded-full border border-cyan/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="w-64 h-64 rounded-full border border-cyan/15 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="w-40 h-40 rounded-full border border-cyan/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <img src={asgsHero} alt="" className="w-24 h-24 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <img src={asgsHero} alt="ASGS" className="w-12 h-12 rounded-full ring-2 ring-cyan/50" />
            <div>
              <p className="font-mono text-cyan text-sm tracking-widest font-bold">ASGS</p>
              <p className="text-[11px] text-muted-foreground">Atharva Satellite Ground Station</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-cyan/10 border border-cyan/20 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-signal-green animate-pulse" />
              <span className="text-xs font-mono text-cyan">SYSTEM ONLINE</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              Track Your <br />
              <span className="gradient-text-cyan">Engineering</span>
              <br />Growth
            </h1>
            <p className="text-muted-foreground text-lg max-w-sm leading-relaxed">
              Log work, grow skills, compete with peers, and get AI-powered insights — all in one internal lab platform.
            </p>
            <div className="flex gap-6 pt-4">
              {[
                { label: "Members", value: "32+" },
                { label: "Projects", value: "12" },
                { label: "Lab Hours", value: "2.4K" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-bold gradient-text-cyan">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground font-mono">
            © 2025 ASGS Internal Platform · Restricted Access
          </p>
        </div>
      </div>

      {/* Right — forms */}
      <div className="flex-1 lg:max-w-md flex flex-col justify-center px-8 py-12 lg:px-12">
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <img src={asgsHero} alt="ASGS" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-mono text-cyan text-xs tracking-widest">ASGS</p>
            <p className="text-[10px] text-muted-foreground">Internal Platform</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-muted rounded-xl p-1 mb-8">
          <button
            onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === "login"
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LogIn size={14} />
            Sign In
          </button>
          <button
            onClick={() => { setTab("request"); setReqError(""); setReqSuccess(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === "request"
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus size={14} />
            Request Access
          </button>
        </div>

        {/* ── SIGN IN ── */}
        {tab === "login" && (
          <>
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-bold">Sign In</h2>
              <p className="text-muted-foreground text-sm">
                Use your ASGS college email to access the platform.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-muted-foreground">College Email</Label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@atharvacoe.ac.in"
                    className="pl-9 bg-muted border-border focus:border-cyan focus:ring-1 focus:ring-cyan/30 h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="pl-9 pr-10 bg-muted border-border focus:border-cyan focus:ring-1 focus:ring-cyan/30 h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-primary text-background font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-glow-cyan disabled:opacity-60"
              >
                {loading ? (
                  <span className="font-mono text-sm">Authenticating...</span>
                ) : (
                  <>
                    Access Platform
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-8 p-4 bg-muted/50 border border-border rounded-lg space-y-2">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Demo Credentials</p>
              <div className="space-y-1 text-xs text-muted-foreground font-mono">
                <p><span className="text-cyan">Member:</span> rahul.sharma@atharvacoe.ac.in / demo123</p>
                <p><span className="text-amber">Mentor:</span> mentor@atharvacoe.ac.in / mentor123</p>
              </div>
            </div>
          </>
        )}

        {/* ── REQUEST ACCESS ── */}
        {tab === "request" && (
          <>
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-bold">Request Access</h2>
              <p className="text-muted-foreground text-sm">
                Submit your details and wait for mentor approval before you can sign in.
              </p>
            </div>

            {reqSuccess ? (
              <div className="flex flex-col items-center gap-5 text-center py-8">
                <div className="w-16 h-16 rounded-full bg-signal-green/10 border border-signal-green/30 flex items-center justify-center">
                  <CheckCircle size={30} className="text-signal-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Request Submitted!</h3>
                  <p className="text-muted-foreground text-sm">
                    Your request has been sent to the mentor for approval. Once approved, you can sign in with your credentials.
                  </p>
                </div>
                <button
                  onClick={() => { setTab("login"); setReqSuccess(false); setReqName(""); setReqEmail(""); setReqPassword(""); }}
                  className="text-cyan text-sm font-medium hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestAccess} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="req-name" className="text-sm text-muted-foreground">Full Name</Label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="req-name"
                      type="text"
                      value={reqName}
                      onChange={e => setReqName(e.target.value)}
                      placeholder="Your full name"
                      className="pl-9 bg-muted border-border focus:border-cyan focus:ring-1 focus:ring-cyan/30 h-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="req-email" className="text-sm text-muted-foreground">College Email</Label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="req-email"
                      type="email"
                      value={reqEmail}
                      onChange={e => setReqEmail(e.target.value)}
                      placeholder="name@atharvacoe.ac.in"
                      className="pl-9 bg-muted border-border focus:border-cyan focus:ring-1 focus:ring-cyan/30 h-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="req-password" className="text-sm text-muted-foreground">Set Password</Label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="req-password"
                      type={reqShowPassword ? "text" : "password"}
                      value={reqPassword}
                      onChange={e => setReqPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="pl-9 pr-10 bg-muted border-border focus:border-cyan focus:ring-1 focus:ring-cyan/30 h-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setReqShowPassword(!reqShowPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {reqShowPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {reqError && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-sm text-destructive">
                    {reqError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={reqLoading}
                  className="w-full h-11 bg-gradient-primary text-background font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-glow-cyan disabled:opacity-60"
                >
                  {reqLoading ? (
                    <span className="font-mono text-sm">Submitting...</span>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Submit Request
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  Your request will be reviewed by a mentor before you can access the platform.
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
