import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SEED_SECRET = "nexhire-seed-2026";

const FALLBACK_JOBS = [
  {
    title: "AI Engineer",
    description: "Build, optimize, and deploy production-grade AI models and pipelines.",
    location: "Remote",
    salary_range: "₹18L-22L",
    job_type: "full-time",
    experience_level: "senior",
    work_mode: "remote",
    skills_required: ["Python", "ML", "NLP", "Vector Databases"],
  },
  {
    title: "Full Stack Python Developer",
    description: "Develop and maintain end-to-end web platforms with Python backend and React frontend.",
    location: "Kochi, India",
    salary_range: "₹12L-16L",
    job_type: "full-time",
    experience_level: "mid",
    work_mode: "hybrid",
    skills_required: ["Django", "React", "PostgreSQL", "Docker"],
  },
  {
    title: "ML Ops Engineer",
    description: "Implement scalable ML pipelines and monitor model lifecycle in production.",
    location: "Bengaluru, India",
    salary_range: "₹14L-18L",
    job_type: "full-time",
    experience_level: "mid",
    work_mode: "onsite",
    skills_required: ["Kubernetes", "CI/CD", "Terraform", "Linux"],
  },
  {
    title: "Data Scientist",
    description: "Analyze large datasets and derive actionable insights with ML models.",
    location: "Remote",
    salary_range: "₹16L-20L",
    job_type: "full-time",
    experience_level: "mid",
    work_mode: "remote",
    skills_required: ["Python", "SQL", "Statistics", "Modeling"],
  },
  {
    title: "Product Manager - AI",
    description: "Drive AI product vision, roadmap, and execution to deliver customer value.",
    location: "Chennai, India",
    salary_range: "₹20L-24L",
    job_type: "full-time",
    experience_level: "senior",
    work_mode: "hybrid",
    skills_required: ["Product Strategy", "AI", "Stakeholder Management"],
  },
  {
    title: "Data Engineer",
    description: "Build data pipelines for analytics and ML data consumption.",
    location: "Pune, India",
    salary_range: "₹13L-17L",
    job_type: "full-time",
    experience_level: "mid",
    work_mode: "hybrid",
    skills_required: ["ETL", "BigQuery", "Airflow", "Python"],
  },
  {
    title: "Front End Engineer",
    description: "Create polished user interfaces with robust React architecture.",
    location: "Remote",
    salary_range: "₹10L-14L",
    job_type: "full-time",
    experience_level: "mid",
    work_mode: "remote",
    skills_required: ["React", "TypeScript", "UI/UX", "Testing"],
  },
  {
    title: "DevOps Engineer",
    description: "Improve infrastructure reliability and deploy applications seamlessly.",
    location: "Hyderabad, India",
    salary_range: "₹12L-15L",
    job_type: "full-time",
    experience_level: "mid",
    work_mode: "onsite",
    skills_required: ["AWS", "CI/CD", "Ansible", "Monitoring"],
  },
];

async function fetchEmbedding(text: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/generate-embedding`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (!data.embedding || !Array.isArray(data.embedding)) {
    throw new Error("Invalid embedding returned");
  }

  return data.embedding;
}

export async function GET(request: Request) {
  const seedSecret = request.headers.get("x-seed-secret");
  if (seedSecret !== SEED_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Supabase config missing" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const summary = {
    totalJobs: 0,
    inserted: 0,
    seeded: 0,
    skipped: 0,
    errors: [] as string[],
    note: "Call this endpoint with header x-seed-secret: nexhire-seed-2026",
  };

  try {
    const { data: jobs, error: fetchError } = await supabase
      .from("jobs")
      .select("id, title, description, embedding, location, salary_range, job_type, experience_level, work_mode, skills_required, company_id");

    if (fetchError) {
      throw fetchError;
    }

    if (!jobs) {
      throw new Error("Failed to read jobs from Supabase");
    }

    summary.totalJobs = jobs.length;

    // If no jobs exist, insert fallback jobs first
    if (jobs.length === 0) {
      // Determine company_id for insertion
      let companyId = null;
      const { data: existingCompanies } = await supabase.from("companies").select("id").limit(1);

      if (existingCompanies && existingCompanies.length > 0) {
        companyId = existingCompanies[0].id;
      } else {
        // Need a valid owner_id to create a company; try with any profile
        const { data: profile } = await supabase.from("profiles").select("id").limit(1).single();
        if (profile?.id) {
          const { data: compCreated, error: compError } = await supabase
            .from("companies")
            .insert({ name: "Coderzon", owner_id: profile.id, description: "Seed data company" })
            .select("id")
            .single();

          if (compError || !compCreated?.id) {
            throw compError || new Error("Unable to create company for seeding");
          }

          companyId = compCreated.id;
        }
      }

      if (!companyId) {
        throw new Error("No company_id available for job inserts. Seed a company first.");
      }

      for (const item of FALLBACK_JOBS) {
        try {
          const description = `${item.title}. ${item.description}`;
          const embedding = await fetchEmbedding(description);

          const { error: insertError } = await supabase.from("jobs").insert({
            title: item.title,
            description: item.description,
            location: item.location,
            salary_range: item.salary_range,
            job_type: item.job_type,
            experience_level: item.experience_level,
            work_mode: item.work_mode,
            skills_required: item.skills_required,
            company_id: companyId,
            embedding,
          });

          if (insertError) {
            summary.errors.push(`insert ${item.title}: ${insertError.message}`);
            continue;
          }

          summary.inserted += 1;
        } catch (e: any) {
          summary.errors.push(`embed/insert ${item.title}: ${e.message}`);
        }
      }

      summary.totalJobs = FALLBACK_JOBS.length;
    }

    // Refresh job list after potential insertion
    const { data: allJobs, error: allError } = await supabase
      .from("jobs")
      .select("id, title, description, embedding")
      .is("embedding", null);

    if (allError) {
      throw allError;
    }

    const toSeed = (allJobs || []).filter((job: any) => job.embedding === null || job.embedding === undefined);

    for (const job of toSeed) {
      try {
        const text = `${job.title}. ${job.description}`;
        const embedding = await fetchEmbedding(text);

        const { error: updateError } = await supabase
          .from("jobs")
          .update({ embedding })
          .eq("id", job.id);

        if (updateError) {
          summary.errors.push(`update ${job.id}: ${updateError.message}`);
          continue;
        }

        summary.seeded += 1;
      } catch (e: any) {
        summary.errors.push(`embed ${job.id}: ${e.message}`);
      }
    }

    if (toSeed.length === 0) {
      summary.skipped = summary.totalJobs;
    }

    return NextResponse.json({
      ...summary,
      message: "Seeded job embeddings successfully.",
      usage: "GET /api/seed-job-embeddings with header x-seed-secret: nexhire-seed-2026",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ...summary,
        error: error.message || "Seeding failed",
        usage: "GET /api/seed-job-embeddings with header x-seed-secret: nexhire-seed-2026",
      },
      { status: 500 }
    );
  }
}
