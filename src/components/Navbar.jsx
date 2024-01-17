import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useContext } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { MdDashboard, MdOutlineCampaign } from "react-icons/md";
import { BiSolidMegaphone, BiGroup, BiBell, BiLogOut } from "react-icons/bi";
import { AiOutlineUser, AiOutlineSearch } from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import { FaRegBuilding } from "react-icons/fa";
import { LuUserPlus } from "react-icons/lu";

import { logo, defaultProfile } from "../assets";
import { FiSun, FiMoon } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import "../styles.css";
import React from "react";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import { Context } from "../context";
import axios from "axios";
import Translation from "../translation/Translation.json";
import { useLanguage } from "../LanguageContext";
import { us, indonesia } from "../assets";
import jwt_decode from "jwt-decode";
import { BiChevronDown, BiCheck } from "react-icons/bi";
import { CiGlobe } from "react-icons/ci";
import Select from "react-select";


// import LazyLoad from 'react-lazyload';

import { Drawer } from "@material-tailwind/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Dashboard", href: "/Dashboard" },
  { name: "Campaigns", href: "/Campaigns" },
  { name: "Accounts", href: "/Accounts" },
  { name: "Clients", href: "/Clients" },
];

const Navbar = () => {
  const [data, setData] = useState([])
  const [tenantData, setTenantData] = useState([]);

  // const [selectedLanguage, setSelectedLanguage] = useState("english");
  const { selectedLanguage, toggleLanguage } = useLanguage();

  // open dropdown profile fungtion

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const [isTenantDropdownOpen, setTenantDropdownOpen] = useState(false);

  const toggleTenantDropdown = () => {
    setTenantDropdownOpen(!isTenantDropdownOpen);
  };
  const { _id } = useParams();
  const [values, setValues] = useState({
    _id: _id,
    name: '',
    id_client: '',
    platform: '',
    email: '',
    password: '',
    notes: '',
    status: '',
  })


  // bagian open draw
  const [openSettingsDrawer, setOpenSettingsDrawer] = useState(false);


  const handleToggleLanguage = (language) => {
    toggleLanguage(language);
  };



  //draweer
  const [openRight, setOpenRight] = React.useState(false);

  useEffect(() => {
    if (openRight) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Membersihkan efek
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [openRight]);

  const closeDrawerRight = () => {
    setOpenSettingsDrawer(false);
  };
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

    localStorage.removeItem("jwtToken");

    navigate("/login");
  };

  const profilePage = () => {
    navigate("/Profile");
  };

  const TenantPage = () => {
    navigate("/Tenant");
  };

  const Users = () => {
    navigate("/UsersTable");
  };



  let { state, dispatch } = useContext(Context);
  let toggle = () => {
    dispatch({ type: "SET_TOGGLE_NAVBAR", payload: !state.toggleNavbar });
  };

  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === "true");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === "true");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

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

  // const handleTenantSelect = (selectedTenantId) => {
  //   // Lakukan sesuatu ketika tenant dipilih, misalnya menyimpan tenant ID ke state
  //   console.log('Selected Tenant ID:', selectedTenantId);
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const apiUrl = `https://umaxxnew-1-d6861606.deta.app/tenant-get-all`;

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'accept': 'application/json',
          },
        });

        setTenantData(response.data.Data);
        console.log('Response Tenant:', response.data);
      } catch (error) {
        console.error('Error saat mengambil data:', error.message);
      }
    };

    fetchData();
  }, []);



  // ambil data user
  const [profileData, setProfileData] = useState({
    name: '',
    image: '',
    roles: '',
    email: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const decodedToken = jwt_decode(token);

        const apiUrl = 'https://umaxxnew-1-d6861606.deta.app/user-by-id';

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        localStorage.setItem('tenant_id', response.data.Data[0].tenant_id)

        console.log('API Response:', response);

        const selectedProfile = response.data.Data[0];

        console.log('Image URL:', selectedProfile.image);
        console.log('respon role:', selectedProfile.roles);

        const base64Image = selectedProfile.image;
        setProfileData({
          name: selectedProfile.name,
          image: base64Image,
          roles: selectedProfile.roles,
          email: selectedProfile.email,
        });
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);


  // select 2
  const [DataV2, DataSelect2] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState("");
  const [buka, setBuka] = useState(false);
  const [resultsFound, setResultsFound] = useState(true);

  const dumySementara = [
    { name: "ID" },
    { name: "ENG" },
  ];

  const DumyData = true;
  useEffect(() => {
    if (DumyData) {
      DataSelect2(dumySementara);
    }
  }, [DumyData]);

  useEffect(() => {
    const isResultFound =
      DataV2 &&
      DataV2.some((country) =>
        country.name.toLowerCase().startsWith(inputValue)
      );
    setResultsFound(isResultFound);
  }, [DataV2, inputValue]);

  // bagian active dropdown
  const [isActive, setIsActive] = useState(false);
  const activeLink = () => {
    setIsActive(!isActive);
  };

  const option = tenantData.map(item => ({
    value: item._id,
    label: item.company,
  }));

  const handleTenantSelect = (selectedTenantId) => {
    // Lakukan sesuatu ketika tenant dipilih, misalnya menyimpan tenant ID ke state
    console.log('Selected Tenant ID:', selectedTenantId);

    // Construct the dynamic URL based on the selected tenant
    const dynamicUrl = `https://umaxxnew-1-d6861606.deta.app/campaign-by-tenant?tenantId=${selectedTenantId}`;

    // Now, you can use the dynamicUrl as needed in your application
    console.log('Dynamic URL:', dynamicUrl);

    // Perform any other actions based on the selected tenant
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-md ">
      {({ open }) => (
        <>
          <div className={"mx-auto max-w-full py-2 px-2 sm:px-6 lg:px-8 "}>
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">

                {/* Mobile menu button */}
                <div className="sm:hidden text-center">
                  <img
                    src={logo}
                    alt="logo"
                    className="w-20 object-cover cursor-pointer"
                    onClick={toggle}
                  />
                </div>
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-600">
                  <span className="absolute -inset-0.5" />
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden sm:flex sm:items-center sm:justify-center">
                <img
                  className="h-8 w-auto object-contain cursor-pointer "
                  src={logo}
                  alt="logo"
                  onClick={toggle}
                />
              </div>
              <div className="hidden sm:-ml-10 sm:block ">
                <div className="flex space-x-4">
                  {navigation.map((item) => {
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          activePage === item.href
                            ? "bg-cyan-100 text-blue-60 "
                            : "text-gray-500 ",
                          "rounded-md lg:px-2  py-2 text-sm font-medium"
                        )}
                        onClick={() => setActivePage(item.href)}
                      >

                        <span className="relative top-1 lg:mr-4 md:mr-1 inline-block max-md:hidden">
                          {translations[item.name] && (
                            <>
                              {item.name === "Dashboard" && (
                                <MdDashboard className="h-5 w-5" />
                              )}
                              {item.name === "Campaigns" && (
                                <BiSolidMegaphone className="h-5 w-5" />
                              )}
                              {item.name === "Accounts" && (
                                <AiOutlineUser className="h-5 w-5" />
                              )}
                              {item.name === "Clients" && (
                                <BiGroup className="h-5 w-5" />
                              )}

                            </>
                          )}
                        </span>
                        {translations[item.name]}
                      </Link>
                    );
                  })}
                </div>
              </div>

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
                    <Menu
                      as="div"
                      className={`absolute z-50 bg-white -ml-48 mt-8 w-48 rounded-md py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-transform `}
                    >
                      {/* Notifikasi Dropdown */}
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className="relative bottom-2 rounded-t-md block px-4 py-2 text-sm bg-red-500 text-white"
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
                              active ? "bg-gray-50/5 text-gray-700" : "",
                              "block px-4 py-2 text-sm text-gray-700"
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
                              active ? "bg-gray-50/5 text-gray-700" : "",
                              "block px-4 py-2 text-sm text-gray-700"
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
                <div className="relative  right-24">
                  <button
                    className="relative flex rounded-full text-sm"
                    onClick={toggleDropdown}
                  >
                    <div className="rounded-full flex relative left-4 border-black/10 bg-black/20 p-1">
                      <img src={`data:image/png;base64, ${profileData.image}`} className="h-8 w-8  object-cover rounded-full" />

                      <span className="absolute left-11 bottom-1 leading-5 flex-col font-medium flex items-start text-gray-800">
                        <a className="text-gray-600 flex w-24 truncate" title={profileData.name}>
                          {profileData.name}
                        </a>
                        <a className="font-normal text-xs text-gray-700">{profileData.roles}</a>
                      </span>
                    </div>
                    {/* Arrow Icon */}
                    <IoIosArrowDown
                      className={`relative left-28 top-3 h-4 w-4 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''
                        }`}

                    />

                  </button>

                  {/* dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute -left-5 mt-2 z-50 w-48 max-h-[15rem] p-4  bg-white border rounded-md rounded-t-none shadow-xl">
                      <span className="relative bottom-1">
                        <a className="truncate font-medium w-24 cursor-pointer flex text-gray-600 text-sm " title={profileData.name}>
                          {profileData.name}
                        </a>
                        <a className="relative font-normal text-gray-500 text-sm flex truncate  w-40">{profileData.email}</a>
                      </span>
                      <hr className="mt-1 border-gray-400" />




                      <div className="relative">
                        <a
                          onClick={Users}
                          className="text-gray-700 text-sm flex items-center gap-2 mt-4 cursor-pointer hover:text-blue-500"
                        >
                          <LuUserPlus className="w-3 h-3" /> User
                        </a>
                      </div>

                      <div className="relative">
                        <a
                          onClick={profilePage}
                          className="text-gray-700 text-sm flex items-center gap-2 mt-4 cursor-pointer hover:text-blue-500"
                        >
                          <AiOutlineUser className="w-3 h-3" /> User Profile
                        </a>
                      </div>

                      <div className="relative">

                        {/* Mengganti button dengan elemen select */}
                        <div className="text-gray-700 text-sm flex items-center gap-2 mt-4 cursor-pointer hover:text-blue-500">
                          {/* <label className="pb-2 text-sm" htmlFor="tenant">
                            Tenant
                          </label> */}
                          <FaRegBuilding className="w-2 h-3" />
                          <select
                            name="tenant"
                            id="tenant"
                            options={option}
                            onChange={(e) => {
                              const selectedTenantId = e.target.value;
                              setValues({ ...values, tenant: selectedTenantId });
                              handleTenantSelect(selectedTenantId);
                            }}
                            value={values.tenant}
                          >
                            <option value="" disabled>
                              Tenant
                            </option>
                            {option.map((tenant) => (
                              <option key={tenant.value} value={tenant.value}>
                                {tenant.label}
                              </option>
                            ))}
                          </select>
                        </div>


                      </div>


                      <hr className="relative border-gray-300 top-3" />

                      <div className="relative">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center text-gray-700 text-sm mt-5 hover:text-blue-500"
                        >
                          <BiLogOut className="mr-2" /> Sign out
                        </button>
                      </div>

                    </div>
                  )}
                </div>
                {/* end */}

              </div>
            </div>
          </div>

          <Drawer
            placement="right"
            open={openSettingsDrawer}
            onClose={() => setOpenSettingsDrawer(false)}
            className="pl-4 pt-3"
            overlay={true}
          >
            <button
              onClick={closeDrawerRight}
              className="flex items-center text-lg gap-2"
            >
              {/* <RxCross2 className="text-gray-400  hover:text-gray-600" /> */}
              <h1 className="font-medium text-gray-700">Settings</h1>
            </button>
            <hr className="relative -ml-4 top-2 mx-0" />

            {/* tombol mode gelap */}

            <div className="flex justify-between mx-5 pt-10">
              <h1 className="text-gray-700 relative right-3 font-medium">
                Theme:
              </h1>
              <label
                htmlFor="darkModeToggle"
                className="flex items-center cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id="darkModeToggle"
                    className="sr-only"
                    onChange={toggleDarkMode}
                    checked={darkMode}
                  />
                  <div
                    className={`w-14 h-7 bg-white rounded-full p-1 flex items-center bordernya transition-transform ease-in-out duration-300`}
                  >
                    <div
                      className={`dot w-5 h-5 bg-cyan-100 rounded-full shadow transition-transform ease-in-out duration-300`}
                      style={{
                        transform: darkMode
                          ? "translateX(100%)"
                          : "translateX(0)",
                        opacity: darkMode ? "1" : "1",
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
              <h1 className="text-gray-700 relative right-4 font-medium">
                {selectedLanguage === "english" ? "Language:" : "Bahasa:"}
              </h1>
              <div className="relative left-1">
                <div className="relative inline-block text-left">
                  <button
                    onClick={toggleDropdown}
                    className="btn dropdown-toggle flex items-center"
                  >
                    <img
                      src={selectedLanguage === "english" ? us : indonesia}
                      className="w-6 h-6 mr-2"
                      alt={
                        selectedLanguage === "english"
                          ? "English Flag"
                          : "Indonesia Flag"
                      }
                    />
                    <span className="mr-2">
                      {selectedLanguage === "english" ? "English" : "Indonesia"}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isDropdownOpen ? "transform -rotate-180" : ""
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
                          onClick={() => handleToggleLanguage("english")}
                          className="w-full text-left py-2 px-4 hover:bg-gray-100 pt-1 flex items-center"
                        >
                          <img
                            src={us}
                            className="w-6 h-6 relative right-2"
                            alt="English Flag"
                          />
                          <span className="text-sm font-normal text-gray-900">
                            English
                          </span>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleToggleLanguage("indonesia")}
                          className="w-full text-left  py-2 px-4 hover:bg-gray-100 flex items-center"
                        >
                          <img
                            src={indonesia}
                            className="w-6 h-6 relative right-2"
                            alt="Indonesia Flag"
                          />
                          <span className="text-sm font-normal text-gray-900">
                            Indonesia
                          </span>
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <span className="flex pt-5 items-center">
              <h1 className="mr-2 font-medium text-blue-700">Date Format</h1>
              <hr className="border-gray-500 border-dashed flex-1 h-0 ml-0" />
            </span>

            {/* bagian Date format */}
            <div className="flex justify-between mx-3 mt-5">
              <h1>Date:</h1>
              <div className="w-40 font-medium h-80">
                <div
                  onClick={() => setBuka(!buka)}
                  className={`bg-white border border-gray-600 w-full p-2 py-1 flex items-center justify-between rounded-md ${!selected && "text-gray-700"
                    }`}
                >
                  {selected
                    ? selected?.length > 25
                      ? selected?.substring(0, 25) + "..."
                      : selected
                    : "--select--"}

                  <div className="flex items-center">
                    {selected && (
                      <RxCross2
                        size={15}
                        className="text-red-500 cursor-pointer"
                        onClick={() => {
                          setSelected(null); // Reset the value
                          setInputValue(""); // Reset the input value
                        }}
                      />
                    )}
                    <BiChevronDown
                      size={20}
                      className={`${buka && "rotate-180"}`}
                    />
                  </div>
                </div>
                <ul
                  className={`bg-white  border-t-0  w-[158px] max-w-[160px] left-[1px] relative rounded-b-md shadow-md mb-5  overflow-y-auto ${buka ? "border-t-0 max-h-[160px]" : "max-h-0"
                    } `}
                >
                  <div className="flex items-center px-1  sticky top-0 ">
                    <AiOutlineSearch
                      size={18}
                      className="text-gray-700 absolute right-1"
                    />
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) =>
                        setInputValue(e.target.value.toLowerCase())
                      }
                      placeholder="Search"
                      className="placeholder:text-gray-500 font-normal  p-1 pl-5 relative right-[15px] max-w-[163px] outline-none"
                    />
                  </div>
                  {resultsFound ? (
                    DataV2?.map((country) => (
                      <li
                        key={country?.name}
                        className={`p-2 text-sm hover-bg-sky-400 hover-text-gray-800
        ${country?.name &&
                          country.name.toLowerCase() === selected?.toLowerCase() && (
                            <BiCheck className="text-blue-400 absolute" />
                          )
                          }
        ${country?.name?.toLowerCase().startsWith(inputValue)
                            ? "block"
                            : "hidden"
                          }`}
                        onClick={() => {
                          if (
                            country?.name?.toLowerCase() !==
                            selected?.toLowerCase()
                          ) {
                            setSelected(country?.name);
                            setBuka(false);
                            setInputValue("");
                          }
                        }}
                      >
                        {country?.name}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-sm">Hasil tidak ditemukan</li>
                  )}
                </ul>
              </div>
            </div>
          </Drawer>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 text-center bg-slate-200 pb-3  pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-cyan-50 text-blue-700"
                      : "text-gray-500 hover:bg-cyan-50 hover:text-blue-700",
                    "  flex-1  rounded-md px-3 py-2 text-sm font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
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
};
export default Navbar;
