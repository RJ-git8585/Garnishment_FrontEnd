
/**
 * Profile Component
 * 
 * This component renders a user profile page with the ability to view and edit profile details.
 * It fetches the profile data from the server, displays it in a form, and allows editing of certain fields.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered Profile component.
 * 
 * @example
 * <Profile />
 * 
 * @description
 * - Fetches employer details using the `employer_id` stored in session storage.
 * - Displays a loading spinner while fetching data.
 * - Allows editing of specific fields in the profile.
 * - Updates the profile data on the server when the form is submitted.
 * - Displays success or error messages using SweetAlert2.
 * 
 * @state {Object} profileData - Stores the profile data for the form fields.
 * @state {boolean} loading - Indicates whether the data is being fetched.
 * @state {Array} data - Stores the fetched profile data.
 * @state {boolean} isEditing - Tracks whether the form is in edit mode.
 * 
 * @function handleChange
 * Handles changes to the form fields and updates the `profileData` state.
 * 
 * @function handleEdit
 * Enables edit mode and pre-fills the form fields with the fetched data.
 * 
 * @function handleCancel
 * Disables edit mode without saving changes.
 * 
 * @function handleSubmit
 * Submits the updated profile data to the server and disables edit mode.
 * 
 * @useEffect
 * Fetches the employer details from the server when the component mounts.
 * 
 * @dependencies
 * - React
 * - SweetAlert2
 * - BASE_URL (from configuration)
 * - FaUserCheck (from react-icons)
 * - Sidebar, Headertop (custom components)
 * - load (loading spinner image)
 */
import React, { useState, useEffect } from 'react';
import Sidebar from '../component/sidebar';
import Headertop from '../component/Headertop';
import { FaUserCheck } from "react-icons/fa";
import load from '../utils/image/bouncing-circles.svg';
import Swal from 'sweetalert2'
import { BASE_URL } from '../configration/Config';

function Profile() {
  const [profileData, setProfileData] = useState({
    employer_name: '',
    username: '',
    department: '',
    location: '',
    email: '',
    city: '',
    state: '',
    number_of_employees: '',
    country: '',
    zipcode: '',
    street_name: '',
    employer_id: '',
  });

  const [loading, setLoading] = useState(false);
  const employer_id = parseInt(sessionStorage.getItem("id"));
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // State to track edit mode

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/User/getemployerdetails/${employer_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const jsonData = await response.json();
        setData(jsonData.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
    // toast.success('Welcome to Dashboard!', {
    //   position: 'bottom-left',
    // });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = () => {
          Swal.fire({
            // toast: true, // This enables the toast mode
            // position: 'top-end', // You can position the toast (top, top-end, top-start, bottom, etc.)
            icon: 'success', // 'success', 'error', 'warning', 'info', 'question'
            title: 'Now you are able to update profile!!',
            showConfirmButton: false, // Hide the confirm button
            timer: 3000, // Auto close after 3 seconds
            timerProgressBar: true, // Show a progress bar
        });
    if (data.length > 0) {
      const item = data[0];
      setProfileData({
        employer_name: item.employer_name,
        username: item.username,
        department: item.department || 'NA',
        location: item.location || 'NA',
        email: item.email,
        city: item.city || 'NA',
        state: item.state || 'NA',
        number_of_employees: item.number_of_employees || '0',
        country: item.country || 'NA',
        zipcode: item.zipcode || 'NA',
        street_name: item.street_name || 'NA',
        employer_id: item.employer_id, // non-editable
      });
    }
    setIsEditing(true); // Enable editing mode
  };

  const handleCancel = () => {
    setIsEditing(false); // Disable editing mode without saving
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/User/employer_profile/${employer_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile data');
      }

      setIsEditing(false); // Disable editing mode after saving
      console.log('Profile updated successfully');
      Swal.fire({
        // toast: true, // This enables the toast mode
        // position: 'top-end', // You can position the toast (top, top-end, top-start, bottom, etc.)
        icon: 'success', // 'success', 'error', 'warning', 'info', 'question'
        title: 'Profile updated successfully',
        text: "Please check once !!",
        showConfirmButton: false, // Hide the confirm button
        timer: 3000, // Auto close after 3 seconds
        timerProgressBar: true, // Show a progress bar
    });
    setTimeout(function(){
     window.location.reload();
   }, 4000);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      
          <h1 className='edit-profile mt-6 inline-block'><FaUserCheck /> Profile</h1>

          <div className="isolate bg-white px-6 sm:py-2 lg:px-8">
            <div className="max-w-2xl"></div>
            {loading ? (
              <div className="text-sm w-full text-center m-0">
                <img className="mx-auto h-10 logo-inner w-auto custom_logo_side" src={load} alt="Loading" />
              </div>
              
            ) : (
              data.length > 0 && (
                data.map((item) => (
                  <>
                    <form action="#" method="POST" onSubmit={handleSubmit} className="mt-4 sm:mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                        {/* Employer Name */}
                        <div>
                          <label className="block text-sm font-semibold leading-6 text-black-900">Employer Name</label>
                          <div className="mt-2.5">
                            <input
                              name="employer_name"
                              type="text"
                              value={profileData.employer_name || item.employer_name}
                              disabled
                              className="block w-full text-sm rounded-md px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                        </div>
  
                        {/* Username */}
                        <div>
                          <label className="block text-sm font-semibold leading-6 text-black-900">Username</label>
                          <div className="mt-2.5">
                            <input
                              name="username"
                              type="text"
                              value={profileData.username || item.username}
                              disabled  
                              className="block w-full text-sm rounded-md px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                        </div>

                        {/* Department */}
                        <div>
                          <label className="block text-sm font-semibold leading-6 text-black-900">Department</label>
                          <div className="mt-2.5">
                            <input
                              name="department"
                              type="text"
                              value={isEditing ? profileData.department : item.department || 'NA'}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="block w-full text-sm rounded-md px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-sm font-semibold leading-6 text-black-900">Location</label>
                          <div className="mt-2.5">
                            <input
                              name="location"
                              type="text"
                              value={isEditing ? profileData.location : item.location || 'NA'}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="block w-full text-sm rounded-md px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-semibold leading-6 text-black-900">Email</label>
                          <div className="mt-2.5">
                            <input
                              name="email"
                              type="email"
                              value={profileData.email || item.email }
                              disabled
                              className="block w-full text-sm rounded-md px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                        </div>

                        {/* City */}
                        <div>
                          <label className="block text-sm font-semibold leading-6 text-black-900">City</label>
                          <div className="mt-2.5">
                            <input
                              name="city"
                              type="text"
                              value={isEditing ? profileData.city : item.city || 'NA'}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="block w-full text-sm rounded-md px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                        </div>

                        {/* State */}
                        <div>
                          <label className="block text-sm font-semibold leading-6 text-black-900">State</label>
                          <div className="mt-2.5">
                            <input
                              name="state"
                              type="text"
                              value={isEditing ? profileData.state : item.state || 'NA'}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="block w-full  text-sm rounded-md px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                        </div>

                        {/* Number of Employees */}
                        <div>
                          <label className="block text-sm font-semibold leading-6 text-black-900">Number of Employees</label>
                          <div className="mt-2.5">
                            <input
                              name="number_of_employees"
                              type="number"
                              value={isEditing ? profileData.number_of_employees : item.number_of_employees || '0'}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="block w-full text-sm rounded-md px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                        </div>

                        {/* Country */}
                        <div>
                          <label className="block text-sm font-semibold leading-6 text-black-900">Country</label>
                          <div className="mt-2.5">
                            <input
                              name="country"
                              type="text"
                              value={isEditing ? profileData.country : item.country || 'NA'}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="block w-full text-sm rounded-md px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                        </div>

                        {/* Zipcode */}
                        <div>
                          <label className="block text-sm font-semibold leading-6 text-black-900">Zipcode</label>
                          <div className="mt-2.5">
                            <input
                              name="zipcode"
                              type="text"
                              value={isEditing ? profileData.zipcode : item.zipcode || 'NA'}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="block w-full text-sm rounded-md px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                        </div>

                        {/* Street Name */}
                        <div>
                          <label className="block text-sm font-semibold leading-6 text-black-900">Street Name</label>
                          <div className="mt-2.5">
                            <input
                              name="street_name"
                              type="text"
                              value={isEditing ? profileData.street_name : item.street_name || 'NA'}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="block w-full text-sm rounded-md px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                        </div>

                        {/* Employer ID (non-editable) */}
                        <div>
                          <label className="block text-sm font-semibold leading-6 text-black-900">Employer ID</label>
                          <div className="mt-2.5">
                            <input
                              name="employer_id"
                              type="text"
                              value={profileData.employer_id || item.employer_id}
                              disabled
                              className="block w-full text-sm rounded-md px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify gap-x-6">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                            onClick={handleEdit}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </form>
                  </>
                ))
              )
            )}
          </div>
        </div>
    
  );
}

export default Profile;
