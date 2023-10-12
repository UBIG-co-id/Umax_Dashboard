import axios from 'axios';
import Navbar from '../components/Navbar';
import AccountTable from '../components/AccountTable';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AiOutlineEdit, AiOutlineFilePdf, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const UpdateAccount = () => {
    // const [data,setData] =useState([])
    const { _id } = useParams();
    const [clientList, setClientList] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const token = localStorage.getItem('jwtToken');
    const [values, setValues] = useState({
        _id: _id,
        name: '',
        id_client: '',
        platform: '',
        email: '',
        password: '',
        notes: '',
        status: '',
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
            const response = await fetch("https://umax-1-z7228928.deta.app/clients",{headers});
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

    useEffect(() => {
        axios.get('https://umax-1-z7228928.deta.app/accounts/' + _id, {headers})
            .then(res =>
                setValues({
                    ...values,
                    name: res.data.name,
                    id_client: res.data.id_client,
                    platform: res.data.platform,
                    email: res.data.email,
                    password: res.data.password,
                    notes: res.data.notes,
                    status: res.data.status,
                }))
            .catch(err => console.log(err))
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('https://umax-1-z7228928.deta.app/accounts/' + _id, values, { headers })
            .then(res => {
                navigate('/Accounts');
            })
            .catch(err => console.log(err))
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    return (
        <main className='bg-slate-100 min-h-screen'>
      <div>
        <Navbar />
        <div className='bg-white h-screen w-auto m-2 border rounded-lg'>
          <span className='p-10 relative top-4 text-gray-600 font-medium text-2xl'>Accounts</span>
          <AccountTable />
        </div>
        <div className="fixed z-50 inset-0 flex items-center justify-center">
            <div className="fixed -z-10 inset-0 bg-black bg-opacity-50"></div>
            <form onSubmit={handleSubmit} className=" bg-white p-5 rounded-lg shadow-lg  max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Account</h2>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex flex-col">
                        <label className='pb-2 text-sm ' htmlFor="">Name</label>
                        <input
                            type="text"
                            name='name'
                            id="name"
                            value={values.name}
                            onChange={e => setValues({ ...values, name: e.target.value })}
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
                            value={values.id_client}
                            onChange={e => setValues({ ...values, id_client: e.target.value })}
                            className="px-3 text-slate-500 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width"
                        >
                            <option hidden>Select Client</option>
                            {clientList.map((client) => (
                                <option key={client._id} value={client._id}>
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

                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex flex-col">
                        <label className='pb-2 text-sm ' htmlFor="">Platform</label>
                        <select
                            name="platform"
                            id="platform"
                            value={values.platform}
                            onChange={e => setValues({ ...values, platform: e.target.value })}
                            className="px-3 text-slate-500 h-9 w-56 border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md "
                        >
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
                                value={values.email}
                                onChange={e => setValues({ ...values, email: e.target.value })}
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
                                value={values.password}
                                onChange={e => setValues({ ...values, password: e.target.value })}
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
                            value={values.status}
                            onChange={e => setValues({ ...values, status: e.target.value })}
                            className="px-3 text-slate-500 h-9 w-56 border focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md "
                        >
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
                            value={values.notes}
                            onChange={e => setValues({ ...values, notes: e.target.value })}
                            className="p-2 max-h-md w-56 text-slate-500 border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                        ></textarea>
                    </div>
                </div>
                <div className="flex justify-end">
                    {/* Tombol Save */}
                    <Link to="/Accounts">
                        <button
                            type="button"
                            // onClick={toggleEditPopup}
                            className="text-gray-500 mr-4"
                        >
                            Cancel
                        </button>
                    </Link>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
        </div>
        </main>
    )
}

export default UpdateAccount