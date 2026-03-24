import { NextResponse } from "next/server";

// Using require for CommonJS module to bypass ESM default export issues in Next.js
// pdf-parse exports a function; this ensures both CJS and interop cases are covered.
const _pdfParse = require("pdf-parse");
const pdfParse = _pdfParse?.default ?? _pdfParse;

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
    
    // Call pdf-parse using the required instance
    const data = await pdfParse(buffer);
    
    return NextResponse.json({ text: data.text });
  } catch (error: any) {
    console.error("Parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse resume" },
      { status: 500 }
    );
  }
}
