import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import PostJobForm from "@/components/features/jobs/PostJobForm";
import { PlusCircle } from "lucide-react";

export default async function PostJobPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch Company
  const { data: company } = await supabase
    .from('companies')
    .select('id, name')
    .eq('owner_id', user?.id)
    .single();

  if (!company) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-6">
          <PlusCircle size={32} className="text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Create Your Company First</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Before posting jobs, you need to set up your company profile. This helps candidates know who they are applying to.
        </p>
        <Link 
          href="/recruiter/company" 
          className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          Create Company Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Post a New Job</h1>
        <p className="text-muted-foreground">Find the perfect candidate for {company.name}.</p>
      </div>
      <PostJobForm companyId={company.id} companyName={company.name} />
    </div>
  );
}
