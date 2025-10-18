import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDump } from '../../../../../services/meilisearch/dumps';
import useMeiliInstance from '../../../../../hooks/useMeiliInstance';
import { getErrorMessage } from '../../../../../utils/errorHandling';

// Constants
const DEBOUNCE_DELAY_MS = 1000; // Prevent clicks within 1 second

interface CreateDumpActionProps {
    onActionComplete?: () => void;
    onError?: (error: Error) => void;
}

const CreateDumpAction: React.FC<CreateDumpActionProps> = ({
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
            const response = await createDump(instanceState);
            if (response && response.taskUid) {
                // Redirect to tasks page with the taskUid
                navigate(`/instance/tasks?taskuid=${response.taskUid}`);
                onActionComplete?.();
            }
        } catch (error) {
            console.error('Failed to create dump:', error);
            const errorWithMessage = new Error(getErrorMessage(error, 'Create dump'));
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
                    Creating Dump...
                </>
            ) : (
                <>💾 Create Dump</>
            )}
        </button>
    );
};

export default CreateDumpAction;