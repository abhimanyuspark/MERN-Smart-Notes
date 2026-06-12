import Groq from "groq-sdk";
import { config } from "dotenv";

config({ quiet: true });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const truncateSmartly = (text, maxChars = 8000) => {
  if (text.length <= maxChars) return text;

  const half = Math.floor(maxChars / 2);
  return (
    text.slice(0, half) +
    "\n\n...[middle content truncated for length]...\n\n" +
    text.slice(-half)
  );
};

export const generateNoteInsights = async (text) => {
  try {
    if (!text || typeof text !== "string") {
      return { title: "Untitled Note", summary: "", questions: [] };
    }

    const truncatedText = truncateSmartly(text.trim());

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are an AI assistant for a smart notes app. You will be given content from one or more uploaded documents.

Analyze ONLY the content provided to you. Do not reference previous uploads or prior context.

Return ONLY valid JSON in this exact format (no extra keys, no markdown):

{
  "title": "short title max 6 words",
  "summary": "clear concise summary in 5 to 7 lines covering the key points of this specific content",
  "questions": [
    "question 1",
    "question 2",
    "question 3",
    "question 4",
    "question 5"
  ]
}
          `.trim(),
        },
        {
          role: "user",
          content: truncatedText,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;

    if (!raw) {
      throw new Error("Empty response from Groq");
    }

    const result = JSON.parse(raw);

    return {
      title:
        typeof result.title === "string" && result.title.trim()
          ? result.title.trim()
          : "Untitled Note",

      summary: typeof result.summary === "string" ? result.summary.trim() : "",

      questions: Array.isArray(result.questions)
        ? result.questions
            .filter((q) => typeof q === "string" && q.trim())
            .slice(0, 5)
        : [],
    };
  } catch (err) {
    console.error("GROQ ERROR:", err?.message || err);

    return {
      title: "Untitled Note",
      summary: "",
      questions: [],
    };
  }
};
