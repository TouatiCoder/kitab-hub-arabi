import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { BookCard } from "@/components/BookCard";
import { mockBooks, categoryColors } from "@/data/mockData";

const allCategories = Array.from(new Set(mockBooks.map(b => b.category)));

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const hasQuery = query.trim().length > 0 || selectedCategory;

  const results = hasQuery
    ? mockBooks.filter(book => {
        const matchesQuery = !query || book.title.includes(query) || book.author.includes(query) || book.tags.some(t => t.includes(query));
        const matchesCategory = !selectedCategory || book.category === selectedCategory;
        return matchesQuery && matchesCategory;
      })
    : [];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-10">
        {/* Search input */}
        <div className="relative max-w-xl mx-auto mb-6">
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث عن كتاب، كاتب، أو تصنيف..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-card border border-border rounded-2xl pr-12 pl-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
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

        {/* Results */}
        {!hasQuery ? (
          <div className="text-center py-16 text-muted-foreground">
            <SearchIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-semibold">ابدأ البحث</p>
            <p className="text-sm mt-1">اكتب اسم كتاب أو كاتب أو اختر تصنيفاً</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">{results.length} نتيجة</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {results.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-semibold">لا توجد نتائج</p>
            <p className="text-sm mt-1">جرّب كلمات مختلفة</p>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
}
