import { useState } from "react";
import { ArrowLeft, Flame, Star, Sparkles, Trophy, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { ContentCard } from "@/components/ContentCard";
import { Navbar } from "@/components/Navbar";
import { AdBanner } from "@/components/AdBanner";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { usePublishedContents, ContentRow } from "@/hooks/useContents";
import { SkeletonCard } from "@/components/SkeletonCard";

const slides = [
  { title: "اكتشف عالماً من الإبداع العربي", subtitle: "مقالات، قصص، وروايات من أفضل الكتّاب العرب", cta: "ابدأ القراءة" },
  { title: "انضم ككاتب على الهامش", subtitle: "شارك إبداعك مع ملايين القرّاء", cta: "تقدّم الآن" },
  { title: "محتوى حصري لمشتركينا", subtitle: "اشترك واستمتع بمحتوى مميز من كتّاب مختارين", cta: "اشترك الآن" },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  return (
    <section className="relative overflow-hidden gradient-hero px-4 py-14 md:py-20">
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white/5 translate-y-1/2" />
      <div className="relative max-w-4xl mx-auto text-center text-white">
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3">{slides[current].title}</h1>
        <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-6">{slides[current].subtitle}</p>
        <Link to={current === 1 ? "/writer/join" : "/articles"} className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-2xl hover:bg-amber-50 transition-all shadow-lg hover:-translate-y-0.5">
          {slides[current].cta}
        </Link>
        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-white w-8" : "bg-white/40"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ icon, title, link, linkLabel = "عرض الكل" }: { icon: React.ReactNode; title: string; link: string; linkLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-extrabold text-foreground">{title}</h2>
      </div>
      <Link to={link} className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
        {linkLabel} <ArrowLeft className="w-4 h-4" />
      </Link>
    </div>
  );
}

function contentToCardItem(c: ContentRow) {
  return {
    id: c.id,
    title: c.title,
    author: c.writer_name || "كاتب",
    authorId: c.writer_id,
    cover: c.cover_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    views: String(c.views),
    type: c.type as any,
    category: c.category || "",
    tags: c.tags || [],
    description: c.summary || "",
    chapters: undefined as number | undefined,
    isComplete: c.is_complete ?? undefined,
    isExclusive: c.is_premium,
    status: c.status as any,
    createdAt: c.created_at,
  };
}

function ScrollRow({ items }: { items: ReturnType<typeof contentToCardItem>[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
      {items.map(item => (
        <div key={item.id} className="w-44 flex-shrink-0">
          <ContentCard item={item} />
        </div>
      ))}
    </div>
  );
}

function FeaturedCard({ item, label }: { item: ReturnType<typeof contentToCardItem>; label: string }) {
  return (
    <Link to={`/content/${item.id}`} className="block bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-all group">
      <div className="flex flex-col md:flex-row">
        <img src={item.cover} alt={item.title} className="w-full md:w-48 h-48 md:h-auto object-cover" />
        <div className="p-5 flex-1">
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{label}</span>
          <h3 className="text-lg font-bold text-foreground mt-3 group-hover:text-primary transition-colors">{item.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{item.author}</p>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {item.views}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { data: allContent, isLoading } = usePublishedContents();

  const items = (allContent || []).map(contentToCardItem);
  const articles = items.filter(c => c.type === "مقال");
  const stories = items.filter(c => c.type === "قصة");
  const novels = items.filter(c => c.type === "رواية");
  const trending = items.sort((a, b) => Number(b.views) - Number(a.views)).slice(0, 6);
  const newest = [...items].slice(0, 6);
  const editorPicks = items.slice(0, 4);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <HeroSlider />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <SectionHeader icon={<Flame className="w-5 h-5 text-orange-500" />} title="الرائج" link="/articles" />
        {isLoading ? (
          <div className="flex gap-4">{[1,2,3,4].map(i => <div key={i} className="w-44 flex-shrink-0"><SkeletonCard /></div>)}</div>
        ) : (
          <ScrollRow items={trending.length > 0 ? trending : items.slice(0, 4)} />
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 py-6">
        <SectionHeader icon={<Sparkles className="w-5 h-5 text-amber-500" />} title="الجديد" link="/articles" />
        {isLoading ? (
          <div className="flex gap-4">{[1,2,3].map(i => <div key={i} className="w-44 flex-shrink-0"><SkeletonCard /></div>)}</div>
        ) : (
          <ScrollRow items={newest} />
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 py-6">
        <SectionHeader icon={<Trophy className="w-5 h-5 text-yellow-600" />} title="توصيات فريق الهامش" link="/articles" />
        {!isLoading && <ScrollRow items={editorPicks} />}
      </section>

      <div className="max-w-7xl mx-auto px-4 py-4"><AdBanner slot="home-top" format="horizontal" /></div>

      {articles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <FeaturedCard item={articles[0]} label="المقال الأكثر شعبية" />
          <div className="mt-6"><ScrollRow items={articles} /></div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-4"><AdBanner slot="home-mid" format="horizontal" /></div>

      {stories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <FeaturedCard item={stories[0]} label="القصة الأكثر شعبية" />
          <div className="mt-6"><ScrollRow items={stories} /></div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-4"><AdBanner slot="home-bottom" format="horizontal" /></div>

      {novels.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6">
          <FeaturedCard item={novels[0]} label="الرواية الأكثر شعبية" />
          <div className="mt-6"><ScrollRow items={novels} /></div>
        </section>
      )}

      {!isLoading && items.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground text-lg">لا يوجد محتوى منشور بعد. كن أول من ينشر!</p>
          <Link to="/writer/join" className="inline-block mt-4 gradient-primary text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 shadow-primary-glow">انضم ككاتب</Link>
        </div>
      )}

      <Footer />
      <MobileNav />
    </div>
  );
}
