import React, { useState, useEffect,} from 'react';
import {MdOutlinePermContactCalendar,MdOutlineAccessTime  , MdOutlineEmail  } from 'react-icons/md';
import { VscSymbolEnum } from 'react-icons/vsc';
import { LiaMoneyBillWaveAltSolid   } from 'react-icons/lia';
import { IoIosArrowBack  } from 'react-icons/io';
import { CiGlobe, CiEdit } from 'react-icons/ci';
import { GiGlobe  } from 'react-icons/gi';
import { FaUsersCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import us from "../assets/us.png"
import indonesia from "../assets/indonesia.png"
import japan from "../assets/japan.jpg"

import {
  Card,
  CardBody,
  Tabs,
  TabsBody,
  TabPanel,
} from "@material-tailwind/react";

 
export default function CheckoutForm() {
  const [type] = React.useState("card");
  

// ambil data user
const [profileData, setProfileData] = useState({
  name: '',
  image: '',
  roles: '',
  email: '',
  currency: '',
  currency_position: '',
  language: '',
  timezone_name: '',
  culture: '',
});

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const apiUrl = 'https://umaxx-1-v8834930.deta.app/user-by-id';

      const response = await Axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Respon API:', response);

      const selectedProfile = response.data.Data[0];

      console.log('URL Gambar:', selectedProfile.image);
      console.log('Respon role:', selectedProfile.roles);


      

        // curency posisi
        const currencyPosition = selectedProfile.currency_position ? 'Left ($n)' : 'Right (n$)';

        // language
        let languageLabel = '';
        let languageImageURL = '';
        
        switch (selectedProfile.language) {
          case 'id':
            languageLabel = 'Indonesia';
            languageImageURL = `${indonesia}`; 
            break;
          case 'en':
            languageLabel = 'English';
            languageImageURL = `${us}`; 
            break;
          case 'ja':
            languageLabel = 'Japan';
            languageImageURL = `${japan}`; 
            break;
          default:
            languageLabel = '';
            break;
        }
        
        console.log('Label Language yang Ditetapkan:', languageLabel);
        const languageImage = languageImageURL ? <img src={languageImageURL} className='w-4 h-4 object-cover' alt={languageLabel} /> : null;

        const base64Image = selectedProfile.image;

        setProfileData({
          name: selectedProfile.name,
          image: base64Image,
          roles: selectedProfile.roles,
          email: selectedProfile.email,
          currency: selectedProfile.currency,
          currency_position: currencyPosition,
          language: languageLabel,
          languageImage: languageImage, 
          timezone_name: selectedProfile.timezone_name, 
          culture: selectedProfile.culture, 
        });
    } catch (error) {
      console.error('Error saat mengambil data:', error.message);
    }
  };

  fetchData();
}, []);


  return (
    <div className="bg-gray-200 flex justify-center items-center w-screen">
    <Card className="w-full">
    <div
    className="m-0 grid place-items-start rounded-b-[20px] py-8 px-4 text-center bg-gradient-to-tl from-sky-400 via-blue-500 to-blue-600"
  
  >
    <div className=" bg-opacity-40 w-full h-[210px] rounded-b-[20px] absolute top-0 left-0"></div>
      <h1 className='relative -mt-5 mx-auto text-lg text-white'>Profile</h1>
        {/* button back */}
        <Link to="/Dashboard">
        <IoIosArrowBack className="absolute top-3 left-5 text-gray-50/90 cursor-pointer hover:text-white h-6 w-6" />
      </Link>
        {/* button editProfile */}
        <Link to="/EditProfile">
        <CiEdit  className="absolute top-3 right-5 text-gray-50/90 cursor-pointer hover:text-white h-6 w-6" />
      </Link>
 
    


        <div className="relative top-4 mt-5 flex">
        <div className="relative mb-1 rounded-full border border-white/10 bg-white/10 p-2 text-white">
        <img
          src={`data:image/png;base64, ${profileData.image}`}
          className="h-24 w-24 object-cover rounded-full"
        />


    </div>

        </div>
      </div>
      <CardBody>
        <Tabs value={type} className="-mt-1 overflow-hidden max-sm:-mt-4">
         
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

            <span className='flex items-center gap-5'>
              <p className='text-blue-600 font-medium'>Profile</p> 
              <hr className='relative w-11/12 border-dashed border-gray-500'/>
            </span>

            <span className='flex  gap-5 lg:gap-52 justify-start mt-10 max-md:flex-col max-lg:flex-col'>
              <span className='relative lg:left-5 flex gap-2 item-center '>
                <span className='flex items-center gap-1'>
              <MdOutlinePermContactCalendar size={18} className='text-amber-500'/> <h1 className='font-medium text-gray-600'>Username:</h1>
                </span>
                <p>{profileData.name}</p>
              </span>

                <span className='relative lg:left-14 flex gap-2 items-center'>
              <FaUsersCog  size={18} className='text-blue-400'/><h1 className='font-medium text-gray-600'>Roles:</h1> 
               <p>{profileData.roles}</p>
                </span>

              <span className='relative lg:left-20 flex gap-2 item-center '>
                <span className='flex items-center gap-1'>
              <MdOutlineEmail  size={18} className='text-red-400'/> <h1 className='font-medium text-gray-600'>Email:</h1>
                </span>
                <p>{profileData.email}</p>
              </span>
            </span>

            <span className='flex items-center mt-10 gap-5'>
              <p className='text-blue-600 font-medium'>International</p> 
              <hr className='relative w-[88%] border-dashed border-gray-500'/>
            </span>

            <span className='flex gap-5 lg:gap-52 justify-start mt-10  max-lg:flex-col'>
            <span className='relative lg:left-5 flex items-center gap-2'>
            <LiaMoneyBillWaveAltSolid className='text-green-500' size={18}/> <h1 className='text-gray-600 font-medium'>Currencies:</h1>
             <p className='px-3 rounded-sm'>{profileData.currency}</p>
             </span>
              <span className='relative lg:left-[6rem] flex items-center gap-2'>
              <VscSymbolEnum size={18}/><h1 className='text-gray-600 font-medium'>Position Symbol:</h1>
             <p className='px-3 rounded-sm'>{profileData.currency_position}</p>
             </span>

             <span className='relative lg:left-[15px] flex items-center gap-2'>
            <CiGlobe size={18} className='text-blue-500'/> <h1 className='text-gray-600 font-medium'>Language:</h1>
            <p className='px-3 rounded-sm'>{profileData.languageImage}</p>
            <p className='relative right-5 px-3 rounded-sm'>{profileData.language}</p>
             </span>

            </span>

             

            <span className='relative  flex lg:gap-56 gap-5 justify-start mt-5 lg:mt-10 max-md:flex-col'>
            <span className='relative lg:left-5 flex items-center gap-2'>
            <MdOutlineAccessTime  className='text-cyan-500' size={18}/> <h1 className='text-gray-600 font-medium'>Timezone:</h1>
             <p className='px-3 rounded-sm'>{profileData.timezone_name}</p>
             </span>
            <span className='relative lg:left-5 flex items-center gap-2'>
            <GiGlobe  className='text-emerald-500' size={18}/> <h1 className='text-gray-600 font-medium'>Culture:</h1>
             <p className='px-3 rounded-sm'>{profileData.culture}</p>
             </span>

            </span>
              


           

            </TabPanel>
            <TabPanel value="Security" className="p-0">
             



            </TabPanel>
          </TabsBody>
        </Tabs>
      </CardBody>
    </Card>
    </div>
  );
}