import React from 'react';
import { APISettings } from '../../../../../services/meilisearch/types';
import useModalState from '../../../../../hooks/useModalState';
import { BaseModal, ModalError, ModalSuccess, CancelButton, SaveButton } from '../../../../commons/modal/ModalComponents';
import { formatValue, getDifferences } from '../../../../../utils/objectUtils';

interface SettingDiffPreviewModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    originalSettings: APISettings;
    modifiedSettings: APISettings;
}

const SettingDiffPreviewModal: React.FC<SettingDiffPreviewModalProps> = ({
    isVisible,
    onClose,
    onConfirm,
    originalSettings,
    modifiedSettings
}) => {
    const { isLoading, error, success, resetState, handleAsyncOperation } = useModalState();

    const changes = getDifferences(originalSettings, modifiedSettings);

    const handleConfirm = async () => {
        await handleAsyncOperation(onConfirm, undefined, onClose, 1000);
    };

    const handleClose = () => {
        if (!isLoading) {
            resetState();
            onClose();
        }
    };

    return (
        <BaseModal
            isVisible={isVisible}
            onClose={handleClose}
            title="Review Settings Changes"
            isLoading={isLoading}
            width="lg"
        >
            <div className="max-h-96 overflow-y-auto mb-4">
                {changes.length === 0 ? (
                    <p className="text-gray-600">No changes detected.</p>
                ) : (
                    <div className="space-y-2">
                        <p className="text-gray-700 font-medium mb-3">The following settings will be updated:</p>
                        {changes.map((change, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <code className="font-mono text-sm font-medium text-gray-800">
                                        {change.field}
                                    </code>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-mono">
                                            {formatValue(change.original)}
                                        </span>
                                        <span className="text-gray-400">→</span>
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono">
                                            {formatValue(change.modified)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ModalError error={error} />
            <ModalSuccess success={success} message="Settings saved successfully!" />

            <div className="flex justify-end gap-2">
                <CancelButton onClick={handleClose} disabled={isLoading} />
                <SaveButton
                    onClick={handleConfirm}
                    disabled={isLoading}
                    loading={isLoading}
                    success={success}
                    defaultText="Save Settings"
                />
            </div>
        </BaseModal>
    );
};

export default SettingDiffPreviewModal;