import { createClient } from "@/lib/supabase-server";
import ApplicationsList from "@/components/features/jobs/ApplicationsList";

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: applications, count } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      created_at,
      jobs (
        title,
        location,
        companies (
          name,
          logo_url
        )
      )
    `, { count: 'exact' })
    .eq('candidate_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2 flex items-center gap-3">
            My Applications
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold">
              {count || 0}
            </span>
          </h1>
          <p className="text-muted-foreground">Track the status of your job applications in real-time.</p>
        </div>
      </div>
      <ApplicationsList applications={applications as any || []} />
    </div>
  );
}
