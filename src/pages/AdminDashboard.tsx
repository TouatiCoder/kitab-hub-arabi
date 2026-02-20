import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen, Users, FileText, Bell, LogOut, BarChart3, Settings,
  LayoutDashboard, ChevronLeft, Eye, Clock, UserPlus, AlertTriangle,
  Megaphone, Layers,
} from "lucide-react";
import {
  LineChart as ReLineChart, Line, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const viewsData = [
  { day: "السبت", views: 4200 }, { day: "الأحد", views: 6800 },
  { day: "الاثنين", views: 5400 }, { day: "الثلاثاء", views: 7900 },
  { day: "الأربعاء", views: 6200 }, { day: "الخميس", views: 8900 },
  { day: "الجمعة", views: 9400 },
];

const categoryData = [
  { name: "مقالات", value: 40 }, { name: "قصص", value: 30 },
  { name: "روايات", value: 20 }, { name: "أخرى", value: 10 },
];

const PIE_COLORS = ["hsl(24,80%,50%)", "hsl(30,85%,60%)", "hsl(35,70%,65%)", "hsl(40,60%,70%)"];

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

const statsCards = [
  { label: "إجمالي الزيارات", value: "٣٤٥,٢١٠", sub: "يومي: ١٢,٤٣٠", icon: Eye },
  { label: "المقالات", value: "٤٨١", icon: FileText },
  { label: "القصص", value: "٣٢٤", icon: BookOpen },
  { label: "الروايات", value: "١٨٧", icon: BookOpen },
  { label: "المجموع", value: "٩٩٢", icon: Layers },
  { label: "قيد المراجعة", value: "٣٤", icon: Clock },
  { label: "الكتّاب", value: "٢٤٨", icon: Users },
  { label: "طلبات الانضمام", value: "١٢", icon: UserPlus },
  { label: "التبليغات", value: "٨", icon: AlertTriangle },
  { label: "إعلانات قريبة الانتهاء", value: "٥", icon: Bell },
];

import { recentActivity } from "@/data/mockData";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} flex-shrink-0 bg-card border-l border-border flex flex-col transition-all duration-300 fixed right-0 top-0 h-screen z-40`}>
        <div className={`h-16 flex items-center border-b border-border ${sidebarOpen ? "px-5 gap-3" : "justify-center"}`}>
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-primary-glow flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
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
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl hover:bg-accent text-muted-foreground transition-colors">
            <ChevronLeft className={`w-4 h-4 ${!sidebarOpen ? "rotate-180" : ""}`} />
            {sidebarOpen && <span className="text-sm">طيّ القائمة</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "mr-64" : "mr-16"}`}>
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">م</span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">مدير المنصة</p>
              <p className="text-xs text-muted-foreground">مدير النظام</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2.5 rounded-xl hover:bg-accent transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <Link to="/admin/login" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent transition-colors">
              <LogOut className="w-4 h-4" /> تسجيل الخروج
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">لوحة التحكم</h1>
            <p className="text-muted-foreground text-sm mt-0.5">مرحباً بك، هذا ملخص نشاط المنصة اليوم.</p>
          </div>

          {/* 11 Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {statsCards.map(stat => (
              <div key={stat.label} className="bg-card rounded-2xl p-4 border border-border shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-xl font-extrabold text-foreground mt-1">{stat.value}</p>
                    {stat.sub && <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</p>}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-sm">
              <h3 className="font-bold text-foreground mb-4">المشاهدات اليومية</h3>
              <ResponsiveContainer width="100%" height={200}>
                <ReLineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <h3 className="font-bold text-foreground mb-4">توزيع المحتوى</h3>
              <ResponsiveContainer width="100%" height={160}>
                <RePieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {categoryData.map((item, i) => (
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
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${item.status === "منشور" ? "bg-green-100 text-green-700" : item.status === "جديد" ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
