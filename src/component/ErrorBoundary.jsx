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
