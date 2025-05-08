import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  type: ToastType;
  title: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  onClose,
  duration = 5000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const borderColor = type === 'success' ? 'border-green-100' : 'border-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const icon = type === 'success' ? (
    <CheckCircle className="h-5 w-5 text-green-400" />
  ) : (
    <AlertCircle className="h-5 w-5 text-red-400" />
  );

  return (
    <div
      className={`fixed top-4 right-4 w-96 ${bgColor} border ${borderColor} rounded-lg shadow-lg z-50`}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-medium ${textColor}`}>{title}</p>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast; 