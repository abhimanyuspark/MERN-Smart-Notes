import Chat from "../models/chat.model.js";
import Groq from "groq-sdk";
import { config } from "dotenv";

config({ quiet: true });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Smart truncation — keeps start and end of context
const truncateContext = (text, maxChars = 12000) => {
  if (!text || text.length <= maxChars) return text;
  const half = Math.floor(maxChars / 2);
  return (
    text.slice(0, half) +
    "\n\n...[content truncated]...\n\n" +
    text.slice(-half)
  );
};

// Detect if document is a syllabus/topic list or detailed content
const detectDocumentType = (context = "") => {
  if (!context) return "unknown";

  const lines = context.split("\n").filter((l) => l.trim());
  const totalLines = lines.length;
  const shortLines = lines.filter((l) => l.trim().length < 60).length;
  const shortLineRatio = shortLines / totalLines;

  // If majority of lines are short → likely a syllabus or topic list
  if (shortLineRatio > 0.6 && totalLines > 3) return "syllabus";

  return "detailed";
};

// Detect if user wants to learn or get an explanation
const detectUserIntent = (message = "") => {
  const learningPattern =
    /explain|what is|what are|how does|how do|describe|tell me about|teach|summarize|define|elaborate|give me details|walk me through|help me understand|overview|introduction to/i;

  return learningPattern.test(message.trim()) ? "learning" : "qa";
};

export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      userId: req.user._id,
    }).select("messages title noteId createdAt updatedAt");

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    return res.status(200).json({
      success: true,
      chatId: chat._id,
      title: chat.title,
      noteId: chat.noteId,
      messages: chat.messages,
    });
  } catch (error) {
    console.error("GET CHAT MESSAGES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    const userId = req.user._id;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Push user message
    chat.messages.push({
      role: "user",
      content: { type: "text", text: message.trim() },
      createdAt: new Date(),
    });

    // Detect document type and user intent
    const safeContext = truncateContext(chat.extractedContext);
    const docType = detectDocumentType(safeContext);
    const userIntent = detectUserIntent(message);
    const isTutorMode = docType === "syllabus" || userIntent === "learning";

    const groqMessages = [
      {
        role: "system",
        content: `
You are Smart Notes AI — an intelligent tutor and document assistant.

You have access to the user's uploaded document content in the CONTEXT section below.

## Detected Document Type: ${docType === "syllabus" ? "SYLLABUS / TOPIC LIST" : "DETAILED DOCUMENT"}
## User Request Type: ${isTutorMode ? "LEARNING / EXPLANATION" : "DOCUMENT Q&A"}

---

${
  isTutorMode
    ? `## TUTOR MODE — Active

You are now acting as a tutor. The user wants to learn and understand topics.

Instructions:
- Use your full knowledge to explain topics thoroughly and clearly.
- If the document is a syllabus or topic list, treat it as a study guide.
- Always give detailed, structured explanations even if the document only mentions the topic name.
- Use real examples, analogies, and code snippets where relevant.
- Structure responses with clear headings (##), bullet points, and numbered steps.
- Make explanations beginner-friendly unless the user asks for advanced detail.
- Reference the uploaded document as the source of the topic when relevant.
- Never say "the context does not provide details" for topics that are common knowledge.
`
    : `## DOCUMENT Q&A MODE — Active

You are answering questions strictly based on the uploaded document.

Instructions:
- Answer using ONLY the content in CONTEXT below.
- Quote relevant sections from the document when helpful.
- If the answer is genuinely not in the document, say: "This is not covered in your uploaded documents."
- Do not invent or assume information beyond what is in the document.
- Use markdown formatting, headings, and bullet points for clarity.
`
}

---

CONTEXT:
${safeContext || "No document content available."}
        `.trim(),
      },
    ];

    // Build message history — handle all content types
    const recentMessages = chat.messages.slice(-20);

    for (const msg of recentMessages) {
      if (!msg.content) continue;

      let textContent = "";

      if (msg.content.type === "text") {
        textContent = msg.content.text || "";
      } else if (msg.content.type === "document_analysis") {
        const parsed =
          typeof msg.content === "string"
            ? JSON.parse(msg.content)
            : msg.content;

        textContent = `
[Document ${parsed.action === "created" ? "Uploaded" : "Added"}]
Title: ${parsed.title || "Untitled"}
Summary: ${parsed.summary || "No summary"}
Files: ${(parsed.uploadedFiles || []).map((f) => f.name).join(", ") || "N/A"}
        `.trim();
      } else if (typeof msg.content === "string") {
        try {
          const parsed = JSON.parse(msg.content);
          textContent = `
[Document ${parsed.action === "created" ? "Uploaded" : "Added"}]
Title: ${parsed.title || "Untitled"}
Summary: ${parsed.summary || "No summary"}
Files: ${(parsed.uploadedFiles || []).map((f) => f.name).join(", ") || "N/A"}
          `.trim();
        } catch {
          textContent = msg.content;
        }
      }

      if (textContent.trim()) {
        groqMessages.push({
          role: msg.role,
          content: textContent,
        });
      }
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: groqMessages,
      temperature: isTutorMode ? 0.5 : 0.3, // slightly more expressive in tutor mode
      max_tokens: 2048, // increased for detailed explanations
    });

    const aiReply =
      completion?.choices?.[0]?.message?.content ||
      "I could not find this in your documents.";

    const assistantMessage = {
      role: "assistant",
      content: {
        type: "text",
        text: aiReply,
        citations: [],
        relatedQuestions: [],
      },
      createdAt: new Date(),
    };

    chat.messages.push(assistantMessage);
    await chat.save();

    return res.status(200).json({
      success: true,
      message: assistantMessage,
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
