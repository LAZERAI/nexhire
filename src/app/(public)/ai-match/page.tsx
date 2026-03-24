"use client";

import { useState, useEffect } from "react";
import { 
  UploadCloud, 
  FileText, 
  Zap, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  BrainCircuit,
  Target,
  Sparkles,
  ChevronRight,
  Lock,
  Search,
  Code2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock Results Data based on Coderzon jobs
const MATCH_RESULTS = [
  {
    id: "1",
    title: "AI Engineer",
    company: "CODERZON",
    matchScore: 98,
    salary: "₹8 LPA - ₹15 LPA",
    tags: ["Python", "PyTorch", "LLMs"],
    reasoning: "Your experience with Transformer architectures and Python matches 98% of this role's core requirements. Strong overlap in PyTorch projects.",
    missingSkills: ["Kubeflow", "LangChain"]
  },
  {
    id: "2",
    title: "Data Analyst",
    company: "CODERZON",
    matchScore: 89,
    salary: "₹5 LPA - ₹7 LPA",
    tags: ["SQL", "Pandas", "Tableau"],
    reasoning: "Strong statistical background matches the data visualization needs. Your SQL proficiency is a key asset here.",
    missingSkills: ["PowerBI"]
  },
  {
    id: "3",
    title: "Python Backend Developer",
    company: "CODERZON",
    matchScore: 76,
    salary: "₹6 LPA - ₹10 LPA",
    tags: ["FastAPI", "Redis", "Docker"],
    reasoning: "Good match for Python backend logic, though this role requires more containerization experience than found in your profile.",
    missingSkills: ["Docker", "Kubernetes", "Microservices"]
  },
  {
    id: "4",
    title: "Machine Learning Engineer",
    company: "CODERZON",
    matchScore: 72,
    salary: "Not Disclosed",
    tags: ["TensorFlow", "MLOps", "NLP"],
    reasoning: "Your NLP project portfolio aligns well, but this senior role requires extensive production deployment experience.",
    missingSkills: ["AWS SageMaker", "CI/CD"]
  },
  {
    id: "5",
    title: "Full Stack Python Developer",
    company: "CODERZON",
    matchScore: 65,
    salary: "₹6 LPA - ₹9 LPA",
    tags: ["Django", "React", "PostgreSQL"],
    reasoning: "You have the Python skills, but this role is heavy on React frontend work which appears limited in your resume.",
    missingSkills: ["React", "TypeScript", "Tailwind CSS"]
  }
];

const ANALYSIS_STEPS = [
  { label: "Parsing resume text...", icon: <FileText size={16} /> },
  { label: "Generating vector embeddings...", icon: <Code2 size={16} /> },
  { label: "Calculating cosine similarity...", icon: <Zap size={16} /> },
  { label: "Ranking opportunities...", icon: <Target size={16} /> },
];

export default function AIMatchPage() {
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resumeText, setResumeText] = useState("");

  const handleAnalyze = () => {
    if (!resumeText && inputMode === "paste") return;
    
    setIsAnalyzing(true);
    setAnalysisStep(0);

    // Simulate multi-step progress
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setAnalysisStep(step);
      if (step >= ANALYSIS_STEPS.length) {
        clearInterval(interval);
        setIsAnalyzing(false);
        setShowResults(true);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background pt-12 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Hero Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            showResults ? "lg:opacity-100" : "lg:col-start-4 lg:col-span-6"
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
                  <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group bg-background">
                    <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud size={32} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Drop your resume here</h3>
                    <p className="text-sm text-muted-foreground mb-6">PDF, DOCX up to 10MB</p>
                    <button className="px-6 py-2 bg-secondary text-foreground font-bold rounded-lg border border-border group-hover:border-primary/30 transition-all text-sm">
                      Select File
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

                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full mt-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,112,243,0.3)] disabled:opacity-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg relative overflow-hidden"
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
                  <div className="mt-6 space-y-3">
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
          {showResults && (
            <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-8 duration-700 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Target className="text-primary" /> Top Semantic Matches
                </h2>
                <span className="text-sm text-muted-foreground">Based on skill adjacency & experience</span>
              </div>

              {MATCH_RESULTS.map((job) => (
                <div key={job.id} className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 p-4">
                    <div className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm",
                      job.matchScore >= 90 ? "bg-green-500/10 border-green-500/20 text-green-500" :
                      job.matchScore >= 80 ? "bg-primary/10 border-primary/20 text-primary" :
                      "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                    )}>
                      <Zap size={12} fill="currentColor" />
                      {job.matchScore}% Semantic Match
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{job.title}</h3>
                  <div className="text-sm font-medium text-muted-foreground mb-4">{job.company} • {job.salary}</div>

                  <div className="bg-secondary/30 rounded-lg p-4 mb-4 border border-border/50">
                    <div className="flex items-start gap-3">
                      <BrainCircuit size={18} className="text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <span className="text-foreground font-bold">AI Insight:</span> {job.reasoning}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {job.missingSkills && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <span className="font-bold text-destructive">Gap Analysis:</span>
                      <span>Missing keywords: {job.missingSkills.join(", ")}</span>
                    </div>
                  )}
                  
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
