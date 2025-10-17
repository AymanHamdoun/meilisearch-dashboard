import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSnapshot } from '../../../../../services/meilisearch/snapshots';
import useMeiliInstance from '../../../../../hooks/useMeiliInstance';
import { getErrorMessage } from '../../../../../utils/errorHandling';

// Constants
const DEBOUNCE_DELAY_MS = 1000; // Prevent clicks within 1 second

interface CreateSnapshotActionProps {
    onActionComplete?: () => void;
    onError?: (error: Error) => void;
}

const CreateSnapshotAction: React.FC<CreateSnapshotActionProps> = ({
    onActionComplete,
    onError
}) => {
    const { instanceState } = useMeiliInstance();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const lastClickTime = useRef<number>(0);

    const handleClick = async () => {
        // Debounce rapid clicks
        const now = Date.now();
        if (now - lastClickTime.current < DEBOUNCE_DELAY_MS) {
            return;
        }
        lastClickTime.current = now;

        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await createSnapshot(instanceState);
            if (response && response.taskUid) {
                // Redirect to tasks page with the taskUid
                navigate(`/instance/tasks?taskuid=${response.taskUid}`);
                onActionComplete?.();
            }
        } catch (error) {
            console.error('Failed to create snapshot:', error);
            const errorWithMessage = new Error(getErrorMessage(error, 'Create snapshot'));
            onError?.(errorWithMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Creating Snapshot...
                </>
            ) : (
                <>📸 Create Snapshot</>
            )}
        </button>
    );
};

export default CreateSnapshotAction;