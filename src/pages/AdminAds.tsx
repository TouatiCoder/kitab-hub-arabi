import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  LayoutDashboard, FileText, Users, Flag, CreditCard, Megaphone,
  Plus, Trash2, ToggleLeft, ToggleRight, Pencil, X, AlertCircle
} from "lucide-react";
import { toast } from "sonner";

const SLOT_OPTIONS = [
  { value: "home_top", label: "الرئيسية - أعلى" },
  { value: "home_middle", label: "الرئيسية - وسط" },
  { value: "home_bottom", label: "الرئيسية - أسفل" },
  { value: "listing", label: "صفحات القوائم" },
  { value: "content", label: "صفحة المحتوى" },
];

const adminLinks = [
  { label: "الرئيسية", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "المحتوى", path: "/admin/content", icon: FileText },
  { label: "الكتّاب", path: "/admin/writers", icon: Users },
  { label: "البلاغات", path: "/admin/reports", icon: Flag },
  { label: "الاشتراكات", path: "/admin/subscriptions", icon: CreditCard },
  { label: "الإعلانات", path: "/admin/ads", icon: Megaphone },
];

interface Ad {
  id: string;
  title: string;
  slot: string;
  ad_code: string | null;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
  starts_at: string;
  expires_at: string | null;
  created_at: string;
}

export default function AdminAds() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [form, setForm] = useState({
    title: "", slot: "home_top", ad_code: "", image_url: "", link_url: "",
    is_active: true, starts_at: new Date().toISOString().slice(0, 10), expires_at: ""
  });

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["admin-ads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Ad[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        slot: form.slot,
        ad_code: form.ad_code || null,
        image_url: form.image_url || null,
        link_url: form.link_url || null,
        is_active: form.is_active,
        starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : new Date().toISOString(),
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      };
      if (editingAd) {
        const { error } = await supabase.from("ads").update(payload).eq("id", editingAd.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("ads").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ads"] });
      toast.success(editingAd ? "تم تحديث الإعلان" : "تم إضافة الإعلان");
      resetForm();
    },
    onError: () => toast.error("حدث خطأ"),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("ads").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ads"] });
      toast.success("تم تحديث الحالة");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ads"] });
      toast.success("تم حذف الإعلان");
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingAd(null);
    setForm({ title: "", slot: "home_top", ad_code: "", image_url: "", link_url: "", is_active: true, starts_at: new Date().toISOString().slice(0, 10), expires_at: "" });
  };

  const startEdit = (ad: Ad) => {
    setEditingAd(ad);
    setForm({
      title: ad.title,
      slot: ad.slot,
      ad_code: ad.ad_code || "",
      image_url: ad.image_url || "",
      link_url: ad.link_url || "",
      is_active: ad.is_active,
      starts_at: ad.starts_at ? ad.starts_at.slice(0, 10) : "",
      expires_at: ad.expires_at ? ad.expires_at.slice(0, 10) : "",
    });
    setShowForm(true);
  };

  const slotLabel = (slot: string) => SLOT_OPTIONS.find(s => s.value === slot)?.label || slot;

  const expiringSoon = ads.filter(a => a.expires_at && new Date(a.expires_at) < new Date(Date.now() + 7 * 86400000) && new Date(a.expires_at) > new Date());

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <nav className="bg-card rounded-2xl border border-border p-3 sticky top-20 space-y-1">
            {adminLinks.map(l => (
              <Link key={l.path} to={l.path}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  l.path === "/admin/ads" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}>
                <l.icon className="w-4 h-4" />{l.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">إدارة الإعلانات</h1>
              <p className="text-muted-foreground text-sm mt-1">تحكم في إعلانات المنصة ومواقع عرضها</p>
            </div>
            <button onClick={() => { resetForm(); setShowForm(true); }}
              className="flex items-center gap-2 gradient-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-primary-glow">
              <Plus className="w-4 h-4" />إضافة إعلان
            </button>
          </div>

          {/* Expiring soon warning */}
          {expiringSoon.length > 0 && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 rounded-xl px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{expiringSoon.length} إعلان(ات) ستنتهي خلال أسبوع</span>
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-foreground">{editingAd ? "تعديل إعلان" : "إضافة إعلان جديد"}</h2>
                <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-accent"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">عنوان الإعلان</label>
                  <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="مثال: إعلان الرئيسية" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">الموقع</label>
                  <select value={form.slot} onChange={e => setForm(f => ({ ...f, slot: e.target.value }))}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    {SLOT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">رابط الصورة</label>
                  <input type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="https://..." dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">رابط الإعلان</label>
                  <input type="url" value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="https://..." dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">تاريخ البدء</label>
                  <input type="date" value={form.starts_at} onChange={e => setForm(f => ({ ...f, starts_at: e.target.value }))}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">تاريخ الانتهاء (اختياري)</label>
                  <input type="date" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" dir="ltr" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-1">كود الإعلان (AdSense أو HTML مخصص)</label>
                  <textarea value={form.ad_code} onChange={e => setForm(f => ({ ...f, ad_code: e.target.value }))} rows={3}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono" dir="ltr"
                    placeholder='<ins class="adsbygoogle" ...' />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="rounded" />
                  مفعّل
                </label>
                <button onClick={() => saveMutation.mutate()} disabled={!form.title || saveMutation.isPending}
                  className="gradient-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50 shadow-primary-glow">
                  {saveMutation.isPending ? "جارٍ الحفظ..." : editingAd ? "تحديث" : "إضافة"}
                </button>
              </div>
            </div>
          )}

          {/* Ads list */}
          {isLoading ? (
            <div className="flex justify-center py-16"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : ads.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-semibold">لا توجد إعلانات بعد</p>
              <p className="text-sm mt-1">أضف إعلانك الأول للبدء</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ads.map(ad => (
                <div key={ad.id} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
                  {/* Image preview */}
                  {ad.image_url ? (
                    <img src={ad.image_url} alt={ad.title} className="w-20 h-14 rounded-lg object-cover flex-shrink-0 bg-muted" />
                  ) : (
                    <div className="w-20 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Megaphone className="w-5 h-5 text-muted-foreground/40" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground text-sm truncate">{ad.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ad.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                        {ad.is_active ? "مفعّل" : "معطّل"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{slotLabel(ad.slot)}</span>
                      {ad.expires_at && (
                        <span className={new Date(ad.expires_at) < new Date() ? "text-destructive" : ""}>
                          ينتهي: {new Date(ad.expires_at).toLocaleDateString("ar")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => toggleMutation.mutate({ id: ad.id, is_active: !ad.is_active })}
                      className="p-2 rounded-lg hover:bg-accent transition-colors" title={ad.is_active ? "تعطيل" : "تفعيل"}>
                      {ad.is_active ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                    </button>
                    <button onClick={() => startEdit(ad)} className="p-2 rounded-lg hover:bg-accent transition-colors" title="تعديل">
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button onClick={() => { if (confirm("هل تريد حذف هذا الإعلان؟")) deleteMutation.mutate(ad.id); }}
                      className="p-2 rounded-lg hover:bg-destructive/10 transition-colors" title="حذف">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
