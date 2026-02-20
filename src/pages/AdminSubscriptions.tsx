import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen, Users, FileText, LogOut, BarChart3, Settings,
  LayoutDashboard, ChevronLeft, Search, AlertTriangle, Megaphone,
  CreditCard, Crown, TrendingUp, UserCheck, UserX, Eye,
} from "lucide-react";

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

const mockSubscribers = [
  { id: "1", name: "أحمد محمد", email: "ahmed@example.com", plan: "شهري", startDate: "2025-01-15", endDate: "2025-02-15", status: "نشط", amount: "10$" },
  { id: "2", name: "سارة علي", email: "sara@example.com", plan: "شهري", startDate: "2025-01-20", endDate: "2025-02-20", status: "نشط", amount: "10$" },
  { id: "3", name: "خالد يوسف", email: "khaled@example.com", plan: "شهري", startDate: "2024-12-10", endDate: "2025-01-10", status: "منتهي", amount: "10$" },
  { id: "4", name: "فاطمة حسن", email: "fatima@example.com", plan: "شهري", startDate: "2025-02-01", endDate: "2025-03-01", status: "نشط", amount: "10$" },
  { id: "5", name: "عمر عبدالله", email: "omar@example.com", plan: "شهري", startDate: "2024-11-05", endDate: "2024-12-05", status: "ملغي", amount: "10$" },
  { id: "6", name: "نورة سعد", email: "noura@example.com", plan: "شهري", startDate: "2025-02-10", endDate: "2025-03-10", status: "نشط", amount: "10$" },
];

const stats = [
  { label: "إجمالي المشتركين", value: "١,٢٤٣", icon: Crown, color: "bg-amber-500/10 text-amber-600" },
  { label: "مشتركين نشطين", value: "٩٨٧", icon: UserCheck, color: "bg-green-500/10 text-green-600" },
  { label: "اشتراكات منتهية", value: "٢٥٦", icon: UserX, color: "bg-red-500/10 text-red-600" },
  { label: "الإيرادات الشهرية", value: "٩,٨٧٠$", icon: TrendingUp, color: "bg-primary/10 text-primary" },
];

export default function AdminSubscriptions() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("الكل");
  const location = useLocation();

  const filtered = mockSubscribers.filter(s => {
    const matchSearch = !search || s.name.includes(search) || s.email.includes(search);
    const matchStatus = filterStatus === "الكل" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

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
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${isActive ? "bg-primary text-primary-foreground shadow-primary-glow" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
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
            <h1 className="text-2xl font-extrabold text-foreground">إدارة الاشتراكات</h1>
            <p className="text-muted-foreground text-sm">إدارة ومتابعة اشتراكات المستخدمين في المحتوى الحصري.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(stat => (
              <div key={stat.label} className="bg-card rounded-2xl p-4 border border-border shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-xl font-extrabold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="ابحث عن مشترك..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="flex gap-1.5">
              {["الكل", "نشط", "منتهي", "ملغي"].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${filterStatus === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-accent"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground">المشترك</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden sm:table-cell">البريد</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden md:table-cell">نوع الاشتراك</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden md:table-cell">تاريخ البدء</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden lg:table-cell">تاريخ الانتهاء</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground">المبلغ</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground">الحالة</th>
                    <th className="text-center px-4 py-3.5 font-semibold text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((sub, idx) => (
                    <tr key={sub.id} className={`border-b border-border last:border-0 hover:bg-accent/40 transition-colors ${idx % 2 !== 0 ? "bg-muted/10" : ""}`}>
                      <td className="px-5 py-3.5 font-medium text-foreground">{sub.name}</td>
                      <td className="px-4 py-3.5 text-muted-foreground hidden sm:table-cell">{sub.email}</td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary/10 text-primary">{sub.plan}</span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground hidden md:table-cell">{sub.startDate}</td>
                      <td className="px-4 py-3.5 text-muted-foreground hidden lg:table-cell">{sub.endDate}</td>
                      <td className="px-4 py-3.5 font-semibold text-foreground">{sub.amount}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${sub.status === "نشط" ? "bg-green-100 text-green-700" : sub.status === "منتهي" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center">
                          <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></button>
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
    </div>
  );
}
