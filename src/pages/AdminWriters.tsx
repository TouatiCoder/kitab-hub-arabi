import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen, Users, FileText, LogOut, BarChart3, Settings,
  LayoutDashboard, ChevronLeft, AlertTriangle, Megaphone,
  Search, Check, X, Trash2, ShieldOff, ShieldCheck,
} from "lucide-react";
import { mockWriters, joinRequests } from "@/data/mockData";

const adminNavItems = [
  { label: "الصفحة الرئيسية", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "إدارة أعمال الكتاب", icon: FileText, path: "/admin/content" },
  { label: "التبليغات والمخالفات", icon: AlertTriangle, path: "/admin/reports" },
  { label: "كتاب المنصة", icon: Users, path: "/admin/writers" },
  { label: "الإعلانات", icon: Megaphone, path: "/admin/ads" },
  { label: "التقارير", icon: BarChart3, path: "/admin/analytics" },
  { label: "الإعدادات", icon: Settings, path: "/admin/settings" },
];

export default function AdminWriters() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tab, setTab] = useState<"requests" | "writers">("writers");
  const [search, setSearch] = useState("");
  const location = useLocation();

  const filteredWriters = mockWriters.filter(w => !search || w.name.includes(search) || w.email.includes(search));

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
          <p className="text-sm font-bold text-foreground">كتاب المنصة</p>
          <Link to="/admin/login" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent"><LogOut className="w-4 h-4" /> خروج</Link>
        </header>

        <main className="flex-1 p-6 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2">
            <button onClick={() => setTab("writers")} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "writers" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-accent"}`}>
              إدارة الحسابات
            </button>
            <button onClick={() => setTab("requests")} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${tab === "requests" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-accent"}`}>
              طلبات الانضمام
              {joinRequests.length > 0 && <span className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">{joinRequests.length}</span>}
            </button>
          </div>

          {tab === "requests" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">يتم حذف الطلبات تلقائياً بعد ٩٠ يوماً</p>
              {joinRequests.map(req => (
                <div key={req.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-foreground">{req.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{req.gender} • {req.nationality} • {req.email}</p>
                      <p className="text-sm text-muted-foreground mt-2">{req.bio}</p>
                      <p className="text-xs text-muted-foreground mt-1">{req.date}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button className="p-2.5 rounded-xl bg-green-100 text-green-600 hover:bg-green-200"><Check className="w-4 h-4" /></button>
                      <button className="p-2.5 rounded-xl bg-red-100 text-red-500 hover:bg-red-200"><X className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "writers" && (
            <>
              <div className="relative max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="ابحث بالاسم أو البريد..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>

              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground">الاسم الكامل</th>
                        <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden sm:table-cell">الجنسية</th>
                        <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden md:table-cell">البريد</th>
                        <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden lg:table-cell">مقالات</th>
                        <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden lg:table-cell">قصص</th>
                        <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden lg:table-cell">روايات</th>
                        <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden md:table-cell">الإجمالي</th>
                        <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground">الحالة</th>
                        <th className="text-center px-4 py-3.5 font-semibold text-muted-foreground">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWriters.map((w, idx) => (
                        <tr key={w.id} className={`border-b border-border last:border-0 hover:bg-accent/40 ${idx % 2 !== 0 ? "bg-muted/10" : ""}`}>
                          <td className="px-5 py-3.5 font-semibold text-foreground">{w.name}</td>
                          <td className="px-4 py-3.5 hidden sm:table-cell text-muted-foreground">{w.nationality}</td>
                          <td className="px-4 py-3.5 hidden md:table-cell text-muted-foreground text-xs">{w.email}</td>
                          <td className="px-4 py-3.5 hidden lg:table-cell text-foreground">{w.articles}</td>
                          <td className="px-4 py-3.5 hidden lg:table-cell text-foreground">{w.stories}</td>
                          <td className="px-4 py-3.5 hidden lg:table-cell text-foreground">{w.novels}</td>
                          <td className="px-4 py-3.5 hidden md:table-cell font-bold text-foreground">{w.total}</td>
                          <td className="px-4 py-3.5">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${w.status === "نشط" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{w.status}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center justify-center gap-1">
                              <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground" title={w.status === "نشط" ? "إيقاف" : "تفعيل"}>
                                {w.status === "نشط" ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                              </button>
                              <button className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
