import React, { useState, useEffect, useRef } from "react";
import { useTable, useGlobalFilter, usePagination } from "react-table";
// import data from "./CampaignData";
import { BsTrash3, BsPlus } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { AiOutlineEdit, AiOutlineFilePdf } from "react-icons/ai";
import { RiFileExcel2Line } from "react-icons/ri";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { useReactToPrint } from 'react-to-print';
import "../styles.css";
import Select from 'react-select';
import 'react-tabs/style/react-tabs.css';
import { useFormik } from 'formik';
import { Link, useNavigate, useParams, } from 'react-router-dom';
import axios from 'axios';
import styled from "@emotion/styled";


function DataTable() {
  const [tableData, setTableData] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const navigate = useNavigate();
  const [clientList, setClientList] = useState([]);
  const [accountList, setAccountList] = useState([]);
  
  // GET DATA CLIENT
  async function fetchClientData() {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch("https://umax-1-z7228928.deta.app/clients",
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
      setAccountList(data); // Simpan data klien ke dalam state clientList
    } catch (error) {
      console.error("Error fetching Account data:", error.message);
    }
  }
  useEffect(() => {
    fetchAccountData();
  }, []);
  // GET DATA ACCOUNT

// Make a DELETE request to the FastAPI endpoint
const handleDelete = async (_id) => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await axios.delete(
      `https://umax-1-z7228928.deta.app/campaigns/${_id}`,
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
      console.error('Error deleting Campaign:', response.data);
    }
  } catch (error) {
    // Handle any network or other errors
    console.error('Error deleting Campaign:', error);
  }
};
// END DELETE 
// END GET DATA CLIENT
  //ambil data
  async function fetchData() {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch("https://umax-1-z7228928.deta.app/campaigns",{
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
      console.log("Data berhasil diambil:", data); // Menampilkan data di console log
      setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }
  //post data

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
      fetch('https://umax-1-z7228928.deta.app/campaigns', {
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
            navigate('/Campaigns');
          }
        })
        .catch(error => {
          // Handle errors, e.g., network errors
          console.error(error);
        });

    },
  });
  


 


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
          backgroundColor: '#C5FFC5', 
          color: '#00CA00', 
          padding: '2px',
          borderRadius: '7px',
        };
        return (
          <span style={statusStyle}>Active</span>
        );
      case 2:
        statusStyle = {
          backgroundColor: '#C5FFC5', 
          color: '#00CA00', 
          padding: '2px',
          borderRadius: '7px',
        };
        return (
          <span style={statusStyle}>Draft</span>
        );
      case 3:
        statusStyle = {
          backgroundColor: '#C5FFC5', 
          color: '#00CA00', 
          padding: '2px',
          borderRadius: '7px',
        };
        return (
          <span style={statusStyle}>Completed</span>
        );
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
  const getObjectiveString = (objective) => {
    switch (objective) {
      case 1:
        return "Awareness";
      case 2:
        return "Conversion";
      case 3:
        return "Consideration";
      default:
        return "Unknown";
    }
  };
  const columns = React.useMemo(
    () => [
      
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Client",
        accessor: "client",
      },
      {
        Header: "Platform",
        accessor: "platform",
        Cell: ({ row }) => (
          <div className="flex justify-center">
            {getPlatFormString(row.original.platform)}
          </div>
        ),
      },
      {
        Header: "Account",
        accessor: "account",
      },
      {
        Header: "Objective",
        accessor: "objective",
        Cell: ({ row }) => (
          <div className="flex justify-center">
            {getPlatFormString(row.original.objective)}
          </div>
        ),
      },
      {
        Header: "Start Date",
        accessor: "startdate",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => (
          <div className="flex justify-center">
            {getStatusString(row.original.status)}
          </div>
        ),
      },
      {
        Header: "Action",
        accessor: "id",
        Cell: ({ row }) => (
          <div className="flex space-x-2 justify-center">
            <button
               onClick={() => handleDelete(row.original._id)}
              className="bg-red-200 hover:bg-red-300 text-red-600 py-1 px-1 rounded"
            >
              <BsTrash3 />
            </button>
            <Link to={`/updatecampaigns/${row.original._id}`}>
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
    pageCount, // Add this function
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: { pageIndex: 0, pageSize: 5 }, // Initial page settings
    },
    useGlobalFilter,
    usePagination // Add this hook
  );

  // const { globalFilter } = state;

  const handleEdit = (rowId) => {
    console.log("Editing row with ID:", rowId);
  };

  
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = tableData.filter((row) => {
      return selectedPlatform === "" || row.platform === selectedPlatform;
    });
    setTableData(filteredData);
  }, [selectedPlatform]);

  const toggleAddPopup = () => {
    setShowAddPopup(!showAddPopup);
  };

  const handleAddData = () => {
    toggleAddPopup();
  };

  // close pakai esc
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

  const tableRef = useRef(null);

  //export table ke excel
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "DataCampaigns",
    sheet: "DataCampaigns",
  });

  //export table ke pdf

  const componentPDF = useRef();

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Campaign Data', 14, 15);

    const filteredData = tableData.map((row) => ({
      Name: row.name,
      Client: row.client,
      Platform: row.platform,
      Account: row.account,
      Objective: row.objective,
      'Start Date': row.startdate,
      Status: getStatusString(row.status),
    }));

    const tableColumnNames = Object.keys(filteredData[0]);
    const tableColumnValues = filteredData.map((row) => Object.values(row));

    doc.autoTable({
      head: [tableColumnNames],
      body: tableColumnValues,
      startY: 20,
    });

    doc.save('campaigns.pdf');
  };


  // select 2
  const options = [
    { value: 'option1', label: 'PT.Makmur	' },
    { value: 'option2', label: 'Pondok Nurul Huda	' },
    { value: 'option3', label: 'PT Haji Umar Barokah' },
    { value: 'option4', label: 'Pondok Nurul Huda' },
    { value: 'option5', label: 'PT.Makmur' },
    { value: 'option6', label: 'PT.Ubig.co.id' },
  ];
  const options2 = [
    { value: 'option1', label: 'Prasetyo	' },
    { value: 'option2', label: 'Ihsan	' },
    { value: 'option3', label: 'Rochman	' },
    { value: 'option4', label: 'Reivan' },
    { value: 'option5', label: 'M Rizky	' },
    { value: 'option6', label: 'Mahardika	' },
  ];

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 200,
      backgroundColor: '#F1F5F9',
    }),
  };

  const handleSelectChange = (selectedOption, field) => {
    if (field === 'client') {
      setSelectedClient(selectedOption);
    } else if (field === 'account') {
      setSelectedAccount(selectedOption);
    }
  };



  return (
    <div>
      <div className="border-2 border-slate-200 bg-white p-0 lg:p-5 mx-2 mt-8 mb-4 lg:m-10 rounded-lg relative">
        <div className="container mx-auto px-0 p-4">
          <div className="grid grid-cols-12 gap-4 px-1 -mt-5 mb-4 ">
            {/* Search bar */}
            <div className="relative max-lg:mt-5 mediaquery col-span-12 lg:col-span-3">
              <input
                type="text"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search"
                className="min-w-0 w-full p-2 h-9 pl-8 text-xs border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <CiSearch style={{ color: "#9BA0A8" }} />
              </span>
            </div>
            {/* End */}

            {/* bagian platform */}
            <div className="relative col-span-6 lg:col-span-2">
              <select
                className="w-full p-2 h-9 text-xs font-medium border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                <option hidden>Platform</option>
                <option value="Facebook">Meta Ads</option>
                <option value="Instagram">Google Ads</option>
                <option value="Google">Tiktok Ads</option>
              </select>
            </div>

            {/* bagian objective */}
            <div className="relative col-span-6 lg:col-span-2">
              <select
                className="w-full p-2 h-9 text-xs font-medium border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                <option hidden>Objective</option>
                <option value="Awareness">Awareness</option>
                <option value="Conversion">Conversion</option>
                <option value="Consideration">Consideration</option>
              </select>
            </div>

            {/* div kosong untuk memberi jarak */}
            <div className="hidden lg:flex col-span-1"></div>

            {/* Button add data */}
            <button
              type="button"
              data-te-ripple-init
              data-te-ripple-color="light"
              data-te-ripple-centered="true"
              className="col-span-8 lg:col-span-2 inline-flex items-center border border-slate-300 h-9 focus:border-gray-500 focus:outline-none focus:ring-0 rounded-md bg-white px-6 pb-2.5 pt-2 text-xs font-medium leading-normal text-gray-800 hover:bg-gray-50"
              onClick={toggleAddPopup}
            >
              <BsPlus className="relative right-5 font-medium text-lg" />
              <span className="relative right-4">Add</span>
            </button>
            {/* menu add data */}

            {/* Pop-up menu */}
            {showAddPopup && (
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
              className="col-span-2 lg:col-span-1 grid place-items-center border border-slate-300 h-full rounded-md bg-white hover:bg-gray-50"
              onClick={onDownload}
            >
              <RiFileExcel2Line className="relative font-medium text-lg" />
            </button>

            {/* End */}

            {/* Button export pdf */}
            <button
              type="button"
              className="col-span-2 lg:col-span-1 grid place-items-center border border-slate-300 h-full rounded-md bg-white hover:bg-gray-50"
              onClick={generatePDF}
            >
              <AiOutlineFilePdf className="relative font-medium text-lg" />
            </button>
            {/* End */}
          </div>

          <div className="w-full bg-white overflow-x-scroll" ref={componentPDF}>
            <table
              {...getTableProps()}
              ref={tableRef}
              className="table-auto border-collapse border w-full "
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className={` p-2 text-white bg-sky-700 font-normal border-slate-300 border ${column.id === "status" || column.id === "id"
                            ? "place-items-center"
                            : "text-left"
                          }`}
                      >
                        {column.render("Header")}
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
                      className={`border border-slate-300 text-gray-600 hover:bg-blue-300 hover:text-gray-700 ${i % 2 === 0 ? "bg-gray-100" : "bg-white"
                        } `}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <td
                            {...cell.getCellProps()}

                            className={`p-2 border border-slate-300 ${cell.column.id === "status" ||
                                cell.column.id === "action"
                                ? "text-center"
                                : "text-left"
                              }`}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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

export default DataTable;
