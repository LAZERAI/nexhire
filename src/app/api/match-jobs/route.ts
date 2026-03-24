import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { embedding } = await request.json();

    if (!embedding) {
      return NextResponse.json({ error: "No embedding provided" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Call the RPC function match_jobs
    const { data: matches, error } = await supabase.rpc('match_jobs', {
      query_embedding: embedding,
      match_threshold: 0.7, // Adjustable threshold
      match_count: 5
    });

    if (error) throw error;

    // Enhance matches with company info if not already joined (RPC returns what we defined)
    // My RPC in Phase 2 returned company_id. Ideally I'd join it. 
    // Since RPC returns a table structure, I might need to fetch company details separately 
    // OR update the RPC to return company name. 
    // For now, I'll loop and fetch (n+1) or just use what I have.
    // Actually, looking back at my SQL, the RPC returns `company_id`.
    // I will fetch company details for these matches.
    
    const enrichedMatches = await Promise.all(matches.map(async (match: any) => {
        const { data: company } = await supabase
            .from('companies')
            .select('name, logo_url')
            .eq('id', match.company_id)
            .single();
        return { ...match, company: company?.name || "Unknown", logo_url: company?.logo_url };
    }));

    return NextResponse.json({ matches: enrichedMatches });
  } catch (error: any) {
    console.error("Match error:", error);
    return NextResponse.json(
      { error: "Failed to match jobs" },
      { status: 500 }
    );
  }
}
