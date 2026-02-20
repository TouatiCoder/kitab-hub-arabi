import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Eye, BookOpen, ChevronLeft, ChevronRight, Moon, Sun, Lock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { ContentCard } from "@/components/ContentCard";
import { AdBanner } from "@/components/AdBanner";
import { Footer } from "@/components/Footer";
import { mockContent, categoryColors, typeColors } from "@/data/mockData";

export default function ContentDetails() {
  const { id } = useParams();
  const item = mockContent.find(c => c.id === id) || mockContent[0];
  const related = mockContent.filter(c => c.id !== item.id && c.type === item.type).slice(0, 4);

  const [darkReader, setDarkReader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = item.chapters || 8;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      {/* Header */}
      <div className="gradient-hero text-white">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <ChevronLeft className="w-4 h-4" />
            <Link to={item.type === "مقال" ? "/articles" : item.type === "قصة" ? "/stories" : "/novels"} className="hover:text-white transition-colors">{item.type === "مقال" ? "مقالات" : item.type === "قصة" ? "قصص" : "روايات"}</Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-white">{item.title}</span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <img src={item.cover} alt={item.title} className="w-48 h-64 object-cover rounded-2xl shadow-2xl" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeColors[item.type]}`}>{item.type}</span>
                {item.tags.map(tag => (
                  <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">{tag}</span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{item.title}</h1>
              <p className="text-white/80 text-lg mb-4">بقلم <span className="font-bold text-amber-300">{item.author}</span></p>
              <div className="flex items-center gap-4 mb-5 text-white/70">
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {item.views} مشاهدة</span>
                {item.chapters && <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {item.chapters} فصل</span>}
                {item.isComplete !== undefined && (
                  <span className={`text-xs font-bold px-2 py-1 rounded ${item.isComplete ? "bg-green-500/30 text-green-200" : "bg-amber-500/30 text-amber-200"}`}>
                    {item.isComplete ? "مكتملة" : "مستمرة"}
                  </span>
                )}
              </div>
              <p className="text-white/80 leading-relaxed mb-6 max-w-xl">{item.description}</p>
              <div className="flex flex-wrap gap-3">
                {item.isExclusive ? (
                  <button className="flex items-center gap-2 bg-amber-500 text-white font-bold px-6 py-3 rounded-2xl hover:bg-amber-400 transition-all shadow-lg hover:-translate-y-0.5">
                    <Lock className="w-5 h-5" />
                    اشترك الآن
                  </button>
                ) : (
                  <button className="flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-2xl hover:bg-amber-50 transition-all shadow-lg hover:-translate-y-0.5">
                    <BookOpen className="w-5 h-5" />
                    اقرأ الآن
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-3">عن المحتوى</h2>
          <p className="text-muted-foreground leading-relaxed">{item.description}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-4">
        <AdBanner slot="content-top" format="horizontal" />
      </div>

      {/* Reader */}
      {!item.isExclusive && (
        <div className="max-w-5xl mx-auto px-4 pb-8">
          <div className={`rounded-2xl border border-border shadow-sm overflow-hidden transition-colors duration-300 ${darkReader ? "bg-gray-900" : "bg-card"}`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${darkReader ? "border-gray-700 bg-gray-800" : "border-border bg-muted/50"}`}>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${darkReader ? "hover:bg-gray-700 text-white" : "hover:bg-accent text-foreground"}`}>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className={`text-sm font-medium px-3 py-1 rounded-lg ${darkReader ? "text-gray-200 bg-gray-700" : "text-foreground bg-background border border-border"}`}>
                  {currentPage} / {totalPages}
                </span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${darkReader ? "hover:bg-gray-700 text-white" : "hover:bg-accent text-foreground"}`}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => setDarkReader(!darkReader)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${darkReader ? "bg-amber-500 text-white" : "bg-gray-800 text-white"}`}>
                {darkReader ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {darkReader ? "نهاري" : "ليلي"}
              </button>
            </div>
            <div className={`min-h-96 p-8 md:p-12 transition-colors ${darkReader ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"}`}>
              <div className="max-w-2xl mx-auto text-right space-y-4 leading-loose">
                <p>كانت الساعة تقترب من منتصف الليل حين وصلت رانيا إلى المدينة القديمة. كانت أضواء الشوارع تُلقي بظلالها الذهبية على أرصفة مرصوفة بالحجارة القديمة.</p>
                <p>لم تكن تعرف لماذا جاءت إلى هنا. ربما كانت تهرب، وربما كانت تبحث. لكن ما إن وطئت قدماها ذلك الحجر الأول حتى شعرت كأن شيئاً ما في هذه المدينة يعرفها.</p>
                <p className={`italic text-center py-4 ${darkReader ? "text-gray-500" : "text-gray-400"}`}>— الصفحة {currentPage} من {totalPages} —</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 pb-24 md:pb-6">
          <h2 className="text-xl font-extrabold mb-4">محتوى مشابه</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {related.map(c => (
              <div key={c.id} className="w-44 flex-shrink-0"><ContentCard item={c} /></div>
            ))}
          </div>
        </div>
      )}
      <Footer />
      <MobileNav />
    </div>
  );
}
