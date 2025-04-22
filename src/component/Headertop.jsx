/**
 * Headertop Component
 * 
 * This component renders a responsive navigation bar with a theme toggle switch, 
 * user profile menu, and navigation links. It uses Tailwind CSS for styling and 
 * Headless UI for accessibility features.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered navigation bar component.
 * 
 * @example
 * <Headertop />
 * 
 * @description
 * - The navigation bar includes links to Dashboard, Calculator, Employee, and Logout.
 * - A theme toggle switch allows users to switch between light and dark modes.
 * - The user profile menu provides options for viewing the profile, adding a location, 
 *   and adding a department.
 * - The component is responsive and adapts to different screen sizes.
 * 
 * @dependencies
 * - React: For building the component.
 * - Headless UI: For accessible UI components.
 * - Tailwind CSS: For styling.
 * - Heroicons: For icons used in the navigation bar.
 * - React Icons: For additional icons used in the theme toggle switch.
 * 
 * @state
 * - `isLightMode` (boolean): Tracks the current theme mode (light or dark).
 * 
 * @functions
 * - `toggleTheme`: Toggles the theme mode and updates the `isLightMode` state.
 * 
 * @variables
 * - `namedata` (string): User's name retrieved from session storage.
 * - `emaildata` (string): User's email retrieved from session storage.
 * - `user` (object): Contains the user's name and email.
 * - `navigation` (array): List of navigation links with their names, hrefs, and current status.
 * - `userNavigation` (array): List of user menu options with their names and hrefs.
 * - `classNames` (function): Utility function to conditionally join class names.
 */
import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import myImage from '/girl.png';
import { LuSunMedium, LuSunMoon } from "react-icons/lu";

const namedata = sessionStorage.getItem('name');
const emaildata = sessionStorage.getItem('email');
const user = {
  name: namedata,
  email: emaildata,
};

const navigation = [
  { name: 'Dashboard', href: '/dashboard', current: true },
  { name: 'Calculator', href: '/garnishment', current: false },
  { name: 'Employee', href: '/employee', current: false },
  { name: 'Logout', href: '/logout', current: false },
];
const userNavigation = [
  { name: 'Your Profile', href: '/profile' },
  { name: 'Add Location', href: '/addlocation' },
  { name: 'Add Department', href: '/adddepartment' },
];

function classNames(...classNamees) {
  return classNamees.filter(Boolean).join(' ');
}

function Headertop() {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsLightMode(savedTheme === 'light');
      document.body.classList.toggle('light-mode', savedTheme === 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    document.body.classList.toggle('light-mode', newMode);
    localStorage.setItem('theme', newMode ? 'light' : 'dark');
    sessionStorage.setItem('theme', newMode ? 'light' : 'dark');
  };

  return (
    <>
      <Disclosure as="nav" className="border-b-[3px] bg-white-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 py-2 sm:px-6 lg:px-6">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0"></div>
                  <div className="hidden md:block menu-mobile">
                    <div className="ml-2 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-gray-900 text-white'
                              : 'text-black-300 hover:bg-black-700 hover:text-black',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Theme Toggle Switch */}
                    <label className="flex mr-6 items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isLightMode}
                          onChange={toggleTheme}
                          className="sr-only"
                        />
                        <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                            isLightMode ? 'transform translate-x-4' : ''
                          }`}
                        ></div>
                      </div>
                      <span className="ml-2 text-lg font-medium text-gray-900">
                        {isLightMode ? <LuSunMedium /> : <LuSunMoon />}
                      </span>
                    </label>
                    <button
                      type="button"
                      className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img className="h-8 w-8 rounded-full" src={myImage} alt="" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-7 w-7 rounded-full" src={myImage} alt="" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium leading-none text-gray-400">{user.name}</div>
                    <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                  </div>
                  <button
                    type="button"
                    className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}

export default Headertop;