import React from 'react';
import ConfirmationModal from "../../../../commons/ConfirmationModal";
import { deleteDocument, deleteAllDocuments } from "../../../../../services/meilisearch/indexes";
import useMeiliInstance from "../../../../../hooks/useMeiliInstance";

interface DocumentDeleteModalProps {
    isVisible: boolean;
    onClose: () => void;
    mode: 'single' | 'all';
    docId?: string;
    indexName: string;
    onDeleted: () => void;
}

const DocumentDeleteModal: React.FC<DocumentDeleteModalProps> = ({
    isVisible,
    onClose,
    mode,
    docId,
    indexName,
    onDeleted,
}) => {
    const { instanceState } = useMeiliInstance();

    const handleConfirm = async () => {
        if (mode === 'single' && docId) {
            await deleteDocument(instanceState, indexName, docId);
        } else if (mode === 'all') {
            await deleteAllDocuments(instanceState, indexName);
        }
        // Wait briefly for the task to process
        await new Promise(resolve => setTimeout(resolve, 500));
        onDeleted();
    };

    const message = mode === 'all'
        ? `Delete all documents from '${indexName}'?`
        : `Delete document '${docId}'?`;

    const description = mode === 'all'
        ? 'This will permanently delete all documents in this index. The index itself will remain. This action cannot be undone.'
        : 'This will permanently delete this document. This action cannot be undone.';

    return (
        <ConfirmationModal
            isVisible={isVisible}
            onClose={onClose}
            onConfirm={handleConfirm}
            message={message}
            description={description}
            confirmButtonText="Delete"
            confirmButtonColor="red"
        />
    );
};

export default DocumentDeleteModal;
