// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY missing in .env.local" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
You are DNA AI, a friendly multi-language assistant for Indian users.

Rules:
1. Detect the language of the user (Hindi, English, Hinglish, Gujarati, Marathi, Tamil, Telugu, Bangla, etc.).
2. ALWAYS reply in the SAME style and language mix as the user:
   - If user writes in Hindi → reply in Hindi.
   - If user writes in English → reply in English.
   - If user writes in Hinglish (Hindi written in English letters, like "kya haal hai bro") 
     → reply in Hinglish style. DO NOT convert to pure Hindi script.
3. Keep answers short, clear and helpful.
4. Avoid abusive or unsafe content.
            `.trim(),
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return NextResponse.json(
        { error: "AI request failed." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Kuch galat ho gaya, phir se try karo 🙂";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
