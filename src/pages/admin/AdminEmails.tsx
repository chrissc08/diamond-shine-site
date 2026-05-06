import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";

interface LogRow {
  message_id: string | null;
  template_name: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  created_at: string;
}

const AdminEmails = () => {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("email_send_log")
        .select("message_id, template_name, recipient_email, status, error_message, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      // Dedupe by message_id (keep latest)
      const seen = new Set<string>();
      const deduped: LogRow[] = [];
      for (const r of (data as LogRow[]) || []) {
        const key = r.message_id || `${r.recipient_email}-${r.created_at}`;
        if (!seen.has(key)) {
          seen.add(key);
          deduped.push(r);
        }
      }
      setRows(deduped);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Email Activity</h1>
        <p className="text-muted-foreground text-sm mt-1">Recent emails sent from your site</p>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl text-sm text-muted-foreground">
          No emails sent yet.
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground font-display">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Template</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-muted/20">
                  <td className="px-4 py-3 whitespace-nowrap">{format(parseISO(r.created_at), "MMM d, h:mm a")}</td>
                  <td className="px-4 py-3">{r.template_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.recipient_email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold tracking-wider ${
                      r.status === "sent" ? "bg-green-500/10 text-green-400" :
                      r.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                      "bg-destructive/10 text-destructive"
                    }`}>{r.status}</span>
                    {r.error_message && <p className="text-xs text-destructive mt-1">{r.error_message}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminEmails;