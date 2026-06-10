import Groq from "groq-sdk";
import { config } from "dotenv";

config({ quiet: true });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateNoteInsights = async (text) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are an AI assistant for a smart notes app.

Return ONLY valid JSON in this format:

{
  "title": "short title (max 6 words)",
  "summary": "clear concise summary in 5-7 lines",
  "questions": [
    "question 1",
    "question 2",
    "question 3",
    "question 4",
    "question 5"
  ]
}
          `,
        },
        {
          role: "user",
          content: text.slice(0, 8000),
        },
      ],
    });

    const result = JSON.parse(completion.choices[0].message.content);

    return {
      title: result.title || "Untitled Note",
      summary: result.summary || "",
      questions: result.questions || [],
    };
  } catch (err) {
    console.error("GROQ ERROR:", err);

    return {
      title: "Untitled Note",
      summary: "",
      questions: [],
    };
  }
};
