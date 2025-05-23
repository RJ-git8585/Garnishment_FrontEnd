
/**
 * Notfound Component
 *
 * This component renders a 404 - Page Not Found error message.
 * It provides a user-friendly interface to inform users that the requested page does not exist.
 * Includes a button to navigate back to the home page.
 *
 * @component
 * @returns {JSX.Element} The rendered Notfound component.
 *
 * @example
 * // Usage
 * import Notfound from './Notfound';
 * 
 * function App() {
 *   return (
 *     <Notfound />
 *   );
 * }
 */
import React from 'react'

function Notfound() {
  return (
    <div className="flex h-screen  dark:bg-slate-800 flex-1 flex-col justify-center px-6 py-12 px-16 sm:px-8 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 className="Logo_w">GarnishEdge</h2>
        <h2 className="mt-10 text-center dark:text-white text-2xl font-bold leading-9 tracking-tight text-gray-900">
          404 - Page Not Found
        </h2>
        <p className="mt-4 text-center dark:text-white text-sm text-gray-500">
          The page youre looking for doesnt exist.
        </p>
      </div>

      <div className="mt-10 text-center sm:mx-auto sm:w-full sm:max-w-sm">
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}


export default Notfound