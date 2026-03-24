import { createClient } from "@/lib/supabase-server";
import ApplicationsList from "@/components/features/jobs/ApplicationsList";

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: applications } = await supabase
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
    `)
    .eq('candidate_id', user?.id)
    .order('created_at', { ascending: false });

  // Transform data to match the component's expected type if necessary, 
  // but Supabase query structure should mostly match.
  // We might need to cast or ensure types are aligned.

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">My Applications</h1>
        <p className="text-muted-foreground">Track the status of your job applications in real-time.</p>
      </div>
      <ApplicationsList applications={applications as any || []} />
    </div>
  );
}
