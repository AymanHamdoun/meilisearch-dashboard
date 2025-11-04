import React from 'react';
import { ActionButton } from '../../../../commons/modal/ModalComponents';

interface SettingsSaveBarProps {
    onPreviewChanges: () => void;
    onReset: () => void;
    saveSuccess: boolean;
}

const SettingsSaveBar: React.FC<SettingsSaveBarProps> = ({
    onPreviewChanges,
    onReset,
    saveSuccess
}) => {
    return (
        <div className="flex items-center justify-between bg-white p-4 rounded-md border-2 border-gray-100 shadow-sm">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">You have unsaved changes</span>
                {saveSuccess && (
                    <span className="text-sm text-green-600 font-medium">✓ Settings saved successfully</span>
                )}
            </div>
            <div className="flex gap-2">
                <ActionButton
                    onClick={onReset}
                    variant="secondary"
                >
                    Reset
                </ActionButton>
                <ActionButton
                    onClick={onPreviewChanges}
                    variant="primary"
                >
                    Preview Changes
                </ActionButton>
            </div>
        </div>
    );
};

export default SettingsSaveBar;