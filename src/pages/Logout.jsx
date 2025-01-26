import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { CircularProgress, Backdrop, Typography } from "@mui/material";

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
        <p>LOGOUT</p>
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
