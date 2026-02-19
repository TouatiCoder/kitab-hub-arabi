import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen, Users, ShoppingCart, BarChart3, Settings,
  LayoutDashboard, ChevronLeft, Bell, LogOut,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, Eye,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const navItems = [
  { label: "لوحة التحكم", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "الكتب", icon: BookOpen, path: "/admin/books" },
  { label: "التقارير", icon: BarChart3, path: "/admin/reports" },
  { label: "المستخدمون", icon: Users, path: "/admin/users" },
  { label: "المبيعات", icon: ShoppingCart, path: "/admin/sales" },
  { label: "الإعدادات", icon: Settings, path: "/admin/settings" },
];

const monthlyData = [
  { month: "يناير", مبيعات: 3200, مستخدمون: 820, قراءات: 14200 },
  { month: "فبراير", مبيعات: 4100, مستخدمون: 950, قراءات: 18900 },
  { month: "مارس", مبيعات: 3800, مستخدمون: 1100, قراءات: 16400 },
  { month: "أبريل", مبيعات: 5200, مستخدمون: 1380, قراءات: 22100 },
  { month: "مايو", مبيعات: 4700, مستخدمون: 1290, قراءات: 20300 },
  { month: "يونيو", مبيعات: 6300, مستخدمون: 1750, قراءات: 28700 },
  { month: "يوليو", مبيعات: 7100, مستخدمون: 2010, قراءات: 33400 },
];

const categoryRevenue = [
  { name: "رومانسي", revenue: 42000 },
  { name: "خيال علمي", revenue: 28000 },
  { name: "أدب", revenue: 19000 },
  { name: "غموض", revenue: 15000 },
  { name: "مغامرة", revenue: 12000 },
  { name: "تطوير ذات", revenue: 9000 },
];

const reportItems = [
  { id: "1", type: "محتوى مخالف", book: "كتاب غير محدد", reporter: "محمد السالم", date: "منذ ساعتين", status: "قيد المراجعة" },
  { id: "2", type: "حقوق نشر", book: "أجنحة الغسق", reporter: "مكتبة النشر", date: "منذ يوم", status: "تمت المعالجة" },
  { id: "3", type: "محتوى مخالف", book: "مدينة الظلال", reporter: "فاطمة الحسين", date: "منذ يومين", status: "قيد المراجعة" },
  { id: "4", type: "خطأ تقني", book: "حكايات البحر", reporter: "النظام", date: "منذ ٣ أيام", status: "تمت المعالجة" },
  { id: "5", type: "محتوى مخالف", book: "لعبة الأقدار", reporter: "ريم العتيبي", date: "منذ أسبوع", status: "مرفوض" },
];

const summaryStats = [
  { label: "إجمالي التقارير", value: "٣٤", icon: BarChart3, trend: "+٢", positive: false },
  { label: "قيد المراجعة", value: "١٢", icon: Clock, trend: "جديد", positive: false },
  { label: "تمت المعالجة", value: "١٨", icon: CheckCircle2, trend: "+٥%", positive: true },
  { label: "إيرادات الشهر", value: "٧١K ر.س", icon: TrendingUp, trend: "+١٨%", positive: true },
];

export default function AdminReports() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeChart, setActiveChart] = useState<"مبيعات" | "مستخدمون" | "قراءات">("مبيعات");
  const location = useLocation();

  const statusStyle = (s: string) => {
    if (s === "تمت المعالجة") return "bg-green-100 text-green-700";
    if (s === "مرفوض") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-700";
  };

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
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">التقارير والإحصاءات</h1>
            <p className="text-muted-foreground text-sm mt-0.5">نظرة شاملة على أداء المنصة والبلاغات المقدمة.</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryStats.map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-xs font-semibold mt-0.5 flex items-center gap-1 ${s.positive ? "text-green-600" : "text-destructive"}`}>
                    {s.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {s.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Line Chart */}
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="font-bold text-foreground">الأداء الشهري</h3>
                <div className="flex gap-1">
                  {(["مبيعات", "مستخدمون", "قراءات"] as const).map((key) => (
                    <button key={key} onClick={() => setActiveChart(key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeChart === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                      {key}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                  <Line type="monotone" dataKey={activeChart} stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-foreground mb-4">إيرادات حسب التصنيف</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoryRevenue} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis dataKey="name" type="category" width={72} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} formatter={(v: number) => [`${v.toLocaleString()} ر.س`, "الإيراد"]} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <h3 className="font-bold text-foreground">البلاغات والمخالفات</h3>
              <span className="mr-auto text-xs bg-yellow-100 text-yellow-700 font-bold px-2.5 py-1 rounded-lg">
                {reportItems.filter(r => r.status === "قيد المراجعة").length} قيد المراجعة
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground">نوع البلاغ</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden sm:table-cell">الكتاب</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden md:table-cell">المُبلِّغ</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden lg:table-cell">التاريخ</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground">الحالة</th>
                    <th className="text-center px-4 py-3.5 font-semibold text-muted-foreground">عرض</th>
                  </tr>
                </thead>
                <tbody>
                  {reportItems.map((r, idx) => (
                    <tr key={r.id} className={`border-b border-border last:border-0 hover:bg-accent/40 transition-colors ${idx % 2 !== 0 ? "bg-muted/10" : ""}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                          <span className="font-medium text-foreground">{r.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell text-muted-foreground">{r.book}</td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-muted-foreground">{r.reporter}</td>
                      <td className="px-4 py-3.5 hidden lg:table-cell text-muted-foreground">{r.date}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${statusStyle(r.status)}`}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
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
