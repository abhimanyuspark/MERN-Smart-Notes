import Media from "../models/media.model.js";
import { extractPdfText } from "./pdf.service.js";
import { extractImageText } from "./ocr.service.js";
import fs from "fs";
import path from "path";

// ✅ Ensure uploads folder exists on server start
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const generateUniqueFileName = (originalName) => {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1e9);
  return `${timestamp}-${random}${ext}`;
};

export const processUploadedFiles = async (files, noteId) => {
  const results = await Promise.all(
    files.map(async (file) => {
      console.log("Processing file:", file.originalname);
      console.log("Mimetype:", file.mimetype);
      console.log("Buffer size:", file.buffer?.length ?? "UNDEFINED", "bytes");

      const mediaType = file.mimetype === "application/pdf" ? "pdf" : "image";

      // ✅ Save buffer to disk and generate URL
      const uniqueName = generateUniqueFileName(file.originalname);
      const fileSavePath = path.join(uploadsDir, uniqueName);

      let mediaUrl = "";

      try {
        fs.writeFileSync(fileSavePath, file.buffer);
        mediaUrl = `/uploads/${uniqueName}`;
        console.log("File saved to disk:", fileSavePath);
      } catch (err) {
        console.error("Failed to save file to disk:", err.message);
      }

      // ✅ Extract text from buffer
      let extractedText = "";

      try {
        if (!file.buffer || file.buffer.length === 0) {
          console.error(`Buffer missing for file: ${file.originalname}`);
        } else {
          extractedText =
            mediaType === "pdf"
              ? await extractPdfText(file.buffer)
              : await extractImageText(file.buffer);
        }
      } catch (error) {
        console.error(`Failed processing ${file.originalname}:`, error.message);
      }

      console.log(
        "Extracted text length for",
        file.originalname,
        ":",
        extractedText?.length ?? 0,
      );

      const media = await Media.create({
        noteId,
        mediaType,
        fileName: file.originalname,
        mediaUrl, // ✅ now has actual path like /uploads/123456789.pdf
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

  const combinedText = results
    .map((item) => item.extractedText)
    .filter(Boolean)
    .join("\n\n");

  console.log("Total combined text length:", combinedText?.length ?? 0);

  return {
    mediaIds: results.map((item) => item.mediaId),
    combinedText: combinedText || "No readable text could be extracted.",
  };
};
