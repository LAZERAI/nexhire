import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

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

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HuggingFace API error: ${error}`);
    }

    const result = await response.json();
    
    // The API might return [number[]] or number[] depending on input format. 
    // We sent a single string, so it usually returns a single vector (number[]) or [number[]].
    // Let's normalize.
    const embedding = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;

    return NextResponse.json({ embedding });
  } catch (error: any) {
    console.error("Embedding error:", error);
    return NextResponse.json(
      { error: "Failed to generate embedding" },
      { status: 500 }
    );
  }
}
