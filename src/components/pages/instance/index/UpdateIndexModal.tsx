import React, { useState } from 'react';
import { BaseModal, ModalError, ModalSuccess, ModalButton } from "../../../commons/modal/ModalComponents";
import { updateIndex } from "../../../../services/meilisearch/indexes";
import useMeiliInstance from "../../../../hooks/useMeiliInstance";
import useModalState from "../../../../hooks/useModalState";

interface UpdateIndexModalProps {
    isVisible: boolean;
    onClose: () => void;
    indexName: string;
}

const UpdateIndexModal: React.FC<UpdateIndexModalProps> = ({ isVisible, onClose, indexName }) => {
    const { instanceState } = useMeiliInstance();
    const [primaryKey, setPrimaryKey] = useState('');
    const { isLoading, error, success, resetState, handleAsyncOperation } = useModalState();

    const handleClose = () => {
        if (!isLoading) {
            resetState();
            setPrimaryKey('');
            onClose();
        }
    };

    const handleUpdate = async () => {
        await handleAsyncOperation(
            async () => {
                if (!primaryKey.trim()) throw new Error('Primary key is required');
                await updateIndex(instanceState, indexName, primaryKey.trim());
            },
            undefined,
            handleClose,
            1000
        );
    };

    return (
        <BaseModal isVisible={isVisible} onClose={handleClose} title={`Update Primary Key - ${indexName}`} isLoading={isLoading}>
            <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600">
                    Update the primary key of this index. Note: the primary key can only be updated if it has not been set yet, or if the index has no documents.
                </p>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Primary Key</label>
                    <input
                        type="text"
                        value={primaryKey}
                        onChange={(e) => setPrimaryKey(e.target.value)}
                        placeholder="e.g. id"
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <ModalError error={error} />
                <ModalSuccess success={success} message="Primary key updated successfully!" />
                <ModalButton onClick={handleUpdate} disabled={!primaryKey.trim()} isLoading={isLoading} success={success} loadingText="Updating...">
                    Update
                </ModalButton>
            </div>
        </BaseModal>
    );
};

export default UpdateIndexModal;
