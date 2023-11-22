import React, { useState, useEffect } from 'react';
import Axios from "axios";
import { FaCheck } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { GoQuestion } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";

const Tenant = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const Dashboard = () => {
    navigate("/Dashboard");
  };

  const [profileData, setProfileData] = useState({
    company: '',
    contact: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const apiUrl = `https://umaxx-1-v8834930.deta.app/tenant-by-id?tenant_id=${_id}`;
        const response = await Axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,

          },
        });

        console.log('API Response:', response);

        // Check if Data array and its elements exist
        if (response.data.Data && response.data.Data.length > 0 && response.data.Data[0].length > 0) {
          const selectedProfile = response.data.Data[0][0];

          setProfileData({
            company: selectedProfile.company,
            contact: selectedProfile.contact,
          });
        } else {
          console.error('Invalid data format in the API response.');
        }
      } catch (error) {
        if (error.response) {
            console.error('Error fetching data:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('No response received from the server');
        } else {
            console.error('Error:', error.message);
        }
    }
    
    };

    fetchData();
  }, [_id]);

  return (
    <main className='p-1 bg-slate-100 min-h-screen'>
      <div className="m-3 p-3 min-h-screen rounded-md border border-gray-300 bg-white ">

        <div className='flex items-center justify-between'>
          <h1 className='font-medium text-xl text-slate-700'>Tenant Profile ({profileData.company})</h1>
          <GoQuestion size={17} className='cursor-pointer text-blue-600'/>
        </div>

        <div className='grid grid-cols-7 gap-5 max-md:grid-cols-3 max-sm:grid-cols-2'>
          {/* button save */}
          <button
            className='mt-4 text-gray-500 bg-slate-100 flex items-center gap-2 border border-slate-300 rounded-md py-1 px-3 justify-center'
          >
            <FaCheck className='text-green-600'/> Save
          </button>

          {/* button download */}
          <button
            className='mt-4 text-gray-500 bg-slate-100 flex items-center gap-2 border border-slate-300 rounded-md py-1 px-3 justify-center'
          >
            <AiOutlineDownload className='text-blue-600'/> Download
          </button>

          {/* button subscribe */}
          <button
            onClick={Dashboard}
            className='mt-4 text-gray-500 bg-slate-100 flex items-center gap-2 border border-slate-300 rounded-md py-1 px-3 justify-center'
          >
            <MdOutlineCancel className='text-red-600'/> Cancel
          </button>
        </div>

        <span className='flex items-center mt-5 gap-5'>
          <p className='text-blue-600 font-medium'>General</p>
          <hr className='relative w-11/12 border-dashed border-gray-500'/>
        </span>

        <div className='flex items-center gap-5 justify-around max-sm:flex-col'>
          <div className='flex items-center ml-5 mt-5'>
            <p className='text-red-500'>*</p><p className='font-medium text-lg text-slate-700'>company</p>
            <span className='ml-10 border border-slate-400 py-1 pl-2 pr-20 truncate text-gray-500 bg-slate-50 rounded-md'>{profileData.company}</span>
          </div>
          <div className='flex items-center ml-5 mt-5'>
            <p className='text-red-500'>*</p><p className='font-medium text-lg text-slate-700'>Phone</p>
            <span className='ml-10 border border-slate-400 py-1 pl-2 pr-20 text-gray-500 bg-slate-50 rounded-md'>{profileData.contact}</span>
          </div>
        </div>

      </div>
    </main>
  );
};

export default Tenant;
