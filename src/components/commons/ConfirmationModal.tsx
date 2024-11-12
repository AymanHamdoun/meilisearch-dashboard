import React from 'react';

const ConfirmationModal = ({ isVisible, onClose, onConfirm, message }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-md shadow-lg">
        <h2 className="pb-2 text-lg font-semibold mb-4 border-b border-b-gray-200">{message}</h2>
        <p className='mb-4 text-gray-800'>This action cannot be undone</p>
        <div className="flex justify-end gap-2 ">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;