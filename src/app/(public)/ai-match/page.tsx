"use client";

import { useState, useRef } from "react";
import { 
  UploadCloud, 
  FileText, 
  Zap, 
  CheckCircle2, 
  Loader2, 
  BrainCircuit,
  Target,
  Sparkles,
  ChevronRight,
  Lock,
  Code2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Match = {
  id: string;
  title: string;
  company: string;
  salary_range: string;
  similarity: number;
  description: string;
  skills_required: string[];
  reasoning?: string;
  gapAnalysis?: string;
  matchedSkills?: string[];
};

const ANALYSIS_STEPS = [
  { label: "Parsing resume data...", icon: <FileText size={16} /> },
  { label: "Generating vector embeddings...", icon: <Code2 size={16} /> },
  { label: "Performing semantic vector search...", icon: <Zap size={16} /> },
  { label: "Generating AI matching insights...", icon: <BrainCircuit size={16} /> },
];

export default function AIMatchPage() {
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Match[]>([]);
  const [resumeText, setResumeText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (inputMode === "upload" && !selectedFile) {
      setError("Please select a resume file first.");
      return;
    }
    if (inputMode === "paste" && !resumeText.trim()) {
      setError("Please paste your resume text first.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep(0);
    setError(null);
    setResults([]);

    try {
      // Step 1: Parse Resume
      setAnalysisStep(0);
      const formData = new FormData();
      if (inputMode === "upload" && selectedFile) {
        formData.append("file", selectedFile);
      } else {
        formData.append("text", resumeText);
      }

      const parseRes = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });
      const { text, error: parseError } = await parseRes.json();
      if (parseError) throw new Error(parseError);

      // Step 2: Generate Embedding
      setAnalysisStep(1);
      const embedRes = await fetch("/api/generate-embedding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const { embedding, error: embedError } = await embedRes.json();
      if (embedError) throw new Error(embedError);

      // Step 3: Match Jobs
      setAnalysisStep(2);
      const matchRes = await fetch("/api/match-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embedding }),
      });
      const { matches, error: matchError } = await matchRes.json();
      if (matchError) throw new Error(matchError);

      if (matches.length === 0) {
        setError("No highly relevant matches found. Try updating your resume with more details.");
        setIsAnalyzing(false);
        return;
      }

      // Step 4: AI Insights
      setAnalysisStep(3);
      const insightsRes = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text, jobs: matches }),
      });
      const { insights, error: insightError } = await insightsRes.json();
      
      // Combine results with insights
      const finalResults = matches.map((m: any) => {
        const insight = insights?.find((i: any) => i.id === m.id);
        return {
          ...m,
          reasoning: insight?.reasoning || "Strong semantic alignment with role requirements.",
          gapAnalysis: insight?.gapAnalysis || "No major gaps identified.",
          matchedSkills: insight?.matchedSkills || m.skills_required?.slice(0, 3)
        };
      });

      setResults(finalResults);
      setAnalysisStep(4);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-12 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold mb-6 uppercase tracking-widest">
            <BrainCircuit size={16} />
            <span>Semantic Vector Engine</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-foreground">
            Stop guessing. Start matching.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our AI analyzes your skills, experience, and potential—not just your keywords. Upload your resume to see where you truly belong.
          </p>
        </div>

        {/* Main Interaction Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input */}
          <div className={cn(
            "lg:col-span-5 transition-all duration-500",
            results.length > 0 ? "lg:opacity-100" : "lg:col-start-4 lg:col-span-6"
          )}>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="flex border-b border-border">
                <button
                  onClick={() => setInputMode("upload")}
                  className={cn(
                    "flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors",
                    inputMode === "upload" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
                  )}
                >
                  <UploadCloud size={16} /> Upload PDF
                </button>
                <button
                  onClick={() => setInputMode("paste")}
                  className={cn(
                    "flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors",
                    inputMode === "paste" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
                  )}
                >
                  <FileText size={16} /> Paste Text
                </button>
              </div>

              <div className="p-8">
                {inputMode === "upload" ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group bg-background"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden" 
                      accept=".pdf"
                    />
                    <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud size={32} className={cn("transition-colors", selectedFile ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {selectedFile ? selectedFile.name : "Drop your resume here"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">PDF files up to 10MB</p>
                    <button className="px-6 py-2 bg-secondary text-foreground font-bold rounded-lg border border-border group-hover:border-primary/30 transition-all text-sm">
                      {selectedFile ? "Change File" : "Select File"}
                    </button>
                  </div>
                ) : (
                  <textarea 
                    className="w-full h-64 bg-background border border-border rounded-xl p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono placeholder:text-muted-foreground"
                    placeholder="Paste your resume content here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                )}

                {error && (
                  <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full mt-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg relative overflow-hidden"
                >
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center gap-1 w-full">
                      <span className="flex items-center gap-2 text-sm uppercase tracking-wider animate-pulse">
                        <Loader2 size={16} className="animate-spin" /> Processing...
                      </span>
                    </div>
                  ) : (
                    <>
                      <Sparkles size={20} /> Analyze My Resume
                    </>
                  )}
                </button>

                {/* Progress Steps */}
                {isAnalyzing && (
                  <div className="mt-6 space-y-3 animate-fade-in-up">
                    {ANALYSIS_STEPS.map((step, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center border transition-colors",
                          i < analysisStep 
                            ? "bg-green-500 border-green-500 text-white" 
                            : i === analysisStep 
                              ? "border-primary text-primary animate-pulse" 
                              : "border-border text-muted-foreground"
                        )}>
                          {i < analysisStep ? <CheckCircle2 size={12} /> : step.icon}
                        </div>
                        <span className={cn(
                          "transition-colors",
                          i < analysisStep ? "text-green-500 font-medium" :
                          i === analysisStep ? "text-primary font-bold" : "text-muted-foreground"
                        )}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          {results.length > 0 && (
            <div className="lg:col-span-7 animate-fade-in-up space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Target className="text-primary" /> Top Semantic Matches
                </h2>
                <span className="text-sm text-muted-foreground">Found {results.length} highly relevant roles</span>
              </div>

              {results.map((job) => (
                <div key={job.id} className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all overflow-hidden shadow-sm hover-lift">
                  <div className="absolute top-0 right-0 p-4">
                    <div className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm",
                      Math.round(job.similarity * 100) >= 90 ? "bg-green-500/10 border-green-500/20 text-green-500" :
                      "bg-primary/10 border-primary/20 text-primary"
                    )}>
                      <Zap size={12} fill="currentColor" />
                      {Math.round(job.similarity * 100)}% Semantic Match
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{job.title}</h3>
                  <div className="text-sm font-medium text-muted-foreground mb-4">{job.company} • {job.salary_range}</div>

                  <div className="bg-secondary/30 rounded-lg p-4 mb-4 border border-border/50">
                    <div className="flex items-start gap-3">
                      <BrainCircuit size={18} className="text-primary shrink-0 mt-0.5" />
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          <span className="text-foreground font-bold">AI Insight:</span> {job.reasoning}
                        </p>
                        {job.gapAnalysis && (
                          <div className="text-xs p-2 rounded bg-destructive/5 border border-destructive/10 text-muted-foreground">
                            <span className="text-destructive font-bold uppercase tracking-tighter mr-2">Gap Analysis:</span>
                            {job.gapAnalysis}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.matchedSkills?.map(tag => (
                      <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                    {job.skills_required?.filter(s => !job.matchedSkills?.includes(s)).slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-border flex justify-end">
                    <Link href="/login" className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                      <Lock size={14} /> Sign in to Apply
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
