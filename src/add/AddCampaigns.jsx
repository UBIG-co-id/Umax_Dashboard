import React, { useState, useEffect, useRef, useMemo } from "react";
import Navbar from "../components/Navbar";
import CampaignTable from "../components/CampaignTable";
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { BsTrash3, BsPlus } from "react-icons/bs";

const AddCampaigns = () => {
    // url base
    const umaxUrl = 'https://umaxx-1-v8834930.deta.app';

    const navigate = useNavigate();
    const [clientList, setClientList] = useState([]);
    const [accountList, setAccountList] = useState([]);
    // GET DATA CLIENT
    async function fetchClientData() {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch("https://umaxdashboard-1-w0775359.deta.app/clients",
                {
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
    async function fetchAccountData() {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`${umaxUrl}/accounts`, {
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
            setAccountList(data); // Simpan data klien ke dalam state clientList
        } catch (error) {
            console.error("Error fetching Account data:", error.message);
        }
    }
    useEffect(() => {
        fetchAccountData();
    }, []);
    // GET DATA ACCOUNT

    // ADD Data Campaigns
    const formik = useFormik({
        initialValues: {
            name: '',
            objective: '',
            client: '',
            account: '',
            platform: '',
            startdate: '',
            enddate: '',
            status: '',
            notes: '',
        },

            onSubmit: (values) => {
                const token = localStorage.getItem('jwtToken');
                // Send a POST request to your FastAPI backend with form data
                fetch(`${umaxUrl}/campaigns`, {
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
                        navigate('/Campaigns');
                    })
                    .catch(error => {
                        // Handle errors, e.g., network errors
                        console.error(error);
                    });

            },
    });
    // END ADD DATA Campaigns


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
                    <form onSubmit={formik.handleSubmit} className=" bg-white p-5 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
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
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
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
                                    onChange={formik.handleChange}
                                    value={formik.values.objective}
                                    className="px-3 text-slate-500 h-9 w-full border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width">
                                    <option hidden>Select Objective...</option>
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
                                    onChange={formik.handleChange}
                                    value={formik.values.client}
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
                                    onChange={formik.handleChange}
                                    value={formik.values.account}
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
                                    onChange={formik.handleChange}
                                    value={formik.values.platform}
                                    className="px-3 text-slate-500 h-9 w-full border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width">
                                    <option hidden>Select Platform...</option>
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
                                    onChange={formik.handleChange}
                                    value={formik.values.startdate}
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
                                    onChange={formik.handleChange}
                                    value={formik.values.enddate}
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
                                    onChange={formik.handleChange}
                                    value={formik.values.status}
                                    className="px-3 text-slate-500 h-9 w-full border focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width">

                                    <option hidden>Select Status...</option>
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
                                    onChange={formik.handleChange}
                                    value={formik.values.notes}
                                    className="p-2 max-h-md select-custom-width text-slate-500 border focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md"></textarea>
                            </div>


                        </div>  

                        <div className="flex justify-end">
                            {/* Tombol Save */}
                            {/* <button

                            className="bg-red-200 hover:bg-red-300 text-red-600 py-1 px-1 rounded"
                            >
                            <BsTrash3 />
                            </button> */}

                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="text-gray-500 mr-4"
                            >
                                Cancel
                            </button>
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

export default AddCampaigns