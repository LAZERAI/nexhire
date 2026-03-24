import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch minimal profile data for the sidebar
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const userProfile = {
    full_name: profile?.full_name || user.user_metadata?.full_name || "User",
    email: user.email,
    avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar user={userProfile} />
      
      <div className="flex flex-1 flex-col md:pl-0"> 
        {/* Note: Sidebar is fixed on mobile/desktop handling is inside Sidebar component, 
            but we might need margin-left on desktop if it's fixed. 
            However, the Sidebar component implementation uses 'md:static' which means 
            it takes up space in the flex container on desktop. 
            So we don't need margin-left. */}
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pt-16 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
