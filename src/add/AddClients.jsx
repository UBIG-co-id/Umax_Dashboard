import  {useEffect, React, useState} from 'react'
import { useFormik } from 'formik';
import { Link, useNavigate, useParams, } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ClientsTable from '../components/ClientsTable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const AddDataClients = () => {
    // url base
    const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

    const navigate = useNavigate();
    // ADD DATA

    const [passwordMatch, setPasswordMatch] = useState(true);
    const formik = useFormik({
        initialValues: {
            name: '',
            address: '',
            contact: '',
            email: '',
            password: '',
            confirm_password: '',
            notes: '',
            status: '',
            is_admin: false,
        },

        onSubmit: (values) => {
            // Validasi sebelum mengirim data
            if (values.password !== values.confirm_password) {
                setPasswordMatch(false);
                return;
            }
            const token = localStorage.getItem('jwtToken');
            if (
                values.name &&
                values.address &&
                values.contact &&
                values.email &&
                values.password &&
                values.confirm_password &&
                values.notes &&
                values.status
            ) {
                fetch(`${umaxUrl}/client-create`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(values).toString(),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        if (data.message === 'data berhasil ditambah') {
                            navigate('/Clients');
                        }
                        else {
                            // Menampilkan toast ketika data berhasil ditambah
                            toast.success('Data added successfully!', {
                              position: 'top-right',
                            });
                            // navigate('/Accounts');
                          }
                    })
                    .catch(error => {
                        console.error(error);
                        toast.error('Terjadi kesalahan. Silakan coba lagi nanti.', {
                          position: 'top-right',
                        });
                      }); 
            } else {
                toast.warning('Silakan isi semua field yang wajib diisi.', {
                    position: 'top-right',
                });
            }
        },
    });
    // END ADD DATA

    // hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasiPassword, setShowKonfirmasiPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleKonfirmasiPasswordVisibility = () => {
    setShowKonfirmasiPassword(!showKonfirmasiPassword);
  };


    // fungsi untuk menutup page menggunakan esc
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
                    <span className='p-10 relative top-4 text-gray-600 font-medium text-2xl'>Clients</span>
                    <ClientsTable />
                </div>
                <div className="border-2 border-slate-200 bg-white p-0 lg:p-5 m-2 lg:m-10 mt-10 rounded-lg relative">
                    <div className="container mx-auto p-4 px-0">

                        <div className="fixed z-50 inset-0 flex items-center justify-center">

                            <div className="fixed -z-10 inset-0 bg-black bg-opacity-50"></div>
                            <form onSubmit={formik.handleSubmit} className="bg-white p-5 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
                                <h2 className="text-xl font-semibold mb-4" >Clients</h2>
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <div className="flex flex-col">
                                        <label className='pb-2 text-sm' htmlFor="name"><span className='text-red-600 text-lg'>*</span>Name</label>
                                        <input
                                            type="text"
                                            name='name'
                                            id="name"
                                            onChange={formik.handleChange}
                                            value={formik.values.name}
                                            className="p-2 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className='pb-2 text-sm ' htmlFor="address"><span className='text-red-600 text-lg'>*</span>Address</label>
                                        <input
                                            type="text"
                                            name='address'
                                            id="address"
                                            onChange={formik.handleChange}
                                            value={formik.values.address}
                                            className="p-2 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <div className="flex flex-col">
                                        <label className='pb-2 text-sm ' htmlFor="contact"><span className='text-red-600 text-lg'>*</span>Contact</label>
                                        <input
                                            type="number"
                                            id="contact"
                                            name='contact'
                                            onChange={formik.handleChange}
                                            value={formik.values.contact}
                                            className="p-2 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className='pb-2 text-sm' htmlFor="status"><span className='text-red-600 text-lg'>*</span>Status</label>
                                        <select
                                            name="status"
                                            id="status"
                                            onChange={formik.handleChange}
                                            value={formik.values.status}
                                            className="px-3 text-slate-500 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width"
                                        >
                                            <option hidden>Selec Status...</option>
                                            <option value="1">Active</option>
                                            <option value="2">Deactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <div className="flex flex-col">
                                        <label className='pb-2 text-sm ' htmlFor="contact"><span className='text-red-600 text-lg'>*</span>Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name='email'  
                                            onChange={formik.handleChange}
                                            value={formik.values.email}
                                            className="p-2 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                    <label className='pb-2 text-sm ' htmlFor="notes"><span className='text-red-600 text-lg'>*</span>Notes</label>
                                        <textarea
                                            type='text'
                                            name='notes'
                                            id="notes"
                                            onChange={formik.handleChange}
                                            value={formik.values.notes}
                                            className="p-2 max-h-md select-custom-width text-slate-500 border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <div className="flex flex-col">
                                        <label className='pb-2 text-sm ' htmlFor="name"><span className='text-red-600 text-lg'>*</span>Password</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name='password'
                                            id="password"
                                            onChange={formik.handleChange}
                                            value={formik.values.password}
                                            className="p-2 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                                        />
                                      <div
                                        className="relative bottom-6 left-44  cursor-pointer"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                        <AiOutlineEyeInvisible size={15} />
                                        ) : (
                                        <AiOutlineEye size={15} />
                                        )}
                                    </div>

                                    </div>
                                    <div className="flex flex-col">
                                        <label className='pb-2 text-sm ' htmlFor="address"><span className='text-red-600 text-lg'>*</span>Confirm Password</label>
                                        <input
                                                type="password"
                                                name='confirm_password'
                                                id="confirm_password"
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    setPasswordMatch(true);
                                                }}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.confirm_password}
                                                className={`p-2 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md ${
                                                    !passwordMatch && formik.errors.confirm_password
                                                        ? 'border-red-500'
                                                        : ''
                                                }`}
                                            />
                                              <div
                                                className="relative bottom-6 left-44  cursor-pointer"
                                                onClick={toggleKonfirmasiPasswordVisibility}
                                            >
                                                {showKonfirmasiPassword ? (
                                                <AiOutlineEyeInvisible size={15} />
                                                ) : (
                                                <AiOutlineEye size={15} />
                                                )}
                                                
                                            </div>
                                            
                                             {!passwordMatch && (
                                                <span className="text-red-500 text-sm relative bottom-0 left-0 mb-2 ml-2">
                                                Password tidak sama!
                                                </span>
                                                )}
                                    </div>
                                </div>
                               
                                <div className="flex justify-end">
                                    {/* Tombol Save */}
                                    <Link to="/Clients">
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
                                        save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </main>
    )
}

export default AddDataClients