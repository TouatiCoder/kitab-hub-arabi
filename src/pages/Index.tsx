import { ArrowLeft, Flame, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BookCard } from "@/components/BookCard";
import { Navbar } from "@/components/Navbar";
import { AdBanner } from "@/components/AdBanner";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { mockBooks } from "@/data/mockData";

const trendingBooks = mockBooks.slice(0, 6);
const recommendedBooks = mockBooks.slice(2, 6);
const popularBooks = mockBooks.slice(0, 5);

export default function Home() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero px-4 py-16 md:py-24">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white/5 translate-y-1/2" />

        <div className="relative max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Flame className="w-4 h-4 text-orange-300" />
            أكثر من ٨٠,٠٠٠ كتاب في انتظارك
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            اكتشف عالماً من
            <br />
            <span className="text-yellow-300">القصص والمعرفة</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            روايات، قصص، وكتب من أفضل الكتّاب العرب. اقرأ مجاناً أو اشترِ ما يعجبك.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/book/1"
              className="bg-white text-primary font-bold px-8 py-3.5 rounded-2xl hover:bg-yellow-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              ابدأ القراءة مجاناً
            </Link>
            <Link
              to="/login"
              className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-white/25 transition-all duration-200"
            >
              إنشاء حساب
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-white/20">
            {[
              { value: "٨٠K+", label: "كتاب" },
              { value: "٢M+", label: "قارئ" },
              { value: "٥K+", label: "كاتب" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-extrabold text-yellow-300">{s.value}</div>
                <div className="text-sm text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-extrabold text-foreground">جديد ورائج</h2>
          </div>
          <Link to="/books" className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
            عرض الكل <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {trendingBooks.map(book => (
            <div key={book.id} className="w-44 flex-shrink-0">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner slot="home-top" format="horizontal" />
      </div>

      {/* Recommended Section */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="text-xl font-extrabold text-foreground">موصى بها لك</h2>
          </div>
          <Link to="/books" className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
            عرض الكل <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {recommendedBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner slot="home-mid" format="horizontal" />
      </div>

      {/* Most Popular Section */}
      <section className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-foreground">🏆 الأكثر شعبية</h2>
          <Link to="/books" className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
            عرض الكل <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {popularBooks.map((book, index) => (
            <div key={book.id} className={index < popularBooks.length - 1 ? "border-b border-border" : ""}>
              <Link to={`/book/${book.id}`} className="flex items-center gap-4 p-4 hover:bg-accent/40 transition-colors group">
                {/* Rank */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${
                  index === 0 ? "bg-yellow-100 text-yellow-700" :
                  index === 1 ? "bg-gray-100 text-gray-600" :
                  index === 2 ? "bg-orange-100 text-orange-700" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {index + 1}
                </div>
                <img src={book.cover} alt={book.title} className="w-12 h-16 object-cover rounded-lg shadow-sm flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">{book.title}</h3>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold">{book.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">• {book.views} مشاهدة</span>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${book.isFree ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"}`}>
                  {book.isFree ? "مجاني" : book.price}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <MobileNav />
    </div>
  );
}
