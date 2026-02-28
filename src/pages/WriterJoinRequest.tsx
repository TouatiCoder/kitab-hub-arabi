import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function WriterJoinRequest() {
  const [form, setForm] = useState({ name: "", gender: "", nationality: "", email: "", bio: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.gender || !form.nationality || !form.email || !form.bio) {
      setError("يرجى ملء جميع الحقول."); return;
    }

    if (!user) {
      setError("يرجى تسجيل الدخول أولاً لتقديم طلب الانضمام.");
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.from("writer_requests").insert({
      user_id: user.id,
      full_name: form.name,
      gender: form.gender,
      nationality: form.nationality,
      email: form.email,
      bio: form.bio,
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    // Update profile with additional info
    await supabase.from("profiles").update({
      full_name: form.name,
      gender: form.gender,
      nationality: form.nationality,
    }).eq("id", user.id);

    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      <div className="hidden lg:flex lg:w-1/2 gradient-hero flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-1/2" />
        <div className="relative text-center text-white">
          <div className="w-20 h-20 rounded-3xl gradient-primary border-2 border-white/30 flex items-center justify-center shadow-2xl mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3">انضم ككاتب في الهامش</h2>
          <p className="text-white/75 text-lg max-w-xs mx-auto leading-relaxed">شارك إبداعك مع ملايين القرّاء العرب. تقدّم بطلب الانضمام وسيراجعه فريق المنصة.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-primary-glow"><BookOpen className="w-5 h-5 text-white" /></div>
            <span className="font-extrabold text-xl text-primary">الهامش</span>
          </div>

          {success ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">تم إرسال طلبك!</h2>
              <p className="text-muted-foreground mb-6">سيتم مراجعة طلبك من قبل فريق الإدارة وسيتم إشعارك بالنتيجة عبر البريد الإلكتروني.</p>
              <Link to="/" className="inline-block gradient-primary text-white font-bold px-8 py-3 rounded-2xl hover:opacity-90 shadow-primary-glow">العودة للرئيسية</Link>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold text-foreground mb-1">طلب انضمام ككاتب</h1>
              <p className="text-muted-foreground mb-6">أكمل النموذج التالي وسيتم مراجعته من فريق الإدارة</p>

              {!user && (
                <div className="flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-700 rounded-xl px-4 py-3 mb-5 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>يرجى <Link to="/login" className="font-bold underline">تسجيل الدخول</Link> أولاً لتقديم طلب الانضمام.</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 mb-5 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">الاسم الكامل</label>
                  <input type="text" placeholder="محمد أحمد" value={form.name} onChange={set("name")}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">الجنس</label>
                    <select value={form.gender} onChange={set("gender")}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      <option value="">اختر</option>
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">الجنسية</label>
                    <input type="text" placeholder="سعودي" value={form.nationality} onChange={set("nationality")}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">البريد الإلكتروني</label>
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">نبذة عنك</label>
                  <textarea placeholder="اكتب نبذة قصيرة عن نفسك وتجربتك في الكتابة..." value={form.bio} onChange={set("bio")} rows={4}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground resize-none" />
                </div>
                <button type="submit" disabled={loading || !user}
                  className="w-full gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl hover:opacity-90 shadow-primary-glow mt-2 disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />جارٍ الإرسال...</> : "إرسال طلب الانضمام"}
                </button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                لديك حساب كاتب؟{" "}
                <Link to="/login" className="text-primary font-bold hover:underline">تسجيل الدخول</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
