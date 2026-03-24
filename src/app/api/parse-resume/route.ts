import { NextResponse } from "next/server";
import pdf from "pdf-parse";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const textInput = formData.get("text") as string | null;

    if (textInput) {
      return NextResponse.json({ text: textInput });
    }

    if (!file) {
      return NextResponse.json(
        { error: "No file or text provided" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const data = await pdf(buffer);
    
    return NextResponse.json({ text: data.text });
  } catch (error: any) {
    console.error("Parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse resume" },
      { status: 500 }
    );
  }
}
