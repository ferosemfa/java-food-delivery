import { Component } from 'react';
import { FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      if (fallback) {
        return typeof fallback === 'function' ? fallback({ error, retry: this.handleRetry }) : fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertTriangle className="text-red-500" size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-500 text-sm mb-2">
              An unexpected error occurred. Please try again.
            </p>
            {error?.message && (
              <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 mb-4 font-mono truncate">
                {error.message}
              </p>
            )}
            <button onClick={this.handleRetry} className="btn-primary inline-flex items-center gap-2">
              <FiRefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}
