import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen, Users, FileText, LogOut, BarChart3, Settings,
  LayoutDashboard, ChevronLeft, AlertTriangle, Megaphone, Eye,
  X as XIcon, Ban, Trash2, Edit3, XCircle, CreditCard,
} from "lucide-react";
import { useReports } from "@/hooks/useAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const adminNavItems = [
  { label: "الصفحة الرئيسية", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "إدارة أعمال الكتاب", icon: FileText, path: "/admin/content" },
  { label: "التبليغات والمخالفات", icon: AlertTriangle, path: "/admin/reports" },
  { label: "كتاب المنصة", icon: Users, path: "/admin/writers" },
  { label: "الاشتراكات", icon: CreditCard, path: "/admin/subscriptions" },
  { label: "الإعلانات", icon: Megaphone, path: "/admin/ads" },
  { label: "التقارير", icon: BarChart3, path: "/admin/analytics" },
  { label: "الإعدادات", icon: Settings, path: "/admin/settings" },
];

const statusFilters = ["الكل", "جديد", "قيد المراجعة", "تمت معالجته"];

export default function AdminReports() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data: reports = [], isLoading } = useReports();
  const queryClient = useQueryClient();

  const filtered = reports.filter((r: any) => statusFilter === "الكل" || r.status === statusFilter);

  const statusStyle = (s: string) => {
    if (s === "تمت معالجته") return "bg-green-100 text-green-700";
    if (s === "قيد المراجعة") return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-600";
  };

  const handleResolve = async (id: string) => {
    await supabase.from("reports").update({ status: "تمت معالجته" as any }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["reports"] });
    setSelectedReport(null);
  };

  const handleSignOut = async () => { await signOut(); navigate("/admin/login"); };

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} flex-shrink-0 bg-card border-l border-border flex flex-col transition-all duration-300 fixed right-0 top-0 h-screen z-40`}>
        <div className={`h-16 flex items-center border-b border-border ${sidebarOpen ? "px-5 gap-3" : "justify-center"}`}>
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-primary-glow flex-shrink-0"><BookOpen className="w-5 h-5 text-white" /></div>
          {sidebarOpen && <span className="font-extrabold text-primary">الهامش</span>}
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {adminNavItems.map(item => {
            const isActive = location.pathname === item.path;
            return (<Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}><item.icon className="w-5 h-5 flex-shrink-0" />{sidebarOpen && <span>{item.label}</span>}</Link>);
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl hover:bg-accent text-muted-foreground">
            <ChevronLeft className={`w-4 h-4 ${!sidebarOpen ? "rotate-180" : ""}`} />{sidebarOpen && <span className="text-sm">طيّ القائمة</span>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col min-h-screen transition-all ${sidebarOpen ? "mr-64" : "mr-16"}`}>
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <p className="text-sm font-bold text-foreground">التبليغات والمخالفات</p>
          <button onClick={handleSignOut} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent"><LogOut className="w-4 h-4" /> خروج</button>
        </header>

        <main className="flex-1 p-6 space-y-6">
          <div className="flex gap-2">
            {statusFilters.map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${statusFilter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-accent"}`}>{f}</button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground">عنوان العمل</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden sm:table-cell">الكاتب</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden md:table-cell">السبب</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground">الحالة</th>
                    <th className="text-center px-4 py-3.5 font-semibold text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">جارٍ التحميل...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">لا توجد بلاغات</td></tr>
                  ) : filtered.map((r: any, idx: number) => (
                    <tr key={r.id} className={`border-b border-border last:border-0 hover:bg-accent/40 ${idx % 2 !== 0 ? "bg-muted/10" : ""}`}>
                      <td className="px-5 py-3.5 font-medium text-foreground">{r.content_title}</td>
                      <td className="px-4 py-3.5 hidden sm:table-cell text-muted-foreground">{r.author_name}</td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-muted-foreground">{r.reason}</td>
                      <td className="px-4 py-3.5"><span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${statusStyle(r.status)}`}>{r.status}</span></td>
                      <td className="px-4 py-3.5 text-center">
                        <button onClick={() => setSelectedReport(r)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl" dir="rtl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">تفاصيل البلاغ</h3>
              <button onClick={() => setSelectedReport(null)} className="p-1 rounded-lg hover:bg-accent"><XIcon className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="font-semibold text-foreground">العمل:</span> <span className="text-muted-foreground">{selectedReport.content_title}</span></div>
              <div><span className="font-semibold text-foreground">السبب:</span> <span className="text-muted-foreground">{selectedReport.reason}</span></div>
              <div><span className="font-semibold text-foreground">الملاحظة:</span> <span className="text-muted-foreground">{selectedReport.reporter_note || "—"}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-6">
              <button onClick={() => handleResolve(selectedReport.id)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-green-600 text-white text-xs font-medium">تمت المعالجة</button>
              <button onClick={() => setSelectedReport(null)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-muted text-muted-foreground text-xs font-medium"><XCircle className="w-3.5 h-3.5" /> إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
