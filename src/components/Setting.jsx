import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const Setting = ({ campaign_id, onSave, updateSelectedName, setMetricId }) => {
  const [data, setData] = useState([])
  const location = useLocation();
  const [settingData, setSettingData] = useState();
  const [ selectedData, setSelectedData] = useState();

  // const { campaign_id } = useParams();
  const token = localStorage.getItem('jwtToken');
  const [values, setValues] = useState({
    // campaign_id: campaign_id,
    rar: '',
    ctr: '',
    oclp: '',
    roas: '', // Use parseFloat for floating-point numbers
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
  }, [campaign_id])


  //   const handleSubmit = async () => {
  //     try {
  //       const convertedValues = {
  //         rar: parseInt(values.rar),
  //         ctr: parseInt(values.ctr),
  //         oclp: parseInt(values.oclp),
  //         roas: parseFloat(values.roas),
  //         cpr: parseInt(values.cpr),
  //         cpc: parseInt(values.cpc),
  //       };

  //     // axios.put(`${baseUrl}/metrics-settings?campaign_id=${campaign_id}`, convertedValues, { headers })
  //     await axios.put(`${baseUrl}/metrics-settings?campaign_id=${campaign_id}`, convertedValues, { 
  //       headers: {
  //       Authorization: `Bearer ${token}`,
  //       'accept': 'application/json',
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //   }, 

  // })
  //     .then((res) => {
  //       // Update the local state with the edited values from the response
  //       setValues({
  //         rar: values.rar,
  //         ctr: values.ctr,
  //         oclp: values.oclp,
  //         roas: values.roas,
  //         cpr: values.cpr,
  //         cpc: values.cpc,
  //       });
  //       navigate(`/Dashboard/${campaign_id}`);
  //     })

  //     .catch((err) => {
  //       console.error('Error updating:', err);
  //     });
  // };
  const handleSubmit = async () => {
    try {
      const convertedValues = {
        rar: parseInt(values.rar),
        ctr: parseInt(values.ctr),
        oclp: parseInt(values.oclp),
        roas: parseFloat(values.roas),
        cpr: parseInt(values.cpr),
        cpc: parseInt(values.cpc),
      };

      await axios.put(
        `${baseUrl}/metrics-settings?campaign_id=${campaign_id}`,
        convertedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      // Tampilkan SweetAlert jika berhasil
      Swal.fire({
        icon: 'success',
        title: 'Data Berhasil Disimpan',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          // sessionStorage.setItem('selectedData', JSON.stringify(selectedData));
          // Navigasi ke Dashboard dengan campaign_id yang dipilih
          navigate('/Dashboard');
          window.location.reload();
        }
      });
      updateSelectedName(selectedData); 
      setMetricId(selectedData.campaign_id);
    } catch (error) {
      console.error('Error updating:', error);
      // Anda juga dapat menampilkan SweetAlert error di sini jika diperlukan
    }
  };




  return (
    <main className='min-h-screen'>
      <div className="p-3 min-h-screen rounded-md border border-gray-300 bg-white ">
        <form
          onSubmit={handleSubmit}
        >
          <div className='flex flex-col gap-3'>

            <div className="ml-3 mt-5 flex flex-col md:flex-row md:items-center">
              <div className="md:mr-10 mb-3 md:mb-0 md:w-72">
                <p className="text-gray-500 font-medium">Reach Amount Ratio (RAR)</p>
                <p className="text-gray-500 font-base text-sm">Recommended value {'>'} 5%</p>
              </div>
              <div className="relative flex items-center">
                <input
                  // onChange={handleChange}
                  type="number"
                  name="rar"
                  id="rar"
                  value={values.rar}
                  onChange={e => setValues({ ...values, rar: e.target.value })}
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
              type="button"
              onClick={handleSubmit}
              className='mt-20 text-white bg-blue-500  flex items-center gap-2  rounded-md py-1 px-6 justify-center transition duration-300 hover:bg-blue-600'
            // onClick={handleSaveButtonClick}
            >
              Save
            </button>

          </div>
        </form>

      </div>
    </main>

  );
};

export default Setting