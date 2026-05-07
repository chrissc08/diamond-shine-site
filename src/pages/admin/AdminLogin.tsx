import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Lock, Loader2 } from "lucide-react";

const AdminLogin = () => {
  const { session, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [submitting, setSubmitting] = useState(false);
  const [needsClaim, setNeedsClaim] = useState(false);

  // Check if any admins exist already
  useEffect(() => {
    (async () => {
      const { data: adminExists } = await supabase.rpc("admin_exists");
      // If no admin yet, allow signup
      if (!adminExists) {
        setMode("signup");
        setNeedsClaim(true);
      } else {
        setMode("signin");
        setNeedsClaim(false);
      }
    })();
  }, []);

  if (!loading && session && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const claimAdmin = async (userId: string) => {
    const { data, error } = await supabase.rpc("claim_first_admin");
    if (error || !data) throw new Error("Admin setup is already complete. Please sign in instead.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (data.user) {
          await claimAdmin(data.user.id);
        }
        toast({ title: "Account created", description: "You're now signed in as admin." });
        navigate("/admin");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Verify admin
        const { data: isAllowed, error: roleError } = await supabase.rpc("has_role", {
          _user_id: data.user.id,
          _role: "admin",
        });
        if (roleError || !isAllowed) {
          await supabase.auth.signOut();
          throw new Error("This account does not have admin access.");
        }
        navigate("/admin");
      }
    } catch (err: any) {
      toast({
        title: "Sign-in failed",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {needsClaim ? "Create Admin Account" : "Admin Login"}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {needsClaim
              ? "First-time setup — this account will become the admin."
              : "Diamond Touch Detailers"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-xl p-6">
          <div>
            <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-display font-semibold uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "signup" ? "Create Admin Account" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;