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
 
  const [tableData, setTableData] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const tableRef = useRef(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const navigate = useNavigate();
  const [errorMesssage, setErrorMesssage] = useState("");

  const handleDelete = async (_id) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.delete(
        `https://umax-1-z7228928.deta.app/clients/${_id}`,
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
      const response = await fetch("https://umax-1-z7228928.deta.app/clients");
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
  return (
    <div className="w-full bg-white max-md:overflow-x-scroll" >
      <table className="table-auto border-collapse border w-full">
        <thead>
          <tr>
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
              <td>{client.name}</td>
              <td>{client.address}</td>
              <td>{client.contact}</td>
              <td>{client.status}</td>
              <td>
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
      DataTable
    </div>
  )
}

export default DataTable