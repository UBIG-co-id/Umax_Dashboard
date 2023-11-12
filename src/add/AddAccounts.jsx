import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar';
import AccountTable from '../components/AccountTable';
import { useFormik } from 'formik';
import { Link, useNavigate, useParams, } from 'react-router-dom';
import { AiOutlineEdit, AiOutlineFilePdf, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const AddDataAccounts = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [clientList, setClientList] = useState([]);
  // url base
  const umaxUrl = 'https://umaxx-1-v8834930.deta.app';

  // GET DATA CLIENT
  async function fetchClientData() {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${umaxUrl}/clients`, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setClientList(data); // Simpan data klien ke dalam state clientList
    } catch (error) {
      console.error("Error fetching client data:", error.message);
    }
  }
  useEffect(() => {
    fetchClientData();
  }, []);
  // END GET DATA CLIENT

  // ADD DATA
  const formik = useFormik({
    initialValues: {
      name: '',
      client: '',
      platform: '',
      email: '',
      password: '',
      status: '',
      notes: ''
    },

    onSubmit: (values) => {
      const token = localStorage.getItem('jwtToken');
      // Send a POST request to your FastAPI backend with form data
      fetch(`${umaxUrl}/accounts`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
        },
        body: new URLSearchParams(values).toString(),
      })

        .then(response => response.json())
        .then(data => {
          // Handle the response from the backend (e.g., success message or error)
          console.log(data);
          if (data.message === 'data berhasil ditambah') {
            // Redirect to the dashboard page
          }
          navigate('/Accounts');
        })
        .catch(error => {
          // Handle errors, e.g., network errors
          console.error(error);
        });

    },
  });
  // END ADD DATA
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // close menggunakan esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        console.log("Esc key pressed");
        navigate(-1);
      };
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);


  return (
    <main className='bg-slate-100 min-h-screen overflow-hidden'>
      <div>
        <Navbar />
        <div className='bg-white overflow-hidden h-screen w-auto m-2 border rounded-lg'>
          <span className='p-10 relative top-4 text-gray-600 font-medium text-2xl'>Accounts</span>
          <AccountTable />
        </div>
        <div className="fixed z-50 inset-0 flex items-center justify-center">
          <div className="fixed -z-10 inset-0 bg-black bg-opacity-50"></div>
          <form onSubmit={formik.handleSubmit} className=" bg-white p-5 rounded-lg shadow-lg  max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Account</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col">
                <label className='pb-2 text-sm ' htmlFor="">Name</label>
                <input
                  type="text"
                  name='name'
                  id="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  className="p-2 h-9 w-56 border focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label className="pb-2 text-sm" htmlFor="client">
                  Client
                </label>
                <select
                  name="client"
                  id="client"
                  onChange={formik.handleChange}
                  value={formik.values.client}
                  className="px-3 text-slate-500 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width"
                >
                  <option hidden>Select Client...</option>
                  {clientList.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>

                {/* <Select
                      options={options}
                      value={selectedOption}
                      onChange={handleSelectChange}
                      styles={customStyles}
                      isSearchable
                      placeholder="‎"
                    /> */}

              </div>
            </div>
            {/* </div> */}

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col">
                <label className='pb-2 text-sm ' htmlFor="">Platform</label>
                <select
                  name="platform"
                  id="platform"
                  onChange={formik.handleChange}
                  value={formik.values.platform}
                  className="px-3 text-slate-500 h-9 w-56 border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md "
                >
                  <option hidden>Select Platform...</option>
                  <option value="1">Meta Ads</option>
                  <option value="2">Google Ads</option>
                  <option value="3">Tiktok Ads</option>
                </select>
              </div>

              <div className='flex' >
                <div className="flex flex-col">
                  <label className='pb-2 text-sm ' htmlFor="">Email</label>
                  <input type="email"
                    name='email'
                    id="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    className="px-3 text-slate-500 rounded-md w-56 h-9 border focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 "
                  />
                </div>
              </div>

            </div>



            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col">
                <label className="pb-2 text-sm" htmlFor="">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    id="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    className="p-2 h-9 w-56 border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md pr-10"
                  />
                  <div
                    className="absolute top-3 right-2  cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={15} />
                    ) : (
                      <AiOutlineEye size={15} />
                    )}
                  </div>
                </div>
              </div>



              <div className="flex flex-col">
                <label className='pb-2 text-sm' htmlFor="">Status</label>
                <select
                  name="status"
                  id="status"
                  onChange={formik.handleChange}
                  value={formik.values.status}
                  className="px-3 text-slate-500 h-9 w-56 border focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md "
                >
                  <option hidden>Select Status...</option>
                  <option value="1">Active</option>
                  <option value="2">Deactive</option>
                </select>
              </div>
            </div>



            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col">
                <label className='pb-2 text-sm ' htmlFor="">Notes</label>
                <textarea
                  name='notes'
                  id="notes"
                  onChange={formik.handleChange}
                  value={formik.values.notes}
                  className="p-2 max-h-md w-56 text-slate-500 border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                ></textarea>
              </div>



            </div>


            <div className="flex justify-end">
              {/* Tombol Save */}
              <Link to="/Accounts">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-gray-500 mr-4"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"

                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default AddDataAccounts