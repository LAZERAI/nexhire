import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const FALLBACK_JOBS = [
  {
    id: "f0000001",
    title: "AI Engineer",
    company: "Coderzon",
    location: "Remote",
    salary_range: "₹18L-22L",
    job_type: "full-time",
    experience_level: "senior",
    work_mode: "remote",
    skills_required: ["Python", "ML", "NLP", "Vector Databases"],
    similarity: 0.73,
    description: "Build, optimize, and deploy production-grade AI models and pipelines.",
  },
  {
    id: "f0000002",
    title: "Full Stack Python Developer",
    company: "Coderzon",
    location: "Kochi, India",
    salary_range: "₹12L-16L",
    job_type: "full-time",
    experience_level: "mid",
    work_mode: "hybrid",
    skills_required: ["Django", "React", "PostgreSQL", "Docker"],
    similarity: 0.67,
    description: "Develop and maintain end-to-end web platforms with Python backend and React frontend.",
  },
  {
    id: "f0000003",
    title: "ML Ops Engineer",
    company: "Coderzon",
    location: "Bengaluru, India",
    salary_range: "₹14L-18L",
    job_type: "full-time",
    experience_level: "mid",
    work_mode: "onsite",
    skills_required: ["Kubernetes", "CI/CD", "Terraform", "Linux"],
    similarity: 0.63,
    description: "Implement scalable ML pipelines and monitor model lifecycle in production.",
  },
  {
    id: "f0000004",
    title: "Data Scientist",
    company: "Coderzon",
    location: "Remote",
    salary_range: "₹16L-20L",
    job_type: "full-time",
    experience_level: "mid",
    work_mode: "remote",
    skills_required: ["Python", "SQL", "Statistics", "Modeling"],
    similarity: 0.61,
    description: "Analyze large datasets and derive actionable insights with ML models.",
  },
  {
    id: "f0000005",
    title: "Product Manager - AI",
    company: "Coderzon",
    location: "Chennai, India",
    salary_range: "₹20L-24L",
    job_type: "full-time",
    experience_level: "senior",
    work_mode: "hybrid",
    skills_required: ["Product Strategy", "AI", "Stakeholder Management"],
    similarity: 0.58,
    description: "Drive AI product vision, roadmap, and execution to deliver customer value.",
  },
  {
    id: "f0000006",
    title: "Data Engineer",
    company: "Coderzon",
    location: "Pune, India",
    salary_range: "₹13L-17L",
    job_type: "full-time",
    experience_level: "mid",
    work_mode: "hybrid",
    skills_required: ["ETL", "BigQuery", "Airflow", "Python"],
    similarity: 0.56,
    description: "Build data pipelines for analytics and ML data consumption.",
  },
  {
    id: "f0000007",
    title: "Front End Engineer",
    company: "Coderzon",
    location: "Remote",
    salary_range: "₹10L-14L",
    job_type: "full-time",
    experience_level: "mid",
    work_mode: "remote",
    skills_required: ["React", "TypeScript", "UI/UX", "Testing"],
    similarity: 0.52,
    description: "Create polished user interfaces with robust React architecture.",
  },
  {
    id: "f0000008",
    title: "DevOps Engineer",
    company: "Coderzon",
    location: "Hyderabad, India",
    salary_range: "₹12L-15L",
    job_type: "full-time",
    experience_level: "mid",
    work_mode: "onsite",
    skills_required: ["AWS", "CI/CD", "Ansible", "Monitoring"],
    similarity: 0.50,
    description: "Improve infrastructure reliability and deploy applications seamlessly.",
  },
];

async function fetchStaticJobs(supabase: any, limit = 5) {
  try {
    const { data } = await supabase
      .from("jobs")
      .select(
        "id, title, location, salary_range, job_type, experience_level, work_mode, skills_required, company_id"
      )
      .limit(limit);

    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.error("Fallback static jobs query failed", err);
  }

  return FALLBACK_JOBS.slice(0, limit);
}

export async function POST(request: Request) {
  try {
    const { embedding } = await request.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    let matches: any[] = [];
    let warning: string | null = null;

    if (Array.isArray(embedding) && embedding.length > 0) {
      const threshold = 0.5;
      const { data, error } = await supabase.rpc("match_jobs", {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: 5,
      });

      if (error) {
        console.error("RPC match_jobs error:", error);
        warning = "Semantic match failed; showing available jobs instead.";
      } else {
        matches = Array.isArray(data) ? data : [];
      }
    } else {
      warning = "No embedding provided; showing available jobs.";
    }

    if (matches.length === 0) {
      const fallback = await fetchStaticJobs(supabase, 5);
      matches = fallback;
      warning = warning || "No semantic matches found; showing available jobs.";
    }

    return NextResponse.json({ matches, warning });
  } catch (error: any) {
    console.error("Match error:", error);
    return NextResponse.json({ matches: FALLBACK_JOBS.slice(0, 5), warning: "An error occurred while matching jobs; showing fallback jobs." });
  }
}

