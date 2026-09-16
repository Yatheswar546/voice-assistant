import mammoth from "mammoth";

import { FileParser, ParserResult } from "./types";

export class DocumentParser implements FileParser {
  async parse(file: File): Promise<ParserResult> {
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await mammoth.extractRawText({
      buffer,
    });

    return {
      content: result.value.trim(),
    };
  }
}