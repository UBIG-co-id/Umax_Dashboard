import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Fragment, useState ,useEffect, useContext } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { MdDashboard } from 'react-icons/md';
import { BiSolidMegaphone, BiGroup, BiBell, BiLogOut } from 'react-icons/bi';
import { AiOutlineUser } from 'react-icons/ai';
import { CiSettings, CiGlobe } from 'react-icons/ci';
import { logo, defaultProfile } from '../assets';
import { FiSun, FiMoon } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import '../styles.css';
import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Context } from '../context'
import Axios from 'axios';
import Translation from "../translation/Translation.json"
import { useLanguage } from '../LanguageContext';
import { us, indonesia } from '../assets';
// import LazyLoad from 'react-lazyload';

import {
  Drawer,

} from "@material-tailwind/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}


  
  
const navigation = [
  { name: 'Dashboard', href: '/Dashboard' },
  { name: 'Campaigns', href: '/Campaigns' },
  { name: 'Accounts', href: '/Accounts' },
  { name: 'Clients', href: '/Clients' },
];

const Navbar = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleLanguage = (language) => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

   //draweer
  const [openRight, setOpenRight] = React.useState(false);


  useEffect(() => {
    if (openRight) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    // Membersihkan efek
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [openRight]);

  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = () => setOpenRight(false);
const theme = {
  drawer: {
    defaultProps: {
      size: 300,
      overlay: true,
      placement: "left",
      overlayProps: undefined,
      className: "",
      dismiss: undefined,
      onClose: undefined,
      transition: {
        type: "tween",
        duration: 0.3,
      },
    },
    styles: {
      base: {
        drawer: {
          position: "fixed",
          zIndex: "z-[9999]",
          pointerEvents: "pointer-events-auto",
          backgroundColor: "bg-white",
          boxSizing: "box-border",
          width: "w-full",
          boxShadow: "shadow-2xl shadow-blue-gray-900/10",
        },
        overlay: {
          position: "absolute",
          inset: "inset-0",
          width: "w-full",
          height: "h-full",
          pointerEvents: "pointer-events-auto",
          zIndex: "z-[9995]",
          backgroundColor: "bg-black",
          backgroundOpacity: "bg-opacity-60",
          backdropBlur: "none",
        },
      },
    },
  },
};

  const translations = Translation[selectedLanguage];
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem('jwtToken');

    navigate('/login');
  };

  const profilePage = () => {
    navigate('/Profile');
  }
  let { state, dispatch } = useContext(Context)
  let toggle = () => {
    dispatch({ type: 'SET_TOGGLE_NAVBAR', payload: !state.toggleNavbar })
  }



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
  const notificationCount = 2; // Jumlah badge notifikasi

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // ambil data gambar dan nama

  function PlaceholderProfileImage() {
    return (
      <div className='rounded-full border-black/10 bg-black/10 p-1'>
        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
      </div>
    );
  }


  const [profileData, setProfileData] = useState({
    name: "‎",
    image: defaultProfile,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const apiUrl = 'https://umax-1-z7228928.deta.app/profiluser/65227163017382b905f8b1dd';

        const response = await Axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log(response.data)

        setProfileData({
          name: response.data.name,
          image: response.data.image,
        });
      } catch (error) {
        if (error.response) {
          console.error('Server error:', error.response.data);
        } else if (error.request) {
          console.error('No response from the server:', error.request);
        } else {
          console.error('Error:', error.message);
        }
      }
    };

    fetchData();
  }, []);

 
  return (
    <Disclosure as="nav" className="bg-white shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">

                {/* Mobile menu button */}

                <div className="sm:hidden text-center">
                  <img src={logo} alt="logo" className='w-20 cursor-pointer' onClick={toggle} />
                </div>
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-600">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden sm:flex sm:items-center sm:justify-center">
                <img
                  className="h-8 w-auto cursor-pointer "
                  src={logo}
                  alt="logo"
                  onClick={toggle}
                />
              </div>
              <div className="hidden sm:ml-6 sm:block ">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        activePage === item.href
                          ? 'bg-cyan-100 text-blue-600'
                          : 'text-gray-500 ',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}
                      onClick={() => setActivePage(item.href)}
                    >
                      {/* <span className="relative top-1 mr-4 inline-block max-lg:hidden ">
                      
                            {item.name === 'Dashboard' && <MdDashboard className="h-5 w-5" />}
                            {item.name === 'Campaigns' && <BiSolidMegaphone className="h-5 w-5" />}
                            {item.name === 'Accounts' && <AiOutlineUser className="h-5 w-5" />}
                            {item.name === 'Clients' && <BiGroup className="h-5 w-5" />}
                          
                       
                      </span>
                      {item.name} */}
                      <span className="relative top-1 mr-4 inline-block max-lg:hidden ">
                        {translations[item.name] && (
                          <>
                            {item.name === 'Dashboard' && <MdDashboard className="h-5 w-5" />}
                            {item.name === 'Campaigns' && <BiSolidMegaphone className="h-5 w-5" />}
                            {item.name === 'Accounts' && <AiOutlineUser className="h-5 w-5" />}
                            {item.name === 'Clients' && <BiGroup className="h-5 w-5" />}
                          </>
                        )}
                      </span>
                      {translations[item.name] || item.name}
                    </Link>
                  ))}
                </div>
              </div>

              

              {/* <select onChange={toggleLanguage}>
                  <option value="english">
                    <img src={uk} alt="uk" className="w-4 h-4 mr-2" /> English
                  </option>
                  <option value="indonesia">
                    <img src={indonesia} alt="Indonesia" className="w-4 h-4 mr-2" /> Indonesia
                  </option>
                </select> */}

              <div className="absolute  inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">


               

                {/* tombol notif */}
                <button
                  type="button"
                  className="relative right-24 text-gray-500 hover:text-gray-800"
                  onClick={toggleNotifications}
                >
                  {notificationCount > 0 && (
                    <span className="absolute  -top-1 -right-1 -mt-1 p-[10px] -mr-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                  <span className="sr-only">View notifications</span>
                  <BiBell className="h-6 w-6" aria-hidden="true" />
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
                <Menu as="div" className="relative ml-3 right-20">
                  <div>
                    <Menu.Button className="relative flex rounded-full  text-sm">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>

                     {/* <LazyLoad height={200} offset={100}> */}
                <div className='rounded-full flex  border-black/10 bg-black/10 p-1'>
                  {profileData.image ? (
                    <img
                      className="h-8  w-8 object-cover rounded-full"
                      src={`data:image/jpeg;base64,${profileData.image}`}
                      alt="profile"
                    />

                  ) : (
                    <img
                      className="h-8 w-8 object-cover rounded-full"
                      src={defaultProfile} 
                      alt="profile"
                    />
                  )}

                    <span className='absolute left-12 bottom-[3px] leading-5 flex-col font-medium flex items-start text-gray-800'>
                    {profileData.name} 
                    <a className='font-normal text-xs text-gray-700'>Admin</a>
                    </span>
                </div>

              {/* </LazyLoad> */}



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
                    <Menu.Items className="absolute -left-16 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        <a
                          className={classNames('bg-slate-500 rounded-t-md block px-4 -mt-1 py-2 text-sm text-white')}
                        >
                          Hallo, {profileData.name}
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={profilePage}
                            className={classNames(active ? 'bg-gray-100' : '', 'flex items-center px-4 py-2 text-sm text-gray-700  ')}
                          >
                            < AiOutlineUser className="mr-2" /> Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={openDrawerRight}
                            className={classNames(active ? 'bg-gray-100' : '', 'flex items-center w-full px-4 py-2 text-sm text-gray-700')}
                          >
                            <CiSettings className="mr-2" />Settings
                          </button>
                        )}
                        
                      </Menu.Item>
      
                    

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={classNames(active ? 'bg-gray-100' : '', 'flex items-center w-full px-4 py-2 text-sm text-gray-700')}
                          >
                            <BiLogOut className="mr-2" /> Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>

                  
                </Menu>




              </div>
            </div>
          </div>

                          
                <Drawer
                placement="right"
                open={openRight}
                onClose={closeDrawerRight}
                className="pl-4 pt-3"
                overlay={true}
                >
                <button 
                onClick={closeDrawerRight}
                className='flex items-center text-lg gap-2'>
                <RxCross2 className='text-gray-400  hover:text-gray-600'/>
                <h1 className='font-medium text-gray-700'>Settings</h1>
                </button>
                <hr className='relative -ml-4 top-2 mx-0'/>


                 {/* tombol mode gelap */}
                   <div className='flex justify-between mx-5 pt-10'>
                 <h1 className='text-gray-700 relative right-3 font-medium'>Theme:</h1>
                 <label htmlFor="darkModeToggle" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="darkModeToggle"
                      className="sr-only"
                      onChange={toggleDarkMode}
                      checked={darkMode}
                    />
                    <div className={`w-14 h-7 bg-white rounded-full p-1 flex items-center bordernya transition-transform ease-in-out duration-300`}>
                      <div
                        className={`dot w-5 h-5 bg-cyan-100 rounded-full shadow transition-transform ease-in-out duration-300`}
                        style={{
                          transform: darkMode ? 'translateX(100%)' : 'translateX(0)',
                          opacity: darkMode ? '1' : '1',
                        }}
                      >
                        {darkMode ? (
                          <FiMoon className="h-5 w-5 text-sky-600 absolute left-0" />
                        ) : (
                          <FiSun className="h-5 w-5 text-sky-600 absolute right-0" />
                        )}
                      </div>
                    </div>
                  </div>
                </label>
                    </div>

                {/* ganti bahasa */}
              
                <div className="flex mx-5 mt-14 gap-10 justify-around">
      <h1 className="text-gray-700 relative right-4 font-medium">Language:</h1>
      <div className="relative left-1">
        <div className="relative inline-block text-left">
          <button
            onClick={toggleDropdown}
            className="btn dropdown-toggle flex items-center"
          >
            <img
              src={selectedLanguage === 'english' ? us : indonesia}
              className="w-6 h-6 mr-2"
              alt={selectedLanguage === 'english' ? 'English Flag' : 'Indonesia Flag'}
            />
            <span className="mr-2">
              {selectedLanguage === 'english' ? 'English' : 'Indonesia'}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? 'transform -rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-menu right-2 absolute mt-3  py-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg">
              <li>
                <button
                  onClick={() => toggleLanguage('english')}
                  className="w-full text-left py-2 px-4 hover:bg-gray-100 pt-1 flex items-center"
                >
                  <img src={us} className="w-6 h-6 relative right-2" alt="English Flag" />
                  <span className='text-sm font-normal text-gray-900'>English</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => toggleLanguage('indonesia')}
                  className="w-full text-left  py-2 px-4 hover:bg-gray-100 flex items-center"
                >
                  <img src={indonesia} className="w-6 h-6 relative right-2" alt="Indonesia Flag" />
                  <span className='text-sm font-normal text-gray-900'>Indonesia</span>
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>



                </Drawer>
                      
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
  );
}
export default Navbar;