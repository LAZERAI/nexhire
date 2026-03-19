export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar will go here */}
      <aside className="hidden w-64 border-r border-border md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b border-border px-6 font-bold text-primary">
            NexHire
          </div>
          <nav className="flex-1 space-y-1 px-4 py-4">
            {/* Sidebar links will go here */}
          </nav>
        </div>
      </aside>
      
      <div className="flex flex-1 flex-col">
        {/* Top bar for dashboard */}
        <header className="flex h-14 items-center border-b border-border bg-background/50 px-6 backdrop-blur-sm">
          <div className="ml-auto flex items-center space-x-4">
            {/* User profile dropdown will go here */}
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
