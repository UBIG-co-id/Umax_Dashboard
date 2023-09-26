import React, { useState, useEffect, useRef } from 'react';
import { useTable, useGlobalFilter, usePagination } from 'react-table';
// import data from './DataAccount';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { BsTrash3, BsPlus } from 'react-icons/bs';
import { CiSearch } from 'react-icons/ci';
import { AiOutlineEdit, AiOutlineFilePdf, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { RiFileExcel2Line } from 'react-icons/ri';
import { useDownloadExcel } from "react-export-table-to-excel";
import '../styles.css';
import Select from 'react-select';
import { useReactToPrint } from 'react-to-print';
import { useFormik } from 'formik';
import { Link, useNavigate, useParams, } from 'react-router-dom';
import axios from 'axios';

  

function AccountTable() {
  const [tableData, setTableData] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [clientList, setClientList] = useState([]);

  // GET DATA CLIENT
  async function fetchClientData() {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch("https://umax-1-z7228928.deta.app/clients",{
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

   // Make a DELETE request to the FastAPI endpoint
   const handleDelete = async (_id) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.delete(
        `https://umax-1-z7228928.deta.app/accounts/${_id}`,
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
        console.error('Error deleting Account:', response.data);
      }
    } catch (error) {
      // Handle any network or other errors
      console.error('Error deleting Account:', error);
    }
  };
  // END DELETE

  // POST DATA
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    platform: '',
    email: '',
    password: '',
    notes: '',
    status: 1, // Set a default value for status (e.g., Active)
    is_admin: false,
  });
  const toggleAddPopup = () => {
    setShowAddPopup(!showAddPopup);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  // ADD DATA
  const formik = useFormik({
    initialValues: {
      name: '',
      client: '',
      platform: '',
      email: '',
      password: '',
      status: '',
      notes: ''
    },

    onSubmit: (values) => {
      const token = localStorage.getItem('jwtToken');
      // Send a POST request to your FastAPI backend with form data
      fetch('https://umax-1-z7228928.deta.app/accounts', {
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
            navigate('/account');
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
      const response = await fetch("https://umax-1-z7228928.deta.app/accounts",{
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

  const getStatusString = (status) => {
    switch (status) {
      case 1:
        return "Active";
      case 2:
        return "Draft";
      case 3:
        return "Completed";
      default:
        return "Unknown";
    }
  };
  const getPlatFormString = (platform) => {
    switch (platform) {
      case 1:
        return "MetaAds";
      case 2:
        return "GoogleAds";
      case 3:
        return "TiktokAds";
      default:
        return "Unknown";
    }
  };

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Client',
        accessor: 'client',
      },
      {
        Header: 'Platform',
        accessor: 'platform',
        Cell: ({ row }) => (
          <div className="flex justify-center">
            {getPlatFormString(row.original.platform)}
          </div>
        ),
      },
      {
        Header: 'Email',
        accessor: 'email',
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
            <Link to={`/updateaccount/${row.original._id}`}>
            <button
              
              className="bg-blue-200 hover:bg-blue-300 text-blue-600 py-1 px-1 rounded"
            >
              <AiOutlineEdit />
            </button>
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
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
      data: tableData,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    usePagination
  );

  // const { globalFilter } = state;

  const handleEdit = (rowId) => {
    console.log('Editing row with ID:', rowId);
  };

  

  useEffect(() => {
    const filteredData = tableData.filter((row) => {
      return selectedPlatform === "" || row.platform === selectedPlatform;
    });
    setTableData(filteredData);
  }, [selectedPlatform]);

  // const toggleAddPopup = () => {
  //   setShowAddPopup(!showAddPopup);
  // };

  // const handleAddData = () => {
  //   toggleAddPopup();
  // };

  //bagian close pakai esc
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
    filename: "DataAccounts",
    sheet: "DataAccounts",
  });


  // select 2
  const options = [
    { value: 'option1', label: 'PT.Makmur	' },
    { value: 'option2', label: 'Pondok Nurul Huda	' },
    { value: 'option3', label: 'PT Haji Umar Barokah' },
    { value: 'option3', label: 'Pondok Nurul Huda' },
    { value: 'option3', label: 'PT.Makmur' },
    { value: 'option3', label: 'PT.Ubig.co.id' },
  ];

  const [selectedOption, setSelectedOption] = useState(null);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 225,
      backgroundColor: '#F1F5F9',
    }),
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const componentPDF = useRef();


  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Account Data', 14, 15);

    const filteredData = tableData.map((row) => ({
      Name: row.name,
      Client: row.client,
      Platform: row.platform,
      Email: row.email,
      Status: getStatusString(row.status),
    }));

    const tableColumnNames = Object.keys(filteredData[0]);
    const tableColumnValues = filteredData.map((row) => Object.values(row));

    doc.autoTable({
      head: [tableColumnNames],
      body: tableColumnValues,
      startY: 20,
    });

    doc.save('Account.pdf');
  };


  return (
    <div className="border-2 border-slate-200 bg-white p-0 m-2 lg:m-10 mt-8 rounded-lg relative">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-12 gap-2 px-2 md:px-0 mb-2">
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

          {/* Seleksi filter Platform dan objective */}

          {/* bagian platform */}


          {/* bagian Platform */}
          <div className="relative col-span-4 lg:col-span-2">
            <select
              className="w-full min-w-0 px-1 h-9 text-xs font-medium border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
            >
              <option hidden>Platform</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Google">Google</option>
            </select>
          </div>
          {/* bagian status */}
          <div className="relative col-span-4 lg:col-span-2">
            <select
              className="w-full min-w-0 px-1 h-9 text-xs font-medium border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
            >
              <option hidden>Status</option>
              <option value="Facebook">Active</option>
              <option value="Instagram">DeActive</option>
            </select>
          </div>
          {/* End */}

          <div className="hidden lg:block col-span-2"></div>


          {/* Button add data */}
          <button
            type="button"
            data-te-ripple-init
            data-te-ripple-color="light"
            data-te-ripple-centered="true"
            className="col-span-8 lg:col-span-1 flex items-center gap-2 border border-slate-300 h-9 rounded-md focus:border-gray-500 focus:outline-none focus:ring-0 bg-white p-2 text-xs font-medium leading-normal text-gray-800 hover:bg-gray-50"
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
              <form onSubmit={formik.handleSubmit} className=" bg-white p-5 rounded-lg shadow-lg  max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Account</h2>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex flex-col">
                    <label className='pb-2 text-sm ' htmlFor="">Name</label>
                    <input
                      type="text"
                      name='name'
                      id="name"
                      onChange={formik.handleChange}
                      value={formik.values.name}
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
                      onChange={formik.handleChange}
                      value={formik.values.platform}
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
                        onChange={formik.handleChange}
                        value={formik.values.email}
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
                        onChange={formik.handleChange}
                        value={formik.values.password}
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
                      onChange={formik.handleChange}
                      value={formik.values.status}
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
                      onChange={formik.handleChange}
                      value={formik.values.notes}
                      className="p-2 max-h-md w-56 text-slate-500 border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                    ></textarea>
                  </div>



                </div>


                <div className="flex justify-end">
                  {/* Tombol Save */}
                  <button
                    type="button"
                    onClick={toggleAddPopup}
                    className=" text-gray-500 mr-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={onsubmit}
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
          <button
            type="button"
            className="col-span-2 lg:col-span-1 grid place-items-center border border-slate-300 h-9 rounded-md bg-white p-2 hover:bg-gray-50"
            onClick={generatePDF}
          >
            <AiOutlineFilePdf className="relative font-medium text-lg" />
          </button>
          {/* End */}
        </div>

        <div className="opacity-0 !w-0 !h-0">

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
                      className={`p-2 text-white bg-sky-700 font-medium border-slate-300 border ${column.id === 'status' || column.id === 'action'
                        ? 'text-center' //  untuk rata tengah
                        : 'text-left' //  untuk kolom lainnya
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
                      }`}                   >
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className={`p-2 border border-slate-300 ${cell.column.id === 'status' || cell.column.id === 'action'
                            ? 'text-center' //  untuk rata tengah
                            : 'text-left' //  untuk sel lainnya
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

export default AccountTable;
