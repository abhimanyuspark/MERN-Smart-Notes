import fs from "fs";
import path from "path";

import Note from "../models/note.model.js";
import Media from "../models/media.model.js";
import Chat from "../models/chat.model.js";

import { extractPdfText } from "../services/pdf.service.js";
import { extractImageText } from "../services/ocr.service.js";

import { generateNoteInsights } from "../services/ai.service.js";

export const createNoteWithFiles = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload files",
      });
    }

    const mediaIds = [];
    let combinedText = "";

    // Create temporary note
    const note = await Note.create({
      userId: req.user._id,
      title: "Processing...",
    });

    // Extract text from all uploaded files
    for (const file of files) {
      const filePath = path.join(process.cwd(), "uploads", file.filename);

      let extractedText = "";

      const mediaType = file.mimetype === "application/pdf" ? "pdf" : "image";

      try {
        if (mediaType === "pdf") {
          extractedText = await extractPdfText(filePath);
        } else {
          extractedText = await extractImageText(filePath);
        }
      } catch (error) {
        console.error(`Text extraction failed for ${file.filename}:`, error);
      }

      combinedText += `\n\n${extractedText}`;

      const media = await Media.create({
        noteId: note._id,
        mediaType,
        fileName: file.filename,
        mediaUrl: `/uploads/${file.filename}`,
        mimeType: file.mimetype,
        fileSize: file.size,
        extractedText,
      });

      mediaIds.push(media._id);
    }

    // Fallback if no text extracted
    if (!combinedText.trim()) {
      combinedText =
        "No readable text could be extracted from the uploaded files.";
    }

    // Generate AI insights
    const aiData = await generateNoteInsights(combinedText);

    console.log("AI DATA:", aiData);

    // Update note
    note.title = aiData?.title || "Untitled Note";
    note.summary = aiData?.summary || "";
    note.suggestedQuestions = aiData?.questions || [];
    note.combinedText = combinedText;
    note.medias = mediaIds;

    await note.save();

    const assistantMessage = JSON.stringify({
      type: "document_analysis",
      title: note.title,
      summary: note.summary,
      suggestedQuestions: note.suggestedQuestions,
      uploadedFiles: files.map((file) => ({
        name: file.originalname,
        type: file.mimetype,
      })),
    });

    // Create chat automatically
    const chat = await Chat.create({
      noteId: note._id,
      userId: req.user._id,
      mediaIds,

      title: `Chat - ${note.title}`,

      // IMPORTANT:
      // This becomes the knowledge base for future chats.
      extractedContext: combinedText,

      messages: [
        {
          role: "assistant",
          content: assistantMessage,
          createdAt: new Date(),
        },
      ],
    });

    note.chatId = chat._id;
    await note.save();

    await note.populate("medias");
    await note.populate("chatId");

    return res.status(201).json({
      success: true,
      note,
      chat,
    });
  } catch (error) {
    console.error("CREATE NOTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create note",
    });
  }
};
export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user._id,
    })
      .populate("medias")
      .populate("chatId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
      .populate("medias")
      .populate("chatId");

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("medias");

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    for (const media of note.medias) {
      const filePath = path.join(process.cwd(), "uploads", media.fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await Media.findByIdAndDelete(media._id);
    }

    if (note.chatId) {
      await Chat.findByIdAndDelete(note.chatId);
    }

    await Note.findByIdAndDelete(note._id);

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
