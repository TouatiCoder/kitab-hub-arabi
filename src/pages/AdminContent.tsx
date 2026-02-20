import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen, Users, FileText, Bell, LogOut, BarChart3, Settings,
  LayoutDashboard, ChevronLeft, Search, Eye, AlertTriangle, Megaphone,
  Check, X,
} from "lucide-react";
import { mockContent, typeColors } from "@/data/mockData";

const adminNavItems = [
  { label: "الصفحة الرئيسية", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "إدارة أعمال الكتاب", icon: FileText, path: "/admin/content" },
  { label: "التبليغات والمخالفات", icon: AlertTriangle, path: "/admin/reports" },
  { label: "كتاب المنصة", icon: Users, path: "/admin/writers" },
  { label: "الاشتراكات", icon: BarChart3, path: "/admin/subscriptions" },
  { label: "الإعلانات", icon: Megaphone, path: "/admin/ads" },
  { label: "التقارير", icon: BarChart3, path: "/admin/analytics" },
  { label: "الإعدادات", icon: Settings, path: "/admin/settings" },
];

export default function AdminContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const location = useLocation();

  const filtered = mockContent.filter(c => !search || c.title.includes(search) || c.author.includes(search));

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
            return (<Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}><item.icon className="w-5 h-5 flex-shrink-0" />{sidebarOpen && <span>{item.label}</span>}</Link>);
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
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><span className="text-primary font-bold text-sm">م</span></div>
            <div><p className="text-sm font-bold text-foreground">مدير المنصة</p></div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/login" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent"><LogOut className="w-4 h-4" /> خروج</Link>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">إدارة أعمال الكتاب</h1>
            <p className="text-muted-foreground text-sm">مراجعة ونشر أو رفض الأعمال المقدمة من الكتّاب.</p>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="ابحث عن عمل أو كاتب..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground">اسم الكاتب</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground">عنوان العمل</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden sm:table-cell">النوع/التصنيف</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden md:table-cell">حالة العمل</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden lg:table-cell">المشاهدات</th>
                    <th className="text-center px-4 py-3.5 font-semibold text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => (
                    <tr key={item.id} className={`border-b border-border last:border-0 hover:bg-accent/40 transition-colors ${idx % 2 !== 0 ? "bg-muted/10" : ""}`}>
                      <td className="px-5 py-3.5 font-medium text-foreground">{item.author}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img src={item.cover} alt="" className="w-8 h-12 object-cover rounded-lg flex-shrink-0" />
                          <span className="font-semibold text-foreground line-clamp-1">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${typeColors[item.type]}`}>{item.type}</span>
                        <span className="text-xs text-muted-foreground mr-1">/ {item.category}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${item.status === "منشور" ? "bg-green-100 text-green-700" : item.status === "قيد المراجعة" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>{item.status}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell text-muted-foreground">{item.views}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-1">
                          <Link to={`/content/${item.id}`} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></Link>
                          {item.status === "قيد المراجعة" && (
                            <>
                              <button className="p-2 rounded-lg hover:bg-green-100 text-green-600" title="نشر"><Check className="w-4 h-4" /></button>
                              <button onClick={() => setRejectId(item.id)} className="p-2 rounded-lg hover:bg-red-100 text-red-500" title="رفض"><X className="w-4 h-4" /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Reject modal */}
      {rejectId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-xl" dir="rtl">
            <h3 className="text-lg font-bold text-foreground mb-2">سبب الرفض</h3>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="اكتب سبب رفض العمل..." rows={4}
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 mb-4 placeholder:text-muted-foreground" />
            <div className="flex gap-3">
              <button onClick={() => { setRejectId(null); setRejectReason(""); }} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent">إلغاء</button>
              <button onClick={() => { setRejectId(null); setRejectReason(""); }} className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90">رفض</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
