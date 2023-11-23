import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { useFormik } from 'formik';
import { Link, useNavigate, useParams, } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

  

function AccountTable() {
  const [tableData, setTableData] = useState([]);
  const tableRef = useRef(null);
  const navigate = useNavigate();
  // url base
  const umaxUrl = 'https://umaxx-1-v8834930.deta.app';
 
  const [showAddPopup, setShowAddPopup] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const handleAddClick = () => {
    navigate('/AddAccounts');
  };

  // GET DATA CLIENT

  
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
            `${umaxUrl}/account-delete/?account_id=${_id}`,
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

  // POST DATA
  
  const toggleAddPopup = () => {
    setShowAddPopup(!showAddPopup);
  };




  // GET DATA
  async function fetchData() {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${umaxUrl}/account-by-tenant`,{
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
    let statusStyle = {}; // Objek gaya status

    switch (status) {
      case 1:
        statusStyle = {
          backgroundColor: "#DFFFDF",
          color: '#00A600',
          border: '0.3px solid #00CA00',
          padding: '5px 13px',
          fontSize: "12px",
          borderRadius: '6px',
          fontWeight: '500', 
        };
        return (
          <span style={statusStyle}>Active</span>
        );
      
      case 2:
        statusStyle = {
          backgroundColor: "#FFF2E8",
          color: '#D4380D', 
          border: '0.3px solid #FF0000',
          padding: '5px 15px',
          fontSize: "12px",
          borderRadius: '6px',
          fontWeight: '500', 
        };
        return (
          <span style={statusStyle}>Deactive</span>
        );
      default:
        return "Unknown";
    }
  };
  const getPlatFormString = (platform) => {
    switch (platform) {
      case 1:
        return "Meta Ads";
      case 2:
        return "Google Ads";
      case 3:
        return "Tiktok Ads";
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

  const filteredData = useMemo(() => {
    if (!tableData || !Array.isArray(tableData)) {
      return [];
    }
  
    return tableData.filter((item) => {
      const statusFilter =
      selectedFilter === "1" ? item.status === 1 : selectedFilter === "2" ? item.status === 2 : true;

    const platformFilter =
    selectedPlatform === "1" ? item.platform === 1 : selectedPlatform === "2" ? item.platform === 2 :selectedPlatform === "3" ? item.platform === 3 : true;
      // selectedPlatform === "" ? true : item.platform === parseInt(selectedPlatform);

    return statusFilter && platformFilter;

    });
  }, [selectedFilter, selectedPlatform, tableData]);

  

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
          <span className="text-blue-700 underline cursor-pointer">
            {getPlatFormString(row.original.platform)}
          </span>
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
              className="bg-red-500 hover:bg-red-500 text-white py-1 px-1 rounded"
            >
              <BsTrash3 />
            </button>
            <Link to={`/updateaccount/${row.original._id}`}>
            <button
              
              className="bg-sky-500 hover:bg-blue-500 text-white py-1 px-1 rounded"
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

  

  

  const handleFilterChange = (e) => {
    const newValue = e.target.value;
    if (newValue !== selectedFilter) {
      setSelectedFilter(newValue);
    }
  };
  const handleFilterChangePlatform = (e) => {
    const newValue = e.target.value;
    if (newValue !== selectedPlatform) {
      setSelectedPlatform(newValue);
    }
  };

  

 

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
    <div>
    <div className="border-2 border-slate-200 bg-white p-0 m-2 lg:m-10 mt-8 rounded-lg relative">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-12 gap-2 px-2 md:px-0 mb-2">
          {/* Search bar */}
          <div className="relative col-span-4 lg:col-span-2">
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
              onChange={handleFilterChangePlatform}
            >
              <option hidden>Platform</option>
              {/* <option value="">All</option> */}
              <option value="1">Meta Ads</option>
              <option value="2">Google Ads</option>
              <option value="3">Tiktok Ads</option>
            </select>
          </div>
          {/* bagian status */}
          <div className="relative col-span-4 lg:col-span-2">
            <select
              className="w-full min-w-0 px-1 h-9 text-xs font-medium border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg"
              value={selectedFilter}
              onChange={handleFilterChange}
            >
              <option hidden>Status</option>
              <option value="1">Active</option>
              <option value="2">DeActive</option>
            </select>
          </div>
          {/* End */}

          <div className="hidden lg:flex col-span-5"></div>


          {/* Button add data */}
          <div className="gap-2 flex lg:justify-end">
          <button
              type="button"
              data-te-ripple-init
              data-te-ripple-color="light"
              data-te-ripple-centered="true"
              className="col-span-4 max-sm:col-span-4 lg:col-span-1 inline-flex flex-1 items-center border border-slate-300 h-9 rounded-md bg-white px-6 pb-2.5 pt-2 text-xs font-medium leading-normal text-gray-800 hover:bg-gray-50"
              onClick={handleAddClick}

            >

              <BsPlus className="font-medium text-lg" />
              <span >Add</span>
            </button>

          {/* menu add data */}
          {/* Pop-up menu */}



          {/* Button export excel */}
          <button
            type="button"
            className=" col-span-2 max-sm:col-span-4 lg:col-span-1 grid place-items-center border border-slate-300 h-9 rounded-md bg-white p-2 hover:bg-gray-50"
            onClick={onDownload}
          >
            <RiFileExcel2Line className="relative font-medium text-lg" />
          </button>
          {/* End */}

          {/* Button export pdf */}
          <button
            type="button"
            className="col-span-2 max-sm:col-span-4 lg:col-span-1 grid place-items-center border border-slate-300 h-9 rounded-md bg-white p-2 hover:bg-gray-50"
            onClick={generatePDF}
          >
            <AiOutlineFilePdf className="relative font-medium text-lg" />
          </button>
          </div>
          {/* End */}
        </div>

        <div className="opacity-0 !w-0 !h-0">

        </div>

        <div className=" w-full rounded-md overflow-hidden outline-none shadow-lg shadow-slate-900/10 border-none max-md:overflow-x-auto" ref={componentPDF}>
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
                      className={`p-2 text-white bg-sky-500 font-normal border-t-0  border-gray-300 border ${column.id === 'status' || column.id === 'action'
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
                    className={`text-gray-600 hover:bg-blue-300 hover:text-gray-700 ${i % 2 === 1 ? 'bg-stone-200' : 'bg-white' // Memberikan latar belakang selang-seling
                      }`}                   >
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className={`p-2  border-gray-200 border-b-0  ${cell.column.id === 'status' || cell.column.id === 'action'
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
    </div>
  );
}

export default AccountTable;
