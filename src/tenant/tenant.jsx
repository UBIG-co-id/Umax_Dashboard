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

        <div className='flex items-center justify-between'>
          <h1 className='font-medium text-xl text-slate-700'>Tenant Profile </h1>
          <GoQuestion size={17} className='cursor-pointer text-blue-600' />
        </div>

        <div className='grid grid-cols-7 gap-5 max-md:grid-cols-3 max-sm:grid-cols-2'>
          {/* button save */}
          <button
            onClick={handleSave}
            className='mt-4 text-gray-500 bg-slate-100 flex items-center gap-2 border border-slate-300 rounded-md py-1 px-3 justify-center'
          >
            <FaCheck className='text-green-600' /> Save
          </button>

          {/* button download */}
          <button
            className='mt-4 text-gray-500 bg-slate-100 flex items-center gap-2 border border-slate-300 rounded-md py-1 px-3 justify-center'
          >
            <AiOutlineDownload className='text-blue-600' /> Download
          </button>

          {/* button subscribe */}
          <button
            onClick={Dashboard}
            className='mt-4 text-gray-500 bg-slate-100 flex items-center gap-2 border border-slate-300 rounded-md py-1 px-3 justify-center'
          >
            <MdOutlineCancel className='text-red-600' /> Cancel
          </button>
        </div>

        <span className='flex items-center mt-5 gap-5'>
          <p className='text-blue-600 font-medium'>General</p>
          {/* <hr className='relative w-11/12 border-dashed border-gray-500' /> */}
        </span>

        <div className='bg-gray-100 p-2 rounded-sm shadow-md'>
          <div className='flex items-center gap-5 justify-around max-sm:flex-col'>
            <div className='flex items-center ml-5 mt-5'>
              <p className='text-red-500'>*</p><p className='font-medium text-lg text-slate-700'>company</p>
              <input
                className='border border-slate-600 ml-5 py-1 px-2 rounded-md'
                type="text"
                name="company"
                value={profileData.company}
                onChange={handleChange}
              />
            </div>
            <div className='flex items-center ml-5 mt-5'>
              <p className='text-red-500'>*</p><p className='font-medium text-lg text-slate-700'>Phone</p>
              <input
                className='border border-slate-600 ml-5 py-1 px-2 rounded-md'
                type="text"
                name="contact"
                value={profileData.contact}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='flex items-center gap-5 justify-around max-sm:flex-col'>
            <div className='flex items-center ml-5 mt-5'>
              <p className='text-red-500'>*</p><p className='font-medium text-lg text-slate-700'>email</p>
              <input
                className='border border-slate-600 ml-5 py-1 px-2 rounded-md'
                type="text"
                name="company"
                value={profileData.email}
                onChange={handleChange}
              />
            </div>
            <div className='flex items-center ml-5 mt-5'>
              {/* <p className='text-red-500'>*</p> */}
              <p className='font-medium text-lg text-slate-700'>language</p>
              <input
                className='border border-slate-600 ml-5 py-1 px-2 rounded-md'
                type="text"
                name="address"
                value={profileData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='flex items-center gap-5 justify-around max-sm:flex-col'>
            <div className='flex items-center ml-5 mt-5'>
              <p className='text-red-500'>*</p><p className='font-medium text-lg text-slate-700'>Address</p>
              <input
                className='border border-slate-600 ml-5 py-1 px-2 rounded-md'
                type="text"
                name="company"
                value={profileData.company}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Tenant;
