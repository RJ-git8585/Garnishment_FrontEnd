import  { useState, useEffect } from 'react';
import Sidebar from '../component/sidebar';
import Headertop from '../component/Headertop';
import { FaTools } from 'react-icons/fa';
import { BASE_URL } from '../Config';

function Setting() {
  const [isChecked, setIsChecked] = useState(false);
  const [isActiveChecked, setIsActiveChecked] = useState(false);

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

  const handleCheckboxChange = (event) => {
    const newChecked = event.target.checked;
    setIsChecked(newChecked);
    
    // Save the theme preference to localStorage
    if (newChecked) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleActivecheckboxChange = (event) => {
    setIsActiveChecked(event.target.checked);
  };

  return (
    <div className="min-h-full">
      <div className={isChecked ? 'dark-mode container main' : 'light-mode container main'}>
        <div className="sidebar hidden lg:block">
          <Sidebar />
        </div>
        <div className="content ml-auto">
          <Headertop />
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
            href="#"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default Setting;
