import React, { useState, useEffect, useRef,useMemo } from 'react';
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
import '../styles.css';
import axios from 'axios';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';




function ClientsTable() {
  const [tableData, setTableData] = useState([]);
  const tableRef = useRef(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("");


  const { _id } = useParams();
  const token = localStorage.getItem('jwtToken');
  const [values, setValues] = useState({
    _id: _id,
    name: '',
    address: '',
    contact: '',
    status: '',
    notes: ''
  })
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Bearer ${token}`,
  }
  // UPDATE DATA

  // END UPDATE


  // DELETE
  // Make a DELETE request to the FastAPI endpoint
  const handleDelete = async (_id) => {
    Swal.fire({
      title: 'Anda Yakin?',
      text: 'Anda tidak akan dapat memulihkan data ini!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton: 'custom-confirm-button-class',
        cancelButton: 'custom-cancel-button-class',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
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
            fetchData();
            Swal.fire({
              title: 'Berhasil!',
              text: 'Data Anda telah dihapus.',
              icon: 'success',
              customClass: {
                confirmButton: 'custom-ok-button-class',
              },
            });
          } else {
            Swal.fire('Error', 'An error occurred while deleting the data.', 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'An error occurred while deleting the data.', 'error');
        }
      }
    });
  };

  // END DELETE

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
      fetch('https://umax-1-z7228928.deta.app/clients', {
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
            navigate('/Accounts');
          }
        })
        .catch(error => {
          // Handle errors, e.g., network errors
          console.error(error);
        });

    },
  });
  // END ADD DATA

  // GET DATA
  async function fetchData() {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch("https://umax-1-z7228928.deta.app/clients", {
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
      setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  // END GET DATA



  // UPDATE DATA

  // END UPDATE DATA

  // PAGINATION
  const paginationStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    marginTop: '20px',
  };

  const buttonStyle = {
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '0 5px',
  };

  const disabledButtonStyle = {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  };

  const pageInfoStyle = {
    fontSize: '16px',
    margin: '0 10px',
    color: '#333',
  };
  // END PAGINATION





  const getStatusString = (status) => {
    let statusStyle = {}; // Objek gaya status

    switch (status) {
      case 1:
        statusStyle = {
          color: '#00CA00',
          padding: '2px',
          borderRadius: '7px',
          fontWeight: '500',
        };
        return (
          <span style={statusStyle}>Active</span>
        );
      case 2:
        statusStyle = {
          color: '#8F8F8F',
          padding: '2px',
          borderRadius: '7px',
          fontWeight: '500',
        };
        return (
          <span style={statusStyle}>Deactive</span>
        );

      default:
        return "Unknown";
    }
  };
  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      if (selectedFilter === "1") {
        return item.status === 1;
      } else if (selectedFilter === "2") {
        return item.status === 2;
      } else {
        return true; // Tampilkan semua data jika "All" dipilih
      }
    });
  }, [selectedFilter, tableData]);

  const columns = React.useMemo(
    () => [
      // {
      //   Header: 'Id',
      //   accessor: '_id'
      // },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Address',
        accessor: 'address',
      },
      {
        Header: 'Contact',
        accessor: 'contact',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ row }) => (
          <div className="flex justify-center">
            {getStatusString(row.original.status)}
          </div>
        ),
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => (
          <div className="flex space-x-2 justify-center">
            <button
              onClick={() => handleDelete(row.original._id)}
              className="bg-red-200 hover:bg-red-300 text-red-600 py-1 px-1 rounded"
            >
              <BsTrash3 />
            </button>
            <Link to={`/updateclient/${row.original._id}`}>
              <button

                className="bg-blue-200 hover:bg-blue-300 text-blue-600 py-1 px-1 rounded"
              >
                <AiOutlineEdit />
              </button>
            </Link>

          </div>
        ),
        headerClassName: 'action-column header',
        className: 'action-column',
      },

    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    data,
    page, // Replace 'rows' with 'page' for paginated data
    state: { pageIndex, pageSize, globalFilter }, // Add these state properties
    setGlobalFilter, // Add this function
    gotoPage, // Add this function
    nextPage, // Add this function
    previousPage, // Add this function
    canNextPage, // Add this function
    canPreviousPage, // Add this function
    pageOptions, // Add this function
    pageCount,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,

    usePagination
  );

  // const { globalFilter } = state;

  // const handleEdit = (rowId) => {
  //   console.log('Editing row with ID:', rowId);
  // };

  // const handleDelete = (rowId) => {
  //   const updatedData = tableData.filter((row) => row.id !== rowId);
  //   setTableData(updatedData);
  // };

  // useEffect(() => {
  //   console.log('Selected Status:', selectedStatus);
  //   const filteredData = tableData.filter((row) => {
  //     return selectedStatus === "" || row.status.toString() === selectedStatus;
  //   });
  //   console.log('Filtered Data:', filteredData);
  //   setTableData(filteredData);
  // }, [selectedStatus]);

  const handleFilterChange = (e) => {
    const newValue = e.target.value;
    if (newValue !== selectedFilter) {
      setSelectedFilter(newValue);
    }
  };


  const toggleAddPopup = () => {
    setShowAddPopup(!showAddPopup);
  };


  useEffect(() => {
    const closePopupOnEscape = (e) => {
      if (e.key === "Escape") {
        toggleAddPopup();

      }
    };

    if (showAddPopup) {
      window.addEventListener("keydown", closePopupOnEscape);
    }

    return () => {
      window.removeEventListener("keydown", closePopupOnEscape);
    };
  }, [showAddPopup]);

  //export table ke excel
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "DataClients",
    sheet: "DataClients",
  });

  const componentPDF = useRef();

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Client Data', 14, 15);

    const filteredData = tableData.map((row) => ({
      Name: row.name,
      Address: row.address,
      Contact: row.contact,
      Status: getStatusString(row.status),
    }));

    const tableColumnNames = Object.keys(filteredData[0]);
    const tableColumnValues = filteredData.map((row) => Object.values(row));

    doc.autoTable({
      head: [tableColumnNames],
      body: tableColumnValues,
      startY: 20,
    });

    doc.save('Client.pdf');
  };




  return (
    <div className="border-2 border-slate-200 bg-white p-0 lg:p-5 m-2 lg:m-10 mt-10 rounded-lg relative">
      <div className="container mx-auto p-4 px-0">
        <div className="grid grid-cols-12 gap-2 px-2 md:px-0 -mt-5 mb-2">
          {/* Search bar */}
          <div className="relative col-span-12 lg:col-span-3">
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search"
              className="p-2 w-full min-w-0 h-9 pl-8 text-xs border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg"
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <CiSearch style={{ color: '#9BA0A8' }} />
            </span>
          </div>
          {/* End */}

          {/* bagian status */}
          <div className="relative col-span-12 lg:col-span-3">
            {/* <select
              
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search"
              className="p-2 w-full min-w-0 h-9 pl-8 text-xs border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg"
            >
              <option hidden>Status</option>
              <option value="1">Active</option>
              <option value="2">Deactive</option>
            </select> */}
            <select
              className="w-full min-w-0 px-1 h-9 text-xs font-medium border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg"
              value={selectedFilter}
              onChange={handleFilterChange}
            >
              <option hidden>Status</option>
              <option value="1">Active</option>
              <option value="2">Deactive</option>
            </select>



          </div>
          {/* End */}

          {/* div kosong untuk memberi jarak */}
          <div className="hidden lg:block col-span-2"></div>

          {/* Button add data */}
          <button
            type="button"
            data-te-ripple-init
            data-te-ripple-color="light"
            data-te-ripple-centered="true"
            className="col-span-8 lg:col-span-2 flex items-center gap-2 border border-slate-300 h-9 rounded-md focus:border-gray-500 focus:outline-none focus:ring-0 bg-white p-2 text-xs font-medium leading-normal text-gray-800 hover:bg-gray-50"
            onClick={toggleAddPopup} // Memanggil fungsi toggleAddPopup saat tombol "Add" diklik
          >
            <BsPlus className="font-medium text-lg" />
            <span>Add</span>
          </button>

          {/* menu add data */}




          {/* Pop-up menu */}
          {showAddPopup && (
            <div className="fixed z-50 inset-0 flex items-center justify-center">
              <div className="fixed -z-10 inset-0 bg-black bg-opacity-50"></div>
              <form onSubmit={formik.handleSubmit} className="bg-white p-5 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4" >Client</h2>
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
                  <button
                    type="button"
                    onClick={toggleAddPopup}
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
          )}



          {/* end */}

          {/* Button export excel */}
          <button
            type="button"
            className="col-span-2 lg:col-span-1 grid place-items-center border border-slate-300 h-9 rounded-md bg-white p-2 hover:bg-gray-50"
            onClick={onDownload}
          >
            <RiFileExcel2Line className="relative font-medium text-lg" />
          </button>
          {/* End */}

          {/* Button export pdf */}
          {/* Button export pdf */}
          {/* End */}

          {/* End */}
          <button
            type="button"
            className="col-span-2 lg:col-span-1 grid place-items-center border border-slate-300 h-9 rounded-md bg-white p-2 hover:bg-gray-50"
            onClick={generatePDF}
          >
            <AiOutlineFilePdf className="relative font-medium text-lg" />
          </button>
        </div>

        <div className="w-full bg-white max-md:overflow-x-scroll" ref={componentPDF}>

          <table
            {...getTableProps()}
            ref={tableRef}
            className="table-auto border-collapse border w-full"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className={`p-2 text-white bg-sky-700 font-medium border-slate-300 border ${column.id === 'action' || column.id === 'status'
                        ? 'text-center' // Untuk rata tengah
                        : 'text-left' // Untuk kolom lainnya
                        }`}
                    >
                      {column.render('Header')}
                    </th>

                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className={`border border-slate-300 text-gray-600 hover:bg-blue-300 hover:text-gray-700 ${i % 2 === 0 ? 'bg-gray-100' : 'bg-white' // Memberikan latar belakang selang-seling
                      }`}                  >
                    {row.cells.map((cell) => {
                      return (
                        <td

                          {...cell.getCellProps()}

                          {...cell.getCellProps()}

                          className={`p-2 border border-slate-300 ${cell.column.id === 'status' || cell.column.id === 'action'
                            ? 'text-center action-column' // Terapkan kelas CSS khusus
                            : 'text-left'
                            }`}
                        >
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div style={paginationStyle}>
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            style={{
              ...buttonStyle,
              ...(canPreviousPage ? {} : disabledButtonStyle),
            }}
          >
            {'<<'}
          </button>{' '}
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            style={{
              ...buttonStyle,
              ...(canPreviousPage ? {} : disabledButtonStyle),
            }}
          >
            {'<'}
          </button>{' '}
          <span style={pageInfoStyle}>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            style={{
              ...buttonStyle,
              ...(canNextPage ? {} : disabledButtonStyle),
            }}
          >
            {'>'}
          </button>{' '}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            style={{
              ...buttonStyle,
              ...(canNextPage ? {} : disabledButtonStyle),
            }}
          >
            {'>>'}
          </button>{' '}
        </div>
        {/* End Pagination */}
      </div>
    </div>
  );
}

export default ClientsTable;
