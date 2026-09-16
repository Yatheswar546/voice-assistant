export interface ParserMetadata {
  pageNumber?: number;
  sheetName?: string;
}

export interface ParserResult {
  content: string;
  metadata?: ParserMetadata;
}

export interface FileParser {
  parse(file: File): Promise<ParserResult>;
}