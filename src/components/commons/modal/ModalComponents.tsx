import React from 'react';

interface ModalErrorProps {
  error: string | null;
}

export const ModalError: React.FC<ModalErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-sm text-red-600">{error}</p>
    </div>
  );
};

interface ModalSuccessProps {
  success: boolean;
  message: string;
}

export const ModalSuccess: React.FC<ModalSuccessProps> = ({ success, message }) => {
  if (!success) return null;

  return (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
      <p className="text-sm text-green-600">{message}</p>
    </div>
  );
};

interface ModalButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  success?: boolean;
  loadingText?: string;
  successText?: string;
  variant?: 'primary' | 'danger' | 'success';
  className?: string;
  children: React.ReactNode;
}

export const ModalButton: React.FC<ModalButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
  success = false,
  loadingText = 'Loading...',
  successText = '✓ Success',
  variant = 'primary',
  className = '',
  children
}) => {
  const getButtonClass = () => {
    if (isLoading) return 'border-gray-300 text-gray-400 cursor-not-allowed';
    if (success) return 'border-green-500 text-green-500 bg-green-50';

    switch (variant) {
      case 'danger':
        return 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white';
      case 'success':
        return 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white';
      default:
        return 'border-primary text-primary hover:bg-primary hover:text-white';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading || success}
      className={`w-full py-3 border rounded font-semibold transition-all ease-in-out ${getButtonClass()} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </div>
      ) : success ? (
        successText
      ) : (
        children
      )}
    </button>
  );
};

interface BaseModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  isLoading?: boolean;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isVisible,
  onClose,
  title,
  isLoading = false,
  children,
  width = 'md'
}) => {
  if (!isVisible) return null;

  const widthClasses = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-full md:w-1/2',
    xl: 'w-full md:w-2/3'
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className={`bg-white rounded-lg shadow-xl p-6 ${widthClasses[width]} max-w-4xl`}>
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            {title}
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            onClick={onClose}
            disabled={isLoading}
          >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Re-export button components from the buttons directory
export { ActionButton, CancelButton, SaveButton } from '../buttons';