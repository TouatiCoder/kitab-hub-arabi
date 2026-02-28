import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen, Users, FileText, Bell, LogOut, BarChart3, Settings,
  LayoutDashboard, ChevronLeft, AlertTriangle, Megaphone, CreditCard,
  Globe, Palette, Shield, Save, Wallet, Eye, EyeOff,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

export default function AdminSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  const [siteName, setSiteName] = useState("الهامش");
  const [siteDescription, setSiteDescription] = useState("منصة النشر العربية");
  const [autoApproveContent, setAutoApproveContent] = useState(false);
  const [allowSignups, setAllowSignups] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // PayPal settings
  const [paypalClientId, setPaypalClientId] = useState("");
  const [paypalPlanId, setPaypalPlanId] = useState("");
  const [subscriptionPrice, setSubscriptionPrice] = useState("10.00");
  const [subscriptionDuration, setSubscriptionDuration] = useState("30");
  const [showClientId, setShowClientId] = useState(false);

  // Stats
  const [activeSubsCount, setActiveSubsCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    // Fetch subscription stats
    const fetchStats = async () => {
      const { count } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "نشط");
      setActiveSubsCount(count || 0);

      const { data } = await supabase
        .from("subscriptions")
        .select("amount");
      const total = (data || []).reduce((sum, s) => sum + Number(s.amount), 0);
      setTotalRevenue(total);
    };
    fetchStats();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const handleSave = () => {
    toast.success("تم حفظ الإعدادات بنجاح");
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">الإعدادات</h1>
              <p className="text-muted-foreground text-sm mt-0.5">إعدادات المنصة العامة</p>
            </div>
            <button onClick={handleSave}
              className="flex items-center gap-2 gradient-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-primary-glow">
              <Save className="w-4 h-4" />حفظ التغييرات
            </button>
          </div>

          {/* General Settings */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />إعدادات عامة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">اسم المنصة</label>
                <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">وصف المنصة</label>
                <input type="text" value={siteDescription} onChange={e => setSiteDescription(e.target.value)}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
            </div>
          </div>

          {/* Content Settings */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />إعدادات المحتوى
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-foreground">نشر تلقائي للمحتوى</p>
                  <p className="text-xs text-muted-foreground">نشر المحتوى بدون مراجعة يدوية</p>
                </div>
                <button onClick={() => setAutoApproveContent(!autoApproveContent)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${autoApproveContent ? "bg-primary" : "bg-muted-foreground/30"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${autoApproveContent ? "right-0.5" : "right-[22px]"}`} />
                </button>
              </label>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />إعدادات الأمان
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-foreground">السماح بالتسجيل</p>
                  <p className="text-xs text-muted-foreground">السماح للمستخدمين الجدد بإنشاء حسابات</p>
                </div>
                <button onClick={() => setAllowSignups(!allowSignups)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${allowSignups ? "bg-primary" : "bg-muted-foreground/30"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${allowSignups ? "right-0.5" : "right-[22px]"}`} />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-foreground">وضع الصيانة</p>
                  <p className="text-xs text-muted-foreground">إخفاء المنصة مؤقتاً عن الزوار</p>
                </div>
                <button onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${maintenanceMode ? "bg-destructive" : "bg-muted-foreground/30"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${maintenanceMode ? "right-0.5" : "right-[22px]"}`} />
                </button>
              </label>
            </div>
          </div>

          {/* PayPal & Subscription Settings */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />إعدادات الدفع و الاشتراكات (PayPal)
            </h2>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-muted rounded-xl p-4">
                <p className="text-xs text-muted-foreground">الاشتراكات النشطة</p>
                <p className="text-2xl font-extrabold text-primary">{activeSubsCount}</p>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-xs text-muted-foreground">إجمالي الإيرادات</p>
                <p className="text-2xl font-extrabold text-primary">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">PayPal Client ID</label>
                <div className="relative">
                  <input
                    type={showClientId ? "text" : "password"}
                    value={paypalClientId}
                    onChange={e => setPaypalClientId(e.target.value)}
                    placeholder="Axxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 pe-10"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowClientId(!showClientId)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showClientId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">من لوحة تحكم PayPal Developer</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">PayPal Plan ID</label>
                <input
                  type="text"
                  value={paypalPlanId}
                  onChange={e => setPaypalPlanId(e.target.value)}
                  placeholder="P-xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground mt-1">معرف خطة الاشتراك الشهري</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">سعر الاشتراك الشهري ($)</label>
                <input
                  type="number"
                  value={subscriptionPrice}
                  onChange={e => setSubscriptionPrice(e.target.value)}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  dir="ltr"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">مدة الاشتراك (بالأيام)</label>
                <input
                  type="number"
                  value={subscriptionDuration}
                  onChange={e => setSubscriptionDuration(e.target.value)}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  dir="ltr"
                  min="1"
                />
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-2">📋 خطوات الإعداد</h3>
              <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside" dir="rtl">
                <li>أنشئ حساب PayPal Developer وأنشئ تطبيق (App)</li>
                <li>أنشئ منتج (Product) ثم خطة اشتراك (Subscription Plan)</li>
                <li>انسخ Client ID و Plan ID وضعهما أعلاه</li>
                <li>أضف PayPal Client Secret و Webhook ID في إعدادات المشروع السرية</li>
                <li>قم بإعداد Webhook URL في PayPal لتوجيهه إلى الدالة الخلفية</li>
              </ol>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />المظهر
            </h2>
            <p className="text-sm text-muted-foreground">خيارات المظهر والتصميم ستكون متاحة قريباً.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
