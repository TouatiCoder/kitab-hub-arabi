import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="hidden md:block bg-card border-t border-border mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-purple">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg text-primary">مكتبة</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              منصتك المفضلة لاكتشاف وقراءة أفضل الكتب العربية.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-foreground mb-3">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link></li>
              <li><Link to="/books" className="hover:text-primary transition-colors">جميع الكتب</Link></li>
              <li><Link to="/search" className="hover:text-primary transition-colors">البحث</Link></li>
              <li><Link to="/library" className="hover:text-primary transition-colors">مكتبتي</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-3">الدعم</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">تواصل معنا</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">الأسئلة الشائعة</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">شروط الاستخدام</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-3">تابعنا</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">تويتر</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">إنستغرام</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">فيسبوك</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} مكتبة. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
