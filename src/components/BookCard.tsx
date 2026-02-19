import { Star, Eye, BookOpen, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Book, categoryColors } from "@/data/mockData";

interface BookCardProps {
  book: Book;
  variant?: "default" | "compact" | "horizontal";
}

export function BookCard({ book, variant = "default" }: BookCardProps) {
  if (variant === "horizontal") {
    return (
      <Link to={`/book/${book.id}`} className="flex gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors group">
        <img
          src={book.cover}
          alt={book.title}
          className="w-16 h-20 object-cover rounded-lg shadow-sm flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{book.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">• {book.views} مشاهدة</span>
          </div>
          <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[book.category] || "bg-muted text-muted-foreground"}`}>
            {book.category}
          </span>
        </div>
        <div className="flex items-center">
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${book.isFree ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"}`}>
            {book.isFree ? "مجاني" : book.price}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/book/${book.id}`} className="group flex flex-col bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border/50">
      {/* Cover */}
      <div className="relative overflow-hidden aspect-[3/4] bg-muted">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Free/Paid badge */}
        <div className={`absolute top-2 right-2 text-xs font-bold px-2.5 py-1 rounded-full shadow ${book.isFree ? "bg-green-500 text-white" : "bg-primary text-primary-foreground"}`}>
          {book.isFree ? "مجاني" : book.price}
        </div>
        {/* Hover action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white/90 text-primary text-sm font-bold px-4 py-2 rounded-full shadow-lg">
            {book.isFree ? "اقرأ الآن" : "اشترِ الآن"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex flex-wrap gap-1">
          {book.tags.slice(0, 2).map(tag => (
            <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[tag] || "bg-muted text-muted-foreground"}`}>
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-bold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {book.title}
        </h3>
        <p className="text-xs text-muted-foreground">{book.author}</p>
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{book.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Eye className="w-3 h-3" />
            <span className="text-xs">{book.views}</span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="px-3 pb-3">
        <button className={`w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl transition-all duration-200 ${
          book.isFree
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-purple"
            : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground border border-border"
        }`}>
          {book.isFree ? <BookOpen className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
          {book.isFree ? "اقرأ الآن" : "اشترِ الآن"}
        </button>
      </div>
    </Link>
  );
}
