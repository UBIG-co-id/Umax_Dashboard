import React, { useState, useEffect, useRef, useMemo } from "react";
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
import 'react-tabs/style/react-tabs.css';
import { useFormik } from 'formik';
import { Link, useNavigate, useParams, } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';


function DataTable() {
  const [tableData, setTableData] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const navigate = useNavigate();
  
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedObjective, setSelectedObjective] = useState("");
  


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
          `https://umax-1-z7228928.deta.app/campaigns/${_id}`,
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
          <span style={statusStyle}>Draft</span>
        );
      case 3:
        statusStyle = {
          color: '#FF8A00', 
          padding: '2px',
          borderRadius: '7px',
          fontWeight: '500', 
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
        return "Meta Ads";
      case 2:
        return "Google Ads";
      case 3:
        return "Tiktok Ads";
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

  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const objectiveFilter =
      selectedObjective === "1" ? item.objective === 1 : selectedObjective === "2" ? item.objective === 2 :selectedObjective === "3" ? item.objective === 3 : true;
  
      const platformFilter =
      selectedPlatform === "1" ? item.platform === 1 : selectedPlatform === "2" ? item.platform === 2 :selectedPlatform === "3" ? item.platform === 3 : true;
        // selectedPlatform === "" ? true : item.platform === parseInt(selectedPlatform);
  
      return objectiveFilter && platformFilter;
    });
  }, [ selectedObjective, selectedPlatform, tableData]);


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
            {getObjectiveString(row.original.objective)}
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
    pageCount, // Add this function
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: 5 }, // Initial page settings
    },
    useGlobalFilter,
    usePagination // Add this hook
  );
  const handleFilterChangeObjective = (e) => {
    const newValue = e.target.value;
    if (newValue !== selectedObjective) {
      setSelectedObjective(newValue);
    }
  };
  const handleFilterChangePlatform = (e) => {
    const newValue = e.target.value;
    if (newValue !== selectedPlatform) {
      setSelectedPlatform(newValue);
    }
  };
 

  
  useEffect(() => {
    fetchData();
  }, []);



  const toggleAddPopup = () => {
    setShowAddPopup(!showAddPopup);
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
                onChange={handleFilterChangePlatform}
              >
                <option hidden>Platform</option>
                
                <option value="1">Meta Ads</option>
                <option value="2">Google Ads</option>
                <option value="3">Tiktok Ads</option>
              </select>
            </div>

            {/* bagian objective */}
            <div className="relative col-span-6 lg:col-span-2">
              <select
                className="w-full p-2 h-9 text-xs font-medium border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg"
                value={selectedObjective}
                onChange={handleFilterChangeObjective}
              >
                <option hidden>Objective</option>
              
                <option value="1">Awareness</option>
                <option value="2">Conversion</option>
                <option value="3">Consideration</option>
              </select>
            </div>

            {/* div kosong untuk memberi jarak */}
            <div className="hidden lg:flex col-span-1"></div>

            {/* Button add data */}
            <Link to={`/AddCampaigns`}>
            <button
              type="button"
              data-te-ripple-init
              data-te-ripple-color="light"
              data-te-ripple-centered="true"
              className="col-span-8 lg:col-span-2 inline-flex items-center border border-slate-300 h-9 focus:border-gray-500 focus:outline-none focus:ring-0 rounded-md bg-white px-6 pb-2.5 pt-2 text-xs font-medium leading-normal text-gray-800 hover:bg-gray-50"

            >
              <BsPlus className="relative right-5 font-medium text-lg" />
              <span className="relative right-4">Add</span>
            </button>
            </Link>
            {/* menu add data */}

         

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
