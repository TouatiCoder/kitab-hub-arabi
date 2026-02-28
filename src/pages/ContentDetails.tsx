import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Eye, BookOpen, ChevronLeft, ChevronRight, Moon, Sun, Lock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { ContentCard } from "@/components/ContentCard";
import { AdBanner } from "@/components/AdBanner";
import { Footer } from "@/components/Footer";
import { useContentById, usePublishedContents } from "@/hooks/useContents";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const typeColors: Record<string, string> = {
  "مقال": "bg-amber-100 text-amber-700",
  "قصة": "bg-sky-100 text-sky-700",
  "رواية": "bg-rose-100 text-rose-700",
};

const categoryColors: Record<string, string> = {
  "فكري": "bg-amber-100 text-amber-700",
  "رأي": "bg-orange-100 text-orange-700",
  "أدبي": "bg-emerald-100 text-emerald-700",
  "إثارة": "bg-red-100 text-red-700",
  "اجتماعي": "bg-cyan-100 text-cyan-700",
  "رومانسي": "bg-pink-100 text-pink-700",
  "خيال": "bg-violet-100 text-violet-700",
  "درامي": "bg-rose-100 text-rose-700",
};

export default function ContentDetails() {
  const { id } = useParams();
  const { data: item, isLoading } = useContentById(id);
  const { data: allContent } = usePublishedContents();
  const { user } = useAuth();
  const [darkReader, setDarkReader] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [viewIncremented, setViewIncremented] = useState(false);

  // Increment views once
  useEffect(() => {
    if (id && !viewIncremented) {
      supabase.rpc("increment_views", { p_content_id: id }).then(() => {
        setViewIncremented(true);
      });
    }
  }, [id, viewIncremented]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <p className="text-muted-foreground">المحتوى غير موجود</p>
      </div>
    );
  }

  const related = (allContent || [])
    .filter(c => c.id !== item.id && c.type === item.type)
    .slice(0, 4)
    .map(c => ({
      id: c.id, title: c.title, author: c.writer_name || "كاتب", authorId: c.writer_id,
      cover: c.cover_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      views: String(c.views), type: c.type as any, category: c.category || "", tags: c.tags || [],
      description: c.summary || "", status: c.status as any, createdAt: c.created_at,
      isExclusive: c.is_premium,
    }));

  const chapters = item.chapters || [];
  const totalChapters = chapters.length || 1;
  const currentChapterData = chapters[currentChapter];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      {/* Header */}
      <div className="gradient-hero text-white">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <ChevronLeft className="w-4 h-4" />
            <Link to={item.type === "مقال" ? "/articles" : item.type === "قصة" ? "/stories" : "/novels"} className="hover:text-white transition-colors">
              {item.type === "مقال" ? "مقالات" : item.type === "قصة" ? "قصص" : "روايات"}
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-white">{item.title}</span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <img src={item.cover_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"} alt={item.title} className="w-48 h-64 object-cover rounded-2xl shadow-2xl" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeColors[item.type] || ""}`}>{item.type}</span>
                {(item.tags || []).map((tag: string) => (
                  <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">{tag}</span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{item.title}</h1>
              <p className="text-white/80 text-lg mb-4">بقلم <span className="font-bold text-amber-300">{item.writer_name}</span></p>
              <div className="flex items-center gap-4 mb-5 text-white/70">
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {item.views} مشاهدة</span>
                {chapters.length > 0 && <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {chapters.length} فصل</span>}
                {item.is_complete !== null && (
                  <span className={`text-xs font-bold px-2 py-1 rounded ${item.is_complete ? "bg-green-500/30 text-green-200" : "bg-amber-500/30 text-amber-200"}`}>
                    {item.is_complete ? "مكتملة" : "مستمرة"}
                  </span>
                )}
              </div>
              <p className="text-white/80 leading-relaxed mb-6 max-w-xl">{item.summary}</p>
              <div className="flex flex-wrap gap-3">
                {item.is_premium && !user ? (
                  <Link to="/login" className="flex items-center gap-2 bg-amber-500 text-white font-bold px-6 py-3 rounded-2xl hover:bg-amber-400 transition-all shadow-lg hover:-translate-y-0.5">
                    <Lock className="w-5 h-5" />اشترك الآن
                  </Link>
                ) : (
                  <button className="flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-2xl hover:bg-amber-50 transition-all shadow-lg hover:-translate-y-0.5">
                    <BookOpen className="w-5 h-5" />اقرأ الآن
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
          <p className="text-muted-foreground leading-relaxed">{item.summary || item.body}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-4">
        <AdBanner slot="content-top" format="horizontal" />
      </div>

      {/* Reader */}
      {(!item.is_premium || user) && (item.body || chapters.length > 0) && (
        <div className="max-w-5xl mx-auto px-4 pb-8">
          <div className={`rounded-2xl border border-border shadow-sm overflow-hidden transition-colors duration-300 ${darkReader ? "bg-gray-900" : "bg-card"}`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${darkReader ? "border-gray-700 bg-gray-800" : "border-border bg-muted/50"}`}>
              {chapters.length > 1 && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentChapter(p => Math.max(0, p - 1))} disabled={currentChapter === 0}
                    className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${darkReader ? "hover:bg-gray-700 text-white" : "hover:bg-accent text-foreground"}`}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className={`text-sm font-medium px-3 py-1 rounded-lg ${darkReader ? "text-gray-200 bg-gray-700" : "text-foreground bg-background border border-border"}`}>
                    {currentChapter + 1} / {totalChapters}
                  </span>
                  <button onClick={() => setCurrentChapter(p => Math.min(totalChapters - 1, p + 1))} disabled={currentChapter === totalChapters - 1}
                    className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${darkReader ? "hover:bg-gray-700 text-white" : "hover:bg-accent text-foreground"}`}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              )}
              <button onClick={() => setDarkReader(!darkReader)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${darkReader ? "bg-amber-500 text-white" : "bg-gray-800 text-white"}`}>
                {darkReader ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {darkReader ? "نهاري" : "ليلي"}
              </button>
            </div>
            <div className={`min-h-96 p-8 md:p-12 transition-colors ${darkReader ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"}`}>
              <div className="max-w-2xl mx-auto text-right space-y-4 leading-loose">
                {currentChapterData ? (
                  <>
                    {currentChapterData.title && <h3 className="text-xl font-bold mb-4">{currentChapterData.title}</h3>}
                    {currentChapterData.body.split("\n").map((p: string, i: number) => (
                      <p key={i}>{p}</p>
                    ))}
                  </>
                ) : item.body ? (
                  item.body.split("\n").map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">لا يوجد محتوى نصي</p>
                )}
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
