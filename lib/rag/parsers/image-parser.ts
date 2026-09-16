import { FileParser, ParserResult } from "./types";

export class ImageParser implements FileParser {
  async parse(_file: File): Promise<ParserResult> {
    throw new Error("Image parser is not implemented yet.");
  }
}