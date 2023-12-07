import React, { useState, useEffect } from 'react';
import Axios from "axios";

const Setting = () => {
  const [profileData, setProfileData] = useState({
    rar: '',
    ctr: '',
    oclp: '',
    roas: '',
    cpr: '',
    cpc: '',
  });

  const baseUrl = 'https://umaxx-1-v8834930.deta.app';

  
  const [originalProfileData, setOriginalProfileData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  

  
  // get data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const apiUrl = `${baseUrl}/metrics-settings-by?campaign_id=656404d2d0fe018977020031`;
  
        const response = await Axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        console.log('Respon setting:', response);
  
        const selectedProfile = response.data.Data[0];
  
        setProfileData({
          rar: selectedProfile.rar,
          ctr: selectedProfile.ctr,
          oclp: selectedProfile.oclp,
          roas: selectedProfile.roas,
          cpr: selectedProfile.cpr,
          cpc: selectedProfile.cpc,
        });
  
        // Set originalProfileData setelah mendapatkan data
        setOriginalProfileData({
          rar: selectedProfile.rar,
          ctr: selectedProfile.ctr,
          oclp: selectedProfile.oclp,
          roas: selectedProfile.roas,
          cpr: selectedProfile.cpr,
          cpc: selectedProfile.cpc,
        });
  
      } catch (error) {
        console.error('Error saat mengambil data:', error.message);
      }
    };
  
    fetchData();
  }, []);

  // edit setting
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const apiUrl = `${baseUrl}/metrics-settings?campaign_id=656404d2d0fe018977020031`;
  
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
  
      // Jika berhasil menyimpan, perbarui originalProfileData
      setOriginalProfileData({ ...profileData });
  
    } catch (error) {
      console.error('Error saat menyimpan perubahan:', error.message);
  
      if (error.response) {
        console.error('Respon Error:', error.response.data);
      }
    }
  };



  return (
    <main className='min-h-screen'>
      <div className="p-3 min-h-screen rounded-md border border-gray-300 bg-white ">

    <div className='flex flex-col gap-3'>
      <div className="ml-3 mt-5 flex flex-col md:flex-row md:items-center">
        <div className="md:mr-10 mb-3 md:mb-0 md:w-72">
          <p className="text-gray-500 font-medium">Reach Amount Ratio (RAR)</p>
          <p className="text-gray-500 font-base text-sm">Recommended value {'>'} 5%</p>
        </div>
        <div className="relative flex items-center">
          <input
            onChange={handleChange}
            type="number"
            value={profileData.rar}
            className="block w-full p-2 rounded-l-md border rounded  border-r-0 border-gray-300 focus:outline-none focus:none focus:border-blue-500"
          />
          <button className="absolute inset-y-0 right-0 inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 bg-blue-400 text-white rounded-r-md">
            %
          </button>
        </div>
      </div>

      <div className="ml-3 mt-5 flex flex-col md:flex-row md:items-center">
        <div className="md:mr-10 mb-3 md:mb-0 md:w-72">
          <p className="text-gray-500 font-medium">Click Through Rate (CTR)</p>
          <p className="text-gray-500 font-base text-sm">Recommended value {">"} 1,5%</p>
        </div>
        <div className="relative flex items-center">
          <input
            type="number"
            value={profileData.ctr}
            className="block w-full p-2 rounded-l-md border rounded  border-r-0 border-gray-300 focus:outline-none focus:none focus:border-blue-500"
          />
          <button className="absolute inset-y-0 right-0 inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 bg-blue-400 text-white rounded-r-md">
            %
          </button>
        </div>
      </div>

      <div className="ml-3 mt-5 flex flex-col md:flex-row md:items-center">
        <div className="md:mr-10 mb-3 md:mb-0 md:w-72">
          <p className="text-gray-500 font-medium">Outbont Click Landing Page (OCLP)</p>
          <p className="text-gray-500 font-base text-sm">Recommended value {">"} 80%</p>
        </div>
        <div className="relative flex items-center">
          <input
            value={profileData.oclp}
            type="number"
            className="block w-full p-2 rounded-l-md border rounded  border-gray-300 focus:outline-none focus:none focus:border-blue-500"
          />
          <button className="absolute inset-y-0 right-0 inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 bg-blue-400 text-white rounded-r-md">
            %
          </button>
        </div>
      </div>

      <div className="ml-3 mt-5 flex flex-col md:flex-row md:items-center">
        <div className="md:mr-10 mb-3 md:mb-0 md:w-72">
          <p className="text-gray-500 font-medium">Return on AD Spent (ROAS)</p>
          <p className="text-gray-500 font-base text-sm">Recommended value {">"} 3.0x</p>
        </div>
        <div className="relative flex items-center">
          <input
            value={profileData.roas}
            type="number"
            className="block w-full p-2 rounded-l-md border rounded  border-r-0 border-gray-300 focus:outline-none focus:none focus:border-blue-500"
          />
          <button className="absolute inset-y-0 right-0 inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 bg-blue-400 text-white rounded-r-md">
            X
          </button>
        </div> 
      </div>
      
      <div className="ml-3 mt-5 flex flex-col md:flex-row md:items-center">
        <div className="md:mr-10 mb-3 md:mb-0 md:w-72">
          <p className="text-gray-500 font-medium">Cost per Result (CPR)</p>
          <p className="text-gray-500 font-base text-sm">Recommended value {"<"} Rp. 5.000</p>
        </div>
        <div className="relative flex items-center">
          <input
            value={profileData.cpr}
            type="number"
            className="block w-full p-2 rounded-l-md border rounded text-center border-l-0 border-gray-300 focus:outline-none focus:none focus:border-blue-500"
          />
          <button className="absolute inset-y-0 left-0 inline-flex items-center px-4 py-2 border border-r-0 border-gray-300 bg-blue-400 text-white rounded-l-md">
            Rp
          </button>
        </div> 
      </div>  

      <div className="ml-3 mt-5 flex flex-col md:flex-row md:items-center">
        <div className="md:mr-10 mb-3 md:mb-0 md:w-72">
          <p className="text-gray-500 font-medium">Cost per Click (CPC)</p>
          <p className="text-gray-500 font-base text-sm">Recommended value {"<"} Rp. 1.000</p>
        </div>
        <div className="relative flex items-center">
          <input
            value={profileData.cpc}
            type="number"
            className="block w-full p-2 rounded-l-md border rounded text-center border-l-0 border-gray-300 focus:outline-none focus:none focus:border-blue-500"
          />
          <button className="absolute inset-y-0 left-0 inline-flex items-center px-4 py-2 border border-r-0 border-gray-300 bg-blue-400 text-white rounded-l-md">
            Rp
          </button>
        </div> 
      </div>
    </div>


        <div className='flex justify-end items-end gap-5 max-md:grid-cols-7 max-sm:grid-cols-7'>
          {/* button save */}
          <button
            onClick={handleSave}
            className='mt-20 text-white bg-blue-500  flex items-center gap-2  rounded-md py-1 px-6 justify-center transition duration-300 hover:bg-blue-600'
          >
           Save
          </button>
        
        </div>

      </div>
    </main>
  );
};

export default Setting;
