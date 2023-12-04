/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef  } from 'react';
import { defaultProfile } from '../assets';
import { IoIosArrowBack,   } from 'react-icons/io';
import { CiGlobe } from "react-icons/ci";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCamera} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import Translation from "../translation/Translation.json";
import jwt_decode from 'jwt-decode';
import { AiOutlineUser } from "react-icons/ai";
import { useLanguage } from "../LanguageContext";
import { us, indonesia } from "../assets";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';


import {
  Card,
  CardBody,
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

 
export default function CheckoutForm() {
  const [type, setType]  = React.useState("card");
  // usestate untuk tab user
  

  const [inputValueName, setInputValueName] = useState('');
  
  const [inputValueEmail, setInputValueEmail] = useState('');

  const [selectValueCulture, setSelectValueCulture] = useState([]);


  
  // useState untuk tab international


  const handleChangeName = (e) => {
    setInputValueName(e.target.value);
  };

  const handleChangeEmail = (e) => {
    setInputValueEmail(e.target.value);
  };

  const handleChangeCulture = (e) => {
    setInputValueCulture(e.target.value);
  };

  
  const [currencyPosition, setCurrencyPosition] = useState(true); // Nilai default bisa true atau false

  // ambil data dari fastApi
// ambil data user
const [profileGeneral, setProfileCulture] = useState({
  culture: '',
  timezone_name: '',
  currency: '',
  language: '',
});

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const apiUrl = 'https://umaxx-1-v8834930.deta.app/user-by-id';

      const culture = await Axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const selectedCulture = culture.data.Data[0];
      console.log('Respon user data:', selectedCulture);

      setProfileCulture({
        culture: selectedCulture.culture, 
        timezone_name: selectedCulture.timezone_name, 
        currency: selectedCulture.currency, 
        language: selectedCulture.language, 
      });
      
      setCurrencyPosition(selectedCulture.currency_position);
    } catch (error) {
      console.error('Error saat mengambil data:', error.message);
    }
  };

  fetchData();
}, []);



  // put data
  const [profileData, setProfileData] = useState({
    name: '',
    image: '',
    email: '',
    culture: '',
  });
  const token = localStorage.getItem('jwtToken');

  const decodedToken = jwt_decode(token);
  console.log("Token Extrax", decodedToken);


  const _id = decodedToken.user_id;
  console.log(_id);

  const updateData = async () => {
      try {
        const apiUrl = `https://umaxx-1-v8834930.deta.app/profile`;
        const bodyFormData = new FormData();
        // bodyFormData.append('image', profileData.image)
        bodyFormData.append('name', inputValueName)
        bodyFormData.append('email', inputValueEmail)
        bodyFormData.append('language', 'id')
        bodyFormData.append('culture', selectValueCulture)
        bodyFormData.append('input_timezone', 'Asia/Jakarta')
        bodyFormData.append('currency', 'Rp')
        bodyFormData.append('currency_position', true)

        // console.log('ini body form',bodyFormData);
        for (const [key, value] of bodyFormData) {
          console.log(`${value}\n`);
        }

        const response = await Axios.put(apiUrl, bodyFormData,{
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // user
        if (response.data && response.data.Data && response.data.Data[0]) {
          setInputValueName(response.data.Data[0].name)
          setInputValueEmail(response.data.Data[0].email)
          setInputValueCulture(response.data.Data[0].roles)
          setInputValueTimezone(response.data.Data[0].timezone)
          setInputValueCurrency(response.data.Data[0].currency)

          setProfileData({
            nama: response.data.Data[0].name,
            image: response.data.Data[0].image,
            email: response.data.Data[0].email,
            culture: response.data.Data[0].culture,
          });
        }
        


        toast.success('Data successfully updated!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
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

  useEffect(() => {
    const decodedToken = jwt_decode(token);
    console.log("Token Extrax", decodedToken.name);

    const fetchData = async () => {
      try {
        const apiUrl = `https://umaxx-1-v8834930.deta.app/user-by-id`;

        const response = await Axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('user by id = ', response)
        
        setInputValueName(response.data.Data[0].name)
        setInputValueEmail(response.data.Data[0].email)

        setInputValueCulture(response.data.Data[0].roles)
        setProfileData({
          nama: response.data.Data[0].name,
          image: response.data.Data[0].image,
          email: response.data.Data[0].email,
          alamat: response.data.Data[0].alamat,
          notelpon: response.data.Data[0].notelpon,
          is_admin: response.data.Data[0].is_admin,
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

// fungsi ganti bahasa
const { selectedLanguage, toggleLanguage } = useLanguage();
const translations = Translation[selectedLanguage];

const [isDropdownOpen, setDropdownOpen] = useState(false);
const toggleDropdown = () => {
  setDropdownOpen(!isDropdownOpen);
};

const handleToggleLanguage = (language) => {
  toggleLanguage(language);
};


  // data get select culture
  const [inputValueCulture, setInputValueCulture] = useState('');
  const [data, setData] = useState([]);
  const [nilai, setNilai] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const apiUrl = 'https://umaxx-1-v8834930.deta.app/culture';

        const response = await Axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setData(response.data);
        console.log('Respon Culture:', response.data);
      } catch (error) {
        console.error('Error saat mengambil data:', error.message);
      }
    };

    fetchData();
  }, []);

  
  // Mengubah struktur data dari API menjadi format yang sesuai dengan opsi Select
  const options = data.map(item => ({
    value: item.cultureInfoCode, 
    label: item.country, 
    }));

    const handleChange = (selectedOption) => {
      setNilai(selectedOption);
    };

  const customStyles = {
    control: provided => ({
      ...provided,
      boxShadow: 'none',
      border: '2px solid #6B7280',
      borderRadius: '6px',
    }),
    container: provided => ({
      ...provided,
      height: '50px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#4CAF500' : '#fff', 
      color: state.isSelected ? '#242424' : '#000', 
    }),
    menu: provided => ({
      ...provided,
      zIndex: 999, 
      border: '1px solid #eee',
      maxHeight: '200px', 
      overflowY: 'hidden',
    }),
  };

  // data get select timezone
  const [inputValueTimezone, setInputValueTimezone] = useState('');
  const [timezoneData, setTimezoneData] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  
  useEffect(() => {
    const fetchTimezoneData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const apiUrl = 'https://umaxx-1-v8834930.deta.app/timezone';
  
        const response = await Axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
    
        setTimezoneData(response.data);
        console.log('Response Timezone:', response.data);
      } catch (error) {
        console.error('Error saat mengambil data:', error.message);
      }
    };
  
    fetchTimezoneData();
  }, []);
  
  // Mengubah struktur data dari API menjadi format yang sesuai dengan opsi Select
  const timezoneOptions = Array.isArray(timezoneData)
    ? timezoneData.map(item => ({
        value: item.value,
        label: item.timezone,
      }))
    : [];
  
  const handleTimezoneChange = value => {
    console.log('value:', value);
    setSelectedTimezone(value);
  };

// data get select currency
const [inputValueCurrency, setInputValueCurrency] = useState('');
const [currencyData, setCurrencyData] = useState([]);
const [selectedCurrency, setSelectedCurrency] = useState(null);

useEffect(() => {
  const fetchCurrencyData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const apiUrl = 'https://umaxx-1-v8834930.deta.app/currency';

      const response = await Axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setCurrencyData(response.data);
      console.log('Response Currency:', response.data);
    } catch (error) {
      console.error('Error saat mengambil data:', error.message);
    }
  };

  fetchCurrencyData();
}, []);

// Mengubah struktur data dari API menjadi format yang sesuai dengan opsi Select
const currencyOptions = Array.isArray(currencyData)
  ? currencyData.map(item => ({
      value: item.value,
      label: item.currency,
    }))
  : [];

const handleCurrencyChange = value => {
  console.log('value:', value);
  setSelectedCurrency(value);
};



  return (
    <div className="bg-gray-200 flex justify-center items-center w-screen">
            <ToastContainer />
    <Card className="w-full">
    <div
    className="m-0 grid place-items-start rounded-b-[20px] py-8 px-4 text-center  bg-gradient-to-tl from-sky-400 via-blue-500 to-blue-600"

  >
    <div className=" bg-opacity-40 w-full h-[210px] rounded-b-[20px] absolute top-0 left-0"></div>
      <h1 className='relative -mt-5 mx-auto text-lg text-white'>Edit Profile</h1>
        {/* button back */}
        <Link to="/Profile">
        <IoIosArrowBack className="absolute top-3 left-5 text-gray-50/90 cursor-pointer hover:text-white h-6 w-6" />
       </Link>

        <div className="relative top-4 mt-5 mx-auto flex">
        <div className="relative mb-1 rounded-full border border-white/10 bg-white/10 p-2 text-white">
        <img src={`data:image/jpeg;base64,${profileData.image}`} alt="Foto" className="h-24 w-24 object-cover rounded-full max-sm:h-16 max-sm:w-16" />
      <div className="absolute bottom-0 right-0">
        <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        />
        <label htmlFor="imageInput">
        <button
        className="bg-blue-700 hover:bg-blue-800 max-sm:p-1 rounded-full p-2 text-white"
        >
        <AiOutlineCamera />
        </button>
        </label>

      </div>
    </div>

        </div>
      </div>
      <CardBody>
        <Tabs value={type} className="-mt-1 overflow-hidden max-sm:-mt-4">
          <TabsHeader className="relative z-0 bg-slate-300">
            <Tab value="card" onClick={() => setType("card")} >
        <div className="flex gap-1 items-center ">
            <AiOutlineUser className="h-5 text-blue-500 w-5" /> 
            <span className="font-medium text-blue-500">
            Profile
            </span>
        </div>
            </Tab>
            <Tab value="Security" onClick={() => setType("Security")}>
            <div className="flex gap-1 items-center ">
            <CiGlobe className="h-5 text-blue-500 w-5" /> 
            <span className="font-medium text-blue-500">
            International
            </span>  
        </div>
            </Tab>
          </TabsHeader>
          <TabsBody
            className="!overflow-x-hidden"
            animate={{
              initial: {
                x: type === "card" ? 400 : -400,
              },
              mount: {
                x: 0,
              },
              unmount: {
                x: type === "card" ? 400 : -400,
              },
            }}
          >
            <TabPanel value="card" className="p-0">
              <form className="mt-1 flex flex-col  gap-4">

                <div className="w-full">
                 
                  <div className="my-4 flex items-center gap-4 max-sm:flex-col">

                    <div className="relative w-full mt-3">
                        <label
                          className='text-gray-600 absolute px-3 py-2 transition-all duration-300 transform -translate-y-9  scale-100 text-base' 
                        >
                          Username
                        </label>
                        <input
                           id="nameInput"
                          className="w-full border-2 border-gray-500 p-2 rounded-md focus:outline-none"
                          onChange={handleChangeName}
                          value={inputValueName}
                        />
                      </div>

                    <div className="relative w-full mt-3">
                        <label
                          className='text-gray-600 absolute px-3 py-2 transition-all duration-300 transform -translate-y-9 scale-100 text-base'
                        >
                          Email
                        </label>
                        <input
                          type='email'
                          className="w-full border-2 border-gray-500 p-2 rounded-md focus:outline-none"
                          onChange={handleChangeEmail}
                          value={inputValueEmail}
                        />
                      </div>
                    
                  </div>

               
                  
                </div>
                <Button
                  className="font-normal text-base bg-blue-700"
                  onClick={() => updateData()}
                >
                  Save
                </Button>
                <div className='h-32'></div>
               
              </form>

            </TabPanel>
            <TabPanel value="Security" className="p-0">
              <form className="mt-12 h-60 border-gray-800 pb-5 flex flex-col gap-2">

          <div className='w-full flex-row flex gap-3 max-md:flex-col'>
             <div className="relative w-full mt-3">
                <label
                  className='text-gray-600 absolute px-3 py-2 transition-all duration-300 transform -translate-y-8 -translate-x-2 scale-75 text-md'
                >
                  Culture
                </label>
                {/* select v2 */}
                <Select
                  value={nilai}
                  onChange={handleChange}
                  styles={customStyles}
                  options={options}
                  placeholder={profileGeneral.culture}
                />
              </div>

             <div className="relative w-full mt-3">
                <label
                  className='text-gray-600 absolute px-3 py-2 transition-all duration-300 transform -translate-y-8 -translate-x-2 scale-75 text-md'
                >
                  Timezone
                </label>
                {/* select v2 */}
                <Select
                    value={selectedTimezone}
                    onChange={handleTimezoneChange}
                    styles={customStyles}
                    options={timezoneOptions}
                    placeholder={profileGeneral.timezone_name}
                  />
              </div>
              </div>

          <div className='w-full flex-row flex gap-3 max-md:flex-col'>
             <div className="relative w-full mt-3">
                <label
                  className='text-gray-600 absolute px-3 py-2 transition-all duration-300 transform -translate-y-8 -translate-x-2 scale-75 text-md'
                >
                  Currency
                </label>
                {/* select v2 */}
                <Select
                  options={currencyOptions}
                   value={selectedCurrency}
                   styles={customStyles}
                   onChange={handleCurrencyChange}
                    placeholder={profileGeneral.currency} 
                  />
              </div>

              <div className="relative w-full mt-3">
                  <label className="text-gray-600 absolute px-3 py-2 transition-all duration-300 transform -translate-y-8 -translate-x-2 scale-75 text-md">
                    Posisi
                  </label>
                  {/* Langkah 4.1: Perbarui elemen select untuk menampilkan teks berdasarkan posisi mata uang */}
                  <select
                    className="w-full border-gray-500 hover:border-gray-400 focus:border-blue-500 border-2 rounded-md h-10"
                    value={currencyPosition ? 'front' : 'back'}
                    onChange={(e) => setCurrencyPosition(e.target.value === 'front')}
                  >
                    <option value="front">Left ($n)</option>
                    <option value="back">Right (n$)</option>
                  </select>
                </div>

              </div>

          <div className='w-full flex-row flex gap-3 max-md:flex-col'>
          <div className="relative w-full mt-3">
        <label
          className='text-gray-600 absolute px-3 py-2 transition-all duration-300 transform -translate-y-8 -translate-x-2 scale-75 text-md'
        >
          Language
        </label>
        {/* select v2 */}
        <Select
          styles={customStyles}
          placeholder={profileGeneral.language}
          options={[
            {
              value: 'english',
              label: (
                <div className="flex items-center">
                  <img src={us} className="w-6 h-6 mr-2" alt="English Flag" />
                  <span>English</span>
                </div>
              ),
            },
            {
              value: 'indonesia',
              label: (
                <div className="flex items-center">
                  <img src={indonesia} className="w-6 h-6 mr-2" alt="Indonesia Flag" />
                  <span>Indonesia</span>
                </div>
              ),
            },
          ]}
          // Memberikan value dan event handler saat opsi dipilih
          onChange={(selectedOption) => handleToggleLanguage(selectedOption.value)}
        />
      </div>

              <div className="relative w-full mt-3">
              </div>
              </div>

              {/* <div className="flex mx-5 mt-14 gap-10 justify-around z-10">
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
                      className={`w-4 h-4 transition-transform ${
                        isDropdownOpen ? "transform -rotate-180" : ""
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
            </div> */}

              
             
              </form>
              

              <Button className='font-normal w-full mt-32 sm:mt-1 text-base bg-blue-700' onClick={() => updateData()}>Save Changes</Button>

{/*               
              <div className='w-full mt-10'>
                <span className='relative -top-5 flex right-0 font-medium text-gray-800 text-xl'>
                 <BsKey  className='text-gray-800  text-[30px]' />
                 <h1 className='ml-3'>Two-factor authentication</h1>
              </span>
              </div>

              <div className='w-full'>
                  <span className='flex items-center justify-center'>
                    <BiLockOpenAlt className='bg-blue-600 rounded-md p-3  text-white text-[50px]'/>
                  </span>
              </div> */}

            </TabPanel>
          </TabsBody>
        </Tabs>
      </CardBody>
    </Card>
    </div>
  );
}