import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';

const Setting = () => {
  const [data, setData] = useState([])
  const { campaign_id } = useParams();
  const token = localStorage.getItem('jwtToken');
  const [values, setValues] = useState({
    campaign_id: campaign_id,
    rar: '',
    ctr: '',
    oclp: '',
    roas: '',
    cpr: '',
    cpc: '',
  })
  const headers = {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
  const navigate = useNavigate();

  const baseUrl = 'https://umaxxnew-1-d6861606.deta.app';


  const [originalProfileData, setOriginalProfileData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    axios.get(`${baseUrl}/metrics-settings-by?campaign_id=${campaign_id}`, {
      headers: headers,
    })
      .then(res =>
        setValues({
          ...values,
          rar: res.data.Data[0].rar,
          ctr: res.data.Data[0].ctr,
          oclp: res.data.Data[0].oclp,
          roas: res.data.Data[0].roas,
          cpr: res.data.Data[0].cpr,
          cpc: res.data.Data[0].cpc,
        }))
      .catch(err => console.log(err))
  }, [])


  // get data
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const token = localStorage.getItem('jwtToken');
  //       const apiUrl = `${baseUrl}/metrics-settings-by?campaign_id=${_id}`;

  //       const response = await axios.get(apiUrl, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       console.log('Respon setting:', response);

  //       const selectedProfile = response.data.Data[0];

  //       setValues({
  //         rar: selectedProfile.rar,
  //         ctr: selectedProfile.ctr,
  //         oclp: selectedProfile.oclp,
  //         roas: selectedProfile.roas,
  //         cpr: selectedProfile.cpr,
  //         cpc: selectedProfile.cpc,
  //       });

  //       // Set originalProfileData setelah mendapatkan data
  //       setOriginalProfileData({
  //         rar: selectedProfile.rar,
  //         ctr: selectedProfile.ctr,
  //         oclp: selectedProfile.oclp,
  //         roas: selectedProfile.roas,
  //         cpr: selectedProfile.cpr,
  //         cpc: selectedProfile.cpc,
  //       });

  //     } catch (error) {
  //       console.error('Error saat mengambil data:', error.message);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // edit setting
  // const handleSave = async () => {
  //   try {
  //     const token = localStorage.getItem('jwtToken');
  //     const apiUrl = (`https://umaxxnew-1-d6861606.deta.app/metrics-settings?campaign_id=65640fccd0fe01897702003e=${_id}`);

  //     const changes = {};
  //     Object.keys(profileData).forEach((key) => {
  //       if (profileData[key] !== originalProfileData[key]) {
  //         changes[key] = profileData[key];
  //       }
  //     });


  //     console.log('Payload Permintaan:', { changes });

  //     const response = await Axios.put(apiUrl, changes, {
  //       headers: {
  //         'accept': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     console.log('Respon Simpan:', response);

  //     // Jika berhasil menyimpan, perbarui originalProfileData
  //     setOriginalProfileData((prevOriginalData) => ({
  //       ...prevOriginalData,
  //       ...changes,
  //     }));
  //   } catch (error) {
  //     console.error('Error saat menyimpan perubahan:', error.message);

  //     if (error.response) {
  //       console.error('Respon Error:', error.response.data);
  //     }
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`https://umaxxnew-1-d6861606.deta.app/metrics-settings?campaign_id=${campaign_id}`, values, { headers })
      .then((res) => {
        navigate('/Dashboards');
      })
      .catch((err) => {
        console.error('Kesalahan pembaruan:', err);
      });
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
                name="rar"
                value={values.rar}
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
                onChange={handleChange}
                name="ctr"
                value={values.ctr}
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
                onChange={handleChange}
                name="oclp"
                value={values.oclp}
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
                onChange={handleChange}
                name="roas"
                value={values.roas}
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
                onChange={handleChange}
                name="cpr"
                value={values.cpr}
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
                onChange={handleChange}
                name="cpc"
                value={values.cpc}
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
            onClick={handleSubmit}
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