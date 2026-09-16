import * as XLSX from "xlsx";

import { FileParser, ParserResult } from "./types";

export class SpreadsheetParser implements FileParser {
  async parse(file: File): Promise<ParserResult> {
    const buffer = Buffer.from(await file.arrayBuffer());

    const workbook = XLSX.read(buffer, {
      type: "buffer",
    });

    const sheetContents: string[] = [];

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];

      const csv = XLSX.utils.sheet_to_csv(worksheet);

      if (csv.trim()) {
        sheetContents.push(`Sheet: ${sheetName}\n${csv.trim()}`);
      }
    }

    return {
      content: sheetContents.join("\n\n").trim(),
    };
  }
}