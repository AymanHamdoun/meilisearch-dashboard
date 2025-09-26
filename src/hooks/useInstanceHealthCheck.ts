import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useMeiliInstance from './useMeiliInstance';

interface HealthCheckResult {
    isHealthy: boolean;
    isChecking: boolean;
    error: string | null;
}

const useInstanceHealthCheck = (): HealthCheckResult => {
    const [isHealthy, setIsHealthy] = useState(true);
    const [isChecking, setIsChecking] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { instanceState } = useMeiliInstance();
    const navigate = useNavigate();

    useEffect(() => {
        const checkHealth = async () => {
            if (!instanceState.isSet || !instanceState.host) {
                setIsChecking(false);
                return;
            }

            setIsChecking(true);

            try {
                // Simple health check - try to fetch from the Meilisearch health endpoint
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

                const response = await fetch(`${instanceState.host}/health`, {
                    signal: controller.signal,
                    headers: instanceState.key ? {
                        'Authorization': `Bearer ${instanceState.key}`
                    } : {}
                });

                clearTimeout(timeoutId);

                if (!response.ok && response.status !== 401) {
                    throw new Error(`Health check failed with status: ${response.status}`);
                }

                setIsHealthy(true);
                setError(null);
            } catch (err) {
                console.error('Instance health check failed:', err);
                setIsHealthy(false);
                setError(err instanceof Error ? err.message : 'Connection failed');

                // Navigate to error page
                navigate('/instance/error');
            } finally {
                setIsChecking(false);
            }
        };

        checkHealth();
    }, [instanceState.host, instanceState.key, instanceState.isSet, navigate]);

    return { isHealthy, isChecking, error };
};

export default useInstanceHealthCheck;