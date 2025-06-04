import React from "react";

interface FileMessageRendererProps {
  fileName: string;
  fileUrl: string;
  isImage?: boolean;
}

const FileMessageRenderer: React.FC<FileMessageRendererProps> = ({
  fileName,
  fileUrl,
  isImage,
}) => {
  return (
    <div className="max-w-xs">
      {isImage ? (
        <img
          src={`http://localhost:3000${fileUrl}`}
          alt={fileName}
          className="rounded-lg max-h-60 object-contain mb-2"
        />
      ) : (
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2">
          <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
            {fileName}
          </p>
        </div>
      )}

      <a
        href={`http://localhost:3000${fileUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="text-xs text-blue-600 dark:text-blue-400 underline"
      >
        Download
      </a>
    </div>
  );
};

export default FileMessageRenderer;
