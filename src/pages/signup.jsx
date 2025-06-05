/**
 * Form Component
 * 
 * This component renders a sign-up form for user registration. It includes input fields for
 * employer name, username, email, password, and re-entering the password. It also provides
 * options for social login using Google and Facebook, along with links to documentation, API,
 * and contact information.
 * 
 * Features:
 * - Handles form input changes and submission.
 * - Sends user registration data to the server using Axios.
 * - Applies custom styles to the body during the component's lifecycle.
 * - Displays error messages in case of registration failure.
 * 
 * @component
 * @returns {JSX.Element} The rendered sign-up form component.
 * 
 * @example
 * <Form />
 * 
 * State:
 * - formData: Object containing user input values for the form fields.
 * 
 * Effects:
 * - Applies custom body styles on mount and resets them on unmount.
 * 
 * Functions:
 * - handleChange: Updates the formData state when input fields change.
 * - handleSubmit: Handles form submission, sends data to the server, and handles errors.
 * 
 * Dependencies:
 * - React: For managing state and lifecycle methods.
 * - Axios: For making HTTP requests.
 * - Tailwind CSS: For styling the form and layout.
 * - react-icons: For rendering Google and Facebook icons.
 * 
 * Props:
 * - None
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../utils/image/Logo_g.png';
import { FcGoogle } from "react-icons/fc";
import { RiFacebookFill } from "react-icons/ri";
import { API_URLS } from '../configration/apis';

function Form() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password1: '',
    password2: ''
  });

  // const navigate = useNavigate();s
  useEffect(() => {
    // Apply custom body styles
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#f8fafc"; // Light gray background

    return () => {
      // Reset body styles on unmount
      document.body.style.height = "";
      document.body.style.overflow = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // alert('Registration successful1');
    try {
      const response = await axios.post(API_URLS.REGISTER, formData);
      // alert('Registration successful2');
      if (response.data.message) {
        console.log(response.data)
      }
    } catch (error) {
      console.error(error.response.data);
      console.log(error.response.data);
      alert(error.response.data.error);
    }
  };
  return (
    <div className="flex lg:h-screen dark:bg-slate-800 flex-1 flex-col justify-center px-6 py-2 lg:px-8">
      <div className="grid grid-flow-row-dense items-center place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-2">
            <div className="sm:mx-auto   sm:w-full sm:max-w-md ]">
            {/* <h2 className="Logo_w">GarnishEdge</h2> */}
            <img className="mx-auto h-10 w-auto" src={logo} alt="Your Company" /> 
                      <h2 className=" mb-10 text-center dark:text-white text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign up to your account
                      </h2>
                      <form className= "grid grid-cols-2 lg:mr-4 gap-4 space-y-6 border-gray-50 rounded-md space-y-6 p-6 shadow-lg shadow-blue-500/50" onSubmit={handleSubmit}>
                        <div className="mt-4">
                          <label htmlFor="name" className="block dark:text-white text-sm font-medium leading-6 text-gray-900">Employer Name</label>
                          <div className="mt-2">
                            <input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        <div >
                          <label htmlFor="username" className="block dark:text-white text-sm font-medium leading-6 text-gray-900">Username</label>
                          <div className="mt-2">
                            <input
                              id="username"
                              name="username"
                              type="text"
                              value={formData.username}
                              onChange={handleChange}
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        <div className="col-span-2 mt-0">
                          <label htmlFor="email" className="block dark:text-white text-sm font-medium leading-6 text-gray-900">Email</label>
                          <div className="">
                            <input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        <div className="mt-0"> 
                          <label htmlFor="password1" className="block dark:text-white text-sm font-medium leading-6 text-gray-900">Password</label>
                          <div className="mt-0">
                            <input
                              id="password1"
                              name="password1"
                              type="password"
                              value={formData.password1}
                              onChange={handleChange}
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        <div className="mt-0">
                          <label htmlFor="password2" className="block dark:text-white text-sm font-medium leading-6 text-gray-900">Re-enter Password</label>
                          <div className="mt-0">
                            <input
                              id="password2"
                              name="password2"
                              type="password"
                              value={formData.password2}
                              onChange={handleChange}
                              
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <button type="submit" className="flex w-full justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500">
                            Sign up
                          </button>
                        </div>
                      </form>
                      <p className="mt-1 text-center text-sm p-6 text-gray-500 dark:text-white">
                        Already a member?{' '} 
                        <a href="/" className="font-semibold leading-6 text-orange-500 hover:text-indigo-500">Login</a>
                      </p>
           
            </div>
            <div className="mt-10 mt-20  ml-10 sm:mx-auto sm:w-full sm:max-w-lg ">
            <div className='text-white  text-2xl'>Sign in easily using your existing account from <b className="text-amber-500" >Social Accounts</b>. No need to create a new password or remember multiple login credentials.</div>
                                  <div className='text-white  border-b-[0.5px] border-orange-50 pb-5 text-2xl'>
                                    Keep the text clear, concise, and easy to understand.
                         Security: If applicable, you can mention that the SSO login process is secure and user credentials are not stored locally.  </div>
                  <div className="custom_page  mt-8 pb-16">
                   
                          <h1 className='text-white text-2xl font-bold'>Login with SSO</h1>
                          
                         
                            <h4 className='text-white mt-2'>We encountered an issue while signing you in with SSO.</h4>
                            <p className='text-white text-xs mt-2'>SSO login process is secure and user credentials are not stored locally.</p>
                          <div className='inline-block_cus'>
                          <a href="https://dev-ntapzgi6ocsiwjal.us.auth0.com/samlp/PxYyuHmOIVRrsEHkWFpnOeJL0UpBAXD9">
                          <FcGoogle className='text-3xl text-white mt-10' />
                          </a>  
                          <a href="https://www.facebook.com">
                          <RiFacebookFill className='text-blue-500 text-3xl mt-10'  />
                          </a>
   {/* applicagtion exrtra links with new docs */}
                   <div className="LinkForInternal mt-2 mb-8 text-white  border-t-[0.5px] border-orange-50 pb-2 ">
                         <a href="/docs" className="font-semibold mt-10  ml-4 mr-6 leading-6 text-orange-500 hover:text-indigo-500">Documentation</a> 
                         <a href="/docs" className="font-semibold mt-10 ml-4 mr-6 leading-6 text-orange-500 hover:text-indigo-500">API</a> 
                         <a href="https://garnishedge.com/" className="font-semibold mt-10 ml-4 mr-6 leading-6 text-orange-500 hover:text-indigo-500">Contact Us</a>
                         </div>
                

                          </div>
       </div>
                    
                    </div>
              </div>
              {/* <ToastContainer /> */}
    </div>
  );
}



export default Form;
