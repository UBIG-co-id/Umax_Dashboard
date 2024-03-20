import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AiOutlineEdit, AiOutlineFilePdf, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Navbar from "../components/Navbar";
import CampaignTable from "../components/CampaignTable";
import Select from "react-select";
import { useFormik } from 'formik';
import Swal from 'sweetalert2';

const UpdateCampaign = () => {
  // url base
  const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

  const [data, setData] = useState([]);

  const { _id } = useParams();
  const [clientList, setClientList] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const token = localStorage.getItem('jwtToken');
  const [values, setValues] = useState({
    _id: _id,
    name: '',
    objective: '',
    client: '',
    account_id: '',
    platform: '',
    start_date: '',
    end_date: '',
    status: '',
    notes: '',
  })
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Bearer ${token}`,
  }
  const navigate = useNavigate();

  // GET DATA CLIENT
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const apiUrl = `https://umaxxnew-1-d6861606.deta.app/client-by-tenant`;

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'accept': 'application/json',
          },
        });

        setClientList(response.data.Data);
        console.log('Response Account:', response.data);
      } catch (error) {
        console.error('Error saat mengambil data:', error.message);
      }
    };

    fetchData();
  }, []);
  // END GET DATA CLIENT

  // GET DATA ACCOUNT
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const apiUrl = `https://umaxxnew-1-d6861606.deta.app/account-by-tenant`;

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setAccountList(response.data.Data);
        console.log('Response Account:', response.data);
      } catch (error) {
        console.error('Error saat mengambil data:', error.message);
      }
    };

    fetchData();
  }, []);
  // END GET DATA ACCOUNT

  // const formik = useFormik({
  //   initialValues: {
  //     name: "",
  //     account_id: "",
  //     objective: "",
  //     start_date: "",
  //     end_date: "",
  //     status: "",
  //     notes: "",
  //   },

  //   onSubmit: (values) => {
  //     const token = localStorage.getItem("jwtToken");
  //     fetch(`${umaxUrl}campaign-create`, {
  //       method: "POST",
  //       headers: {
  //         accept: "application/json",
  //         "Content-Type": "application/x-www-form-urlencoded",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: new URLSearchParams(values).toString(),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log(data);
  //         if (data.message === "data berhasil ditambah") {
  //         }
  //         navigate("/Campaigns");
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   },
  // });

  useEffect(() => {
    axios.get(`${umaxUrl}/campaign-by-id?campaign_id=${_id}`, {
      headers: headers,
    })
      .then(res => 
        setValues({
          ...values,
          name: res.data.Data[0].name ,
          objective: res.data.Data[0].objective,
          client_id: res.data.Data[0].client_id,
          account_id: res.data.Data[0].account_id,
          platform: res.data.Data[0].platform,
          start_date: res.data.Data[0].start_date,
          end_date: res.data.Data[0].end_date,
          status: res.data.Data[0].status,
          notes: res.data.Data[0].notes ,
        }))
      .catch(err => console.log(err))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Menampilkan alert konfirmasi menggunakan SweetAlert
    Swal.fire({
      title: 'Apakah Anda yakin data Anda sudah benar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Jika diklik OK, kirim data ke server dan tampilkan alert sukses
        axios.put(`https://umaxxnew-1-d6861606.deta.app/campaign-edit?campaign_id=${_id}`, values, { headers })
          .then(res => {
            Swal.fire({
              title: 'Data berhasil diupdate!',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            }).then(() => {
              // Setelah diklik OK, navigasi ke halaman Campaigns
              navigate('/Campaigns');
            });
          })
          .catch(err => console.log(err));
      }
    });
  }
  

  const options = accountList.map(item => ({
    value: item._id,
    label: item.username,
  }));

  const option = clientList.map(item => ({
    value: item._id,
    label: item.name,
  }));

  // style select v2
  const customStyles = {
    control: provided => ({
      ...provided,
      boxShadow: 'none',
      backgroundColor: '#f2f6faff',
      border: '1px solid #cad4e0ff',
      borderRadius: '6px',
    }),
    container: provided => ({
      ...provided,
      height: '50px',
      width: '200px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#4CAF500' : '#fff',
      color: state.isSelected ? '#242424' : '#000',
    }),
    menu: provided => ({
      ...provided,
      zIndex: 999,
      border: '2px solid #eee',
      maxHeight: '200px',
      overflowY: 'hidden',
    }),
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
    <main className="bg-slate-100 min-h-screen">
      <div>
        <Navbar />
        <div className="bg-white min-h-[100vh] w-auto m-2 border rounded-lg">
          <span className="p-10 relative top-4 text-gray-600 font-medium text-2xl">
            Campaigns
          </span>
          <CampaignTable />
        </div>
        <div className="fixed z-50 inset-0 flex items-center justify-center">
          <div className="fixed -z-10 inset-0 bg-black bg-opacity-50"></div>
          <form onSubmit={handleSubmit} className=" bg-white p-5 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Campaign</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col">
                <label className="pb-2 text-sm " htmlFor="">
                  Name
                </label>
                <input
                  type="text"
                  name='name'
                  id="name"
                  value={values.name}
                  onChange={e => setValues({ ...values, name: e.target.value })}
                  className="p-2 h-9 w-full border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label className="pb-2 text-sm " htmlFor="">
                  Objective
                </label>
                <select
                  name="objective"
                  id="objective"
                  value={values.objective}
                  onChange={e => setValues({ ...values, objective: e.target.value })}
                  className="px-3 text-slate-500 h-9 w-full border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width">
                  <option value="1">Awareness</option>
                  <option value="2">Conversion</option>
                  <option value="3">Consideration</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col">
                <label className="pb-2 text-sm" htmlFor="">
                  Client
                </label>
                <Select
                  name="client_id"
                  id="client_id"
                  options={option}
                  styles={customStyles}
                  onChange={(selectedOption) =>
                    setValues({ ...values, client_id: selectedOption.value })
                  }
                  value={option.find((option) => option.value === values.client_id)}
                  className="text-slate-500 h-9 w-full focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width"
                >
                  <option hidden>-Select Client-</option>
                  {option.map(client_id => (
                    <option key={client_id.value} value={client_id.value}>
                      {client_id.label}
                    </option>
                  ))}
                </Select>

              </div>

              <div className="flex flex-col">
                <label className="pb-2 text-sm" htmlFor="">
                  Account
                </label>
                <Select
                  name="account_id"
                  id="account_id"
                  options={options}
                  styles={customStyles}
                  onChange={(selectedOption) =>
                    setValues({ ...values, account_id: selectedOption.value })
                  }
                  value={options.find((options) => options.value === values.account_id)}
                  className="text-slate-500 h-9 w-full focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width"
                >
                  <option hidden>-Select Account-</option>
                  {options.map(account_id => (
                    <option key={account_id.value} value={account_id.value}>
                      {account_id.label}
                    </option>
                  ))}
                </Select>

              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col">
                <label className="pb-2 text-sm " htmlFor="">
                  Platform
                </label>
                <select
                  name="platform"
                  id="platform"
                  value={values.platform}
                  onChange={e => setValues({ ...values, platform: e.target.value })}
                  className="px-3 text-slate-500 h-9 w-full border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width">
                  <option value="1">Meta Ads</option>
                  <option value="2">Google Ads</option>
                  <option value="3">Tiktok Ads</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="pb-2 text-sm " htmlFor="">
                  Start Date
                </label>
                <input
                  type="date"
                  name='start_date'
                  id="start_date"
                  value={values.start_date}
                  onChange={e => setValues({ ...values, start_date: e.target.value })}
                  className="p-2 h-9 select-custom-width text-slate-500 border focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                />
              </div>

            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-4">

              <div className="flex flex-col">
                <label className="pb-2 text-sm " htmlFor="">
                  End Date
                </label>
                <input
                  type="date"
                  name='end_date'
                  id="end_date"
                  value={values.end_date}
                  onChange={e => setValues({ ...values, end_date: e.target.value })}
                  className="p-2 h-9 select-custom-width text-slate-500 border focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label className="pb-2 text-sm " htmlFor="">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={values.status}
                  onChange={e => setValues({ ...values, status: e.target.value })}
                  className="px-3 text-slate-500 h-9 w-full border focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width">

                  <option value="1">Active</option>
                  <option value="2">Draft</option>
                  <option value="3">Complated</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col">
                <label className="pb-2 text-sm " htmlFor="">
                  Notes
                </label>
                <textarea
                  type='text'
                  name='notes'
                  id="notes"
                  value={values.notes}
                  onChange={e => setValues({ ...values, notes: e.target.value })}
                  className="p-2 max-h-md select-custom-width text-slate-500 border focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md"></textarea>
              </div>


            </div>

            <div className="flex justify-end">
              {/* Tombol Save */}
              <Link to="/Campaigns">
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

export default UpdateCampaign