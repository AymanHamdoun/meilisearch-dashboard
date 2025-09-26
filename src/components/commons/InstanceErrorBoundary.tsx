import React, { Component, ReactNode, ErrorInfo } from 'react';
import InstanceErrorPage from '../pages/instance/InstanceErrorPage';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class InstanceErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        // Check if this is a network/connection error
        const isConnectionError =
            error.message?.toLowerCase().includes('fetch') ||
            error.message?.toLowerCase().includes('network') ||
            error.message?.toLowerCase().includes('connection') ||
            error.message?.toLowerCase().includes('failed to fetch') ||
            error.name === 'TypeError';

        return {
            hasError: isConnectionError,
            error: isConnectionError ? error : null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log the error to console for debugging
        console.error('InstanceErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <InstanceErrorPage />;
        }

        return this.props.children;
    }
}

export default InstanceErrorBoundary;