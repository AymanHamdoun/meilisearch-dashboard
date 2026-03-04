import React, { useState, useEffect } from 'react';
import { BaseModal, ModalError, ModalSuccess, ModalButton } from "../../../commons/modal/ModalComponents";
import { swapIndexes, listIndexes } from "../../../../services/meilisearch/indexes";
import useMeiliInstance from "../../../../hooks/useMeiliInstance";
import useModalState from "../../../../hooks/useModalState";

interface SwapIndexesModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const SwapIndexesModal: React.FC<SwapIndexesModalProps> = ({ isVisible, onClose }) => {
    const { instanceState } = useMeiliInstance();
    const [indexes, setIndexes] = useState<string[]>([]);
    const [indexA, setIndexA] = useState('');
    const [indexB, setIndexB] = useState('');
    const { isLoading, error, success, resetState, handleAsyncOperation } = useModalState();

    useEffect(() => {
        if (isVisible && instanceState.isLoaded) {
            listIndexes(instanceState.host, instanceState.key)
                .then((data: any) => {
                    const names = (data.results || []).map((idx: any) => idx.uid);
                    setIndexes(names);
                    if (names.length >= 2) {
                        setIndexA(names[0]);
                        setIndexB(names[1]);
                    }
                })
                .catch(() => {});
        }
    }, [isVisible, instanceState]);

    const handleClose = () => {
        if (!isLoading) {
            resetState();
            onClose();
        }
    };

    const handleSwap = async () => {
        await handleAsyncOperation(
            async () => {
                if (!indexA || !indexB || indexA === indexB) {
                    throw new Error('Please select two different indexes');
                }
                await swapIndexes(instanceState, [{ indexes: [indexA, indexB] }]);
            },
            undefined,
            handleClose,
            1000
        );
    };

    return (
        <BaseModal isVisible={isVisible} onClose={handleClose} title="Swap Indexes" isLoading={isLoading}>
            <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600">Swap the documents, settings, and task history of two indexes.</p>
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Index A</label>
                        <select value={indexA} onChange={(e) => setIndexA(e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                            {indexes.map(idx => <option key={idx} value={idx}>{idx}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Index B</label>
                        <select value={indexB} onChange={(e) => setIndexB(e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                            {indexes.map(idx => <option key={idx} value={idx}>{idx}</option>)}
                        </select>
                    </div>
                </div>
                <ModalError error={error} />
                <ModalSuccess success={success} message="Indexes swapped successfully!" />
                <ModalButton onClick={handleSwap} disabled={!indexA || !indexB || indexA === indexB} isLoading={isLoading} success={success} loadingText="Swapping...">
                    Swap
                </ModalButton>
            </div>
        </BaseModal>
    );
};

export default SwapIndexesModal;
