// Logout.jsx build freash component for logout text
// eslint-disable-next-line no-unused-vars
import {React,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {  FaSignOutAlt } from 'react-icons/fa';


const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token'); 
    sessionStorage.removeItem('id');
    localStorage.removeItem('id');
    sessionStorage.removeItem('name'); 
    localStorage.removeItem('name'); // Clear the token from localStorage
    navigate('/', { replace: true }); // Redirect to login and prevent back button issues
  };
  useEffect(()=>{
    // handleLogout();
},[])
  return (
    <>    <button className="sidebar-link " onClick={handleLogout}>
      <FaSignOutAlt />
      <p>LOGOUT</p>
      </button>
      </>

  );
};

export default Logout;




