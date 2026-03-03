import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X, BookOpen, User, LogOut, PenTool, UserCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "مقالات", path: "/articles" },
  { label: "قصص", path: "/stories" },
  { label: "روايات", path: "/novels" },
  { label: "هامش الكتاب", path: "/writer" },
];

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const location = useLocation();
  const { user, profile, isAdmin, isWriter, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-primary-glow">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg text-primary hidden sm:block">الهامش</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 mx-4">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ms-auto">
          <button className="p-2 rounded-lg hover:bg-accent transition-colors" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              {isAdmin && (
                <Link to="/admin/dashboard" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20">لوحة الإدارة</Link>
              )}
              {isWriter && (
                <Link to="/writer" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20">لوحة الكاتب</Link>
              )}
              <span className="text-xs text-muted-foreground">{profile?.full_name || user.email}</span>
              <Link to="/profile" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-accent text-foreground hover:bg-primary/10 ml-2 flex items-center gap-1"><UserCircle className="w-3 h-3" />البروفيل</Link>
              <Link to="/request-writer" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-accent text-foreground hover:bg-primary/10 ml-2 flex items-center gap-1"><PenTool className="w-3 h-3" />طلب كاتب</Link>
              <button onClick={signOut} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground" title="تسجيل الخروج">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login"
              className="hidden sm:flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors shadow-primary-glow">
              <User className="w-4 h-4" />تسجيل الدخول
            </Link>
          )}

          <button className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="px-4 pb-3">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="ابحث عن محتوى، كاتب..."
              className="w-full bg-muted border-0 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={query} onChange={e => setQuery(e.target.value)} autoFocus />
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}
              className={`py-2.5 px-3 rounded-lg text-sm font-medium ${location.pathname === link.path ? "bg-primary/10 text-primary font-bold" : "hover:bg-accent"}`}
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              {isAdmin && <Link to="/admin/dashboard" className="py-2.5 px-3 rounded-lg text-sm font-medium text-primary" onClick={() => setMenuOpen(false)}>لوحة الإدارة</Link>}
              <button onClick={() => { signOut(); setMenuOpen(false); }} className="py-2.5 px-3 rounded-lg text-sm font-medium text-destructive text-right">تسجيل الخروج</button>
            </>
          ) : (
            <Link to="/login" className="py-2.5 px-3 rounded-lg text-sm font-medium text-primary" onClick={() => setMenuOpen(false)}>تسجيل الدخول</Link>
          )}
        </div>
      )}
    </header>
  );
}
