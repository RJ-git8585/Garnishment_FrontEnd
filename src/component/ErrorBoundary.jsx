/**
 * ErrorBoundary is a React component that acts as an error boundary to catch JavaScript errors
 * anywhere in its child component tree. It displays a fallback UI and logs the error details.
 *
 * @class
 * @extends React.Component
 * @param {Object} props - The props passed to the ErrorBoundary component.
 * @param {React.ReactNode} props.children - The child components wrapped by the ErrorBoundary.
 *
 * @method static getDerivedStateFromError
 * @description Updates the state to indicate an error has occurred.
 * @param {Error} error - The error that was thrown.
 * @returns {Object} An object with `hasError` set to true.
 *
 * @method componentDidCatch
 * @description Logs the error and displays an alert using SweetAlert2.
 * @param {Error} error - The error that was thrown.
 * @param {Object} errorInfo - Additional information about the error.
 *
 * @method render
 * @description Renders the fallback UI if an error occurred, otherwise renders the child components.
 *
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 */
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold text-red-500">Something went wrong.</h1>
          <p className="text-gray-700">Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
