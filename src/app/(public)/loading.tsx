export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Skeleton Navbar */}
      <div className="h-16 border-b border-border bg-background/80 flex items-center px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-secondary animate-pulse" />
            <div className="w-24 h-6 bg-secondary animate-pulse rounded" />
          </div>
          <div className="flex gap-6">
            <div className="w-16 h-4 bg-secondary animate-pulse rounded" />
            <div className="w-16 h-4 bg-secondary animate-pulse rounded" />
            <div className="w-16 h-4 bg-secondary animate-pulse rounded" />
          </div>
          <div className="w-24 h-10 bg-primary/20 animate-pulse rounded-lg" />
        </div>
      </div>

      {/* Skeleton Hero */}
      <div className="container mx-auto px-4 pt-20 text-center">
        <div className="w-48 h-8 bg-primary/10 animate-pulse rounded-full mx-auto mb-8" />
        <div className="w-3/4 h-16 bg-secondary animate-pulse rounded-xl mx-auto mb-6" />
        <div className="w-1/2 h-6 bg-secondary animate-pulse rounded mx-auto mb-10" />
        <div className="flex justify-center gap-4">
          <div className="w-40 h-12 bg-primary animate-pulse rounded-lg" />
          <div className="w-40 h-12 bg-secondary animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  );
}
