import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("يرجى إدخال البريد الإلكتروني وكلمة المرور."); return; }
    if (password.length < 6) { setError("كلمة المرور يجب أن تكون ٦ أحرف على الأقل."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); window.location.href = "/admin/dashboard"; }, 1500);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4" dir="rtl">
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="bg-card rounded-3xl shadow-2xl p-8 border border-border/20">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-primary-glow mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-foreground">لوحة الإدارة</h1>
            <p className="text-muted-foreground text-sm mt-1">تسجيل دخول المدير</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">البريد الإلكتروني</label>
              <input type="email" placeholder="admin@alhamish.com" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">كلمة المرور</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground pl-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl hover:opacity-90 transition-all shadow-primary-glow mt-2 disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />جارٍ تسجيل الدخول...</> : "تسجيل الدخول"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">العودة للرئيسية</Link>
          </div>
        </div>
        <p className="text-center text-white/60 text-xs mt-4">هذه الصفحة مخصصة لمدراء المنصة فقط</p>
      </div>
    </div>
  );
}
