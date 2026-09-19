export type QueryType =
  | "general"
  | "document"
  | "comparison";

interface QueryRouterOptions {
  message: string;
  hasDocument: boolean;
  hasMultipleDocuments: boolean;
}

const COMPARISON_KEYWORDS = [
  "compare",
  "comparison",
  "difference",
  "differences",
  "different",
  "both",
  "between",
  "versus",
  "vs",
];

const DOCUMENT_KEYWORDS = [
  "document",
  "documents",
  "pdf",
  "file",
  "files",
  "uploaded",
  "course",
  "courses",
  "bootcamp",
  "above",
  "this",
  "these",
  "according to",
  "in the document",
  "in this document",
  "from the document",
  "from this document",
  "in the file",
  "from the file",
];

function containsKeyword(
  message: string,
  keywords: string[]
): boolean {
  return keywords.some((keyword) =>
    message.includes(keyword)
  );
}

export function routeQuery({
  message,
  hasDocument,
  hasMultipleDocuments,
}: QueryRouterOptions): QueryType {
  const normalizedMessage = message
    .toLowerCase()
    .trim();

  /*
   * No uploaded document means there is nothing
   * available for document-based retrieval.
   */
  if (!hasDocument) {
    return "general";
  }

  /*
   * Comparison questions require multiple documents.
   */
  const isComparisonQuestion = containsKeyword(
    normalizedMessage,
    COMPARISON_KEYWORDS
  );

  if (
    isComparisonQuestion &&
    hasMultipleDocuments
  ) {
    return "comparison";
  }

  /*
   * If the user asks for comparison but only one
   * document is available, treat it as a normal
   * document question rather than failing.
   */
  if (isComparisonQuestion) {
    return "document";
  }

  /*
   * Explicit document-related question.
   */
  const isDocumentQuestion = containsKeyword(
    normalizedMessage,
    DOCUMENT_KEYWORDS
  );

  if (isDocumentQuestion) {
    return "document";
  }

  /*
   * If multiple documents exist, do not automatically
   * assume every question requires RAG.
   */
  return "general";
}