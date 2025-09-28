import React, { useState } from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { json } from "@codemirror/lang-json";
import { uploadDocuments } from "../../../../../services/meilisearch/indexes";
import useMeiliInstance from "../../../../../hooks/useMeiliInstance";
import useModalState from "../../../../../hooks/useModalState";
import { BaseModal, ModalError, ModalSuccess, ModalButton } from "../../../../commons/modal/ModalComponents";

interface DocIndexingModalProps {
    isVisible: boolean;
    onClose: () => void;
    indexName: string;
}

const DocIndexingModal: React.FC<DocIndexingModalProps> = ({ isVisible, onClose, indexName }) => {
  const { instanceState } = useMeiliInstance();

  const initialCode = JSON.stringify([{ name: "John Doe", bio: "A very searchable person" }, { name: "Jane Doe", bio: "Another very searchable person" }], null, 2);
  const [code, setCode] = useState(initialCode);

  const { isLoading, error, success, resetState, handleAsyncOperation } = useModalState({
    onReset: () => {
      setCode(initialCode);
    }
  });

  const handleClose = () => {
    if (!isLoading) {
      resetState();
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

  return (
    <BaseModal
      isVisible={isVisible}
      onClose={handleClose}
      title="Add Record(s)"
      isLoading={isLoading}
      width="lg"
    >
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

          <ModalError error={error} />
          <ModalSuccess success={success} message="Documents uploaded successfully!" />

          <ModalButton
            onClick={handleDocumentUpload}
            disabled={!code.trim()}
            isLoading={isLoading}
            success={success}
            loadingText="Uploading..."
          >
            Save
          </ModalButton>
        </div>
    </BaseModal>
  );
};

export default DocIndexingModal;