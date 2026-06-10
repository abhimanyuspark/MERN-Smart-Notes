import { createWorker } from "tesseract.js";

export const extractImageText = async (filePath) => {
  const worker = await createWorker("eng");

  const result = await worker.recognize(filePath);

  await worker.terminate();

  return result.data.text;
};
