import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Create a list of three open-ended and engaging questions formatted as a single string.
Each question should be separated by '||'. These questions are for an anonymous social messaging platform
like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics,
focusing instead on universal themes that encourage friendly interaction.
Example output: "What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?"`;

  try {
    const result = await model.generateContentStream(prompt);

    let finalText = "";
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) finalText += text;
    }

    // Return plain text
    return new Response(finalText.trim(), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate suggestions" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
