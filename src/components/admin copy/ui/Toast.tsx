import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, description, duration = 5000 }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = { id, title, description, duration };
      
      setToasts((prev) => [...prev, newToast]);

      if (duration !== Infinity) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm w-full animate-slide-in-right"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {toast.title}
                </h3>
                {toast.description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};