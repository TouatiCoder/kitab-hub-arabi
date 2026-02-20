import { useState, Fragment } from "react";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { ContentCard } from "@/components/ContentCard";
import { AdBanner } from "@/components/AdBanner";
import { mockContent, articleCategories, categoryColors } from "@/data/mockData";

const articles = mockContent.filter(c => c.type === "مقال");
const types = ["الكل", "فكري/رأي", "قصصي", "أدبي"];

export default function Articles() {
  const [typeFilter, setTypeFilter] = useState("الكل");
  const [catFilter, setCatFilter] = useState("الكل");
  const [search, setSearch] = useState("");

  const filtered = articles.filter(a => {
    const matchType = typeFilter === "الكل" || a.category.includes(typeFilter.replace("/رأي", ""));
    const matchCat = catFilter === "الكل" || a.category === catFilter;
    const matchSearch = !search || a.title.includes(search) || a.author.includes(search);
    return matchType && matchCat && matchSearch;
  });

  const adInterval = Math.max(2, Math.floor(filtered.length / 4));

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-foreground mb-2">مقالات</h1>
        <p className="text-muted-foreground text-sm mb-6">استكشف مقالات فكرية، أدبية، ورأي من كتّاب المنصة</p>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input type="text" placeholder="ابحث عن مقال أو كاتب..." value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <div className="flex gap-2 flex-wrap">
            {types.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${typeFilter === t ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-accent"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-20 md:pb-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-muted-foreground">لا توجد مقالات تطابق البحث</div>
          ) : filtered.map((item, i) => (
            <Fragment key={item.id}>
              <ContentCard item={item} />
              {(i + 1) % adInterval === 0 && (i + 1) < filtered.length && Math.floor((i + 1) / adInterval) <= 3 && (
                <div className="col-span-full py-2">
                  <AdBanner slot={`articles-${Math.floor((i + 1) / adInterval)}`} format="horizontal" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <Footer />
      <MobileNav />
    </div>
  );
}
