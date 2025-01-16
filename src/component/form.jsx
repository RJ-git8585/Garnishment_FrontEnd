// eslint-disable-next-line no-unused-vars
import  { React, useState } from 'react';
import logo from '/src/Logo (1).png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import {  ToastContainer,toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";
import { RiFacebookFill } from "react-icons/ri";
import { BASE_URL } from '../Config';

function Form() {
  const navigate = useNavigate();
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    // alert(showPassword)
      setShowPassword(!showPassword);
    };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      
      return; // Exit function if email is invalid
    }
    

    // Password validation (adjust validation rules as needed)
    if (password.length < 9 ) {
      setErrorMessage('Password must be at least 9 characters long.');
      
      return; // Exit function if password is invalid
    }

    const loginCredentials = { email, password };

    try {
      const response = await axios.post(`${BASE_URL}/User/login`, loginCredentials,);
      if (response.data.success) {
        localStorage.setItem('token', response.data.access);
        sessionStorage.setItem('token', response.data.access);
        // Optionally store other user data
        localStorage.setItem('id', response.data.user_data.employer_id);
        sessionStorage.setItem('id', response.data.user_data.employer_id);
        // Store the access token
        localStorage.setItem('name', response.data.user_data.name);
        sessionStorage.setItem('name', response.data.user_data.name);
        navigate('/dashboard');
        // toast('Login successful!', {
        //   autoClose: 3000, // Delay in milliseconds
        //   position: 'top-right',
        // }); 
      } else {
        // toast.success("Please Check Credentials!");
        setErrorMessage(response.data.message);
        
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed');
      // toast.warning("Please Check Credentials!");
    }
  };
  

  
  
  return (
    <>
     <div className="flex min-h-screen dark:bg-slate-800 flex-col lg:flex-row justify-center items-center px-6 py-12 lg:px-8">
  {/* Left Section: Sign-In Form */}
  <div className="max-w-md w-full p-6 bg-white dark:bg-slate-900 rounded-lg shadow-lg">
    <img className="mx-auto h-12 w-auto mb-6" src={logo} alt="Your Company Logo" />
    <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white mb-6">
      Sign in to your account
    </h2>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 py-2 px-3 text-gray-800 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your email"
        />
      </div>

      {/* Password Input */}
      <div className="relative">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 py-2 px-3 text-gray-800 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5c-4.97 0-9.27 3.11-10.99 7.5C2.73 15.89 7.03 19 12 19s9.27-3.11 10.99-7.5C21.27 7.61 16.97 4.5 12 4.5z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5c4.97 0 9.27 3.11 10.99 7.5C21.27 15.89 16.97 19 12 19s-9.27-3.11-10.99-7.5C2.73 7.61 7.03 4.5 12 4.5z" />
              <path d="M12 15c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3 1.35 3 3 3z" />
            </svg>
          )}
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

      {/* Forgot Password */}
      <div className="flex items-center justify-between text-sm">
        <a href="/forgot" className="text-indigo-600 hover:underline">
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full flex justify-center rounded-md bg-indigo-600 py-2 text-white text-sm font-medium hover:bg-indigo-700"
      >
        Sign In
      </button>
    </form>

    {/* Signup Link */}
    <p className="mt-6 text-center text-sm text-gray-500">
      Not a member?{" "}
      <a href="/signup" className="font-medium text-indigo-600 hover:underline">
        Sign up
      </a>
    </p>
  </div>

  {/* Right Section: SSO Info */}
  <div className="max-w-lg w-full mt-10 lg:mt-0 lg:ml-10 text-center lg:text-left text-gray-100">
    <h3 className="text-2xl font-bold">
      Sign in with <span className="text-amber-500">Social Accounts</span>
    </h3>
    <p className="mt-4 text-gray-300">
      No need to create a new password. Enjoy a secure login process where user credentials are not stored locally.
    </p>

    {/* Social Icons */}
    <div className="flex justify-center lg:justify-start mt-6 space-x-6">
      <a href="https://dev-ntapzgi6ocsiwjal.us.auth0.com/samlp/PxYyuHmOIVRrsEHkWFpnOeJL0UpBAXD9">
        <FcGoogle className="text-4xl" />
      </a>
      <a href="https://www.facebook.com">
        <RiFacebookFill className="text-4xl text-blue-500" />
      </a>
    </div>

    {/* Additional Links */}
    <div className="mt-8 space-x-4 text-sm">
      <a href="/docs" className="text-indigo-400 hover:underline">
        Documentation
      </a>
      <a href="/api" className="text-indigo-400 hover:underline">
        API
      </a>
      <a href="/contact" className="text-indigo-400 hover:underline">
        Contact Us
      </a>
    </div>
  </div>
</div>
    </>
  );
}

export default Form;
