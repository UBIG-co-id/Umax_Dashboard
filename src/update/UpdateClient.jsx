import axios from 'axios';
import React, { useEffect } from 'react'
import Navbar from '../components/Navbar';
import ClientsTable from '../components/ClientsTable';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2';

const UpdateClient = () => {
    // const [data,setData] =useState([])
    // url base
    const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

    const {client_id} =useParams();
    const {_id} =useParams();
    const token = localStorage.getItem('jwtToken');
    const [values,setValues] = useState({
      _id: _id ,
        name:'',
        address:'',
        contact:'',
        status: '',
        notes: '',
    })
    const headers = {
         'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
    }
    const navigate = useNavigate();
    
   useEffect(()=> {
      axios.get(`${umaxUrl}/client-by-id?client_id=${_id}`, {
        headers: headers,
      })
      .then(res => 
        setValues({
          ...values,
          name: res.data.Data[0].name,
          address: res.data.Data[0].address,
          contact: res.data.Data[0].contact,
          status: res.data.Data[0].status,
          notes: res.data.Data[0].notes
        }))
      .catch(err => console.log(err))
  }, [_id])

  const handleSubmit = (e) => {
    e.preventDefault();

    // Show SweetAlert confirmation
    Swal.fire({
        title: 'Apakah Anda yakin Data And Sudah Benar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            axios.put(`${umaxUrl}/client-edit?client_id=${_id}`, values, { headers })
            .then((res) => {
                // Show success message
                Swal.fire({
                    title: 'Data Berhasil Diperbarui!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/Clients'); // Navigate after OK button clicked
                });
            })
            .catch((err) => console.log(err));
        }
    });
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
              <span className='p-10 relative top-4 text-gray-600 font-medium text-2xl'>Clients</span>
              <ClientsTable />
          </div>
            <div className="fixed z-50 inset-0 flex items-center justify-center">
            <div className="fixed -z-10 inset-0 bg-black bg-opacity-50"></div>
            <form
              onSubmit={handleSubmit}
              className="bg-white p-5 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-xl font-semibold mb-4">Edit Client</h2>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex flex-col">
                      <label className='pb-2 text-sm ' htmlFor="name">Name</label>
                      <input
                        type="text"
                        name='name'
                        id="name"
                        value={values.name}
                        onChange={e=> setValues({...values, name: e.target.value})}
                        className="p-2 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className='pb-2 text-sm ' htmlFor="address">Address</label>
                      <input
                        type="text"
                        name='address'
                        id="address"
                        value={values.address}
                        onChange={e=> setValues({...values, address: e.target.value})}
                        className="p-2 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex flex-col">
                      <label className='pb-2 text-sm ' htmlFor="contact">Contact</label>
                      <input
                        type="text"
                        id="contact"
                        name='contact'
                        value={values.contact}
                        onChange={e=> setValues({...values, contact: e.target.value})}
                        className="p-2 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className='pb-2 text-sm' htmlFor="status">Status</label>
                      <select
                      name="status"
                        id="status"
                        value={values.status}
                        onChange={e=> setValues({...values, status: e.target.value})}
                        className="px-3 text-slate-500 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width"
                      >
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
                        value={values.notes}
                        onChange={e=> setValues({...values, notes: e.target.value})}
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
                      Update
                    </button>
                  </div>
              </form>
              </div>
          </div>
          </main>
    )
}

export default UpdateClient