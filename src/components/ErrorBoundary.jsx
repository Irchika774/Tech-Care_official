import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });

        // Log error to console in development
        if (import.meta.env.DEV) {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // Optionally send to error reporting service
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary p-6 bg-red-50 border border-red-200 rounded-lg">
                    <h2 className="text-xl font-bold text-red-600 mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-red-500 mb-4">
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                    {this.props.fallback ? (
                        this.props.fallback(this.state)
                    ) : (
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null, errorInfo: null });
                                if (this.props.onReset) {
                                    this.props.onReset();
                                }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
