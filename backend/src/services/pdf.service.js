import { createRequire } from "module";
const require = createRequire(import.meta.url);
const PDFParser = require("pdf2json");

export const extractPdfText = async (buffer) => {
  try {
    console.log("PDF buffer received:", buffer?.length ?? "UNDEFINED", "bytes");

    if (!buffer || buffer.length === 0) {
      console.error("PDF buffer is empty");
      return "";
    }

    const text = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1);

      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        try {
          const pages = pdfData?.Pages || [];

          const fullText = pages
            .map((page) =>
              (page.Texts || [])
                .map((t) => {
                  const raw = t.R?.map((r) => r.T).join("") || "";
                  // ✅ Safe decode — fallback to raw if decodeURIComponent fails
                  try {
                    return decodeURIComponent(raw);
                  } catch {
                    return raw;
                  }
                })
                .join(" "),
            )
            .join("\n\n");

          console.log("PDF pages:", pages.length);
          console.log("PDF text length:", fullText.trim().length);
          console.log("PDF text preview:", fullText.slice(0, 200));

          resolve(fullText.trim());
        } catch (err) {
          reject(err);
        }
      });

      pdfParser.on("pdfParser_dataError", (err) => {
        reject(new Error(err?.parserError || "PDF parsing failed"));
      });

      pdfParser.parseBuffer(buffer);
    });

    if (!text) {
      console.warn("PDF has no extractable text — may be image-based");
      return "";
    }

    return text;
  } catch (error) {
    console.error("PDF extraction failed:", error.message);
    return "";
  }
};
