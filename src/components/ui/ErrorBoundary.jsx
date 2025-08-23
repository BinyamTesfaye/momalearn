import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark p-4">
          <div className="text-center max-w-2xl">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong</h1>
            <p className="text-xl text-gray-300 mb-6">
              We're having trouble loading the page. Please try refreshing or contact support.
            </p>
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            <div className="mt-8 p-4 bg-gray-800/50 rounded-lg text-left">
              <p className="text-gray-400 mb-2">Technical details for developers:</p>
              <p className="text-sm text-gray-500">
                Check the browser console for more information about the error.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}