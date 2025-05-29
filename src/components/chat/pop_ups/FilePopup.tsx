import React from "react";

interface Props {
  file: File;
  message: string;
  onChange: (val: string) => void;
  onClose: () => void;
}

const FilePopup: React.FC<Props> = ({ file, message, onChange, onClose }) => {
  return (
    <div className="absolute bottom-full left-0 mb-2 w-[26rem] p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-xl z-20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {file.type.startsWith("image/") ? "Image" : "File"} Upload
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          ×
        </button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 truncate">
        {file.name}
      </p>
      {file.type.startsWith("image/") && (
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="max-h-48 object-contain mb-2"
        />
      )}
      <textarea
        rows={2}
        value={message}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Optional message..."
        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
};

export default FilePopup;
