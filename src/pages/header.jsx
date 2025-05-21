/**
 * Header component that renders a responsive navigation bar with a logo, menu items, 
 * and a mobile menu toggle. The navigation bar includes a dropdown for products, 
 * links to features, marketplace, and company, as well as a login button.
 *
 * @component
 * @returns {JSX.Element} The rendered header component.
 *
 * @example
 * <Header />
 *
 * @description
 * - Uses Tailwind CSS for styling.
 * - Includes a mobile menu that can be toggled open and closed.
 * - Displays a dropdown menu for products with icons and descriptions.
 * - Renders a logo image sourced from the `myImage` import.
 *
 * @dependencies
 * - React: For component structure and state management.
 * - @headlessui/react: For accessible UI components like Dialog, Disclosure, Popover, and Transition.
 * - @heroicons/react: For SVG icons used in the navigation bar.
 *
 * @state
 * - `mobileMenuOpen` (boolean): Tracks whether the mobile menu is open or closed.
 */
import React, { useState, Fragment } from "react";
import myImage from "../utils/image/White-logo-1 (1).png";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { PlayCircleIcon, PhoneIcon } from "@heroicons/react/20/solid";

const products = [
  { name: "Analytics", description: "Get a better understanding of your traffic", href: "#" },
  { name: "Engagement", description: "Speak directly to your customers", href: "#" },
  { name: "Security", description: "Your customers’ data will be safe and secure", href: "#" },
  { name: "Integrations", description: "Connect with third-party tools", href: "#" },
  { name: "Automations", description: "Build strategic funnels that will convert", href: "#" },
];

const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

const classNames = (...classes) => classes.filter(Boolean).join(" ");

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderMenuItems = (items) =>
    items.map(({ name, description, href, icon: Icon }) => (
      <div key={name} className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
        {Icon && (
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
            <Icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
          </div>
        )}
        <div className="flex-auto">
          <a href={href} className="block font-semibold text-gray-900">{name}</a>
          {description && <p className="mt-1 text-gray-600">{description}</p>}
        </div>
      </div>
    ));

  return (
    <header className="aix">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <img className="mx-auto h-10 w-auto" src={myImage} alt="Your Company" />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
              Product
              <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">{renderMenuItems(products)}</div>
                <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                  {callsToAction.map(({ name, href, icon: Icon }) => (
                    <a key={name} href={href} className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100">
                      <Icon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                      {name}
                    </a>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
          {["Features", "Marketplace", "Company"].map((item) => (
            <a key={item} href="#" className="text-sm font-semibold leading-6 text-gray-900">{item}</a>
          ))}
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Log in &rarr;</a>
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <img className="h-8 w-auto" src={myImage} alt="Your Company" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        Product
                        <ChevronDownIcon className={classNames(open ? "rotate-180" : "", "h-5 w-5 flex-none")} aria-hidden="true" />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {[...products, ...callsToAction].map(({ name, href }) => (
                          <Disclosure.Button key={name} as="a" href={href} className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                            {name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {["Features", "Marketplace", "Company"].map((item) => (
                  <a key={item} href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">{item}</a>
                ))}
              </div>
              <div className="py-6">
                <a href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Log in</a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Header;