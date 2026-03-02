import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { cancelTasks } from '../../../../../services/meilisearch/tasks';
import useMeiliInstance from '../../../../../hooks/useMeiliInstance';
import { getErrorMessage } from '../../../../../utils/errorHandling';

const DEBOUNCE_DELAY_MS = 1000;

interface CancelTasksActionProps {
    onActionComplete?: () => void;
    onError?: (error: Error) => void;
}

const CancelTasksAction: React.FC<CancelTasksActionProps> = ({
    onActionComplete,
    onError
}) => {
    const { instanceState } = useMeiliInstance();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const lastClickTime = useRef<number>(0);

    const handleClick = async () => {
        const now = Date.now();
        if (now - lastClickTime.current < DEBOUNCE_DELAY_MS) return;
        lastClickTime.current = now;

        if (isLoading) return;

        if (!confirm('Cancel all enqueued and processing tasks?')) return;

        setIsLoading(true);
        try {
            const response = await cancelTasks(instanceState, {
                statuses: ['enqueued', 'processing']
            });
            if (response && response.taskUid) {
                navigate(`/instance/tasks?taskuid=${response.taskUid}`);
                onActionComplete?.();
            }
        } catch (error) {
            console.error('Failed to cancel tasks:', error);
            const errorWithMessage = new Error(getErrorMessage(error, 'Cancel tasks'));
            onError?.(errorWithMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className="block w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Canceling...
                </>
            ) : (
                'Cancel Pending Tasks'
            )}
        </button>
    );
};

export default CancelTasksAction;
