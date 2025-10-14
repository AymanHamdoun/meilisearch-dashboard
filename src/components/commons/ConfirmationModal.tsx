import React from 'react';
import useModalState from '../../hooks/useModalState';

interface ConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  message: string;
  description?: string;
  confirmButtonText?: string;
  confirmButtonColor?: 'red' | 'blue' | 'green' | 'primary';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  message,
  description = 'This action cannot be undone',
  confirmButtonText = 'Confirm',
  confirmButtonColor = 'red'
}) => {
  const { isLoading, error, success, resetState, handleAsyncOperation } = useModalState();

  const handleConfirm = async () => {
    await handleAsyncOperation(onConfirm, undefined, onClose, 1000);
  };

  const handleClose = () => {
    if (!isLoading) {
      resetState();
      onClose();
    }
  };

  if (!isVisible) return null;

  const getConfirmButtonColor = () => {
    if (isLoading) return 'bg-gray-400 cursor-not-allowed';
    if (success) return 'bg-primary hover:primary-midfaint';

    switch (confirmButtonColor) {
      case 'primary': return 'bg-primary hover:primary-midfaint';
      case 'blue': return 'bg-blue-500 hover:bg-blue-600';
      case 'green': return 'bg-green-500 hover:bg-green-600';
      case 'red': default: return 'bg-red-500 hover:bg-red-600';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md shadow-lg">
        <h2 className="pb-2 text-lg font-semibold mb-4 border-b border-b-gray-200">{message}</h2>
        <p className='mb-4 text-gray-800'>{description}</p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">Operation completed successfully!</p>
          </div>
        )}

        <div className="flex justify-end gap-2 ">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className={`px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded transition-all ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || success}
            className={`px-4 py-2 text-sm text-white rounded transition-all ${
              getConfirmButtonColor()
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </div>
            ) : success ? (
              '✓ Success'
            ) : (
              confirmButtonText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;