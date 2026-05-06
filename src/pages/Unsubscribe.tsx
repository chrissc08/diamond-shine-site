import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type Status = "loading" | "valid" | "already" | "invalid" | "submitting" | "success" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token) { setStatus("invalid"); return; }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } }
        );
        const data = await res.json();
        if (data.valid) setStatus("valid");
        else if (data.reason === "already_unsubscribed") setStatus("already");
        else setStatus("invalid");
      } catch {
        setStatus("error");
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setStatus("submitting");
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    if (error || !data?.success) {
      if (data?.reason === "already_unsubscribed") setStatus("already");
      else setStatus("error");
    } else setStatus("success");
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center bg-card border border-border rounded-2xl p-8">
        <h1 className="font-display text-2xl font-bold mb-3">Unsubscribe</h1>
        {status === "loading" && <p className="text-muted-foreground text-sm">Checking your link…</p>}
        {status === "valid" && (
          <>
            <p className="text-muted-foreground text-sm mb-6">
              Confirm to stop receiving emails from Diamond Touch Detailers.
            </p>
            <button
              onClick={confirm}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display uppercase tracking-wider text-sm hover:opacity-90 active:scale-[0.97] transition"
            >
              Confirm Unsubscribe
            </button>
          </>
        )}
        {status === "submitting" && <p className="text-muted-foreground text-sm">Processing…</p>}
        {status === "success" && (
          <p className="text-foreground text-sm">You've been unsubscribed. We're sorry to see you go.</p>
        )}
        {status === "already" && (
          <p className="text-foreground text-sm">This email is already unsubscribed.</p>
        )}
        {status === "invalid" && (
          <p className="text-destructive text-sm">This unsubscribe link is invalid or expired.</p>
        )}
        {status === "error" && (
          <p className="text-destructive text-sm">Something went wrong. Please try again later.</p>
        )}
      </div>
    </main>
  );
};

export default Unsubscribe;