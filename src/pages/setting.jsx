import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure React Router is used for navigation
import Sidebar from '../component/sidebar';
import Headertop from '../component/Headertop';
import { FaTools } from 'react-icons/fa';
import { BASE_URL } from '../Config';

function Setting() {
  const [isActiveChecked, setIsActiveChecked] = useState(false);
  const navigate = useNavigate(); // Use navigate for routing

  // Fetch user settings on mount
  useEffect(() => {
    const id = sessionStorage.getItem('id');
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/User/setting/${id}/`);
        const data = await response.json();
        setIsActiveChecked(data.data.visibility === 'true');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleActivecheckboxChange = useCallback((event) => {
    setIsActiveChecked(event.target.checked);
  }, []);

  const handleSaveSettings = useCallback(() => {
    // Save settings logic here
    console.log('Settings saved');
    navigate('/dashboard'); // Example navigation after saving
  }, [navigate]);

  return (
    <>
      <h1 className="edit-profile mt-6 inline-block">
        <FaTools />
        Settings
      </h1>
      <form className="grid grid-cols-2 gap-4 rounded-md space-y-6 p-6" action="#" method="POST">
        {/* Active Profile Toggle */}
        <label className="inline-flex items-center mb-5 cursor-pointer">
          <input
            type="checkbox"
            id="ActiveProfile"
            className="sr-only peer"
            checked={isActiveChecked}
            onChange={handleActivecheckboxChange}
          />
          <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium dark:text-gray-600">Active Profile for Others</span>
        </label>

        {/* Conditional Text */}
        {isActiveChecked && (
          <p id="text">Active Profile checkbox is clicked for new setting to be saved.</p>
        )}
      </form>

      <button
        onClick={handleSaveSettings}
        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Save Settings
      </button>
    </>
  );
}

export default Setting;
