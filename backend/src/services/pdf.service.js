import { PDFParse } from "pdf-parse";
import fs from "fs";

export const extractPdfText = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);

  const data = await new PDFParse({ data: dataBuffer });

  return data.text;
};
