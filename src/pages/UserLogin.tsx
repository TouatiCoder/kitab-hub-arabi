import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function UserLogin() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !password) { setError("يرجى إدخال البريد الإلكتروني وكلمة المرور."); return; }
    if (mode === "signup" && !fullName) { setError("يرجى إدخال الاسم الكامل."); return; }
    if (password.length < 6) { setError("كلمة المرور يجب أن تكون ٦ أحرف على الأقل."); return; }

    setLoading(true);
    if (mode === "login") {
      const { error: err } = await signIn(email, password);
      if (err) { setError(err); setLoading(false); return; }
      navigate("/");
    } else {
      const { error: err } = await signUp(email, password, fullName);
      if (err) { setError(err); setLoading(false); return; }
      setSuccess("تم إنشاء الحساب! يرجى تأكيد بريدك الإلكتروني.");
      setLoading(false);
    }
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

          <h1 className="text-3xl font-extrabold text-foreground mb-1">
            {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {mode === "login" ? "أدخل بياناتك للوصول إلى حسابك" : "أنشئ حسابك للبدء في القراءة"}
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-green-100 border border-green-300 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm">
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">الاسم الكامل</label>
                <input type="text" placeholder="محمد أحمد" value={fullName} onChange={e => setFullName(e.target.value)}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground" />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">البريد الإلكتروني</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">كلمة المرور</label>
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
              {loading ? <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />{mode === "login" ? "جارٍ تسجيل الدخول..." : "جارٍ الإنشاء..."}</> : mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "login" ? (
              <>ليس لديك حساب؟ <button onClick={() => { setMode("signup"); setError(""); setSuccess(""); }} className="text-primary font-bold hover:underline">إنشاء حساب</button></>
            ) : (
              <>لديك حساب؟ <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }} className="text-primary font-bold hover:underline">تسجيل الدخول</button></>
            )}
          </p>
          <p className="text-center text-xs text-muted-foreground mt-3">
            هل أنت كاتب؟{" "}
            <Link to="/writer/join" className="text-primary font-bold hover:underline">تقدّم بطلب انضمام</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
