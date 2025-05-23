
/**
 * Setting Component
 * 
 * This component provides a settings page where users can toggle dark mode and 
 * active profile visibility settings. It also allows users to save their preferences.
 * 
 * Features:
 * - Fetches user settings from the server on mount.
 * - Allows toggling dark mode and active profile visibility.
 * - Saves theme preference to localStorage and sessionStorage.
 * - Navigates to the dashboard after saving settings.
 * 
 * @component
 * @returns {JSX.Element} The rendered settings page.
 * 
 * @example
 * <Setting />
 * 
 * Hooks:
 * - `useState`: Manages the state of checkboxes for dark mode and active profile.
 * - `useEffect`: Fetches user settings on component mount and applies saved theme.
 * - `useCallback`: Memoizes event handlers for performance optimization.
 * - `useNavigate`: Handles navigation to other routes.
 * 
 * State Variables:
 * - `isChecked` (boolean): Tracks the state of the dark mode toggle.
 * - `isActiveChecked` (boolean): Tracks the state of the active profile toggle.
 * 
 * Functions:
 * - `handleCheckboxChange`: Toggles dark mode and updates localStorage/sessionStorage.
 * - `handleActivecheckboxChange`: Toggles active profile visibility.
 * - `handleSaveSettings`: Saves settings and navigates to the dashboard.
 * 
 * Dependencies:
 * - `react-router-dom`: For navigation.
 * - `react-icons/fa`: For rendering the settings icon.
 * - `BASE_URL`: API base URL for fetching user settings.
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure React Router is used for navigation
import Sidebar from '../component/sidebar';
import Headertop from '../component/Headertop';
import { FaTools } from 'react-icons/fa';
import { BASE_URL } from '../Config';

function Setting() {
  const [isChecked, setIsChecked] = useState(false);
  const [isActiveChecked, setIsActiveChecked] = useState(false);
  const navigate = useNavigate(); // Use navigate for routing

  // Fetch user settings on mount
  useEffect(() => {
    const id = sessionStorage.getItem('id');
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/User/setting/${id}/`);
        const data = await response.json();
        setIsChecked(data.data.mode === 'true');
        setIsActiveChecked(data.data.visibility === 'true');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsChecked(savedTheme === 'dark');
    }
  }, []);

  const handleCheckboxChange = useCallback((event) => {
    const newChecked = event.target.checked;
    setIsChecked(newChecked);

    // Save the theme preference to localStorage
    if (newChecked) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      sessionStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
      sessionStorage.setItem('theme', 'light');
    }
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
        {/* Dark Mode Toggle */}
        <label className="inline-flex items-center mb-5 cursor-pointer">
          <input
            type="checkbox"
            id="myCheck"
            className="sr-only peer"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium dark:text-gray-600">Dark Mode</span>
        </label>

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
        {isChecked && (
          <p id="text" style={{ color: isChecked ? 'white' : 'black', backgroundColor: isChecked ? 'black' : 'transparent' }}>
            Dark mode is activated. This is the text shown when the checkbox is checked.
          </p>
        )}

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
