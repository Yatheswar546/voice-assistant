const ALLOWED_FILE_TYPES = {
  pdf: {
    extensions: [".pdf"],
    mimeTypes: ["application/pdf"],
  },

  document: {
    extensions: [".doc", ".docx"],
    mimeTypes: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },

  spreadsheet: {
    extensions: [".xls", ".xlsx"],
    mimeTypes: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  },

  image: {
    extensions: [".png", ".jpg", ".jpeg", ".webp"],
    mimeTypes: ["image/png", "image/jpeg", "image/webp"],
  },
} as const;

const ALLOWED_EXTENSIONS = Object.values(ALLOWED_FILE_TYPES).flatMap(
  (type) => type.extensions
);

const ALLOWED_MIME_TYPES = Object.values(ALLOWED_FILE_TYPES).flatMap(
  (type) => type.mimeTypes
);

export function validateUploadedFile(file: File) {
  if (!file) {
    return {
      valid: false,
      message: "File is required.",
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      message: "File cannot be empty.",
    };
  }

  const fileName = file.name.toLowerCase();

  const extension = fileName.includes(".")
    ? fileName.slice(fileName.lastIndexOf("."))
    : "";

  if (!ALLOWED_EXTENSIONS.includes(extension as (typeof ALLOWED_EXTENSIONS)[number])) {
    return {
      valid: false,
      message: "Unsupported file type.",
    };
  }

  if (
    !ALLOWED_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_MIME_TYPES)[number]
    )
  ) {
    return {
      valid: false,
      message: "Invalid file MIME type.",
    };
  }

  return {
    valid: true,
    message: "File is valid.",
  };
}