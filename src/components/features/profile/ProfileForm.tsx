"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { UploadCloud, X, Save, Loader2, User, MapPin, Briefcase, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ProfileForm({ profile }: { profile: any }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    headline: profile?.headline || "",
    bio: profile?.bio || "",
    location: profile?.location || "",
    experience_years: profile?.experience_years || 0,
    skills: profile?.skills || [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s: string) => s !== skillToRemove) });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let resume_url = profile?.resume_url;

      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, resumeFile);

        if (uploadError) throw uploadError;
        
        // Get public URL (assuming public bucket for MVP, or signed URL logic later)
        const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(fileName);
        resume_url = publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          resume_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      router.refresh();
      alert("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column: Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="text-primary" size={20} /> Personal Info
          </h3>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">Full Name</label>
              <input 
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none transition-all"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">Headline</label>
              <input 
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none transition-all"
                placeholder="e.g. Senior React Developer | UI Enthusiast"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-muted-foreground" size={16} />
                  <input 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-secondary/30 border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none transition-all"
                    placeholder="e.g. Kochi, Kerala"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Experience (Years)</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3.5 text-muted-foreground" size={16} />
                  <input 
                    name="experience_years"
                    type="number"
                    value={formData.experience_years}
                    onChange={handleChange}
                    className="w-full bg-secondary/30 border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none transition-all"
                    placeholder="e.g. 5"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">Bio</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none transition-all resize-none"
                placeholder="Tell us about your professional journey..."
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Zap className="text-primary" size={20} /> Skills
          </h3>
          <div className="space-y-4">
            <input 
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={addSkill}
              className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none transition-all"
              placeholder="Type a skill and press Enter..."
            />
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {formData.skills.map((skill: string) => (
                <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors"><X size={14} /></button>
                </span>
              ))}
              {formData.skills.length === 0 && (
                <span className="text-sm text-muted-foreground italic">No skills added yet.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Resume & Save */}
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FileText className="text-primary" size={20} /> Resume
          </h3>
          
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 hover:bg-secondary/50 transition-all cursor-pointer relative">
            <input 
              type="file" 
              accept=".pdf,.docx"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-4">
              <UploadCloud size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-bold text-foreground mb-1">
              {resumeFile ? resumeFile.name : "Click to upload or drag & drop"}
            </p>
            <p className="text-xs text-muted-foreground">PDF or DOCX up to 5MB</p>
          </div>

          {profile?.resume_url && !resumeFile && (
            <div className="mt-4 p-3 bg-secondary/30 rounded-lg border border-border flex items-center gap-3">
              <FileText size={16} className="text-primary" />
              <a href={profile.resume_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-foreground hover:underline truncate flex-1">
                Current Resume
              </a>
            </div>
          )}
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
