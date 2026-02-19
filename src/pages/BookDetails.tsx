import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Eye, BookOpen, ShoppingCart, ArrowRight, ChevronLeft, ChevronRight, Moon, Sun, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { BookCard } from "@/components/BookCard";
import { AdBanner } from "@/components/AdBanner";
import { mockBooks, categoryColors } from "@/data/mockData";

export default function BookDetails() {
  const { id } = useParams();
  const book = mockBooks.find(b => b.id === id) || mockBooks[0];
  const relatedBooks = mockBooks.filter(b => b.id !== book.id && b.tags.some(t => book.tags.includes(t))).slice(0, 4);

  const [darkReader, setDarkReader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 12;

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(book.rating));

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      {/* Book Header */}
      <div className="gradient-hero text-white">
        <div className="max-w-5xl mx-auto px-4 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-white">{book.title}</span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Cover */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <img
                src={book.cover}
                alt={book.title}
                className="w-48 h-64 md:w-56 md:h-76 object-cover rounded-2xl shadow-2xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {book.tags.map(tag => (
                  <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{book.title}</h1>
              <p className="text-white/80 text-lg mb-4">بقلم <span className="font-bold text-yellow-300">{book.author}</span></p>

              {/* Rating & Views */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {stars.map((filled, i) => (
                      <Star key={i} className={`w-5 h-5 ${filled ? "fill-yellow-400 text-yellow-400" : "text-white/40"}`} />
                    ))}
                  </div>
                  <span className="font-bold">{book.rating}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/70">
                  <Eye className="w-4 h-4" />
                  <span>{book.views} مشاهدة</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/70">
                  <BookOpen className="w-4 h-4" />
                  <span>{book.pages} صفحة</span>
                </div>
              </div>

              <p className="text-white/80 leading-relaxed mb-6 max-w-xl line-clamp-3">{book.description}</p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {book.isFree ? (
                  <button className="flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-2xl hover:bg-yellow-50 transition-all duration-200 shadow-lg hover:-translate-y-0.5">
                    <BookOpen className="w-5 h-5" />
                    اقرأ الآن — مجاناً
                  </button>
                ) : (
                  <>
                    <button className="flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-2xl hover:bg-yellow-50 transition-all duration-200 shadow-lg hover:-translate-y-0.5">
                      <ShoppingCart className="w-5 h-5" />
                      اشترِ الآن — {book.price}
                    </button>
                    <button className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold px-6 py-3 rounded-2xl hover:bg-white/25 transition-all duration-200">
                      <BookOpen className="w-5 h-5" />
                      اقرأ مقتطفاً
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-3">عن الكتاب</h2>
          <p className="text-muted-foreground leading-relaxed">{book.description} هذه الرواية الرائعة تأخذك في رحلة لا تُنسى، مليئة بالمشاعر الإنسانية الصادقة والأحداث المشوّقة التي تجعلك عاجزاً عن إغلاق الكتاب حتى تنهيه.</p>
        </div>
      </div>

      {/* Ad Banner */}
      <div className="max-w-5xl mx-auto px-4 pb-4">
        <AdBanner slot="book-top" format="horizontal" />
      </div>

      {/* PDF Viewer */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className={`rounded-2xl border border-border shadow-sm overflow-hidden transition-colors duration-300 ${darkReader ? "bg-gray-900" : "bg-card"}`}>
          {/* Viewer Toolbar */}
          <div className={`flex items-center justify-between px-4 py-3 border-b ${darkReader ? "border-gray-700 bg-gray-800" : "border-border bg-muted/50"}`}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${darkReader ? "hover:bg-gray-700 text-white" : "hover:bg-accent text-foreground"}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className={`text-sm font-medium px-3 py-1 rounded-lg ${darkReader ? "text-gray-200 bg-gray-700" : "text-foreground bg-background border border-border"}`}>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${darkReader ? "hover:bg-gray-700 text-white" : "hover:bg-accent text-foreground"}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            <h3 className={`text-sm font-bold ${darkReader ? "text-white" : "text-foreground"}`}>
              {book.title}
            </h3>

            <button
              onClick={() => setDarkReader(!darkReader)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${darkReader ? "bg-yellow-500 text-white hover:bg-yellow-400" : "bg-gray-800 text-white hover:bg-gray-700"}`}
            >
              {darkReader ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {darkReader ? "وضع النهار" : "وضع الليل"}
            </button>
          </div>

          {/* Reading Area */}
          <div className={`min-h-96 p-8 md:p-12 transition-colors duration-300 ${darkReader ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"}`}>
            <div className="max-w-2xl mx-auto">
              <h2 className={`text-xl font-bold mb-6 text-center ${darkReader ? "text-gray-100" : "text-gray-900"}`}>
                الفصل الأول — البداية
              </h2>
              <div className={`text-base leading-loose text-right space-y-4 ${darkReader ? "text-gray-300" : "text-gray-700"}`}>
                <p>
                  كانت الساعة تقترب من منتصف الليل حين وصلت رانيا إلى المدينة القديمة. كانت أضواء الشوارع تُلقي بظلالها الذهبية على أرصفة مرصوفة بالحجارة القديمة، وكانت رائحة البخور تملأ الهواء الدافئ بعطر يشبه الذاكرة.
                </p>
                <p>
                  لم تكن تعرف لماذا جاءت إلى هنا. ربما كانت تهرب، وربما كانت تبحث. لكن ما إن وطئت قدماها ذلك الحجر الأول حتى شعرت كأن شيئاً ما في هذه المدينة يعرفها، كأن الجدران القديمة تحمل بين طياتها جزءاً من روحها التائهة.
                </p>
                <p>
                  التفتت تبحث عن مكان تأوي إليه، فلاحت لها إشارة مضيئة تقول "فندق السلطان". كانت الأبواب الخشبية الكبيرة مفتوحة ترحيباً بكل غريب ضلّ الطريق. دخلت، وما إن دخلت حتى رأته...
                </p>
                <p className={`italic text-center py-4 ${darkReader ? "text-gray-500" : "text-gray-400"}`}>
                  — الصفحة {currentPage} من {totalPages} —
                </p>
              </div>
            </div>
          </div>

          {/* Bottom navigation */}
          <div className={`flex items-center justify-center gap-4 py-4 border-t ${darkReader ? "border-gray-700 bg-gray-800" : "border-border bg-muted/50"}`}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-40 ${darkReader ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-background border border-border hover:bg-accent"}`}
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${currentPage === i + 1
                    ? "bg-primary text-primary-foreground"
                    : darkReader ? "text-gray-400 hover:bg-gray-700" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-40 ${darkReader ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-background border border-border hover:bg-accent"}`}
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Ad Banner */}
      <div className="max-w-5xl mx-auto px-4 pb-4">
        <AdBanner slot="book-bottom" format="rectangle" />
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 pb-24 md:pb-10">
          <h2 className="text-xl font-extrabold mb-4">كتب مشابهة</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {relatedBooks.map(book => (
              <div key={book.id} className="w-44 flex-shrink-0">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      )}

      <MobileNav />
    </div>
  );
}
