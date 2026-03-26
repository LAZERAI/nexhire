import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const textInput = formData.get("text") as string | null;
      
      if (textInput) {
        return NextResponse.json({ text: textInput });
      }
      
      return NextResponse.json({ 
        text: "Please use the Paste Text tab to paste your resume content.",
        isPdf: true 
      });
    }
    
    const body = await request.json().catch(() => ({}));
    if (body.text) {
      return NextResponse.json({ text: body.text });
    }
    
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to parse input" }, { status: 500 });
  }
}
