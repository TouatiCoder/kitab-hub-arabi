import { useState } from "react";
import { Search, Menu, X, BookOpen, User, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 me-auto md:me-0">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-purple">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg text-primary hidden sm:block">مكتبة</span>
          </Link>

          {/* Search - desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن كتاب، كاتب..."
                className="w-full bg-muted border-0 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ms-auto md:ms-0">
            {/* Mobile search toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="p-2 rounded-lg hover:bg-accent transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>

            <Link
              to="/login"
              className="hidden sm:flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors shadow-purple"
            >
              <User className="w-4 h-4" />
              تسجيل الدخول
            </Link>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن كتاب، كاتب..."
                className="w-full bg-muted border-0 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile menu drawer */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-2">
            <Link to="/" className="py-2.5 px-3 rounded-lg hover:bg-accent text-sm font-medium" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
            <Link to="/login" className="py-2.5 px-3 rounded-lg hover:bg-accent text-sm font-medium" onClick={() => setMenuOpen(false)}>تسجيل الدخول</Link>
            <Link to="/admin/login" className="py-2.5 px-3 rounded-lg hover:bg-accent text-sm font-medium text-muted-foreground" onClick={() => setMenuOpen(false)}>لوحة الإدارة</Link>
          </div>
        )}
      </header>
    </>
  );
}
