import Chat from "../models/chat.model.js";
import Groq from "groq-sdk";
import { config } from "dotenv";

config({ quiet: true });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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

    const chat = await Chat.findOne({
      _id: chatId,
      userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.messages.push({
      role: "user",
      content: {
        type: "text",
        text: message.trim(),
      },
      createdAt: new Date(),
    });

    const recentMessages = chat.messages.slice(-20);

    const groqMessages = [
      {
        role: "system",
        content: `
You are Smart Notes AI.

You answer ONLY using the provided note context.

Rules:

1. Never invent information.
2. If information is unavailable say:
   "I could not find this in your documents."
3. Use markdown.
4. Use headings when needed.
5. Use bullet points.
6. Quote important text from documents.
7. Keep answers concise.
8. Mention source section if possible.

CONTEXT:

${chat.extractedContext}
`,
      },
    ];

    for (const msg of recentMessages) {
      if (msg.content?.type !== "text") continue;

      groqMessages.push({
        role: msg.role,
        content: msg.content.text,
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: groqMessages,
      temperature: 0.3,
      max_tokens: 1024,
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
