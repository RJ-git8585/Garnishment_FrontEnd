/**
 * A higher-order component that restricts access to its children based on authentication.
 * If a valid token is not found in sessionStorage, the user is redirected to the login page.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components to render if authenticated.
 * @returns {React.ReactNode} The child components if authenticated, otherwise a redirect to the login page.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem('token'); // Get token from sessionStorage

  if (!token) {
    return <Navigate to="/" replace />; // Redirect to login if no token
  }

  return children; // Render the wrapped component if authenticated
};

export default PrivateRoute;