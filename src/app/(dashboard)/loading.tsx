export default function DashboardLoading() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Skeleton Sidebar */}
      <div className="w-64 border-r border-border bg-[#0f0f10] p-6 space-y-8 hidden md:block">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary/20 animate-pulse" />
          <div className="w-24 h-6 bg-secondary animate-pulse rounded" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-full h-10 bg-secondary/50 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>

      {/* Skeleton Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-end mb-8">
          <div className="space-y-3">
            <div className="w-64 h-10 bg-secondary animate-pulse rounded-lg" />
            <div className="w-48 h-4 bg-secondary animate-pulse rounded" />
          </div>
          <div className="flex gap-3">
            <div className="w-32 h-10 bg-secondary animate-pulse rounded-lg" />
            <div className="w-32 h-10 bg-primary/20 animate-pulse rounded-lg" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-secondary/30 border border-border animate-pulse rounded-xl" />
          ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 w-48 bg-secondary animate-pulse rounded mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-secondary/20 border border-border animate-pulse rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-secondary/20 border border-border animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  );
}
