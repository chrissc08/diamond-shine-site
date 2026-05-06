import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Plane } from "lucide-react";
import { clearVacationCache } from "@/hooks/useVacationPeriods";

interface Vacation {
  id: string;
  start_date: string;
  end_date: string;
  message: string | null;
  active: boolean;
}

const AdminVacation = () => {
  const [periods, setPeriods] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vacation_periods")
      .select("*")
      .order("start_date", { ascending: true });
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    else setPeriods((data as Vacation[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!start || !end) {
      toast({ title: "Pick start and end dates", variant: "destructive" });
      return;
    }
    if (end < start) {
      toast({ title: "End date must be after start date", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { data: vac, error } = await supabase
        .from("vacation_periods")
        .insert({ start_date: start, end_date: end, message: message || null, active: true })
        .select()
        .single();
      if (error) throw error;

      // Find affected confirmed bookings and cancel + email them
      const { data: affected } = await supabase
        .from("bookings")
        .select("*")
        .eq("status", "confirmed")
        .gte("booking_date", start)
        .lte("booking_date", end);

      if (affected && affected.length > 0) {
        const vacationMessage = message
          ? `We'll be unavailable from ${format(parseISO(start), "MMM d")} to ${format(parseISO(end), "MMM d")}. ${message}`
          : `We'll be unavailable from ${format(parseISO(start), "MMM d")} to ${format(parseISO(end), "MMM d")}.`;

        for (const b of affected) {
          await supabase
            .from("bookings")
            .update({
              status: "cancelled",
              cancellation_reason: `Vacation period: ${start} to ${end}`,
              cancelled_at: new Date().toISOString(),
            })
            .eq("id", b.id);

          if (b.customer_email) {
            await supabase.functions.invoke("send-transactional-email", {
              body: {
                templateName: "booking-cancelled",
                recipientEmail: b.customer_email,
                idempotencyKey: `booking-cancel-vac-${b.id}-${vac.id}`,
                templateData: {
                  customerName: b.customer_name,
                  packageName: b.package_name,
                  date: format(parseISO(b.booking_date), "EEEE, MMMM d, yyyy"),
                  time: b.time_slot_label,
                  vacationMessage,
                },
              },
            });
          }
        }
        toast({ title: "Vacation set", description: `${affected.length} booking(s) cancelled and notified.` });
      } else {
        toast({ title: "Vacation set", description: "No existing bookings affected." });
      }
      clearVacationCache();
      setOpen(false);
      setStart(""); setEnd(""); setMessage("");
      load();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this vacation period? Booking dates will reopen.")) return;
    const { error } = await supabase.from("vacation_periods").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { clearVacationCache(); load(); }
  };

  const toggleActive = async (v: Vacation) => {
    const { error } = await supabase.from("vacation_periods").update({ active: !v.active }).eq("id", v.id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else { clearVacationCache(); load(); }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Vacation Mode</h1>
          <p className="text-muted-foreground text-sm mt-1">Block dates and notify affected customers</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-display font-semibold uppercase tracking-wider hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Vacation
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : periods.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <Plane className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No vacation periods scheduled.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {periods.map((v) => (
            <div key={v.id} className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
              <Plane className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold">
                  {format(parseISO(v.start_date), "MMM d, yyyy")} → {format(parseISO(v.end_date), "MMM d, yyyy")}
                </p>
                {v.message && <p className="text-sm text-muted-foreground mt-1">{v.message}</p>}
                <p className="text-xs text-muted-foreground mt-2">
                  Status: <span className={v.active ? "text-primary" : ""}>{v.active ? "Active (blocking dates)" : "Inactive"}</span>
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => toggleActive(v)} className="text-xs px-3 py-1 rounded border border-border hover:bg-muted/50">
                  {v.active ? "Disable" : "Enable"}
                </button>
                <button onClick={() => remove(v.id)} className="text-xs px-3 py-1 rounded border border-destructive/30 text-destructive hover:bg-destructive/10 flex items-center justify-center gap-1">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-card border border-border rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl font-bold mb-4">Schedule Vacation</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-display">Start Date</label>
                <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-display">End Date</label>
                <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-display">Message (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="e.g. Back on May 16th — booking resumes then."
                  className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">Shown on the site banner and in customer emails.</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setOpen(false)} className="flex-1 py-2.5 rounded-lg border border-border text-sm font-display uppercase tracking-wider hover:bg-muted/50">Cancel</button>
                <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-display uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save & Notify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVacation;