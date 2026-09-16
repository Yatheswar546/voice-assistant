import { FileParser } from "./types";
import { PDFParser } from "./pdf-parser";
import { DocumentParser } from "./document-parser";
import { SpreadsheetParser } from "./spreadsheet-parser";
import { ImageParser } from "./image-parser";

export function getParser(file: File): FileParser {
  const mimeType = file.type.toLowerCase();

  if (mimeType === "application/pdf") {
    return new PDFParser();
  }

  if (
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return new DocumentParser();
  }

  if (
    mimeType === "application/vnd.ms-excel" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return new SpreadsheetParser();
  }

  if (
    mimeType === "image/png" ||
    mimeType === "image/jpeg" ||
    mimeType === "image/webp"
  ) {
    return new ImageParser();
  }

  throw new Error(`Unsupported file type: ${file.type}`);
}