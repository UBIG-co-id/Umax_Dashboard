import { Fragment, useState} from 'react'; 
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { MdDashboard } from "react-icons/md";
import { BiSolidMegaphone, BiGroup, BiBell, BiLogOut} from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { CiSettings } from "react-icons/ci";
import {logo, profile} from "../assets"
import { FiSun, FiMoon } from "react-icons/fi";
import '../styles.css';
import React, {useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const navigation = [
  { name: 'Dashboard', href: '/Dashboard' },
  { name: 'Campaigns', href: '/Campaigns' },
  { name: 'Accounts', href: '/Accounts' },
  { name: 'Clients', href: '/Clients' },
];

export default function Navbar() {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    };

    const location = useLocation();
    const [activePage, setActivePage] = useState(location.pathname);

    useEffect(() => {
      setActivePage(location.pathname);
    }, [location]);


  const [showNotifications, setShowNotifications] = useState(false);
  const notificationCount = 2; //jumlah badge notif

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">

                {/* Mobile menu button */}

                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-600">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
                <div className="sm:hidden text-center">
                    <img src={logo} alt="logo" className='w-20' />
            </div>
              </div>
                <div className="hidden sm:flex sm:items-center sm:justify-center">
                  <img
                    className="h-8 w-auto "
                    src={logo}
                    alt="logo"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block ">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          activePage === item.href
                          ? 'bg-cyan-100 text-blue-600'
                          : 'text-gray-500 ',
                        'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        onClick={() => setActivePage(item.href)}
                      >
                    <span className="relative top-1 mr-4 inline-block max-lg:hidden ">
                      {item.name === 'Dashboard' && <MdDashboard className="h-5 w-5" />}
                      {item.name === 'Campaigns' && <BiSolidMegaphone className="h-5 w-5" />}
                      {item.name === 'Accounts' && <AiOutlineUser className="h-5 w-5" />}
                      {item.name === 'Clients' && <BiGroup className="h-5 w-5" />}
                    </span>
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>

            


              <div className="absolute  inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                 
                 {/* tombol mode gelap */}
                  <label htmlFor="darkModeToggle" className="relative right-7 flex items-center cursor-pointer">
                  <div className="relative">
                  <input
                  type="checkbox"
                  id="darkModeToggle"
                  className="sr-only"
                  onChange={toggleDarkMode}
                  checked={darkMode}
                  />
                  <div
                  className={`w-14 h-7 bg-white rounded-full p-1 flex items-center bordernya transition-transform ${
                  darkMode ? 'justify-end' : 'justify-start'
                  } ease-in-out duration-300`}
                  >
                  <div
                  className={`dot w-5 h-5 bg-cyan-100 rounded-full shadow transition-transform ${
                  darkMode ? 'translate-x-full' : ''
                  }`}
                  >
                  {darkMode ? <FiMoon className="h-5 w-5 text-sky-600" /> : <FiSun className="h-5 w-5 text-sky-600" />}
                  </div>
                  </div>
                  </div>
                  </label>



                          {/* tombol notif */}
                  <button
            type="button"
            className="relative right-3 text-gray-500 hover:text-gray-800"
            onClick={toggleNotifications}
            >
            {notificationCount > 0 && (
              <span className="absolute  -top-1 -right-1 -mt-1 -mr-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
            <span className="sr-only">View notifications</span>
            <BiBell className="h-6 w-6"  aria-hidden="true" />
            </button>

            {showNotifications && (
                <Transition
                show={showNotifications}
                enter="transition ease-out duration-200 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-100 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                >
                  <Menu as="div" className="absolute z-10 -ml-48 mt-8 w-48 rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-transform">
                    {/* Notifikasi Dropdown */}
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            'relative bottom-2 rounded-t-md block px-4 py-2 text-sm bg-red-500 text-white'
                          )}
                        >
                          Notification
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Notification 1
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Notification 2
                        </a>
                      )}
                    </Menu.Item>
                  </Menu>
                </Transition>
              )}

                            {/* profile */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full  text-sm">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={profile}
                        alt="profile"
                      />
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
                      <Menu.Item>
                          <a
                            href="#"
                            className={classNames('bg-slate-500 rounded-t-md block px-4 py-2 text-sm text-white')}
                          >
                            Hello, Rizky
                          </a>
                      </Menu.Item>  
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'flex items-center px-4 py-2 text-sm text-gray-700  ')}
                          >
                           < AiOutlineUser className="mr-2"/> Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'flex items-center px-4 py-2 text-sm text-gray-700')}
                          >
                            <CiSettings className="mr-2"/>Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'flex items-center px-4 py-2 text-sm text-gray-700')}
                          >
                            <BiLogOut className="mr-2"/>Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
                          
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-cyan-50 text-blue-700' : 'text-gray-500 hover:bg-cyan-50 hover:text-blue-700',
                    '  flex-1  rounded-md px-3 py-2 text-sm font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
  

            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

