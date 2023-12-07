import React, { useState, useEffect, useRef, useContext } from 'react';
import { useTable, useGlobalFilter, usePagination } from 'react-table';
// import data from './DataClient';
import { Link, useNavigate, useParams, } from 'react-router-dom';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { BsTrash3, BsPlus } from 'react-icons/bs';
import { CiSearch } from 'react-icons/ci';
import { AiOutlineEdit, AiOutlineFilePdf } from 'react-icons/ai';
import { RiFileExcel2Line } from 'react-icons/ri';
import { useDownloadExcel } from "react-export-table-to-excel";
import { useReactToPrint } from 'react-to-print';
import '../styles.css';
import axios from 'axios';
import { useFormik } from 'formik';




const DataTable = () => {
  // url base
  const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const [selectedClientId, setSelectedClientId] = useState(null);

  // To track the selected client ID for updating
  
  const handleDelete = async (_id) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.delete(
        
        `${umaxUrl}/clients/${_id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Client deleted successfully, you can update your UI or perform any necessary actions.
        fetchData(); // Assuming fetchData is a function to refresh the client list.
      } else {
        // Handle error if necessary
        console.error('Error deleting client:', response.data);
      }
    } catch (error) {
      // Handle any network or other errors
      console.error('Error deleting client:', error);
    }
  };

  async function fetchData() {
    try {
      const response = await fetch(`${umaxUrl}/clients`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  const handleEditClick = (_id) => {
    setSelectedClientId(_id);
  };

  const handleUpdate = async (values) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.put(
        `${umaxUrl}/clients/${selectedClientId}`,
        values, // Send the updated data
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setSelectedClientId(null); // Clear the selected client after successful update
        fetchData(); // Refresh the client list
      } else {
        // Handle error if necessary
        console.error('Error updating client:', response.data);
      }
    } catch (error) {
      // Handle any network or other errors
      console.error('Error updating client:', error);
    }
  };

  const initialValues = selectedClientId
    ? tableData.find((client) => client._id === selectedClientId)
    : {};

  const formik = useFormik({
    initialValues,
    onSubmit: handleUpdate,
  });
 


  


  return (
    <div className="w-full bg-white max-md:overflow-x-scroll" >



      <table className="table-auto border-collapse border w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>address</th>
            <th>contact</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((client) => (
          
              <tr key={client._id}>
                <td>{client._id}</td>
                <td>{client.name}</td>
                <td>{client.address}</td>
                <td>{client.contact}</td>
                <td>{client.status}</td>
                <td>
                <button
                  className="is-info is-light button"
                  onClick={() => handleEditClick(client._id)}
                >
                  Update
                </button>
                  <button
                    className="is-danger is-light button ml-2"
                    onClick={() => handleDelete(client._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
          ))}
        </tbody>
      </table>
      {selectedClientId && (
        <div>
          <form onSubmit={formik.handleSubmit}>
            <input
              type="text"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            {/* Add input fields for other client data */}
            <button type="submit">Update User</button>
          </form>
        </div>
          )}
      DataTable
    </div>
  )
}

export default DataTable