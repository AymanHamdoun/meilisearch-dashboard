import React, { useState } from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { vscodeLight, vscodeDark } from "@uiw/codemirror-theme-vscode";
import { json } from "@codemirror/lang-json";
import { uploadDocuments } from "../../../../../services/meilisearch/indexes";
import useMeiliInstance from "../../../../../hooks/useMeiliInstance";
import useIndex from "../../../../../hooks/useMeiliIndex";
import useModalState from "../../../../../hooks/useModalState";

interface DocIndexingModalProps {
    isVisible: boolean;
    onClose: () => void;
    indexName: string;
}

const DocIndexingModal: React.FC<DocIndexingModalProps> = ({ isVisible, onClose, indexName }) => {
  const { instanceState } = useMeiliInstance();
  const { isLoading, error, success, resetState, handleAsyncOperation } = useModalState();

  const [code, setCode] = useState(JSON.stringify([{ name: "John Doe", bio: "A very searchable person" }, { name: "Jane Doe", bio: "Another very searchable person" }], null, 2));

  const resetModal = () => {
    setCode(JSON.stringify([{ name: "John Doe", bio: "A very searchable person" }, { name: "Jane Doe", bio: "Another very searchable person" }], null, 2));
    resetState();
  };

  const handleClose = () => {
    if (!isLoading) {
      resetModal();
      onClose();
    }
  };

  const validateAndParseJSON = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);

      // Must be an array of objects
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of objects');
      }

      if (parsed.length === 0) {
        throw new Error('JSON array cannot be empty');
      }

      // Check that all items are objects (not primitives)
      const allAreObjects = parsed.every(item =>
        typeof item === 'object' && item !== null && !Array.isArray(item)
      );

      if (!allAreObjects) {
        throw new Error('All items in the array must be objects');
      }

      return parsed;
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON format');
      }
      throw error;
    }
  };

  const performDocumentUpload = async () => {
    // Validate index name
    if (!indexName || indexName.trim() === '') {
      throw new Error('No index selected. Please select an index first.');
    }

    // Validate and parse JSON
    const documents = validateAndParseJSON(code);

    // Upload documents to Meilisearch
    const response = await uploadDocuments({
      instance: instanceState,
      indexName: indexName,
      documents: documents
    });

    // Check if there's an error in the response
    if (response.message && response.code) {
      throw new Error(response.message);
    }
  };

  const handleDocumentUpload = async () => {
    await handleAsyncOperation(
      performDocumentUpload,
      undefined, // onSuccess callback
      onClose, // onClose callback
      1000 // success delay
    );
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full md:w-1/3 max-w-md shadow-lg">
        <div className="flex items-center justify-between py-2 border-b rounded-t border-gray-200 mb-2">
          <h3 className="text-lg font-semibold text-gray-700">
            Add Record(s)
          </h3>
          <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" onClick={handleClose} disabled={isLoading}>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <p className='mb-4 text-gray-800'>
          Add records to '{indexName}' in JSON format. JSON should contain either a single object or an array of objects. For example:
        </p>
        <div className="flex flex-col gap-2">
          <div>
            <CodeMirror
              value={code}
              extensions={[json()]}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLine: true,
              }}
              onChange={(newCode) => {
                setCode(newCode)
              }}
              style={{
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                overflow: "hidden",
              }}
              theme={vscodeDark}
              editable={!isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">Documents uploaded successfully!</p>
            </div>
          )}

          <button
            onClick={handleDocumentUpload}
            disabled={isLoading || !code.trim()}
            className={`w-full py-3 border rounded font-semibold transition-all ease-in-out ${
              isLoading
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-primary text-primary hover:bg-primary hover:text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </div>
            ) : success ? (
              '✓ Success'
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocIndexingModal;