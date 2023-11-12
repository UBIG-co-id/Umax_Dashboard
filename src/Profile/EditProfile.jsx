import React, { useState, useEffect, useRef  } from 'react';
import { defaultProfile, cover, security } from '../assets';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { BiLockOpenAlt } from 'react-icons/bi';
import { IoIosArrowBack } from 'react-icons/io';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCamera} from 'react-icons/ai';
import { BsKey } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import jwt_decode from 'jwt-decode';

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
  const [type, setType] = React.useState("card");
  // usestate untuk tab account
  

  const [isFocusedName, setIsFocusedName] = useState(false);
  const [inputValueName, setInputValueName] = useState('');

  const [isFocusedStatus, setIsFocusedStatus] = useState(false);
  const [inputValueStatus, setInputValueStatus] = useState('');
  
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [inputValueEmail, setInputValueEmail] = useState('');

  const [isFocusedRole, setIsFocusedRole] = useState(false);
  const [inputValueRole, setInputValueRole] = useState('');
  
  // useState untuk tab security
  
  const [isFocusedCurentPw, setIsFocusedCurentPw] = useState(false);
  const [inputValueCurentPw, setInputValueCurentPw] = useState('');
  
  const [isFocusedNewPw, setIsFocusedNewPw] = useState(false);
  const [inputValueNewPw, setInputValueNewPw] = useState('');
  
  const [isFocusedConsPw, setIsFocusedConsPw] = useState(false);
  const [inputValueConsPw, setInputValueConsPw] = useState('');

  // url base
  const umaxUrl = 'https://umaxx-1-v8834930.deta.app'

  const handleFocusName = () => {
    setIsFocusedName(true);
    setIsFocusedStatus(false); 
    setIsFocusedEmail(false);
    setIsFocusedRole(false);
    setIsFocusedCurentPw(false);
    setIsFocusedNewPw(false);
    setIsFocusedConsPw(false);
  };

  const handleFocusStatus = () => {
    setIsFocusedStatus(true);
    setIsFocusedName(false); 
    setIsFocusedEmail(false);
    setIsFocusedRole(false);
    setIsFocusedCurentPw(false);
    setIsFocusedNewPw(false);
    setIsFocusedConsPw(false);
  };

  const handleFocusEmail = () => {
    setIsFocusedEmail(true);
    setIsFocusedName(false); 
    setIsFocusedStatus(false); 
    setIsFocusedRole(false); 
    setIsFocusedCurentPw(false); 
    setIsFocusedNewPw(false);
    setIsFocusedConsPw(false);
  };

  const handleFocusRole = () => {
    setIsFocusedRole(true); 
    setIsFocusedEmail(false);
    setIsFocusedName(false); 
    setIsFocusedStatus(false); 
    setIsFocusedCurentPw(false); 
    setIsFocusedConsPw(false);
    setIsFocusedNewPw(false); 
  };

  const handleFocusCurentPw = () => {
    setIsFocusedCurentPw(true); 
    setIsFocusedEmail(false);
    setIsFocusedRole(false); 
    setIsFocusedName(false); 
    setIsFocusedStatus(false); 
    setIsFocusedConsPw(false);
    setIsFocusedNewPw(false); 
  };

  const handleFocusNewPw = () => {
    setIsFocusedNewPw(true); 
    setIsFocusedCurentPw(false); 
    setIsFocusedEmail(false);
    setIsFocusedRole(false); 
    setIsFocusedName(false); 
    setIsFocusedStatus(false); 
    setIsFocusedConsPw(false);
  };

  const handleFocusConsPw = () => {
    setIsFocusedConsPw(true);
    setIsFocusedCurentPw(false); 
    setIsFocusedEmail(false);
    setIsFocusedRole(false); 
    setIsFocusedName(false); 
    setIsFocusedStatus(false); 
    setIsFocusedNewPw(false); 
  };

  const handleBlur = () => {
    setIsFocusedName(false);
    setIsFocusedStatus(false);
    setIsFocusedEmail(false);
    setIsFocusedRole(false);
    setIsFocusedCurentPw(false); 
    setIsFocusedNewPw(false); 
    setIsFocusedConsPw(false); 
  };

  const handleChangeName = (e) => {
    setInputValueName(e.target.value);
  };

  const handleChangeStatus = (e) => {
    setInputValueStatus(e.target.value);
  };
  
  const handleChangeEmail = (e) => {
    setInputValueEmail(e.target.value);
  };
  
  const handleChangeRole = (e) => {
    setInputValueRole(e.target.value);
  };
  
  const handleChangeCurentPw = (e) => {
    setInputValueCurentPw(e.target.value);
  };
  
  const handleChangeNewPw = (e) => {
    setInputValueNewPw(e.target.value);
  };
  
  const handleChangeConsPw = (e) => {
    setInputValueConsPw(e.target.value);
  };

  // fungsi untuk membuat pasword terlihtat
  const [NewPassword, setNewPw] = useState('Newpassword');
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

  const toggleNewPasswordVisibility = () => {
    setNewPw(isNewPasswordVisible ? 'password' : 'text');
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const [ConsPassword, setConsPw] = useState('Conspassword');
  const [isConsPasswordVisible, setIsConsPasswordVisible] = useState(false);

  const toggleConsPasswordVisibility = () => {
    setConsPw(isConsPasswordVisible ? 'password' : 'text');
    setIsConsPasswordVisible(!isConsPasswordVisible);
  };


  // ambil data dari fastApi


  const [profileData, setProfileData] = useState({
    // user_id: _id,
    nama: "‎",
    image: defaultProfile,
    email: "",
    alamat: "",
    notelpon: "",
    is_admin: "",
  });
  const token = localStorage.getItem('jwtToken');

  const decodedToken = jwt_decode(token);
  console.log("Token Extrax", decodedToken);

  const _id = decodedToken.user_id;
  console.log(_id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${umaxUrl}/user/${_id}`;

        const response = await Axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log(response.data)

        setProfileData({
          nama: response.data.nama,
          image: response.data.image,
          email: response.data.email,
          alamat: response.data.alamat,
          notelpon: response.data.notelpon,
          is_admin: response.data.is_admin,
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
    <div className="bg-gray-200 flex justify-center items-center w-screen">
    <Card className="w-full">
    <div
    className="m-0 grid place-items-start rounded-b-[20px] py-8 px-4 text-center"
    style={{ 
      backgroundImage: `url(${cover})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '210px',
    }}
  >
    <div className=" bg-opacity-40 w-full h-[210px] rounded-b-[20px] absolute top-0 left-0"></div>
      <h1 className='relative -mt-5 mx-auto text-lg text-white'>Edit Profile</h1>
        {/* button back */}
        <Link to="/profile">
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
          <TabsHeader className="relative z-0 bg-gray-200">
            <Tab value="card" onClick={() => setType("card")} >
        <div className="flex gap-1 items-center ">
            <MdOutlineAccountCircle className="h-5 w-5" /> 
            <span className="font-medium">
            Account
            </span>
        </div>
            </Tab>
            <Tab value="Security" onClick={() => setType("Security")}>
            <div className="flex gap-1 items-center ">
            <BiLockOpenAlt className="h-5 w-5" /> 
            <span className="font-medium">
            Security
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
                          className={`text-gray-600 absolute px-3 py-2 transition-all duration-300 transform ${
                            isFocusedName || inputValueName
                              ? '-translate-y-8 -translate-x-2 scale-75 text-md'
                              : 'translate-y-0 translate-x-0 scale-100 text-base'
                          }`}
                        >
                          Nama
                        </label>
                        <input
                          id="nameInput"
                          className="w-full border-2 border-gray-500 p-2 rounded-md focus:outline-none"
                          onFocus={handleFocusName}
                          onBlur={handleBlur}
                          onChange={handleChangeName}
                          value={inputValueName}
                        />
                      </div>

                      <div className="relative w-full mt-3">
                  <label
                    className={`text-gray-600 absolute px-3 py-2 transition-all duration-300 transform ${
                      isFocusedStatus || inputValueStatus
                        ? '-translate-y-8 -translate-x-2 scale-75 text-md'
                        : 'translate-y-0 translate-x-0 scale-100 text-base'
                    }`}
                  >
                    Status
                  </label>
                  <select
                    className="cursor-pointer w-full border-2 border-gray-500 p-2 rounded-md focus:outline-none"
                    onFocus={handleFocusStatus}
                    onBlur={handleBlur}
                    onChange={handleChangeStatus}
                    value={inputValueStatus}
                  >
                    <option value="" hidden>‎ </option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>

                  </select>
                </div>


                  </div>
                  <div className="my-4 flex items-center gap-4 max-sm:flex-col">

                    <div className="relative w-full mt-3">
                        <label
                          className={`text-gray-600 absolute px-3 py-2 transition-all duration-300 transform ${
                            isFocusedEmail || inputValueEmail
                              ? '-translate-y-8 -translate-x-2 scale-75 text-md'
                              : 'translate-y-0 translate-x-0 scale-100 text-base'
                          }`}
                        >
                          Email
                        </label>
                        <input
                          type='email'
                          className="w-full border-2 border-gray-500 p-2 rounded-md focus:outline-none"
                          onFocus={handleFocusEmail}
                          onBlur={handleBlur}
                          onChange={handleChangeEmail}
                          value={inputValueEmail}
                        />
                      </div>
                    
                      <div className="relative w-full mt-3">
                  <label
                    className={`text-gray-600 absolute px-3 py-2 transition-all duration-300 transform ${
                      isFocusedRole || inputValueRole
                        ? '-translate-y-8 -translate-x-2 scale-75 text-md'
                        : 'translate-y-0 translate-x-0 scale-100 text-base'
                    }`}
                  >
                    Role
                  </label>
                  <select
                    className="cursor-pointer w-full border-2 border-gray-500 p-2 rounded-md focus:outline-none"
                    onFocus={handleFocusRole}
                    onBlur={handleBlur}
                    onChange={handleChangeRole}
                    value={inputValueRole}
                  >
                    <option value="" hidden>‎ </option>
                    <option value="active">Admin</option>
                    <option value="inactive">User</option>

                  </select>
                </div>
                  </div>
                </div>
                <Button
                  className="font-normal text-base bg-blue-700"
                >
                  Save
                </Button>
                <div className='h-32'></div>
               
              </form>

            </TabPanel>
            <TabPanel value="Security" className="p-0">
              <form className="mt-12 border-b border-gray-800 pb-5 flex flex-row gap-4 max-sm:flex-col">


                    <div className='flex flex-col w-full'>
              <div className="relative w-2/3 mt-3 max-sm:w-full">
                        <label
                          className={`text-gray-600 absolute px-3 py-3 transition-all duration-300 transform ${
                            isFocusedCurentPw || inputValueCurentPw
                              ? '-translate-y-9 -translate-x-2 scale-75 text-md'
                              : 'translate-y-0 translate-x-0 scale-100 text-base'
                          }`}
                        >
                          Current Password
                        </label>
                        <input
                          type='password'
                          className="w-full border-2 border-gray-500 p-3 rounded-md focus:outline-none"
                          onFocus={handleFocusCurentPw}
                          onBlur={handleBlur}
                          onChange={handleChangeCurentPw}
                          value={inputValueCurentPw}
                        />
                      </div>

            <div className='mt-6'>
              <div className="relative w-2/3 mt-3 max-sm:w-full">
                        <label
                          className={`text-gray-600 absolute px-3 py-3 transition-all duration-300 transform ${
                            isFocusedNewPw || inputValueNewPw
                              ? '-translate-y-9 -translate-x-2 scale-75 text-md'
                              : 'translate-y-0 translate-x-0 scale-100 text-base'
                          }`}
                        >
                          New Password
                        </label>
                        <input
                          type={NewPassword}
                          className="w-full border-2 border-gray-500 p-3 rounded-md focus:outline-none"
                          onFocus={handleFocusNewPw}
                          onBlur={handleBlur}
                          onChange={handleChangeNewPw}
                          value={inputValueNewPw}
                        />
                        <span
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                          onClick={toggleNewPasswordVisibility}
                        >
                          {isNewPasswordVisible ? (
                            <AiOutlineEye />
                          ) : (
                            <AiOutlineEyeInvisible />
                          )}
                        </span>
                      </div>

              <div className="relative w-2/3 mt-6 max-sm:w-full">
                        <label
                          className={`text-gray-600 absolute px-3 py-3 transition-all duration-300 transform ${
                            isFocusedConsPw || inputValueConsPw
                              ? '-translate-y-9 -translate-x-2 scale-75 text-md'
                              : 'translate-y-0 translate-x-0 scale-100 text-base'
                          }`}
                        >
                         Confirm New Password
                        </label>
                        <input
                           type={ConsPassword}
                          className="w-full border-2 border-gray-500 p-3 rounded-md focus:outline-none"
                          onFocus={handleFocusConsPw}
                          onBlur={handleBlur}
                          onChange={handleChangeConsPw}
                          value={inputValueConsPw}
                        />
                            <span
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                          onClick={toggleConsPasswordVisibility}
                        >
                          {isConsPasswordVisible ? (
                            <AiOutlineEye />
                          ) : (
                            <AiOutlineEyeInvisible />
                          )}
                        </span>
                      </div>

                      </div>
                      </div>
              <img src={security} className='relative top-[26px] max-sm:top-[21px] -z-10 max-sm:mx-auto max-sm:right-0 max-sm:mt-2 lg:right-36 max-md:right-10 right-20  w-60'/>
             
              </form>

              <Button className='font-normal mt-5 w-full text-base bg-blue-700'>Save Changes</Button>

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