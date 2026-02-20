import { Eye, BookOpen, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { ContentItem, categoryColors, typeColors } from "@/data/mockData";

interface ContentCardProps {
  item: ContentItem;
}

export function ContentCard({ item }: ContentCardProps) {
  return (
    <Link to={`/content/${item.id}`} className="group flex flex-col bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-border/50">
      {/* Cover */}
      <div className="relative overflow-hidden aspect-[3/4] bg-muted">
        <img
          src={item.cover}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Type badge */}
        <div className={`absolute top-2 right-2 text-xs font-bold px-2.5 py-1 rounded-full shadow ${typeColors[item.type] || "bg-muted text-muted-foreground"}`}>
          {item.type}
        </div>
        {/* Exclusive badge */}
        {item.isExclusive && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow flex items-center gap-1">
            <Lock className="w-3 h-3" />
            حصري
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map(tag => (
            <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${categoryColors[tag] || "bg-muted text-muted-foreground"}`}>
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-bold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {item.title}
        </h3>
        <p className="text-xs text-muted-foreground">{item.author}</p>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
        <div className="flex items-center justify-between mt-auto pt-1.5">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Eye className="w-3 h-3" />
            <span className="text-xs">{item.views}</span>
          </div>
          {item.type === "رواية" && item.chapters && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <BookOpen className="w-3 h-3" />
              <span className="text-xs">{item.chapters} فصل</span>
              {item.isComplete !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.isComplete ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {item.isComplete ? "مكتملة" : "مستمرة"}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
