import { BookOpen, Heart, Clock, Download } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { BookCard } from "@/components/BookCard";
import { mockBooks } from "@/data/mockData";

const tabs = [
  { id: "reading", label: "أقرأ الآن", icon: BookOpen },
  { id: "favorites", label: "المفضلة", icon: Heart },
  { id: "history", label: "سجل القراءة", icon: Clock },
  { id: "downloads", label: "التحميلات", icon: Download },
] as const;

// Mock user library data
const libraryData: Record<string, typeof mockBooks> = {
  reading: mockBooks.slice(0, 3),
  favorites: mockBooks.slice(2, 6),
  history: mockBooks.slice(4, 8),
  downloads: mockBooks.slice(0, 2),
};

export default function Library() {
  const [activeTab, setActiveTab] = useState<string>("reading");

  const books = libraryData[activeTab] || [];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-10">
        <h1 className="text-2xl font-extrabold text-foreground mb-6">📖 مكتبتي</h1>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Books grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-semibold">لا توجد كتب هنا بعد</p>
            <p className="text-sm mt-1">ابدأ بإضافة كتب إلى مكتبتك</p>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
}
