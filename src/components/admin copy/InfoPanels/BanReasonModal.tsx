import React, { useState } from "react";

interface BanReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const BanReasonModal: React.FC<BanReasonModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
      setReason("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Reason for Ban
          </label>
          <textarea
            id="description"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanReasonModal;
