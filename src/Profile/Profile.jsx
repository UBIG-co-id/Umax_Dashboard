import React, { useState, useEffect } from 'react';
import { defaultProfile, cover } from '../assets';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { BiLockOpenAlt } from 'react-icons/bi';
import { IoIosArrowBack } from 'react-icons/io';
import { LuContact } from 'react-icons/lu';
import { AiOutlineEdit, AiOutlineMail, AiOutlinePhone, AiOutlineEnvironment, AiOutlineTeam } from 'react-icons/ai';
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
  const [type, setType] = React.useState("Account");
  const [profileData, setProfileData] = useState({

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
        const apiUrl = `https://umaxdashboard-1-w0775359.deta.app/user/${_id}`;

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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const token = localStorage.getItem('jwtToken');
  //       const apiUrl = 'https://umax-1-z7228928.deta.app/profiluser/65227163017382b905f8b1dd';

  //       const response = await Axios.get(apiUrl, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       console.log(response.data)

  //       setProfileData({
  //         name: response.data.name,
  //         image: response.data.image || defaultProfile, 
  //       });
  //     } catch (error) {
  //       if (error.response) {
  //         console.error('Server error:', error.response.data);
  //       } else if (error.request) {
  //         console.error('No response from the server:', error.request);
  //       } else {
  //         console.error('Error:', error.message);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, []);
  

  return (
    <div className="bg-gray-200 flex justify-center items-center w-screen">
      <Card className="w-full">
        {/* thumnail */}
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
          <h1 className='relative -mt-5 mx-auto text-white text-lg'>Your Profile</h1>
          <Link to="/Dashboard">
            <IoIosArrowBack className="absolute top-3 left-5 text-gray-50/90 cursor-pointer hover:text-white h-6 w-6" />
          </Link>
          
          <Link to={`/EditProfile/${_id}`}>
            <AiOutlineEdit className="absolute top-3 right-5 text-gray-50/90 cursor-pointer hover:text-white h-6 w-6" />
          </Link>


          <div className="relative top-4 mt-5 flex">
            <div className="mb-1 rounded-full border border-white/10 bg-white/10 p-2 text-white">
              <img src={`data:image/jpeg;base64,${profileData.image}`} alt="Foto" className="h-24 w-24 object-cover rounded-full max-sm:h-16 max-sm:w-16" />
            </div>
            <div className="items-start mt-4 flex flex-col">
              <h4 className="font-normal pl-4 text-white">Hallo,</h4>
              <h4 className="font-medium pl-4 text-white">{profileData.nama}</h4>
            </div>
          </div>
        </div>
        <CardBody>
          <Tabs value={type} className="-mt-1 overflow-hidden max-sm:-mt-4">
            <TabsHeader className="relative z-0 bg-gray-200">
              <Tab value="Account" onClick={() => setType("Account")}>
                <div className="flex gap-1 items-center">
                  <MdOutlineAccountCircle className="h-5 w-5" />
                  <span className="font-medium">
                    Account
                  </span>
                </div>
              </Tab>
              <Tab value="Security" onClick={() => setType("Security")}>
                <div className="flex gap-1 items-center">
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
                  x: type === "Account" ? 400 : -400,
                },
                mount: {
                  x: 0,
                },
                unmount: {
                  x: type === "Account" ? 400 : -400,
                },
              }}
            >
              <TabPanel value="Account" className="p-0">
                <form className="mt-1 flex flex-col mb-2 gap-4">

                  <div className='flex justify-around'>
                    <div className='flex mt-5'>
                      <LuContact className='bg-white p-3 text-blue-600 text-[45px] rounded-full shadow-md mr-5' />
                      <span className='flex flex-col'>
                        <p className='font-medium text-base'>Username</p>
                        <h1 className='font-normal text-sm'>{profileData.nama}</h1>
                      </span>
                    </div>

                    <div className='flex mt-5'>
                      <AiOutlineMail className='bg-white p-3 text-red-600 text-[45px] rounded-full shadow-md mr-5' />
                      <span className='flex flex-col'>
                        <p className='font-medium text-base'>Email</p>
                        <h1 className='font-normal text-sm'>{profileData.email}</h1>
                      </span>
                    </div>
                  </div>

                  <div className='flex justify-around'>
                    <div className='flex mt-5'>
                      <AiOutlineEnvironment className='bg-white p-3 text-blue-600 text-[45px] rounded-full shadow-md mr-5' />
                      <span className='flex flex-col'>
                        <p className='font-medium text-base'>Alamat</p>
                        <h1 className='font-normal text-sm'>{profileData.alamat}</h1>
                      </span>
                    </div>

                    <div className='flex mt-5'>
                      <AiOutlinePhone className='bg-white p-3 text-red-600 text-[45px] rounded-full shadow-md mr-5' />
                      <span className='flex flex-col'>
                        <p className='font-medium text-base'>No Telp</p>
                        <h1 className='font-normal text-sm'>{profileData.notelpon}</h1>
                      </span>
                    </div>
                  </div>

                  <div className='flex justify-around'>
                    <div className='flex mt-5'>
                      <AiOutlineTeam className='bg-white p-3 text-red-600 text-[45px] rounded-full shadow-md mr-5' />
                      <span className='flex flex-col'>
                        <p className='font-medium text-base'>Status</p>
                        <h1 className='font-normal text-sm'>
                          {profileData.is_admin ? 'Admin' : 'Staff'}
                        </h1>
                      </span>
                    </div>
                  </div>

                </form>
              </TabPanel>
              <TabPanel value="Security" className="p-0">
                <form className="mt-12 flex flex-col gap-4">
                </form>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
