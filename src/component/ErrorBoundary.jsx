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
import Swal from "sweetalert2";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    Swal.fire({
      icon: "error",
      title: "Something went wrong!",
      text: "An unexpected error occurred. Please try again later.",
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center mt-10">
          <h1 className="text-2xl font-bold text-red-600">Something went wrong!</h1>
          <p className="text-gray-700">Please refresh the page or try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
