import React from 'react';
import { APISettings } from '../../../../../services/meilisearch/types';
import useModalState from '../../../../../hooks/useModalState';
import { BaseModal, ModalError, ModalSuccess } from '../../../../commons/modal/ModalComponents';
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

    const getConfirmButtonColor = () => {
        if (isLoading) return 'bg-gray-400 cursor-not-allowed';
        if (success) return 'bg-primary hover:primary-midfaint';
        return 'bg-primary hover:bg-primary-dark';
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
                            Saving...
                        </div>
                    ) : success ? (
                        '✓ Success'
                    ) : (
                        'Save Settings'
                    )}
                </button>
            </div>
        </BaseModal>
    );
};

export default SettingDiffPreviewModal;