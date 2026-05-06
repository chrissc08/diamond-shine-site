import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Calendar, Plane, Mail, LogOut } from "lucide-react";

const AdminLayout = () => {
  const { session, isAdmin, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-display transition-colors ${
      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-60 border-r border-border bg-card/30 p-4 flex flex-col gap-1">
        <div className="px-3 py-4 mb-2">
          <p className="font-display text-sm font-bold tracking-tight">Diamond Touch</p>
          <p className="text-xs text-muted-foreground">Admin Dashboard</p>
        </div>
        <NavLink to="/admin" end className={linkClass}>
          <Calendar className="w-4 h-4" /> Bookings
        </NavLink>
        <NavLink to="/admin/vacation" className={linkClass}>
          <Plane className="w-4 h-4" /> Vacation
        </NavLink>
        <NavLink to="/admin/emails" className={linkClass}>
          <Mail className="w-4 h-4" /> Emails
        </NavLink>
        <div className="mt-auto pt-4 border-t border-border">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-display text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;