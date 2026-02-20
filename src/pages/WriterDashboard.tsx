import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Bell, FileText, Plus, Eye, Clock, Check, X, AlertCircle,
} from "lucide-react";
import { mockContent, typeColors } from "@/data/mockData";

const writerWorks = mockContent.slice(0, 5);

export default function WriterDashboard() {
  const [tab, setTab] = useState<"works" | "new">("works");
  const [legalChecked, setLegalChecked] = useState(false);
  const [form, setForm] = useState({ title: "", type: "", category: "", tags: "", summary: "", content: "" });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const wordCount = form.summary.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Writer Navbar */}
      <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center"><BookOpen className="w-4 h-4 text-white" /></div>
            <span className="font-extrabold text-lg text-primary">هامش الكتاب</span>
          </Link>
          <div className="ms-auto flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-accent"><Bell className="w-5 h-5 text-muted-foreground" /><span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" /></button>
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary px-3 py-2">الرئيسية</Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
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
                  {writerWorks.map((w, idx) => (
                    <tr key={w.id} className={`border-b border-border last:border-0 hover:bg-accent/40 ${idx % 2 !== 0 ? "bg-muted/10" : ""}`}>
                      <td className="px-5 py-3.5 font-semibold text-foreground">{w.title}</td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${typeColors[w.type]}`}>{w.type}</span>
                        <span className="text-xs text-muted-foreground mr-1">/ {w.category}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 w-fit ${w.status === "منشور" ? "bg-green-100 text-green-700" : w.status === "قيد المراجعة" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                          {w.status === "منشور" ? <Check className="w-3 h-3" /> : w.status === "قيد المراجعة" ? <Clock className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {w.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-xs text-muted-foreground">{w.status === "مرفوض" ? "مخالفة للسياسات" : "—"}</td>
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
            <form className="space-y-4">
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
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">النبذة ({wordCount}/222 كلمة)</label>
                <textarea placeholder="اكتب نبذة عن العمل..." value={form.summary} onChange={set("summary")} rows={3}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground resize-none" />
                {wordCount > 222 && <p className="text-xs text-destructive mt-1">النبذة تجاوزت الحد الأقصى (222 كلمة)</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">نص العمل</label>
                <textarea placeholder="اكتب محتوى العمل هنا..." value={form.content} onChange={set("content")} rows={8}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">صورة الغلاف</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center text-muted-foreground text-sm hover:border-primary/50 transition-colors cursor-pointer">
                  اضغط لتحميل الصورة أو اسحبها هنا
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <button type="button" onClick={() => setLegalChecked(!legalChecked)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${legalChecked ? "bg-primary border-primary" : "border-border bg-background"}`}>
                  {legalChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </button>
                <label className="text-sm text-foreground cursor-pointer" onClick={() => setLegalChecked(!legalChecked)}>
                  أقر بأن هذا العمل من تأليفي الشخصي وأنه لا ينتهك حقوق الملكية الفكرية لأي طرف آخر، وأوافق على <a href="#" className="text-primary hover:underline">شروط النشر</a>.
                </label>
              </div>
              <button type="submit" disabled={!legalChecked}
                className="w-full gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl hover:opacity-90 shadow-primary-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                إرسال للمراجعة
              </button>
              {!legalChecked && <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3" /> يجب الموافقة على الشروط قبل الإرسال</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
