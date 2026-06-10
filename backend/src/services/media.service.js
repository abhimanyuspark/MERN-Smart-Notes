import path from "path";

import Media from "../models/media.model.js";

import { extractPdfText } from "./pdf.service.js";
import { extractImageText } from "./ocr.service.js";

export const processUploadedFiles = async (files, noteId) => {
  const results = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(process.cwd(), "uploads", file.filename);

      const mediaType = file.mimetype === "application/pdf" ? "pdf" : "image";

      let extractedText = "";

      try {
        extractedText =
          mediaType === "pdf"
            ? await extractPdfText(filePath)
            : await extractImageText(filePath);
      } catch (error) {
        console.error(`Failed processing ${file.filename}`, error);
      }

      const media = await Media.create({
        noteId,
        mediaType,
        fileName: file.filename,
        mediaUrl: `/uploads/${file.filename}`,
        mimeType: file.mimetype,
        fileSize: file.size,
        extractedText,
      });

      return {
        mediaId: media._id,
        extractedText,
      };
    }),
  );

  return {
    mediaIds: results.map((item) => item.mediaId),

    combinedText:
      results
        .map((item) => item.extractedText)
        .filter(Boolean)
        .join("\n\n") || "No readable text could be extracted.",
  };
};
