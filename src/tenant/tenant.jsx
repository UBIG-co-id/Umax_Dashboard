import React, { useState, useEffect } from 'react';
import Axios from "axios";
import { FaCheck } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { GoQuestion } from "react-icons/go";
import { useNavigate, navigate, useParams } from "react-router-dom";
import us from "../assets/us.png"
import indonesia from "../assets/indonesia.png"
import japan from "../assets/japan.jpg"

const Tenant = () => {
  const [profileData, setProfileData] = useState({
    company: '',
    address: '',
    email: '',
    contact: '',
    subscription: '',
    currency: '',
    currency_position: '',
    timezone_name: '',
    language: '',
    culture: '',
  });

  const navigate = useNavigate();
  const Dashboard = () => {
    navigate("/Dashboard");
  };
  const [originalProfileData, setOriginalProfileData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const apiUrl = 'https://umaxx-1-v8834930.deta.app/tenant-by-id';

        const response = await Axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Respon API:', response);

        const selectedProfile = response.data.Data[0];

        const currencyPosition = selectedProfile.currency_position ? 'Left ($n)' : 'Right (n$)';

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

        setProfileData({
          name: selectedProfile.name,
          roles: selectedProfile.roles,
          email: selectedProfile.email,
          currency: selectedProfile.currency,
          currency_position: currencyPosition,
          language: languageLabel,
          timezone_name: selectedProfile.timezone_name,
          culture: selectedProfile.culture,
          company: selectedProfile.company,
          contact: selectedProfile.contact,
        });

        setOriginalProfileData({
          company: selectedProfile.company,
          contact: selectedProfile.contact,
        });
      } catch (error) {
        console.error('Error saat mengambil data:', error.message);
      }
    };

    fetchData();
  }, []);


  const handleSave = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const apiUrl = 'https://umaxx-1-v8834930.deta.app/tenant-edit';

      const changes = {};
      Object.keys(profileData).forEach((key) => {
        if (profileData[key] !== originalProfileData[key]) {
          changes[key] = profileData[key];
        }
      });

      console.log('Payload Permintaan:', { changes });

      const response = await Axios.put(apiUrl, changes, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Respon Simpan:', response);


    } catch (error) {
      console.error('Error saat menyimpan perubahan:', error.message);

      if (error.response) {
        console.error('Respon Error:', error.response.data);
      }
    }
  };


  return (
    <main className='p-1 bg-slate-100 min-h-screen'>
      <div className="m-3 p-3 min-h-screen rounded-md border border-gray-300 bg-white ">
        <span className='flex items-end justify-end'>
          <GoQuestion />
        </span>

        <div className='flex items-center justify-center'>
          <h1 className='font-medium text-xxl text-slate-700'>Tenant Profile ({profileData.company})</h1>
        </div>

        <hr className="ml-3 flex-grow border-dashed border-gray-300 border-t-2 mt-1" />

        <p className='text-blue-600 font-medium  text-lg  relative left-20 mt-2'>General</p>
        <div className='bg-sky-50/100 border border-slate-300 p-2 rounded-md shadow-sm mx-5 sm:mx-20'>
          <div className='flex items-center gap-5 justify-around max-sm:flex-col'>
            <div className="relative w-full mt-3">
              <p className='font-medium text-lg text-slate-700'><span className='text-red-500'>*</span>company</p>
              <input
                type='text'
                name='company'
                className="w-full border-2 border-gray-500 p-2 rounded-md focus:outline-none"
                onChange={handleChange}
                value={profileData.company}
              />
            </div>

            <div className="relative w-full mt-3">
              <p className='font-medium text-lg text-slate-700'><span className='text-red-500'>*</span>phone</p>
              <input
                type='text'
                name='contact'
                className="w-full border-2 border-gray-500 p-2 rounded-md focus:outline-none"
                onChange={handleChange}
                value={profileData.contact}
              />
            </div>
          </div>

          <div className='flex items-center gap-5 justify-around max-sm:flex-col'>
            <div className="relative w-full mt-3">
              <p className='font-medium text-lg text-slate-700'><span className='text-red-500'>*</span>email</p>
              <input
                type='email'
                name='email'
                className="w-full border-2 border-gray-500 p-2 rounded-md focus:outline-none"
                onChange={handleChange}
                value={profileData.email}
              />
            </div>

            <div className="relative w-full mt-3">
              <p className='font-medium text-lg text-slate-700'>language</p>
              <input
                type='text'
                name='language'
                className="w-full border-2 border-gray-500 p-2 rounded-md focus:outline-none"
                onChange={handleChange}
                value={profileData.language}
              />
            </div>
          </div>

          <div className="w-full">
            <div className="my-4 flex items-center gap-4 max-sm:flex-col">
              <div className="relative w-full mt-2">
                <p className='font-medium text-lg text-slate-700'><span className='text-red-500'>*</span>Address</p>
                <input
                  type="text"
                  className="w-full border-2 border-gray-500 p-2 rounded-md focus:outline-none"
                  name="address"
                  onChange={handleChange}
                  value={profileData.address}
                />
              </div>
            </div>
          </div>
        </div>

        <p className='text-blue-600 font-medium text-lg relative left-20 mt-5'>Format</p>

        <div className='bg-sky-50/100 border border-slate-300 p-2 rounded-md shadow-sm mx-5 sm:mx-20'>
          <div className='flex items-center gap-5 justify-around max-sm:flex-col'>
            <div className="relative w-full mt-3">
              <p className='font-medium text-lg text-slate-700'><span className='text-red-500'>*</span>curreency</p>
              <input
                type='text'
                name='currency'
                className="w-full border-2 border-gray-500 p-2 rounded-md focus:outline-none"
                onChange={handleChange}
                value={profileData.currency}
              />
            </div>

            <div className="relative w-full mt-3">
              <p className='font-medium text-lg text-slate-700'><span className='text-red-500'>*</span>timezone</p>
              <input
                type='text'
                name='timezone'
                className="w-full border-2 border-gray-500 p-2 rounded-md focus:outline-none"
                onChange={handleChange}
                value={profileData.timezone_name}
              />
            </div>
          </div>

          <div className='flex items-center gap-5 justify-around max-sm:flex-col'>
            <div className="relative w-full mt-3">
              <p className='font-medium text-lg text-slate-700'><span className='text-red-500'>*</span>culture</p>
              <input
                type='text'
                name='culture'
                className="w-full border-2 border-gray-500 p-2 rounded-md focus:outline-none"
                onChange={handleChange}
                value={profileData.culture}
              />
            </div>

            <div className="relative w-full mt-3">
              <p className='font-medium text-lg text-slate-700'><span className='text-red-500'>*</span>position</p>
              <input
                type='text'
                name='position'
                className="w-full border-2 border-gray-500 p-2 rounded-md focus:outline-none"
                onChange={handleChange}
                value={profileData.currency_position}
              />
            </div>
          </div>
        </div>

        <div className="w-full">
        <div className='flex justify-center gap-5 max-md:grid-cols-7 max-sm:grid-cols-7'>
          {/* button save */}
          <button
            onClick={handleSave}
            className='mt-4 text-gray-500 bg-green-100 flex items-center gap-2 border border-slate-300 rounded-md py-1 px-6 justify-center transition duration-300 hover:bg-green-200'
          >
            <FaCheck className='text-green-600' /> Save
          </button>

          {/* button subscribe */}
          <button
            onClick={Dashboard}
            className='mt-4 text-gray-500 bg-red-100 flex items-center gap-2 border border-slate-300 rounded-md py-1 px-6 justify-center transition duration-300 hover:bg-red-200'
          >
            <MdOutlineCancel className='text-red-600' /> Cancel
          </button>
        </div>
        </div>

      </div>
    </main>
  );
};

export default Tenant;
