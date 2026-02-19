export function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/50 animate-pulse">
      <div className="aspect-[3/4] bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-muted rounded-full w-2/3" />
        <div className="h-4 bg-muted rounded-full" />
        <div className="h-3 bg-muted rounded-full w-1/2" />
        <div className="h-8 bg-muted rounded-xl mt-2" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex gap-4 p-3 animate-pulse">
      <div className="w-16 h-20 bg-muted rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 bg-muted rounded-full w-3/4" />
        <div className="h-3 bg-muted rounded-full w-1/2" />
        <div className="h-3 bg-muted rounded-full w-1/3" />
      </div>
    </div>
  );
}
