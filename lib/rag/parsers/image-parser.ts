import { generateGeminiImageDescription } from "@/lib/gemini";
import { AI_CONFIG } from "@/settings/ai.config";

import { FileParser, ParserResult } from "./types";

export class ImageParser implements FileParser {
  async parse(file: File): Promise<ParserResult> {
    const buffer = Buffer.from(await file.arrayBuffer());

    const content = await generateGeminiImageDescription({
      model: AI_CONFIG.MODEL,
      image: buffer,
      mimeType: file.type,
    });

    return {
      content: content.trim(),
    };
  }
}