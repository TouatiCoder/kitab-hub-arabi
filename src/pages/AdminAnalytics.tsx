import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen, Users, FileText, Bell, LogOut, BarChart3, Settings,
  LayoutDashboard, ChevronLeft, AlertTriangle, Megaphone, CreditCard,
  Eye, TrendingUp, Calendar,
} from "lucide-react";
import {
  BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const PIE_COLORS = ["hsl(24,80%,50%)", "hsl(30,85%,60%)", "hsl(35,70%,65%)", "hsl(40,60%,70%)"];

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

function useAnalyticsData() {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

      const [
        { data: allContents },
        { data: recentContents },
        { count: totalViews },
        { count: totalUsers },
        { count: totalWriters },
        { count: activeSubscriptions },
        { count: totalReports },
      ] = await Promise.all([
        supabase.from("contents").select("type, status, views, created_at, writer_id").is("deleted_at", null),
        supabase.from("contents").select("type, created_at").is("deleted_at", null).gte("created_at", thirtyDaysAgo),
        supabase.from("contents").select("*", { count: "exact", head: true }).is("deleted_at", null),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "writer"),
        supabase.from("subscriptions").select("*", { count: "exact", head: true }).gte("expires_at", now.toISOString()),
        supabase.from("reports").select("*", { count: "exact", head: true }),
      ]);

      const contents = allContents || [];
      const recent = recentContents || [];
      const totalViewsSum = contents.reduce((sum, c) => sum + (c.views || 0), 0);

      // Content by type
      const byType = [
        { name: "مقالات", value: contents.filter(c => c.type === "مقال").length },
        { name: "قصص", value: contents.filter(c => c.type === "قصة").length },
        { name: "روايات", value: contents.filter(c => c.type === "رواية").length },
      ];

      // Content by status
      const byStatus = [
        { name: "منشور", value: contents.filter(c => c.status === "منشور").length },
        { name: "قيد المراجعة", value: contents.filter(c => c.status === "قيد المراجعة").length },
        { name: "مسودة", value: contents.filter(c => c.status === "مسودة").length },
        { name: "مرفوض", value: contents.filter(c => c.status === "مرفوض").length },
      ];

      // Daily content creation (last 30 days)
      const dailyMap: Record<string, number> = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 86400000);
        dailyMap[d.toISOString().slice(0, 10)] = 0;
      }
      recent.forEach(c => {
        const day = c.created_at.slice(0, 10);
        if (dailyMap[day] !== undefined) dailyMap[day]++;
      });
      const dailyData = Object.entries(dailyMap).map(([date, count]) => ({
        date: new Date(date).toLocaleDateString("ar", { month: "short", day: "numeric" }),
        count,
      }));

      // Top viewed content
      const topViewed = [...contents]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

      // Top writers by content count
      const writerCounts: Record<string, number> = {};
      contents.forEach(c => { writerCounts[c.writer_id] = (writerCounts[c.writer_id] || 0) + 1; });
      const topWriterIds = Object.entries(writerCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

      let topWriters: { name: string; count: number }[] = [];
      if (topWriterIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", topWriterIds.map(w => w[0]));
        topWriters = topWriterIds.map(([id, count]) => ({
          name: (profiles || []).find((p: any) => p.id === id)?.full_name || "غير معروف",
          count,
        }));
      }

      return {
        totalViewsSum,
        totalUsers: totalUsers || 0,
        totalWriters: totalWriters || 0,
        activeSubscriptions: activeSubscriptions || 0,
        totalReports: totalReports || 0,
        totalContents: contents.length,
        byType,
        byStatus,
        dailyData,
        topViewed,
        topWriters,
      };
    },
  });
}

export default function AdminAnalytics() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  const { data, isLoading } = useAnalyticsData();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

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
              <p className="text-sm font-bold text-foreground">{profile?.full_name || "مدير المنصة"}</p>
              <p className="text-xs text-muted-foreground">مدير النظام</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2.5 rounded-xl hover:bg-accent transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            <button onClick={handleSignOut} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent transition-colors">
              <LogOut className="w-4 h-4" /> تسجيل الخروج
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">التقارير والتحليلات</h1>
            <p className="text-muted-foreground text-sm mt-0.5">إحصائيات شاملة عن أداء المنصة</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : data ? (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: "إجمالي المحتوى", value: data.totalContents, icon: FileText },
                  { label: "المشاهدات", value: data.totalViewsSum, icon: Eye },
                  { label: "المستخدمون", value: data.totalUsers, icon: Users },
                  { label: "الكتّاب", value: data.totalWriters, icon: Users },
                  { label: "اشتراكات نشطة", value: data.activeSubscriptions, icon: CreditCard },
                  { label: "البلاغات", value: data.totalReports, icon: AlertTriangle },
                ].map(stat => (
                  <div key={stat.label} className="bg-card rounded-2xl p-4 border border-border shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <stat.icon className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <p className="text-xl font-extrabold text-foreground">{stat.value.toLocaleString("ar")}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily content chart */}
                <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />المحتوى المضاف (آخر 30 يوم)
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data.dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" name="محتوى" fill="hsl(24,80%,50%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Content by type pie */}
                <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                  <h3 className="font-bold text-foreground mb-4">توزيع المحتوى حسب النوع</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <RePieChart>
                      <Pie data={data.byType} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                        {data.byType.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-2">
                    {data.byType.map((item, i) => (
                      <div key={item.name} className="flex items-center gap-1.5 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-bold text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status + Top writers + Top viewed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* By status */}
                <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                  <h3 className="font-bold text-foreground mb-4">حالة المحتوى</h3>
                  <div className="space-y-3">
                    {data.byStatus.map(s => {
                      const pct = data.totalContents > 0 ? Math.round((s.value / data.totalContents) * 100) : 0;
                      return (
                        <div key={s.name}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{s.name}</span>
                            <span className="font-semibold text-foreground">{s.value} ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top writers */}
                <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                  <h3 className="font-bold text-foreground mb-4">أنشط الكتّاب</h3>
                  {data.topWriters.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">لا يوجد كتّاب بعد</p>
                  ) : (
                    <div className="space-y-3">
                      {data.topWriters.map((w, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{i + 1}</div>
                            <span className="text-sm font-medium text-foreground truncate">{w.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{w.count} محتوى</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Top viewed */}
                <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />الأكثر مشاهدة
                  </h3>
                  {data.topViewed.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">لا يوجد محتوى بعد</p>
                  ) : (
                    <div className="space-y-3">
                      {data.topViewed.map((c: any, i: number) => (
                        <div key={c.id} className="flex items-center justify-between">
                          <span className="text-sm text-foreground truncate flex-1 ml-3">{c.title || "بدون عنوان"}</span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">{(c.views || 0).toLocaleString("ar")} مشاهدة</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}
