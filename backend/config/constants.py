# Max file size in bytes (50MB in this case)
MAX_FILE_UPLOAD_SIZE = 50 * 1024 * 1024  # 50MB

# Allowed MIME types (images, PDFs, text files, documents)
ALLOWED_UPLOAD_MIME_TYPES = [
    "image/jpeg",   # JPEG images
    "image/png",    # PNG images
    "application/pdf",  # PDF files
    "text/plain",   # Plain text files
    "application/msword",  # Word documents (older .doc)
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  # Word documents (.docx)
    "application/rtf",  # Rich Text Format documents
    "application/zip",  # ZIP files (e.g., archives with documents)
]

UPLOAD_DIRECTORY = "uploads"


