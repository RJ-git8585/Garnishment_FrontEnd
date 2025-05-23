
/**
 * Forgot Component
 *
 * This component renders a password recovery page where users can input their email
 * to request a password reset link. It includes form validation, error handling, 
 * and success messages.
 *
 * @component
 * @returns {JSX.Element} The Forgot component.
 *
 * @example
 * // Usage
 * import Forgot from './forgot';
 * 
 * function App() {
 *   return <Forgot />;
 * }
 *
 * Features:
 * - Custom body styles applied on mount and reset on unmount.
 * - Form submission to send a password reset request to the backend.
 * - Displays success or error messages based on the response.
 *
 * State Variables:
 * @state {string} email - The email input value.
 * @state {string} message - Success message displayed after a successful request.
 * @state {string} error - Error message displayed if the request fails.
 *
 * Effects:
 * - Applies custom styles to the body element on component mount and resets them on unmount.
 *
 * Functions:
 * @function handleSubmit - Handles the form submission, sends a POST request to the backend,
 *                          and updates the message or error state based on the response.
 */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from '../utils/image/Logo_g.png';
function Forgot() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Apply custom body styles
    const setBodyStyles = () => {
      document.body.style.cssText = `
        height: 100vh;
        overflow: hidden;
        margin: 0;
        padding: 0;
        background-color: #f8fafc;
      `;
    };
    setBodyStyles();

    return () => {
      // Reset body styles on unmount
      document.body.style.cssText = "";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "https://garnishment-backend.onrender.com/User/password-reset",
        { email }
      );

      if (response.data.success) {
        setMessage("Password reset link has been sent to your email.");
      } else {
        setError(response.data.message || "Failed to send password reset link.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="flex h-screen dark:bg-slate-800 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src={Logo} alt="Your Company" /> 
        <h2 className="mt-10 text-center text-2xl font-bold dark:text-white text-gray-900">
          PASSWORD RECOVERY
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 rounded-md shadow-lg shadow-blue-500/50"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 dark:text-white text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus:outline focus:ring-2 focus:ring-orange-500"
            >
              Send
            </button>
          </div>
        </form>

        {message && (
          <p className="text-center text-sm mt-4 text-green-500">{message}</p>
        )}
        {error && (
          <p className="text-center text-sm mt-4 text-red-500">{error}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-white">
          Already a member?{" "}
          <a
            href="/"
            className="font-semibold text-orange-500 hover:text-indigo-500"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Forgot;