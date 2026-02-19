import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen, Users, ShoppingCart, BarChart3, Settings,
  LayoutDashboard, ChevronLeft, Bell, LogOut,
  Search, UserPlus, Trash2, Pencil, ShieldCheck, ShieldOff,
} from "lucide-react";

const navItems = [
  { label: "لوحة التحكم", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "الكتب", icon: BookOpen, path: "/admin/books" },
  { label: "التقارير", icon: BarChart3, path: "/admin/reports" },
  { label: "المستخدمون", icon: Users, path: "/admin/users" },
  { label: "المبيعات", icon: ShoppingCart, path: "/admin/sales" },
  { label: "الإعدادات", icon: Settings, path: "/admin/settings" },
];

const mockUsers = [
  { id: "1", name: "سارة المحمدي", email: "sara@example.com", joinDate: "١ يناير ٢٠٢٤", books: 12, status: "نشط", role: "مستخدم" },
  { id: "2", name: "أحمد الفيصل", email: "ahmed@example.com", joinDate: "١٥ فبراير ٢٠٢٤", books: 8, status: "نشط", role: "كاتب" },
  { id: "3", name: "نورا الزهراني", email: "noura@example.com", joinDate: "٣ مارس ٢٠٢٤", books: 24, status: "نشط", role: "كاتب" },
  { id: "4", name: "خالد المنصور", email: "khaled@example.com", joinDate: "١٠ أبريل ٢٠٢٤", books: 5, status: "موقوف", role: "مستخدم" },
  { id: "5", name: "ريم العتيبي", email: "reem@example.com", joinDate: "٢٢ أبريل ٢٠٢٤", books: 17, status: "نشط", role: "كاتب" },
  { id: "6", name: "محمد السالم", email: "mohammed@example.com", joinDate: "٥ مايو ٢٠٢٤", books: 3, status: "نشط", role: "مستخدم" },
  { id: "7", name: "ليلى الأحمدي", email: "layla@example.com", joinDate: "١٩ مايو ٢٠٢٤", books: 31, status: "نشط", role: "كاتب" },
  { id: "8", name: "عبد الله القحطاني", email: "abdullah@example.com", joinDate: "٢ يونيو ٢٠٢٤", books: 9, status: "موقوف", role: "مستخدم" },
  { id: "9", name: "فاطمة الحسين", email: "fatma@example.com", joinDate: "١٤ يونيو ٢٠٢٤", books: 0, status: "نشط", role: "مستخدم" },
  { id: "10", name: "عمر الشريف", email: "omar@example.com", joinDate: "٢٨ يونيو ٢٠٢٤", books: 6, status: "نشط", role: "مستخدم" },
];

const statusFilters = ["الكل", "نشط", "موقوف"];
const roleFilters = ["الكل", "مستخدم", "كاتب"];

export default function AdminUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [roleFilter, setRoleFilter] = useState("الكل");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const location = useLocation();

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.includes(search) || u.email.includes(search);
    const matchStatus = statusFilter === "الكل" || u.status === statusFilter;
    const matchRole = roleFilter === "الكل" || u.role === roleFilter;
    return matchSearch && matchStatus && matchRole;
  });

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} flex-shrink-0 bg-card border-l border-border flex flex-col transition-all duration-300 fixed right-0 top-0 h-screen z-40`}>
        <div className={`h-16 flex items-center border-b border-border ${sidebarOpen ? "px-5 gap-3" : "justify-center"}`}>
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-purple flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && <span className="font-extrabold text-primary">مكتبة</span>}
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${isActive ? "bg-primary text-primary-foreground shadow-purple" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl hover:bg-accent text-muted-foreground transition-colors">
            <ChevronLeft className={`w-4 h-4 ${!sidebarOpen ? "rotate-180" : ""}`} />
            {sidebarOpen && <span className="text-sm">طيّ القائمة</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "mr-64" : "mr-16"}`}>
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">أ</span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">أحمد المدير</p>
              <p className="text-xs text-muted-foreground">مدير النظام</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2.5 rounded-xl hover:bg-accent transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <Link to="/admin/login" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent transition-colors">
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">إدارة المستخدمين</h1>
              <p className="text-muted-foreground text-sm mt-0.5">عرض وإدارة جميع حسابات المستخدمين.</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold shadow-purple hover:opacity-90 transition-opacity">
              <UserPlus className="w-4 h-4" />
              إضافة مستخدم
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "إجمالي المستخدمين", value: mockUsers.length },
              { label: "نشطون", value: mockUsers.filter(u => u.status === "نشط").length },
              { label: "موقوفون", value: mockUsers.filter(u => u.status === "موقوف").length },
              { label: "كُتّاب", value: mockUsers.filter(u => u.role === "كاتب").length },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
                <p className="text-2xl font-extrabold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="ابحث بالاسم أو البريد..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {statusFilters.map(f => (
                <button key={f} onClick={() => setStatusFilter(f)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${statusFilter === f ? "bg-primary text-primary-foreground shadow-purple" : "bg-card border border-border text-muted-foreground hover:bg-accent"}`}>
                  {f}
                </button>
              ))}
              {roleFilters.map(f => (
                <button key={f} onClick={() => setRoleFilter(f)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${roleFilter === f ? "bg-primary text-primary-foreground shadow-purple" : "bg-card border border-border text-muted-foreground hover:bg-accent"}`}>
                  {f}
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
                    <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground">المستخدم</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden sm:table-cell">الدور</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden md:table-cell">تاريخ الانضمام</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden lg:table-cell">الكتب</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground">الحالة</th>
                    <th className="text-center px-4 py-3.5 font-semibold text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-muted-foreground">لا توجد نتائج</td>
                    </tr>
                  ) : filtered.map((user, idx) => (
                    <tr key={user.id} className={`border-b border-border last:border-0 hover:bg-accent/40 transition-colors ${idx % 2 !== 0 ? "bg-muted/10" : ""}`}>
                      {/* User */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 shadow-purple">
                            <span className="text-white text-sm font-bold">{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Role */}
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${user.role === "كاتب" ? "bg-purple-100 text-purple-700" : "bg-muted text-muted-foreground"}`}>
                          {user.role}
                        </span>
                      </td>
                      {/* Join Date */}
                      <td className="px-4 py-3.5 hidden md:table-cell text-muted-foreground">{user.joinDate}</td>
                      {/* Books */}
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="font-semibold text-foreground">{user.books}</span>
                        <span className="text-muted-foreground text-xs"> كتاب</span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${user.status === "نشط" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {user.status}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors" title="تعديل">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title={user.status === "نشط" ? "إيقاف" : "تفعيل"}>
                            {user.status === "نشط" ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                          </button>
                          <button onClick={() => setDeleteId(user.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="حذف">
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Delete Dialog */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-xl" dir="rtl">
            <h3 className="text-lg font-bold text-foreground mb-2">تأكيد الحذف</h3>
            <p className="text-muted-foreground text-sm mb-6">هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors">إلغاء</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity">حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
