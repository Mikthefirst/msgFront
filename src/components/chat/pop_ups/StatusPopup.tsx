import React from "react";
import { X } from "lucide-react";

interface Props {
  statusData: Record<string, string>;
  onChange: (field: string, value: string) => void;
  onClose: () => void;
}

const fields = [
  "What I'm currently working on",
  "Blockers",
  "What I'll be working on tomorrow",
  "What I've recently learned/read",
  "Risks or concerns",
  "Progress highlights",
  "Mood",
];

const StatusPopup: React.FC<Props> = ({ statusData, onChange, onClose }) => {
  return (
    <div className="absolute bottom-full left-0 mb-2 w-[18.5rem] p-3 bg-white dark:bg-gray-800 border rounded-lg shadow-xl z-20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
          Status Update
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Close status popup"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {fields.map((field) => (
        <div key={field} className="mb-2">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            {field}
          </label>
          <input
            type="text"
            value={statusData[field] || ""}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-blue-500/50"
          />
        </div>
      ))}
    </div>
  );
};

export default StatusPopup;
