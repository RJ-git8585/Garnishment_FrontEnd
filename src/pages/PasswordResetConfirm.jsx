/**
 * PasswordResetConfirm Component
 * 
 * This component provides a user interface for resetting a password. It includes
 * form fields for entering a new password and confirming it, and handles the
 * submission of the new password to the backend API.
 * 
 * @component
 * 
 * @returns {JSX.Element} The PasswordResetConfirm component.
 * 
 * @description
 * - The component uses React hooks (`useState`, `useParams`, `useNavigate`) for state management,
 *   accessing route parameters, and navigation.
 * - It validates that the new password and confirmation password match before submitting.
 * - On successful password reset, the user is redirected to the login page.
 * - Displays error or success messages based on the API response.
 * 
 * @example
 * <PasswordResetConfirm />
 * 
 * @dependencies
 * - `react`: For building the component and managing state.
 * - `react-router-dom`: For accessing route parameters and navigation.
 * - `axios`: For making HTTP requests to the backend API.
 * - `../utils/image/Logo_g.png`: Logo image used in the component.
 * 
 * @hooks
 * - `useParams`: To extract the `token` parameter from the URL.
 * - `useNavigate`: To navigate to the login page after a successful password reset.
 * - `useState`: To manage the state of the password, confirmation password, and messages.
 * 
 * @functions
 * - `handleSubmit`: Handles the form submission, validates passwords, and sends the reset request to the backend.
 * 
 * @api
 * - POST `https://garnishment-backend.onrender.com/User/password-reset-confirm/:token/`
 *   - Request Body: `{ password: string, confirm_password: string }`
 *   - Response: `{ message: string }` on success or `{ error: string }` on failure.
 */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../utils/image/Logo_g.png';
import { API_URLS } from '../configration/apis';

const PasswordResetConfirm = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm_password) {
            setMessage('Passwords do not match.');
            return;
        }
        try {
            const response = await axios.post(API_URLS.PASSWORD_RESET_CONFIRM(token), { 
                password,
                confirm_password
            });
            setMessage(response.data.message);
            navigate('/'); // Redirect to login page after successful reset
        } catch (error) {
            setMessage(error.response?.data?.error || 'Something went wrong.');
        }
    };

    return (
        <>
            <div className="flex h-screen dark:bg-slate-800 flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="grid grid-flow-row-dense grid-cols-2 mt-2">
                    <div className="sm:mx-auto suctom_login_side border-r-[0.5px] border-orange-50 sm:w-full sm:max-w-md">
                        <img className="mx-auto h-10 w-auto" src={logo} alt="Your Company" />
                        <h2 className="text-center dark:text-white text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Reset Your Password
                        </h2>
                        <form onSubmit={handleSubmit} className="mt-10 border-gray-50 rounded-md space-y-6 p-6 shadow-lg shadow-blue-500/50">
                            <div>
                                <label htmlFor="password" className="block dark:text-white text-sm font-medium leading-6 text-gray-900">
                                    New Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block dark:text-white text-sm font-medium leading-6 text-gray-900">
                                    Confirm Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        value={confirm_password}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                {message && <p className="error text-green">{message}</p>}
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                                >
                                    Reset Password
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="text-left mt-20 ml-10 sm:mx-auto sm:w-full sm:max-w-lg">
                        <div className="text-white text-2xl">
                            Reset your password using the new credentials. No need to create a new account or remember multiple login credentials.
                        </div>
                        <div className="text-white border-b-[0.5px] border-orange-50 pb-5 text-2xl">
                            If you encounter any issues, please contact support for assistance.
                        </div>
                    </div>
                </div>
                {/* <ToastContainer /> */}
            </div>
        </>
    );
};

export default PasswordResetConfirm;
