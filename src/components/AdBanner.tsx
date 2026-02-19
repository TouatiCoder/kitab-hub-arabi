interface AdBannerProps {
  slot?: string;
  format?: "horizontal" | "rectangle" | "vertical";
  className?: string;
}

export function AdBanner({ slot = "xxxxxxxxxx", format = "horizontal", className = "" }: AdBannerProps) {
  const sizeClasses = {
    horizontal: "h-24 md:h-28",
    rectangle: "h-64 max-w-sm mx-auto",
    vertical: "h-72 max-w-xs mx-auto",
  };

  return (
    <div
      className={`w-full rounded-2xl border-2 border-dashed border-border bg-muted/50 flex items-center justify-center ${sizeClasses[format]} ${className}`}
      data-ad-slot={slot}
      data-ad-format={format}
    >
      <div className="text-center text-muted-foreground">
        <p className="text-xs font-medium opacity-60">إعلان</p>
        <p className="text-[10px] opacity-40">AdSense — {slot}</p>
      </div>
    </div>
  );
}
