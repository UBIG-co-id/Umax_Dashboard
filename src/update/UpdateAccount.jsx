import axios from 'axios';
import Navbar from '../components/Navbar';
import AccountTable from '../components/AccountTable';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AiOutlineEdit, AiOutlineFilePdf, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Select from "react-select";
import Swal from 'sweetalert2';


const UpdateAccount = () => {
    const [data, setData] = useState([])
    const [passwordMatch, setPasswordMatch] = useState(true);

    const toggleKonfirmasiPasswordVisibility = () => {
        setShowKonfirmasiPassword(!showKonfirmasiPassword);
    };

    // url base
    const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

    const { _id } = useParams();
    const [clientList, setClientList] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showKonfirmasiPassword, setShowKonfirmasiPassword] = useState(false);
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

                setData(response.data.Data);
                console.log('Response Account:', response.data);
            } catch (error) {
                console.error('Error saat mengambil data:', error.message);
            }
        };

        fetchData();
    }, []);
    // END GET DATA CLIENT

    useEffect(() => {
        axios.get(`${umaxUrl}/account-by-id?account_id=${_id}`, {
            headers: headers,
        })
            .then(res =>
                setValues({
                    ...values,
                    username: res.data.Data[0].username,
                    id_client: res.data.Data[0].id_client,
                    platform: res.data.Data[0].platform,
                    email: res.data.Data[0].email,
                    password: res.data.Data[0].password,
                    confirm_password: res.data.Data[0].confirm_password,
                    notes: res.data.Data[0].notes,
                    status: res.data.Data[0].status,
                }))
            .catch(err => console.log(err))
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (values.password !== values.confirm_password) {
            setPasswordMatch(false); // Set passwordMatch menjadi false jika password tidak cocok
            return; // Keluar dari handleSubmit jika password tidak cocok
        }
    
        // Tampilkan alert warning
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
                // Lanjutkan dengan pengiriman data jika user menekan OK
                axios.put(`https://umaxxnew-1-d6861606.deta.app/account-edit?account_id=${_id}`, values, { headers })
                    .then((res) => {
                        // Tampilkan alert berhasil
                        Swal.fire({
                            title: 'Data berhasil diupdate!',
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Navigasi ke halaman Account jika user menekan OK
                                navigate('/Accounts');
                            }
                        });
                    })
                    .catch((err) => {
                        console.error('Kesalahan pembaruan:', err);
                    });
            }
        });
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const option = data.map(item => ({
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
                                    value={values.username}
                                    onChange={e => setValues({ ...values, username: e.target.value })}
                                    className="p-2 h-9 w-56 border focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="pb-2 text-sm" htmlFor="client">
                                    Client
                                </label>
                                <Select
                                    name="client"
                                    id="client"
                                    options={option}
                                    styles={customStyles}
                                    onChange={(selectedOption) =>
                                        setValues({ ...values, client: selectedOption.value })
                                    }
                                    value={option.find((option) => option.value === values.client)}
                                    className="text-slate-500 h-9 w-full focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width"
                                >
                                    <option hidden>-Select Client-</option>
                                    {option.map(client => (
                                        <option key={client.value} value={client.value}>
                                            {client.label}
                                        </option>
                                    ))}
                                </Select>

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
                                            <AiOutlineEye size={15} />
                                        ) : (
                                            <AiOutlineEyeInvisible size={15} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="pb-2 text-sm" htmlFor="">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showKonfirmasiPassword ? 'text' : 'password'}
                                        id="confirm_password"
                                        name="confirm_password"
                                        onChange={e => setValues({ ...values, confirm_password: e.target.value })}
                                        value={values.confirm_password}
                                        placeholder="Konfirmasi Password"
                                        className="p-2 h-9 w-56 border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md pr-10"
                                    />
                                    <div
                                        className="absolute top-3 right-2  cursor-pointer"
                                        onClick={toggleKonfirmasiPasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <AiOutlineEye size={15} />
                                        ) : (
                                            <AiOutlineEyeInvisible size={15} />
                                        )}
                                    </div>
                                    {/* {!passwordMatch && (
                                        <span className="text-red-500 text-sm relative bottom-0 left-0 mb-2 ml-2">
                                            Password tidak sama!
                                        </span>
                                    )} */}
                                </div>
                                {!passwordMatch && (
                                    <span className="text-red-500 text-sm relative bottom-0 left-0 mb-2 ml-2">
                                        Password tidak sama!
                                    </span>
                                )}
                            </div>
                        </div>



                        <div className="flex flex-col md:flex-row gap-4 mb-4">
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