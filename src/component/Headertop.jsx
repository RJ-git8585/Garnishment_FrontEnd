/**
 * Headertop Component
 *
 * This component renders a responsive navigation bar with user profile and menu options.
 * It uses the `Disclosure` component from `@headlessui/react` for handling the mobile menu toggle.
 *
 * @component
 * @returns {JSX.Element} The rendered HeaderTop component.
 *
 * @dependencies
 * - React: For building the component.
 * - @headlessui/react: For the `Disclosure`, `Menu`, and `Transition` components.
 * - @heroicons/react: For the `Bars3Icon`, `BellIcon`, and `XMarkIcon` icons.
 *
 * @example
 * <Headertop />
 *
 * @notes
 * - The `navigation` array defines the main navigation links.
 * - The `userNavigation` array defines the user-specific menu options.
 * - The `classNames` function is used to conditionally apply CSS classes.
 * - User data (`name` and `email`) is retrieved from `sessionStorage`.
 * - The component supports both desktop and mobile views.
 */
import React from 'react'
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import myImage from '../utils/image/girl.png' 

const namedata = sessionStorage.getItem('name');
const emaildata = sessionStorage.getItem('email');
const user = {
    name: namedata,
    email: emaildata,
  }
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: true },
    { name: 'Calculator', href: '/garnishment', current: false },
    { name: 'Employee', href: '/employee', current: false },
    // { name: 'IWO', href: '/iwo', current: false },
    // { name: 'Results', href: '/results', current: false },
    // { name: 'Settings', href: '/setting', current: false },
    { name: 'Logout', href: '/logout', current: false },
  ]
  const userNavigation = [
    { name: 'Your Profile', href: '/profile' },
   
    { name: 'Add Location', href: '/addlocation' },
    { name: 'Add Department', href: '/adddepartment' },
    // { name: 'Settings', href: '/setting' },

  ]
  
  function classNames(...classNamees) {
    return classNamees.filter(Boolean).join(' ')
  }
  
  

function Headertop() {


    return (
       <>
       <Disclosure as="nav" className="border-b-[2px] bg-white-800">
       {({ open }) => (
         <>
           <div className="mx-auto max-w-7xl   sm:px-6 lg:px-6">
             <div className="flex h-12 items-center  justify-between">
               <div className="flex items-center ">
                 <div className="flex-shrink-0">
           </div>
           <div className="hidden md:block menu-mobile">
             <div className="ml-2 flex  items-baseline space-x-4">
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
          
             <button
               type="button"
               className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
             >
               <span className="absolute -inset-1.5" />
               <span className="sr-only">View notifications</span>
               <BellIcon className="h-6 w-6" aria-hidden="true" />
             </button>
             
             {/* Profile dropdown */}
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
                 <Menu.Items className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
           {/* Mobile menu button */}
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
               item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
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
           <span className="ml-3 text-sm text-gray-400">v{import.meta.env.VITE_APP_VERSION || '0.2.0'}</span>
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
    )
}

export default Headertop