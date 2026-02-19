import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen, Users, ShoppingCart, DollarSign, FileText,
  Bell, LogOut, BarChart3, Settings, LayoutDashboard,
  ChevronLeft, Search, Plus, Pencil, Trash2, Eye,
  ChevronDown,
} from "lucide-react";
import { mockBooks, categoryColors } from "@/data/mockData";

const navItems = [
  { label: "لوحة التحكم", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "الكتب", icon: BookOpen, path: "/admin/books" },
  { label: "التقارير", icon: BarChart3, path: "/admin/reports" },
  { label: "المستخدمون", icon: Users, path: "/admin/users" },
  { label: "المبيعات", icon: ShoppingCart, path: "/admin/sales" },
  { label: "الإعدادات", icon: Settings, path: "/admin/settings" },
];

const categories = ["الكل", "رومانسي", "خيال علمي", "أدب", "غموض", "تطوير ذات", "مغامرة", "درامي"];

export default function AdminBooks() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const location = useLocation();

  const filtered = mockBooks.filter((book) => {
    const matchSearch =
      book.title.includes(search) || book.author.includes(search);
    const matchCategory =
      selectedCategory === "الكل" || book.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } flex-shrink-0 bg-card border-l border-border flex flex-col transition-all duration-300 fixed right-0 top-0 h-screen z-40`}
      >
        <div
          className={`h-16 flex items-center border-b border-border ${
            sidebarOpen ? "px-5 gap-3" : "justify-center"
          }`}
        >
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-purple flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-extrabold text-primary">مكتبة</span>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-purple"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl hover:bg-accent text-muted-foreground transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4 rotate-180" />
            )}
            {sidebarOpen && <span className="text-sm">طيّ القائمة</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarOpen ? "mr-64" : "mr-16"
        }`}
      >
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">أ</span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">أحمد المدير</p>
              <p className="text-xs text-muted-foreground">مدير النظام</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2.5 rounded-xl hover:bg-accent transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Header row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">إدارة الكتب</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                عرض وإضافة وتعديل جميع الكتب في المنصة.
              </p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold shadow-purple hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
              إضافة كتاب
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن كتاب أو مؤلف..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-purple"
                      : "bg-card border border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "إجمالي الكتب", value: mockBooks.length },
              { label: "مجانية", value: mockBooks.filter((b) => b.isFree).length },
              { label: "مدفوعة", value: mockBooks.filter((b) => !b.isFree).length },
              { label: "نتائج البحث", value: filtered.length },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
                <p className="text-2xl font-extrabold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Books Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground">الكتاب</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden sm:table-cell">التصنيف</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden md:table-cell">التقييم</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden lg:table-cell">المشاهدات</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground">النوع</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-muted-foreground hidden md:table-cell">السعر</th>
                    <th className="text-center px-4 py-3.5 font-semibold text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-muted-foreground">
                        لا توجد نتائج للبحث
                      </td>
                    </tr>
                  ) : (
                    filtered.map((book, idx) => (
                      <tr
                        key={book.id}
                        className={`border-b border-border last:border-0 hover:bg-accent/40 transition-colors ${
                          idx % 2 === 0 ? "" : "bg-muted/10"
                        }`}
                      >
                        {/* Book + author */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded-lg flex-shrink-0 shadow-sm"
                            />
                            <div>
                              <p className="font-semibold text-foreground line-clamp-1">{book.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
                              <p className="text-xs text-muted-foreground">{book.pages} صفحة</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${categoryColors[book.category] ?? "bg-muted text-muted-foreground"}`}>
                            {book.category}
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500 text-xs">★</span>
                            <span className="font-semibold text-foreground">{book.rating}</span>
                          </div>
                        </td>

                        {/* Views */}
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <span className="text-muted-foreground">{book.views}</span>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${book.isFree ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>
                            {book.isFree ? "مجاني" : "مدفوع"}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <span className="text-foreground font-medium">
                            {book.isFree ? "—" : book.price}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center gap-1">
                            <Link
                              to={`/book/${book.id}`}
                              className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                              title="عرض"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
                              title="تعديل"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteId(book.id)}
                              className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Delete confirmation dialog */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-xl" dir="rtl">
            <h3 className="text-lg font-bold text-foreground mb-2">تأكيد الحذف</h3>
            <p className="text-muted-foreground text-sm mb-6">
              هل أنت متأكد من حذف هذا الكتاب؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
