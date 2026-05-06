import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Loader2, Search, X, Phone, Mail, MapPin, Car, Calendar as CalIcon, Clock, FileText } from "lucide-react";

type Status = "confirmed" | "cancelled" | "completed";

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  vehicle_type: string;
  package_id: string;
  package_name: string;
  package_price: string | null;
  package_duration: string | null;
  add_ons: { name: string; price?: string }[];
  booking_date: string;
  time_slot_id: string;
  time_slot_label: string;
  notes: string | null;
  referral: string | null;
  status: Status;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  created_at: string;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"upcoming" | "past" | "cancelled" | "all">("upcoming");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: false });
    if (error) {
      toast({ title: "Failed to load bookings", description: error.message, variant: "destructive" });
    } else {
      setBookings(((data as unknown) as Booking[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const today = new Date().toISOString().split("T")[0];

  const filtered = useMemo(() => {
    let r = bookings;
    if (filter === "upcoming") r = r.filter((b) => b.status === "confirmed" && b.booking_date >= today);
    else if (filter === "past") r = r.filter((b) => b.booking_date < today && b.status !== "cancelled");
    else if (filter === "cancelled") r = r.filter((b) => b.status === "cancelled");
    if (search) {
      const s = search.toLowerCase();
      r = r.filter((b) =>
        b.customer_name.toLowerCase().includes(s) ||
        b.customer_email.toLowerCase().includes(s) ||
        b.customer_phone.includes(s),
      );
    }
    return r;
  }, [bookings, filter, search, today]);

  const stats = useMemo(() => {
    const upcoming = bookings.filter((b) => b.status === "confirmed" && b.booking_date >= today).length;
    const thisWeek = bookings.filter((b) => {
      const d = parseISO(b.booking_date);
      const diff = (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 7 && b.status === "confirmed";
    }).length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    return { upcoming, thisWeek, cancelled, total: bookings.length };
  }, [bookings, today]);

  const cancelBooking = async () => {
    if (!selected) return;
    setCancelling(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          cancellation_reason: cancelReason || null,
          cancelled_at: new Date().toISOString(),
        })
        .eq("id", selected.id);
      if (error) throw error;

      // Send cancellation email
      if (selected.customer_email) {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "booking-cancelled",
            recipientEmail: selected.customer_email,
            idempotencyKey: `booking-cancel-${selected.id}`,
            templateData: {
              customerName: selected.customer_name,
              packageName: selected.package_name,
              date: format(parseISO(selected.booking_date), "EEEE, MMMM d, yyyy"),
              time: selected.time_slot_label,
              reason: cancelReason,
            },
          },
        });
      }
      toast({ title: "Booking cancelled", description: selected.customer_email ? "Customer has been emailed." : "No email on file — contact customer directly." });
      setCancelOpen(false);
      setCancelReason("");
      setSelected(null);
      load();
    } catch (err: any) {
      toast({ title: "Cancel failed", description: err.message, variant: "destructive" });
    } finally {
      setCancelling(false);
    }
  };

  const markCompleted = async (b: Booking) => {
    const { error } = await supabase.from("bookings").update({ status: "completed" }).eq("id", b.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Marked as completed" });
      load();
    }
  };

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage all customer appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Upcoming" value={stats.upcoming} />
        <StatCard label="This Week" value={stats.thisWeek} />
        <StatCard label="Cancelled" value={stats.cancelled} />
        <StatCard label="Total" value={stats.total} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
          {(["upcoming", "past", "cancelled", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-display uppercase tracking-wider transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full pl-10 pr-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm bg-card border border-border rounded-xl">
          No bookings found.
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-border">
              <tr className="text-left text-xs font-display uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="font-medium">{format(parseISO(b.booking_date), "MMM d, yyyy")}</div>
                    <div className="text-xs text-muted-foreground">{b.time_slot_label}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{b.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{b.customer_phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{b.package_name}</div>
                    <div className="text-xs text-muted-foreground">{b.package_price}</div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(b)}
                      className="text-primary text-xs font-display uppercase tracking-wider hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-xl max-w-lg w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-border flex items-start justify-between">
              <div>
                <h2 className="font-display text-xl font-bold">{selected.customer_name}</h2>
                <StatusBadge status={selected.status} />
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <DetailRow icon={CalIcon} label={format(parseISO(selected.booking_date), "EEEE, MMMM d, yyyy")} sub={selected.time_slot_label} />
              <DetailRow icon={Phone} label={selected.customer_phone} />
              {selected.customer_email && <DetailRow icon={Mail} label={selected.customer_email} />}
              <DetailRow icon={MapPin} label={selected.address} />
              <DetailRow icon={Car} label={selected.vehicle_type} />
              <DetailRow icon={Clock} label={selected.package_name} sub={`${selected.package_price || ""} • ${selected.package_duration || ""}`} />
              {selected.add_ons.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Add-Ons</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.add_ons.map((a, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-primary/10 text-xs text-primary">{a.name}</span>
                    ))}
                  </div>
                </div>
              )}
              {selected.notes && <DetailRow icon={FileText} label="Notes" sub={selected.notes} />}
              {selected.referral && <p className="text-xs text-muted-foreground">Referred by: {selected.referral}</p>}
              {selected.cancellation_reason && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <p className="text-xs uppercase text-destructive font-semibold mb-1">Cancellation Reason</p>
                  <p className="text-sm">{selected.cancellation_reason}</p>
                </div>
              )}
            </div>
            {selected.status === "confirmed" && (
              <div className="p-6 border-t border-border flex gap-2">
                <button
                  onClick={() => markCompleted(selected)}
                  className="flex-1 py-2.5 rounded-lg border border-border text-sm font-display uppercase tracking-wider hover:bg-muted/50"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => setCancelOpen(true)}
                  className="flex-1 py-2.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/30 text-sm font-display uppercase tracking-wider hover:bg-destructive/20"
                >
                  Cancel Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancel confirm */}
      {cancelOpen && selected && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => setCancelOpen(false)}>
          <div className="bg-card border border-border rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold mb-2">Cancel this booking?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {selected.customer_email
                ? "The customer will receive a cancellation email automatically."
                : "No email on file — you'll need to contact the customer directly."}
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Optional reason (included in the email)..."
              rows={3}
              className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setCancelOpen(false)}
                className="flex-1 py-2.5 rounded-lg border border-border text-sm font-display uppercase tracking-wider hover:bg-muted/50"
              >
                Keep It
              </button>
              <button
                onClick={cancelBooking}
                disabled={cancelling}
                className="flex-1 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-display uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelling && <Loader2 className="w-4 h-4 animate-spin" />}
                Cancel & Notify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-card border border-border rounded-xl p-4">
    <p className="text-xs uppercase tracking-wider text-muted-foreground font-display">{label}</p>
    <p className="text-2xl font-display font-bold mt-1">{value}</p>
  </div>
);

const StatusBadge = ({ status }: { status: Status }) => {
  const cls =
    status === "confirmed"
      ? "bg-primary/10 text-primary"
      : status === "completed"
      ? "bg-green-500/10 text-green-400"
      : "bg-destructive/10 text-destructive";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-display font-semibold ${cls}`}>
      {status}
    </span>
  );
};

const DetailRow = ({ icon: Icon, label, sub }: { icon: any; label: string; sub?: string }) => (
  <div className="flex items-start gap-3">
    <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
    <div className="min-w-0">
      <p className="font-medium break-words">{label}</p>
      {sub && <p className="text-xs text-muted-foreground break-words">{sub}</p>}
    </div>
  </div>
);

export default AdminBookings;