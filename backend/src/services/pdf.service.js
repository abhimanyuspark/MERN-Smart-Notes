import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const extractPdfText = async (buffer) => {
  try {
    console.log("PDF buffer received:", buffer?.length ?? "UNDEFINED", "bytes");

    if (!buffer || buffer.length === 0) {
      console.error("PDF buffer is empty");
      return "";
    }

    const data = await pdfParse(buffer);

    console.log("PDF pages:", data?.numpages);
    console.log("PDF text length:", data?.text?.length);

    if (!data?.text?.trim()) {
      console.warn("PDF has no extractable text — may be image-based");
      return "";
    }

    return data.text.trim();
  } catch (error) {
    console.error("PDF extraction failed:", error.message);
    return "";
  }
};
