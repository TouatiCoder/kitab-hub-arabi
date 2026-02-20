import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("يرجى إدخال البريد الإلكتروني وكلمة المرور."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); window.location.href = "/"; }, 1500);
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-1/2" />
        <div className="relative text-center text-white">
          <div className="w-20 h-20 rounded-3xl gradient-primary border-2 border-white/30 flex items-center justify-center shadow-2xl mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3">مرحباً بك في الهامش</h2>
          <p className="text-white/75 text-lg max-w-xs mx-auto leading-relaxed">منصة النشر العربية. اقرأ وشارك إبداعك مع العالم.</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-primary-glow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl text-primary">الهامش</span>
          </div>

          <h1 className="text-3xl font-extrabold text-foreground mb-1">تسجيل الدخول</h1>
          <p className="text-muted-foreground mb-6">أدخل بياناتك للوصول إلى حسابك</p>

          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">البريد الإلكتروني</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-foreground">كلمة المرور</label>
                <Link to="#" className="text-xs text-primary hover:underline font-medium">نسيت كلمة المرور؟</Link>
              </div>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground pl-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button type="button" onClick={() => setRememberMe(!rememberMe)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${rememberMe ? "bg-primary border-primary" : "border-border bg-background"}`}>
                {rememberMe && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </button>
              <label className="text-sm text-foreground cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>تذكّرني</label>
            </div>
            <button type="submit" disabled={loading}
              className="w-full gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl hover:opacity-90 transition-all shadow-primary-glow mt-2 disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />جارٍ تسجيل الدخول...</> : "تسجيل الدخول"}
            </button>
          </form>

          {/* Facebook login */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" /><span className="text-xs text-muted-foreground">أو</span><div className="flex-1 h-px bg-border" />
          </div>
          <button className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white font-semibold py-3 rounded-2xl hover:bg-[#166FE5] transition-colors text-sm">
            تسجيل الدخول بفيسبوك
          </button>

          <p className="text-center text-xs text-muted-foreground mt-6">
            هل أنت كاتب؟{" "}
            <Link to="/writer/join" className="text-primary font-bold hover:underline">تقدّم بطلب انضمام</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
