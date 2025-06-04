import React, { useState } from "react";
import {
  FileText,
  ImageIcon,
  Download,
  File,
  Eye,
  XCircle,
} from "lucide-react";

interface FileMessageRendererProps {
  fileName: string;
  fileUrl: string;
  isImage?: boolean;
  content?: string;
}

const FileMessageRenderer: React.FC<FileMessageRendererProps> = ({
  fileName,
  fileUrl,
  isImage,
  content,
}) => {
  const [showPdf, setShowPdf] = useState(false);

  const fileExtension = fileName.split(".").pop()?.toLowerCase();

  const renderFileIcon = () => {
    switch (fileExtension) {
      case "pdf":
        return <FileText className="text-red-500 w-6 h-6" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageIcon className="text-blue-500 w-6 h-6" />;
      default:
        return <File className="text-gray-500 w-6 h-6" />;
    }
  };

  const isPdf = fileExtension === "pdf";

  return (
    <div className="relative max-w-xs p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md">
      {/* Render Image or File block */}
      {isImage ? (
        <img
          src={`http://localhost:3000${fileUrl}`}
          alt={fileName}
          className="rounded-lg max-h-60 object-contain mb-2 border"
        />
      ) : (
        <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2">
          {renderFileIcon()}
          <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
            {fileName}
          </p>
        </div>
      )}

      {/* Content text — always shown */}
      {content && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap break-words">
          {content}
        </p>
      )}

      <div className="flex gap-4 items-center mt-1">
        <a
          href={`http://localhost:3000${fileUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          <Download className="w-4 h-4 mr-1" />
          Download
        </a>

        {isPdf && (
          <button
            onClick={() => setShowPdf(true)}
            className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <Eye className="w-4 h-4 mr-1" />
            Просмотр
          </button>
        )}
      </div>

      {/* Modal PDF Viewer */}
      {showPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-3xl h-[80vh] bg-white rounded-lg shadow-xl overflow-hidden">
            <button
              onClick={() => setShowPdf(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <iframe
              src={`http://localhost:3000${fileUrl}`}
              className="w-full h-full border-none"
              title="PDF Preview"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileMessageRenderer;
