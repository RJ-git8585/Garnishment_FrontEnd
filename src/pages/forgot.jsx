// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";

import axios from "axios";

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
      <h2 className="Logo_w">GarnishEdge</h2>
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