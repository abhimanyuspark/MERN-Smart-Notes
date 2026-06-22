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
      return res
        .status(400)
        .json({ success: false, message: "Please upload files" });
    }

    const note = await Note.findOne({ _id: noteId, userId: req.user._id });

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    const { mediaIds, combinedText } = await processUploadedFiles(
      req.files,
      note._id,
    );

    const newFileInsights = await generateNoteInsights(combinedText);

    const mergedText = [note.combinedText, combinedText]
      .filter(Boolean)
      .join("\n\n");

    Object.assign(note, {
      title: newFileInsights?.title || note.title,
      summary: note.summary
        ? `${note.summary}\n\n--- New Upload ---\n${newFileInsights?.summary}`
        : newFileInsights?.summary,
      suggestedQuestions: [
        ...new Set([
          ...(note.suggestedQuestions || []),
          ...(newFileInsights?.questions || []),
        ]),
      ].slice(0, 10),
      combinedText: mergedText,
      medias: [...note.medias, ...mediaIds],
    });

    await note.save();

    const message = await updateNoteChat({
      chatId: note.chatId,
      note,
      mediaIds,
      uploadedFiles: req.files.map((file) => ({
        name: file.originalname,
        type: file.mimetype,
      })),
    });

    await note.populate({ path: "medias", match: { _id: { $in: mediaIds } } });

    return res.status(200).json({
      success: true,
      media: note.medias?.[0],
      message,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
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

export const deleteMultipleNotes = async (req, res) => {
  try {
    const { noteIds } = req.body;

    if (!Array.isArray(noteIds) || noteIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide noteIds array",
      });
    }

    const notes = await Note.find({
      _id: { $in: noteIds },
      userId: req.user._id,
    }).populate("medias");

    if (!notes.length) {
      return res.status(404).json({
        success: false,
        message: "No notes found",
      });
    }

    const mediaIds = [];
    const chatIds = [];
    const noteDeleteIds = [];

    for (const note of notes) {
      noteDeleteIds.push(note._id);

      // Delete media files
      for (const media of note.medias) {
        const filePath = path.join(process.cwd(), "uploads", media.fileName);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        mediaIds.push(media._id);
      }

      // Collect chat ids
      if (note.chatId) {
        chatIds.push(note.chatId);
      }
    }

    // Delete all media documents
    if (mediaIds.length) {
      await Media.deleteMany({
        _id: { $in: mediaIds },
      });
    }

    // Delete all chats
    if (chatIds.length) {
      await Chat.deleteMany({
        _id: { $in: chatIds },
      });
    }

    // Delete all notes
    await Note.deleteMany({
      _id: { $in: noteDeleteIds },
    });

    return res.status(200).json({
      success: true,
      message: `${noteDeleteIds.length} notes deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
