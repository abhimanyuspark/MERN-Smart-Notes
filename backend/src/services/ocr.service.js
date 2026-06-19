import { createWorker } from "tesseract.js";

export const extractImageText = async (buffer) => {
  const worker = await createWorker("eng");

  try {
    console.log("OCR buffer received:", buffer?.length ?? "UNDEFINED", "bytes");

    if (!buffer || buffer.length === 0) {
      console.error("Image buffer is empty");
      return "";
    }

    // tesseract.js accepts buffer directly — no file path needed
    const result = await worker.recognize(buffer);

    console.log("OCR text length:", result?.data?.text?.length ?? 0);

    if (!result?.data?.text?.trim()) {
      console.warn("No text extracted from image");
      return "";
    }

    return result.data.text.trim();
  } catch (error) {
    console.error("OCR extraction failed:", error.message);
    return "";
  } finally {
    await worker.terminate(); // ✅ always terminates even if extraction fails
  }
};