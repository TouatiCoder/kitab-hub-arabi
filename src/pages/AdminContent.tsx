import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen, Users, FileText, LogOut, BarChart3, Settings,
  LayoutDashboard, ChevronLeft, Search, Eye, AlertTriangle, Megaphone,
  Check, X, Plus, Upload, PenLine, Trash2, CreditCard,
} from "lucide-react";
import { useAllContents } from "@/hooks/useContents";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

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

const typeColors: Record<string, string> = {
  "مقال": "bg-amber-100 text-amber-700",
  "قصة": "bg-sky-100 text-sky-700",
  "رواية": "bg-rose-100 text-rose-700",
};

type PublishMode = "pdf" | "chapters" | null;

interface Chapter {
  id: string;
  title: string;
  content: string;
}

export default function AdminContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showPublish, setShowPublish] = useState(false);
  const [publishMode, setPublishMode] = useState<PublishMode>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const queryClient = useQueryClient();

  const { data: contents = [], isLoading } = useAllContents();

  const [form, setForm] = useState({ title: "", type: "", category: "", tags: "", summary: "" });
  const [chapters, setChapters] = useState<Chapter[]>([{ id: "1", title: "", content: "" }]);
  const [activeChapter, setActiveChapter] = useState(0);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const addChapter = () => {
    setChapters(prev => [...prev, { id: String(prev.length + 1), title: "", content: "" }]);
    setActiveChapter(chapters.length);
  };

  const removeChapter = (idx: number) => {
    if (chapters.length <= 1) return;
    setChapters(prev => prev.filter((_, i) => i !== idx));
    setActiveChapter(Math.max(0, activeChapter - 1));
  };

  const updateChapter = (idx: number, field: "title" | "content", value: string) => {
    setChapters(prev => prev.map((ch, i) => i === idx ? { ...ch, [field]: value } : ch));
  };

  const resetPublish = () => {
    setShowPublish(false); setPublishMode(null);
    setForm({ title: "", type: "", category: "", tags: "", summary: "" });
    setChapters([{ id: "1", title: "", content: "" }]); setActiveChapter(0);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.type || !user) return;

    const { data: content, error } = await supabase.from("contents").insert({
      writer_id: user.id,
      title: form.title,
      type: form.type as any,
      category: form.category,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      summary: form.summary,
      body: publishMode === "chapters" ? null : "",
      status: "منشور" as any,
    }).select().single();

    if (error || !content) return;

    // Insert chapters if chapter mode
    if (publishMode === "chapters" && chapters.length > 0) {
      await supabase.from("chapters").insert(
        chapters.map((ch, i) => ({
          content_id: content.id,
          chapter_number: i + 1,
          title: ch.title,
          body: ch.content,
        }))
      );
    }

    queryClient.invalidateQueries({ queryKey: ["contents"] });
    resetPublish();
  };

  const handleApprove = async (id: string) => {
    await supabase.from("contents").update({ status: "منشور" as any }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["contents"] });
  };

  const handleReject = async () => {
    if (!rejectId) return;
    await supabase.from("contents").update({ status: "مرفوض" as any, rejection_reason: rejectReason }).eq("id", rejectId);
    queryClient.invalidateQueries({ queryKey: ["contents"] });
    setRejectId(null); setRejectReason("");
  };

  const handleSignOut = async () => { await signOut(); navigate("/admin/login"); };

  const filtered = contents.filter((c: any) => !search || c.title?.includes(search) || c.writer_name?.includes(search));

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
            return (<Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${isActive ? "bg-primary text-primary-foreground shadow-primary-glow" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}><item.icon className="w-5 h-5 flex-shrink-0" />{sidebarOpen && <span>{item.label}</span>}</Link>);
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
          <p className="text-sm font-bold text-foreground">إدارة أعمال الكتاب</p>
          <button onClick={handleSignOut} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent"><LogOut className="w-4 h-4" /> خروج</button>
        </header>

        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">إدارة أعمال الكتاب</h1>
              <p className="text-muted-foreground text-sm">مراجعة ونشر أو رفض الأعمال المقدمة من الكتّاب.</p>
            </div>
            <button onClick={() => setShowPublish(true)}
              className="flex items-center gap-2 gradient-primary text-primary-foreground font-bold px-5 py-2.5 rounded-2xl hover:opacity-90 shadow-primary-glow text-sm">
              <Plus className="w-4 h-4" /> نشر عمل جديد
            </button>
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
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden sm:table-cell">النوع</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden md:table-cell">الحالة</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden lg:table-cell">المشاهدات</th>
                    <th className="text-center px-4 py-3.5 font-semibold text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">جارٍ التحميل...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">لا يوجد محتوى</td></tr>
                  ) : filtered.map((item: any, idx: number) => (
                    <tr key={item.id} className={`border-b border-border last:border-0 hover:bg-accent/40 transition-colors ${idx % 2 !== 0 ? "bg-muted/10" : ""}`}>
                      <td className="px-5 py-3.5 font-medium text-foreground">{item.writer_name}</td>
                      <td className="px-4 py-3.5 font-semibold text-foreground line-clamp-1">{item.title}</td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${typeColors[item.type] || ""}`}>{item.type}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${item.status === "منشور" ? "bg-green-100 text-green-700" : item.status === "قيد المراجعة" ? "bg-amber-100 text-amber-700" : item.status === "مرفوض" ? "bg-red-100 text-red-600" : "bg-muted text-muted-foreground"}`}>{item.status}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell text-muted-foreground">{item.views}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-1">
                          <Link to={`/content/${item.id}`} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></Link>
                          {item.status === "قيد المراجعة" && (
                            <>
                              <button onClick={() => handleApprove(item.id)} className="p-2 rounded-lg hover:bg-green-100 text-green-600" title="نشر"><Check className="w-4 h-4" /></button>
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
              <button onClick={handleReject} className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90">رفض</button>
            </div>
          </div>
        </div>
      )}

      {/* Publish modal */}
      {showPublish && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full shadow-xl my-8" dir="rtl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-extrabold text-foreground">نشر عمل جديد</h3>
              <button onClick={resetPublish} className="p-2 rounded-lg hover:bg-accent text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>

            {!publishMode && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">اختر طريقة النشر:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => setPublishMode("pdf")}
                    className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-border bg-muted/30 hover:border-primary hover:bg-primary/5 transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-foreground text-lg">رفع ملف PDF</p>
                      <p className="text-xs text-muted-foreground mt-1">رفع كتاب كامل بصيغة PDF</p>
                    </div>
                  </button>
                  <button onClick={() => setPublishMode("chapters")}
                    className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-border bg-muted/30 hover:border-primary hover:bg-primary/5 transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                      <PenLine className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-foreground text-lg">كتابة يدوية</p>
                      <p className="text-xs text-muted-foreground mt-1">كتابة المحتوى فصل بفصل</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {publishMode && (
              <form className="space-y-4" onSubmit={handlePublish}>
                <button type="button" onClick={() => setPublishMode(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-2">
                  <ChevronLeft className="w-4 h-4 rotate-180" /> رجوع
                </button>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">العنوان</label>
                  <input type="text" placeholder="عنوان العمل" value={form.title} onChange={set("title")}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">نوع العمل</label>
                    <select value={form.type} onChange={set("type")}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      <option value="">اختر</option>
                      <option value="مقال">مقال</option>
                      <option value="قصة">قصة</option>
                      <option value="رواية">رواية</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">التصنيف</label>
                    <input type="text" placeholder="فكري، رومانسي..." value={form.category} onChange={set("category")}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">الوسوم</label>
                  <input type="text" placeholder="فصّل الوسوم بفاصلة" value={form.tags} onChange={set("tags")}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">النبذة</label>
                  <textarea placeholder="اكتب نبذة عن العمل..." value={form.summary} onChange={set("summary")} rows={3}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground resize-none" />
                </div>

                {/* Chapters mode */}
                {publishMode === "chapters" && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 overflow-x-auto scrollbar-hide">
                      {chapters.map((ch, i) => (
                        <button key={ch.id} type="button" onClick={() => setActiveChapter(i)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${activeChapter === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                          فصل {i + 1}
                          {chapters.length > 1 && <button type="button" onClick={e => { e.stopPropagation(); removeChapter(i); }} className="hover:text-destructive"><Trash2 className="w-3 h-3" /></button>}
                        </button>
                      ))}
                      <button type="button" onClick={addChapter} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <input type="text" placeholder={`عنوان الفصل ${activeChapter + 1}`} value={chapters[activeChapter]?.title || ""} onChange={e => updateChapter(activeChapter, "title", e.target.value)}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground mb-3" />
                    <textarea placeholder="محتوى الفصل..." value={chapters[activeChapter]?.content || ""} onChange={e => updateChapter(activeChapter, "content", e.target.value)} rows={8}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground resize-none" />
                  </div>
                )}

                <button type="submit" className="w-full gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl hover:opacity-90 shadow-primary-glow">
                  نشر العمل
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
