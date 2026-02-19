import { BookOpen, Users, ShoppingCart, DollarSign, FileText, TrendingUp, TrendingDown } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  BookOpen, Users, ShoppingCart, DollarSign, FileText,
};

interface StatsCardProps {
  label: string;
  value: string;
  icon: string;
  trend: string;
  positive: boolean;
}

export function StatsCard({ label, value, icon, trend, positive }: StatsCardProps) {
  const Icon = iconMap[icon] || BookOpen;
  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-purple flex-shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className={`flex items-center gap-1 mt-3 text-sm font-semibold ${positive ? "text-green-600" : "text-destructive"}`}>
        {positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span>{trend} من الشهر الماضي</span>
      </div>
    </div>
  );
}
