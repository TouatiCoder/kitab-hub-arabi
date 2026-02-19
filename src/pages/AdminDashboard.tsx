import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen, Users, ShoppingCart, DollarSign, FileText,
  Bell, LogOut, Menu, X, BarChart3, LineChart, PieChart,
  TrendingUp, Settings, LayoutDashboard, ChevronLeft,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { adminStats, recentActivity } from "@/data/mockData";
import {
  LineChart as ReLineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const viewsData = [
  { day: "السبت", views: 4200 },
  { day: "الأحد", views: 6800 },
  { day: "الاثنين", views: 5400 },
  { day: "الثلاثاء", views: 7900 },
  { day: "الأربعاء", views: 6200 },
  { day: "الخميس", views: 8900 },
  { day: "الجمعة", views: 9400 },
];

const categoryData = [
  { name: "رومانسي", value: 35 },
  { name: "خيال علمي", value: 20 },
  { name: "أدب", value: 18 },
  { name: "غموض", value: 14 },
  { name: "أخرى", value: 13 },
];

const topBooksData = [
  { name: "أجنحة الغسق", sales: 1240 },
  { name: "مدينة الظلال", sales: 980 },
  { name: "حكايات البحر", sales: 870 },
  { name: "لعبة الأقدار", sales: 740 },
  { name: "نجوم لا تُحصى", sales: 620 },
];

const PIE_COLORS = ["#7C3AED", "#A855F7", "#C084FC", "#E879F9", "#F0ABFC"];

const navItems = [
  { label: "لوحة التحكم", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "الكتب", icon: BookOpen, path: "/admin/books" },
  { label: "التقارير", icon: BarChart3, path: "/admin/reports" },
  { label: "المستخدمون", icon: Users, path: "/admin/users" },
  { label: "المبيعات", icon: ShoppingCart, path: "/admin/sales" },
  { label: "الإعدادات", icon: Settings, path: "/admin/settings" },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} flex-shrink-0 bg-card border-l border-border flex flex-col transition-all duration-300 fixed right-0 top-0 h-screen z-40`}>
        {/* Logo */}
        <div className={`h-16 flex items-center border-b border-border ${sidebarOpen ? "px-5 gap-3" : "justify-center"}`}>
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-purple flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && <span className="font-extrabold text-primary">مكتبة</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-purple"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl hover:bg-accent text-muted-foreground transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4 rotate-180" />}
            {sidebarOpen && <span className="text-sm">طيّ القائمة</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
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
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Page title */}
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">لوحة التحكم</h1>
            <p className="text-muted-foreground text-sm mt-0.5">مرحباً بك، هذا ملخص نشاط المنصة اليوم.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {adminStats.map(stat => (
              <StatsCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Line Chart */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <LineChart className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-foreground">المشاهدات اليومية</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <ReLineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 4 }} activeDot={{ r: 6 }} />
                </ReLineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-foreground">تصنيفات الكتب</h3>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <RePieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                </RePieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {categoryData.slice(0, 3).map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart + Table Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-foreground">أفضل الكتب مبيعاً</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topBooksData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <h3 className="font-bold text-foreground mb-4">آخر النشاطات</h3>
              <div className="space-y-3">
                {recentActivity.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-xs font-bold">{item.type.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground line-clamp-1">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.user} • {item.date}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${item.amount !== "-" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
