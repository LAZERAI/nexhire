import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const fetchEmbedding = async (attempt = 1): Promise<any> => {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGING_FACE_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: text }),
        }
      );

      if (response.status === 503 && attempt < 4) {
        // Model is loading; wait and retry
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return fetchEmbedding(attempt + 1);
      }

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`HuggingFace API error (${response.status}): ${error}`);
      }

      return await response.json();
    };

    const result = await fetchEmbedding();
    
    // The API might return [number[]] or number[] depending on input format. 
    // We sent a single string, so it usually returns a single vector (number[]) or [number[]].
    // Let's normalize.
    const embedding = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;

    return NextResponse.json({ embedding });
  } catch (error: any) {
    console.error("Embedding error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Failed to generate embedding" },
      { status: 500 }
    );
  }
}
