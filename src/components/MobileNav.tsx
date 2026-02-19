import { Home, BookOpen, Search, Library, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "الرئيسية", icon: Home, path: "/" },
  { label: "الكتب", icon: BookOpen, path: "/books" },
  { label: "البحث", icon: Search, path: "/search" },
  { label: "مكتبتي", icon: Library, path: "/library" },
  { label: "حسابي", icon: User, path: "/login" },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-card border-t border-border shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-200",
                isActive ? "bg-primary/10" : ""
              )}>
                <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5]" : "")} />
              </div>
              <span className={cn("text-[10px] font-medium", isActive ? "font-bold" : "")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
