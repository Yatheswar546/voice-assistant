import { getPath } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import { FileParser, ParserResult } from "./types";

PDFParse.setWorker(getPath());

export class PDFParser implements FileParser {
  async parse(file: File): Promise<ParserResult> {
    const buffer = Buffer.from(await file.arrayBuffer());

    const parser = new PDFParse({
      data: buffer,
    });

    try {
      const result = await parser.getText();

      return {
        content: result.text.trim(),
      };
    } finally {
      await parser.destroy();
    }
  }
}