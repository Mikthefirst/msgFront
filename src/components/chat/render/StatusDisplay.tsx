// components/StatusDisplay.tsx
import React from "react";

interface Props {
  statusData: Record<string, string>;
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

const StatusDisplay: React.FC<Props> = ({ statusData }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
        STATUS:
      </h2>
      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
        {fields.map((field, index) => (
          <div key={field}>
            <span className="font-semibold">{index + 1}.</span>{" "}
            {statusData[field] ? statusData[field] : <i>No update</i>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusDisplay;
