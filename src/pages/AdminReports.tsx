import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen, Users, FileText, Bell, LogOut, BarChart3, Settings,
  LayoutDashboard, ChevronLeft, AlertTriangle, Megaphone, Eye,
  Mail, Trash2, X as XIcon, Ban, Edit3, XCircle,
} from "lucide-react";
import { reportItems } from "@/data/mockData";

const adminNavItems = [
  { label: "الصفحة الرئيسية", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "إدارة أعمال الكتاب", icon: FileText, path: "/admin/content" },
  { label: "التبليغات والمخالفات", icon: AlertTriangle, path: "/admin/reports" },
  { label: "كتاب المنصة", icon: Users, path: "/admin/writers" },
  { label: "الإعلانات", icon: Megaphone, path: "/admin/ads" },
  { label: "التقارير", icon: BarChart3, path: "/admin/analytics" },
  { label: "الإعدادات", icon: Settings, path: "/admin/settings" },
];

const statusFilters = ["الكل", "جديد", "قيد المراجعة", "تمت معالجته"];

export default function AdminReports() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [selectedReport, setSelectedReport] = useState<typeof reportItems[0] | null>(null);
  const location = useLocation();

  const filtered = reportItems.filter(r => statusFilter === "الكل" || r.status === statusFilter);

  const statusStyle = (s: string) => {
    if (s === "تمت معالجته") return "bg-green-100 text-green-700";
    if (s === "قيد المراجعة") return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-600";
  };

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
          <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><span className="text-primary font-bold text-sm">م</span></div><p className="text-sm font-bold text-foreground">مدير المنصة</p></div>
          <Link to="/admin/login" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent"><LogOut className="w-4 h-4" /> خروج</Link>
        </header>

        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">التبليغات والمخالفات</h1>
            <p className="text-muted-foreground text-sm">إدارة البلاغات المقدمة من المستخدمين ومراجعة المحتوى المخالف.</p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statusFilters.filter(f => f !== "الكل").map(s => (
              <div key={s} className="bg-card border border-border rounded-2xl p-4 text-center">
                <p className="text-2xl font-extrabold text-primary">{reportItems.filter(r => r.status === s).length}</p>
                <p className="text-xs text-muted-foreground mt-1">{s}</p>
              </div>
            ))}
            <div className="bg-card border border-border rounded-2xl p-4 text-center">
              <p className="text-2xl font-extrabold text-primary">{reportItems.length}</p>
              <p className="text-xs text-muted-foreground mt-1">إجمالي البلاغات</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {statusFilters.map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${statusFilter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-accent"}`}>{f}</button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground">عنوان العمل</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden sm:table-cell">اسم الكاتب</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden md:table-cell">سبب البلاغ</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground">الحالة</th>
                    <th className="text-center px-4 py-3.5 font-semibold text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, idx) => (
                    <tr key={r.id} className={`border-b border-border last:border-0 hover:bg-accent/40 ${idx % 2 !== 0 ? "bg-muted/10" : ""}`}>
                      <td className="px-5 py-3.5 font-medium text-foreground">{r.title}</td>
                      <td className="px-4 py-3.5 hidden sm:table-cell text-muted-foreground">{r.author}</td>
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

      {/* Report detail modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl" dir="rtl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">تفاصيل البلاغ</h3>
              <button onClick={() => setSelectedReport(null)} className="p-1 rounded-lg hover:bg-accent"><XIcon className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="font-semibold text-foreground">العمل:</span> <span className="text-muted-foreground">{selectedReport.title}</span></div>
              <div><span className="font-semibold text-foreground">الكاتب:</span> <span className="text-muted-foreground">{selectedReport.author}</span></div>
              <div><span className="font-semibold text-foreground">تفسير المبلغ:</span> <span className="text-muted-foreground">{selectedReport.reporterNote}</span></div>
              <div><span className="font-semibold text-foreground">بريد المبلغ:</span> <span className="text-muted-foreground">{selectedReport.reporterEmail}</span></div>
              <div><span className="font-semibold text-foreground">بلاغات أخرى لنفس العمل:</span> <span className="text-muted-foreground">{selectedReport.otherReports}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-6">
              <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-medium"><Ban className="w-3.5 h-3.5" /> إلغاء النشر</button>
              <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-600 text-white text-xs font-medium"><Trash2 className="w-3.5 h-3.5" /> حذف العمل</button>
              <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-medium"><Edit3 className="w-3.5 h-3.5" /> تعديل العمل</button>
              <button onClick={() => setSelectedReport(null)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-muted text-muted-foreground text-xs font-medium"><XCircle className="w-3.5 h-3.5" /> تجاهل</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
