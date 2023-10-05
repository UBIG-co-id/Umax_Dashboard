import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'

const UpdateClient = () => {
    // const [data,setData] =useState([])
    const {_id} =useParams();
    const token = localStorage.getItem('jwtToken');
    const [activePage, setActivePage] = useState('clients');
    const [values,setValues] = useState({
        _id:_id,
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
    axios.get('https://umax-1-z7228928.deta.app/clients/'+_id,{
      headers:headers,
    })
    .then(res => 
        setValues({...values, 
            name:res.data.name, 
            address:res.data.address, 
            contact:res.data.contact, 
            status:res.data.status,
            notes:res.data.notes }))
    .catch(err => console.log(err))
   },[])

    const handleSubmit =(e) => {
        e.preventDefault();
        axios.put ('https://umax-1-z7228928.deta.app/clients/'+_id,values,{headers})
        .then(res => {
            navigate('/Clients');
        })
        .catch(err => console.log(err))
        setActivePage('clients');
    }
    
    return (
        <div>
        
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
                        type="number"
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
                    <Link to="/clients">
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
    )
}

export default UpdateClient