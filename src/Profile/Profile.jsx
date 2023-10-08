import React, {  useState, useEffect  } from 'react';
import { defaultProfile, overlay, overlay2 } from '../assets';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { BiLockOpenAlt } from 'react-icons/bi';
import { IoIosArrowBack } from 'react-icons/io';
import { AiOutlineEdit } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Axios from 'axios';


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


  const [profileData, setProfileData] = useState({
    name: "Your Name", 
    photo: defaultProfile, 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = 'https://umax-1-z7228928.deta.app/profiluser/65227163017382b905f8b1dd';
        const token = 'jwtToken';

        const response = await Axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const { nama, foto } = response.data;
        setProfileData({
          name: nama,
          photo: foto,
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
        className=" m-0 bg-gradient-to-tr from-gray-700 via-gray-800 to-gray-900  grid place-items-start rounded-b-[20px] py-8 px-4 text-center"
      >
      <h1 className='relative -mt-5 mx-auto text-white text-lg'>Your Profile</h1>
        {/* button back */}
        <Link to="/Dashboard">
        <IoIosArrowBack className="absolute top-3 left-5 text-gray-50/90 cursor-pointer hover:text-white h-6 w-6" />
      </Link>
      {/* button edit profile */}
        <Link to="/EditProfile">
        <AiOutlineEdit className="absolute top-3 right-5 text-gray-50/90 cursor-pointer hover:text-white h-6 w-6" />
      </Link>


        <div className="relative top-4 mt-5 flex">
        <div className="mb-1 rounded-full border border-white/10 bg-white/10 p-2 text-white">
          {/* gambar */}
          <img src={profileData.photo} className="h-24 rounded-full max-sm:h-16"/>
        </div>
    
        <div className="items-start mt-4 flex flex-col">
            <h4 className="font-normal pl-4 text-white">Hallo,</h4>
            {/* nama */}
            <h4 className=" font-medium pl-4 text-white">{profileData.name}</h4>
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