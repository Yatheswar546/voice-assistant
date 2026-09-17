interface TextChunk {
  content: string;
  chunkIndex: number;
}

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

export function chunkText(text: string): TextChunk[] {
  const chunks: TextChunk[] = [];

  let start = 0;
  let chunkIndex = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);

    const chunk = text.slice(start, end).trim();

    if (chunk) {
      chunks.push({
        content: chunk,
        chunkIndex,
      });

      chunkIndex++;
    }

    if (end === text.length) {
      break;
    }

    start = end - CHUNK_OVERLAP;
  }

  return chunks;
}