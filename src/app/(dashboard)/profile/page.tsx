import { createClient } from "@/lib/supabase-server";
import ProfileForm from "@/components/features/profile/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Edit Profile</h1>
        <p className="text-muted-foreground">Update your professional details and resume to get better AI matches.</p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
