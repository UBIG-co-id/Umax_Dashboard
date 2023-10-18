import  {useEffect, React} from 'react'
import { useFormik } from 'formik';
import { Link, useNavigate, useParams, } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ClientsTable from '../components/ClientsTable';

const AddDataClients = () => {
    const navigate = useNavigate();
    // ADD DATA
    const formik = useFormik({
        initialValues: {
            name: '',
            address: '',
            contact: '',
            notes: '',
            status: '',
            is_admin: false,
        },

        onSubmit: (values) => {
            const token = localStorage.getItem('jwtToken');
            fetch('https://umaxdashboard-1-w0775359.deta.app/clients', {
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
                    navigate('/Clients');
                })
                .catch(error => {
                    // Handle errors, e.g., network errors
                    console.error(error);
                });

        },
    });
    // END ADD DATA

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
                                        <label className='pb-2 text-sm ' htmlFor="name">Name</label>
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
                                        <label className='pb-2 text-sm ' htmlFor="address">Address</label>
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
                                        <label className='pb-2 text-sm ' htmlFor="contact">Contact</label>
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
                                        <label className='pb-2 text-sm' htmlFor="status">Status</label>
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
                                        <label className='pb-2 text-sm ' htmlFor="notes">Notes</label>
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
        </main>
    )
}

export default AddDataClients