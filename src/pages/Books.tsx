import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { BookCard } from "@/components/BookCard";
import { mockBooks, categoryColors } from "@/data/mockData";

const allCategories = Array.from(new Set(mockBooks.map(b => b.category)));

export default function Books() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = mockBooks.filter(book => {
    const matchesSearch = !search || book.title.includes(search) || book.author.includes(search);
    const matchesCategory = !selectedCategory || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-10">
        {/* Header */}
        <h1 className="text-2xl font-extrabold text-foreground mb-6">📚 جميع الكتب</h1>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن كتاب أو كاتب..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              !selectedCategory ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            الكل
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : categoryColors[cat] || "bg-muted text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">{filtered.length} كتاب</p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-semibold">لا توجد نتائج</p>
            <p className="text-sm mt-1">جرّب البحث بكلمات مختلفة</p>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
}
