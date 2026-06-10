import fs from "fs";
import path from "path";

import Note from "../models/note.model.js";
import Media from "../models/media.model.js";
import Chat from "../models/chat.model.js";

import { extractPdfText } from "../services/pdf.service.js";
import { extractImageText } from "../services/ocr.service.js";

import { generateNoteInsights } from "../services/ai.service.js";
import { processUploadedFiles } from "../services/media.service.js";
import { createNoteChat, updateNoteChat } from "../services/chat.service.js";

export const createNoteWithFiles = async (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({
        success: false,
        message: "Please upload files",
      });
    }

    const note = await Note.create({
      userId: req.user._id,
      title: "Processing...",
    });

    const { mediaIds, combinedText } = await processUploadedFiles(
      req.files,
      note._id,
    );

    const aiData = await generateNoteInsights(combinedText);

    Object.assign(note, {
      title: aiData?.title || "Untitled Note",
      summary: aiData?.summary || "",
      suggestedQuestions: aiData?.questions || [],
      combinedText,
      medias: mediaIds,
    });

    await note.save();

    const chat = await createNoteChat({
      note,
      userId: req.user._id,
      mediaIds,

      uploadedFiles: req.files.map((file) => ({
        name: file.originalname,
        type: file.mimetype,
      })),
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
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addFilesToNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    if (!req.files?.length) {
      return res.status(400).json({
        success: false,
        message: "Please upload files",
      });
    }

    const note = await Note.findOne({
      _id: noteId,
      userId: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    const { mediaIds, combinedText } = await processUploadedFiles(
      req.files,
      note._id,
    );

    const mergedText = [note.combinedText, combinedText]
      .filter(Boolean)
      .join("\n\n");

    const aiData = await generateNoteInsights(mergedText);

    Object.assign(note, {
      title: aiData?.title || note.title,
      summary: aiData?.summary || note.summary,

      suggestedQuestions: aiData?.questions || note.suggestedQuestions,

      combinedText: mergedText,

      medias: [...note.medias, ...mediaIds],
    });

    await note.save();

    const chat = await updateNoteChat({
      chatId: note.chatId,
      note,
      mediaIds,

      uploadedFiles: req.files.map((file) => ({
        name: file.originalname,
        type: file.mimetype,
      })),
    });

    await note.populate("medias");
    await note.populate("chatId");

    return res.status(200).json({
      success: true,
      note,
      chat,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
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
