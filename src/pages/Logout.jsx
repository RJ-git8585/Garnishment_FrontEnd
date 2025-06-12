
/**
 * Logout Component
 *
 * This component handles the user logout process. It provides a button for the user to log out,
 * clears all relevant local and session storage items, and redirects the user to the login page.
 * A loading indicator is displayed during the logout process.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered Logout component.
 *
 * @example
 * // Usage
 * import Logout from './Logout';
 * 
 * function App() {
 *   return <Logout />;
 * }
 *
 * @dependencies
 * - react: For managing state and lifecycle methods.
 * - react-router-dom: For navigation and redirection.
 * - react-icons: For the logout icon.
 * - @mui/material: For the Backdrop, CircularProgress, and Typography components.
 *
 * @function handleLogout
 * - Clears local and session storage items.
 * - Displays a loading indicator during the process.
 * - Redirects the user to the login page after a short delay.
 *
 * @state {boolean} loading - Indicates whether the logout process is in progress.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { CircularProgress, Backdrop, Typography } from "@mui/material";

  /**
   * Handles the user logout process.
   *
   * The component provides a button for the user to log out,
   * clears all relevant local and session storage items,
   * and redirects the user to the login page.
   * A loading indicator is displayed during the logout process.
   */
const Logout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loader state

  const handleLogout = () => {
    setLoading(true); // Start loader
    setTimeout(() => {
      // Clear all local and session storage items
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('id');
      localStorage.removeItem('id');
      sessionStorage.removeItem('name');
      localStorage.removeItem('name');
      sessionStorage.removeItem('cid');
      localStorage.removeItem('cid');
      sessionStorage.removeItem('email');
      localStorage.removeItem('email');

      setLoading(false); // Stop loader
      navigate('/', { replace: true }); // Redirect to login
    }, 1500); // Simulate a short delay for the logout process
  };

  useEffect(() => {
    // Optionally handle logout immediately on component mount
    // handleLogout();
  }, []);

  return (
    <>
      <button className="sidebar-link" onClick={handleLogout}>
        <FaSignOutAlt />
        <p>Sign Out</p>
      </button>

      {/* Backdrop Loader */}
      <Backdrop
        open={loading}
        sx={{
          zIndex: 1300,
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress
          size={80}
          thickness={5}
          sx={{
            color: "orange",
            animation: "pulse 1.5s infinite",
          }}
        />
        <Typography variant="h6" component="div">
          Logging Out...
        </Typography>
      </Backdrop>
    </>
  );
};

export default Logout;
