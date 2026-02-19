import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const passwordStrength = () => {
    const p = form.password;
    if (p.length === 0) return null;
    if (p.length < 6) return { level: 1, label: "ضعيفة", color: "bg-red-500" };
    if (p.length < 10) return { level: 2, label: "متوسطة", color: "bg-yellow-500" };
    return { level: 3, label: "قوية", color: "bg-green-500" };
  };

  const strength = passwordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("يرجى ملء جميع الحقول.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }
    if (form.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-1/2" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-white/5 -translate-x-1/2" />
        <div className="relative text-center text-white">
          <div className="w-20 h-20 rounded-3xl gradient-primary border-2 border-white/30 flex items-center justify-center shadow-2xl mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3">انضم إلى مكتبة</h2>
          <p className="text-white/75 text-lg max-w-xs mx-auto leading-relaxed">
            سجّل مجاناً واستمتع بآلاف الكتب والقصص من أفضل الكتّاب العرب.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { value: "٨٠K+", label: "كتاب" },
              { value: "٢M+", label: "قارئ" },
              { value: "٥K+", label: "كاتب" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                <div className="text-xl font-extrabold text-yellow-300">{s.value}</div>
                <div className="text-xs text-white/70 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Register form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-purple">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl text-primary">مكتبة</span>
          </div>

          {success ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">تم إنشاء حسابك!</h2>
              <p className="text-muted-foreground mb-6">مرحباً بك في مكتبة. يمكنك الآن تسجيل الدخول والبدء في القراءة.</p>
              <Link to="/login" className="inline-block gradient-primary text-white font-bold px-8 py-3 rounded-2xl hover:opacity-90 transition-opacity shadow-purple">
                تسجيل الدخول
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-foreground">إنشاء حساب جديد</h1>
                <p className="text-muted-foreground mt-1">سجّل مجاناً وابدأ رحلتك مع القراءة</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 mb-5 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">الاسم الكامل</label>
                  <input
                    type="text"
                    placeholder="محمد أحمد"
                    value={form.name}
                    onChange={set("name")}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">البريد الإلكتروني</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={set("email")}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">كلمة المرور</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={set("password")}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground pl-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {strength && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((l) => (
                          <div key={l} className={`h-1.5 flex-1 rounded-full transition-all ${l <= strength.level ? strength.color : "bg-border"}`} />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">قوة كلمة المرور: <span className="font-semibold">{strength.label}</span></p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">تأكيد كلمة المرور</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.confirm}
                      onChange={set("confirm")}
                      className={`w-full bg-muted border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground pl-10 ${form.confirm && form.confirm !== form.password ? "border-destructive" : "border-border focus:border-primary"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {form.confirm && form.confirm !== form.password && (
                    <p className="text-xs text-destructive mt-1">كلمتا المرور غير متطابقتين</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl hover:opacity-90 transition-all duration-200 shadow-purple mt-2 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      جارٍ إنشاء الحساب...
                    </>
                  ) : "إنشاء الحساب مجاناً"}
                </button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                لديك حساب بالفعل؟{" "}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  تسجيل الدخول
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
