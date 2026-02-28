import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Bell, FileText, Plus, Eye, Clock, Check, X, AlertCircle, Upload, FileUp, Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWriterContents } from "@/hooks/useContents";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const typeColors: Record<string, string> = {
  "مقال": "bg-amber-100 text-amber-700",
  "قصة": "bg-sky-100 text-sky-700",
  "رواية": "bg-rose-100 text-rose-700",
};

const UPLOAD_ENDPOINT = "https://your-host.com/upload.php"; // عدّل هذا الرابط

export default function WriterDashboard() {
  const [tab, setTab] = useState<"works" | "new">("works");
  const [legalChecked, setLegalChecked] = useState(false);
  const [form, setForm] = useState({ title: "", type: "", category: "", tags: "", summary: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { data: works = [], isLoading } = useWriterContents(user?.id);
  const queryClient = useQueryClient();

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const wordCount = form.summary.trim().split(/\s+/).filter(Boolean).length;

  const handlePdfUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("يرجى اختيار ملف PDF فقط");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("حجم الملف يتجاوز 20MB");
      return;
    }
    setPdfFile(file);
    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(UPLOAD_ENDPOINT, { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setPdfUrl(data.url);
        toast.success("تم رفع الملف بنجاح");
      } else {
        throw new Error("لم يتم الحصول على رابط الملف");
      }
    } catch {
      toast.error("فشل رفع الملف، حاول مجدداً");
      setPdfFile(null);
      setPdfUrl(null);
    } finally {
      setUploadingPdf(false);
    }
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.type || !user || !legalChecked) return;

    setLoading(true);
    const { error } = await supabase.from("contents").insert({
      writer_id: user.id,
      title: form.title,
      type: form.type as any,
      category: form.category,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      summary: form.summary,
      body: form.content || null,
      pdf_url: pdfUrl || null,
      status: "قيد المراجعة" as any,
    });

    setLoading(false);
    if (!error) {
      setForm({ title: "", type: "", category: "", tags: "", summary: "", content: "" });
      setPdfFile(null);
      setPdfUrl(null);
      setLegalChecked(false);
      setTab("works");
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      toast.success("تم إرسال العمل للمراجعة");
    } else {
      toast.error("حدث خطأ أثناء الإرسال");
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center"><BookOpen className="w-4 h-4 text-white" /></div>
            <span className="font-extrabold text-lg text-primary">هامش الكتاب</span>
          </Link>
          <div className="ms-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{profile?.full_name || user?.email}</span>
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary px-3 py-2">الرئيسية</Link>
            <button onClick={signOut} className="text-sm text-muted-foreground hover:text-destructive px-3 py-2">خروج</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("works")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "works" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-accent"}`}>
            <FileText className="w-4 h-4" /> أعمالي
          </button>
          <button onClick={() => setTab("new")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "new" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-accent"}`}>
            <Plus className="w-4 h-4" /> عمل جديد
          </button>
        </div>

        {tab === "works" && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground">عنوان العمل</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden sm:table-cell">النوع/التصنيف</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground">حالة العمل</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden md:table-cell">سبب الرفض</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden lg:table-cell">المشاهدات</th>
                    <th className="text-center px-4 py-3.5 font-semibold text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">جارٍ التحميل...</td></tr>
                  ) : works.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">لا توجد أعمال بعد</td></tr>
                  ) : works.map((w: any, idx: number) => (
                    <tr key={w.id} className={`border-b border-border last:border-0 hover:bg-accent/40 ${idx % 2 !== 0 ? "bg-muted/10" : ""}`}>
                      <td className="px-5 py-3.5 font-semibold text-foreground">{w.title}</td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${typeColors[w.type] || ""}`}>{w.type}</span>
                        {w.category && <span className="text-xs text-muted-foreground mr-1">/ {w.category}</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 w-fit ${w.status === "منشور" ? "bg-green-100 text-green-700" : w.status === "قيد المراجعة" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                          {w.status === "منشور" ? <Check className="w-3 h-3" /> : w.status === "قيد المراجعة" ? <Clock className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {w.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-xs text-muted-foreground">{w.rejection_reason || "—"}</td>
                      <td className="px-4 py-3.5 hidden lg:table-cell text-muted-foreground">{w.views}</td>
                      <td className="px-4 py-3.5 text-center">
                        <Link to={`/content/${w.id}`} className="p-2 rounded-lg hover:bg-accent text-muted-foreground inline-block"><Eye className="w-4 h-4" /></Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "new" && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm max-w-2xl">
            <h2 className="text-xl font-extrabold text-foreground mb-4">إضافة عمل جديد</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                <label className="block text-sm font-semibold text-foreground mb-1.5">الوسوم (بحد أقصى ٤)</label>
                <input type="text" placeholder="فصّل الوسوم بفاصلة" value={form.tags} onChange={set("tags")}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground" />
              </div>
              {/* PDF Upload Section */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">رفع ملف PDF (اختياري)</label>
                {!pdfFile ? (
                  <label className="flex flex-col items-center justify-center gap-2 w-full bg-muted border-2 border-dashed border-border rounded-xl px-4 py-6 cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-semibold text-foreground">اضغط لرفع ملف PDF</span>
                      <p className="text-xs text-muted-foreground mt-0.5">الحد الأقصى 20MB</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePdfUpload(file);
                      }}
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 bg-muted border border-border rounded-xl px-4 py-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <FileUp className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{pdfFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    {uploadingPdf ? (
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : pdfUrl ? (
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Check className="w-3 h-3" /> تم الرفع
                      </span>
                    ) : null}
                    <button type="button" onClick={removePdf} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">النبذة ({wordCount}/222 كلمة)</label>
                <textarea placeholder="اكتب نبذة عن العمل..." value={form.summary} onChange={set("summary")} rows={3}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground resize-none" />
                {wordCount > 222 && <p className="text-xs text-destructive mt-1">النبذة تجاوزت الحد الأقصى (222 كلمة)</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">نص العمل {pdfUrl && <span className="text-xs text-muted-foreground font-normal">(اختياري - تم رفع PDF)</span>}</label>
                <textarea placeholder="اكتب محتوى العمل هنا..." value={form.content} onChange={set("content")} rows={8}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground resize-none" />
              </div>
              <div className="flex items-start gap-2.5">
                <button type="button" onClick={() => setLegalChecked(!legalChecked)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${legalChecked ? "bg-primary border-primary" : "border-border bg-background"}`}>
                  {legalChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </button>
                <label className="text-sm text-foreground cursor-pointer" onClick={() => setLegalChecked(!legalChecked)}>
                  أقر بأن هذا العمل من تأليفي الشخصي وأنه لا ينتهك حقوق الملكية الفكرية لأي طرف آخر.
                </label>
              </div>
              <button type="submit" disabled={!legalChecked || loading}
                className="w-full gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl hover:opacity-90 shadow-primary-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />جارٍ الإرسال...</> : "إرسال للمراجعة"}
              </button>
              {!legalChecked && <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3" /> يجب الموافقة على الشروط قبل الإرسال</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
