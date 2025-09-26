import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useMeiliInstance from '../../../hooks/useMeiliInstance';
import { InstanceAction } from '../../../reducers/instanceReducer';

export enum ErrorType {
    CONNECTION = 'connection',
    API_KEY = 'api_key',
    TIMEOUT = 'timeout',
    UNKNOWN = 'unknown'
}

const InstanceErrorPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { dispatch } = useMeiliInstance();
    const [errorType, setErrorType] = useState<ErrorType>(ErrorType.UNKNOWN);

    useEffect(() => {
        // Get error type from location state if available
        if (location.state?.errorType) {
            setErrorType(location.state.errorType);
        }
    }, [location]);

    const handleClearAndRedirect = () => {
        // Clear ALL localStorage data
        localStorage.clear();

        // Reset the instance state
        dispatch({
            type: InstanceAction.Set,
            payload: {
                label: "Not Set",
                host: "",
                key: "",
                isSet: false,
                isLoaded: true
            }
        });

        // Redirect to instance form page
        navigate('/instance-form');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full text-center">
                {/* Sad Meili Icon */}
                <div className="mb-6">
                    <div className="text-6xl mb-2">😢</div>
                </div>

                {/* Error Message */}
                <h1 className="text-2xl font-bold text-gray-800 mb-3">
                    {errorType === ErrorType.API_KEY
                        ? "Authentication Failed"
                        : errorType === ErrorType.TIMEOUT
                        ? "Connection Timeout"
                        : "Oh no! Connection Lost"}
                </h1>

                <p className="text-gray-600 mb-6 leading-relaxed">
                    {errorType === ErrorType.API_KEY
                        ? "The API key provided is invalid or has expired. Please check your credentials and try again with a valid API key."
                        : errorType === ErrorType.TIMEOUT
                        ? "The request took too long to respond. The Meilisearch instance might be overloaded or there could be network issues."
                        : "The Meilisearch instance is either no longer available or cannot be reached. This might happen if the server is down, the connection details have changed, or there's a network issue."}
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm text-gray-500 mb-1">Failed instance:</p>
                    <p className="text-sm font-mono text-gray-700">
                        {localStorage.getItem('instance') &&
                            JSON.parse(localStorage.getItem('instance') || '{}').host ||
                            'Unknown host'}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleClearAndRedirect}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
                    >
                        Configure New Instance
                    </button>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out"
                    >
                        Try Reloading
                    </button>
                </div>

                <p className="text-xs text-gray-400 mt-6">
                    If this problem persists, please check your Meilisearch server status.
                </p>
            </div>
        </div>
    );
};

export default InstanceErrorPage;