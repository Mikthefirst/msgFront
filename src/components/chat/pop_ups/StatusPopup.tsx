import React from "react";

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
    <div className="absolute bottom-full left-0 mb-2 w-[28rem] p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-xl z-20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Status Update
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          ×
        </button>
      </div>
      {fields.map((field) => (
        <div key={field} className="mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {field}
          </label>
          <textarea
            rows={2}
            value={statusData[field] || ""}
            onChange={(e) => onChange(field, e.target.value)}
            className="mt-1 w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>
      ))}
    </div>
  );
};

export default StatusPopup;
