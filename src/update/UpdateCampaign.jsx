import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AiOutlineEdit, AiOutlineFilePdf, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Navbar from "../components/Navbar";
import CampaignTable from "../components/CampaignTable";

const UpdateCampaign = () => {
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
        account: '',
        platform: '',
        startdate: '',
        enddate: '',
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
    async function fetchClientData() {
        try {
            const response = await fetch("https://umaxdashboard-1-w0775359.deta.app/clients",{headers});
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

    // GET DATA ACCOUNT
    async function fetchAccountData() {
        try {
          const response = await fetch("https://umaxdashboard-1-w0775359.deta.app/accounts",{headers});
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
          }
          const data = await response.json();
          setAccountList(data); // Simpan data klien ke dalam state clientList
        } catch (error) {
          console.error("Error fetching Account data:", error.message);
        }
      }
      useEffect(() => {
        fetchAccountData();
      }, []);
// END GET DATA ACCOUNT
    useEffect(() => {
        axios.get('https://umaxdashboard-1-w0775359.deta.app/campaigns/' + _id,{headers})
            .then(res =>
                setValues({
                    ...values,
                    name: res.data.name,
                    objective: res.data.objective,
                    client: res.data.client,
                    account: res.data.account,
                    platform: res.data.platform,
                    startdate: res.data.startdate,
                    enddate: res.data.enddate,
                    status: res.data.status,
                    notes: res.data.notes,
                }))
            .catch(err => console.log(err))
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('https://umaxdashboard-1-w0775359.deta.app/campaigns/' + _id, values, { headers })
            .then(res => {
                navigate('/Campaigns');
            })
            .catch(err => console.log(err))
    }
   
    
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
                      <select
                      name="client"
                      id="client"
                      value={values.client}
                            onChange={e => setValues({ ...values, client: e.target.value })}
                      className="px-3 text-slate-500 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width"
                    >
                      <option hidden>Select Client</option>
                      {clientList.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>

                    </div>

                    <div className="flex flex-col">
                      <label className="pb-2 text-sm" htmlFor="">
                        Account
                      </label>
                      <select
                      name="account"
                      id="account"
                      value={values.account}
                            onChange={e => setValues({ ...values, account: e.target.value })}
                      className="px-3 text-slate-500 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width"
                    >
                      <option hidden>Select Account</option>
                      {accountList.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </select>

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
                        type="datetime-local"
                        name='startdate'
                      id="startdate"
                      value={values.startdate}
                            onChange={e => setValues({ ...values, startdate: e.target.value })}
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
                        type="datetime-local"
                        name='enddate'
                      id="enddate"
                      value={values.enddate}
                            onChange={e => setValues({ ...values, enddate: e.target.value })}
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