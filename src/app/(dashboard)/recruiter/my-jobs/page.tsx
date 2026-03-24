import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { 
  Briefcase, 
  MapPin, 
  Users, 
  Calendar, 
  MoreHorizontal, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function MyJobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get Company
  const { data: company } = await supabase
    .from('companies')
    .select('id, name')
    .eq('owner_id', user?.id)
    .single();

  if (!company) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-3xl font-bold text-foreground mb-4">No Company Profile Found</h1>
        <Link href="/recruiter/company" className="text-primary hover:underline">
          Create Company Profile
        </Link>
      </div>
    );
  }

  // Fetch Jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">My Jobs</h1>
          <p className="text-muted-foreground">Manage your active listings and applications.</p>
        </div>
        <Link href="/recruiter/post-job">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            <PlusCircle size={18} />
            <span>Post New Job</span>
          </button>
        </Link>
      </div>

      <div className="space-y-4">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="group p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                  <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold uppercase">
                    Active
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium mb-4">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                  <span className="flex items-center gap-1"><Briefcase size={14} /> {job.job_type}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> Posted {new Date(job.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Users size={16} className="text-primary" />
                    <span>0 Applicants</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Eye size={16} className="text-purple-500" />
                    <span>24 Views</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start md:self-center w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-border">
                <Link 
                  href={`/recruiter/jobs/${job.id}`} 
                  className="flex-1 md:flex-none px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-sm font-bold rounded-lg border border-border transition-colors text-center"
                >
                  Manage
                </Link>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                  <Edit size={18} />
                </button>
                <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-border rounded-xl bg-secondary/5">
            <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-6">
              <Briefcase size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No jobs posted yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Create your first job posting to start receiving applications from our AI-matched talent pool.
            </p>
            <Link href="/recruiter/post-job" className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all inline-flex items-center gap-2">
              <PlusCircle size={18} /> Post First Job
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
