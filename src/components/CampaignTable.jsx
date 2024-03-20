import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTable, useGlobalFilter, usePagination } from "react-table";
// import data from "./CampaignData";
import { BsTrash3, BsPlus } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
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
import '../styles.css';



function DataTable({ user }) {
  const [tableData, setTableData] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const navigate = useNavigate();

  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Tambah state untuk alert

  const [currentLocale, setCurrentLocale] = useState("en-US"); // Default to English
  const toggleLocale = () => {
    const newLocale = currentLocale === "en-US" ? "id-ID" : "en-US";
    setCurrentLocale(newLocale);
  };

  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedObjective, setSelectedObjective] = useState("");
  const [userRole, setUserRole] = useState("");

  // url base
  const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

  const handleAddClick = () => {
    navigate('/AddCampaigns');
  };

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
            `${umaxUrl}/campaign-delete?campaign_id=${_id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('Delete response:', response);

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
            Swal.fire({
              title: 'Error!',
              text: 'Maaf Anda Tidak Dapat Menghapus Data.',
              icon: 'error',
              customClass: {
                confirmButton: 'custom-error-button-class',
              },
            });
          }
        } catch (error) {
          Swal.fire('Error', 'Terjadi kesalahan saat menghapus data.', 'error');
        }
      }
    });
  };

  // END DELETE 

  // GET CLIENT

  async function fetchData() {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch("https://umaxxnew-1-d6861606.deta.app/client-by-tenant", {
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
      console.log('response = ', data.Data);
      setTableData(data.Data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // END GET DATA CLIENT


  //GET DATA
  async function fetchData() {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch("https://umaxxnew-1-d6861606.deta.app/campaign-by-tenant", {
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
      console.log('response = ', data.Data);
      setTableData(data.Data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  // END GET

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
      fetch('https://umaxxnew-1-d6861606.deta.app/campaigns', {
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
          console.log(data);
          if (data.message === 'data berhasil ditambah') {
            // Step 4: Set the state to show the alert
            setShowSuccessAlert(true);

            // Step 5: Set a timeout to hide the alert after a few seconds
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 5000); // Hide the alert after 5 seconds (you can adjust the duration)
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
  });


  useEffect(() => {
    if (showSuccessAlert) {
      // Set timeout untuk menyembunyikan alert setelah beberapa detik
      const timeoutId = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000); // Contoh: alert akan hilang setelah 5 detik
      return () => clearTimeout(timeoutId);
    }
  }, [showSuccessAlert]);


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
          backgroundColor: "#DCDCDC",
          color: '#6F6F6F',
          border: '0.3px solid #868686',
          padding: '5px 15px',
          fontSize: "12px",
          borderRadius: '6px',
          fontWeight: '500',
        };
        return (
          <span style={statusStyle}>Draft</span>
        );
      case 3:
        statusStyle = {
          backgroundColor: "#FFF2D1",
          color: '#E29117',
          border: '0.3px solid #FF6B00',
          padding: '4px 10px',
          fontSize: "12px",
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
        selectedObjective === "1" ? item.objective === 1 : selectedObjective === "2" ? item.objective === 2 : selectedObjective === "3" ? item.objective === 3 : true;

      const platformFilter =
        selectedPlatform === "1" ? item.platform === 1 : selectedPlatform === "2" ? item.platform === 2 : selectedPlatform === "3" ? item.platform === 3 : true;
      // selectedPlatform === "" ? true : item.platform === parseInt(selectedPlatform);

      return objectiveFilter && platformFilter;
    });
  }, [selectedObjective, selectedPlatform, tableData]);


  useEffect(() => {
    // Disini, userRole diatur berdasarkan peran pengguna yang disediakan oleh sistem autentikasi
    if (user && user.role) {
      setUserRole(user.role);
    }
  }, [user]);

  const columns = React.useMemo(
    () => [

      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) => (
          <div className="flex justify-start"> {/* Mengubah justify-center menjadi justify-start */}
            <Link to={`/updatecampaigns/${row.original._id}`} className="underline">{row.original.name}</Link>
          </div>
        ),
      },
      {
        Header: "Client",
        accessor: "client_name",
      },
      {
        Header: "Platform",
        accessor: "platform",
        Cell: ({ row }) => (
          <div className="flex justify-center">
            <span className="text-blue-700 underline cursor-pointer">
              {getPlatFormString(row.original.platform)}
            </span>
          </div>
        ),
      },
      {
        Header: "Account",
        accessor: "account_name",
      },
      {
        Header: "Objective",
        Cell: ({ row }) => (
          <div className="flex text-red-900 justify-center">
            {getObjectiveString(row.original.objective)}
          </div>
        ),
        accessor: "objective",
        Cell: ({ row }) => (
          <div className="flex justify-center">
            {getObjectiveString(row.original.objective)}
          </div>
        ),
      },
      {
        Header: "Start Date",
        accessor: "start_date",
        // Cell: ({ value }) => {
        //   const date = new Date(value);
        //   const formattedTime = date.toLocaleTimeString('id-ID', { year:'numeric', day: '2-digit',month: '2-digit', hour: '2-digit', minute: '2-digit' });
        //   return <div className="flex justify-center">{formattedTime}</div>;
        // },
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
            {/* {(userRole === "admin" || userRole === "super_admin") && ( */}
              <button
                onClick={() => handleDelete(row.original._id)}
                className="bg-red-500 hover:bg-red-500 text-white py-1 px-1 rounded"
              >
                <BsTrash3 />
              </button>
            {/* )} */}

            <Link to={`/updatecampaigns/${row.original._id}`}>
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
    <div className="border-2 border-slate-200  p-0 m-2 lg:m-10 mt-8 rounded-lg relative">
      {showSuccessAlert && (
        <div className="bg-green-200 border-green-500 text-green-700 border rounded p-2 mt-2">
          Data berhasil ditambah!
        </div>
      )}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-12 gap-3 px-2 md:px-0 mb-2">
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
              <CiSearch style={{ color: "#9BA0A8" }} />
            </span>
          </div>
          {/* End */}

          {/* bagian platform */}
          <div className="relative col-span-4 lg:col-span-2">
            <select
              className="w-full min-w-0 px-1 h-9 text-xs font-medium border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg"
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
          <div className="relative col-span-4 lg:col-span-2">
            <select
              className="w-full min-w-0 px-1 h-9 text-xs font-medium border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg"
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
          <div className="hidden lg:flex col-span-5 "></div>



          {/* Button add data */}
          <div className="gap-2 flex lg:justify-end">
            <button
              type="button"
              data-te-ripple-init
              data-te-ripple-color="light"
              data-te-ripple-centered="true"
              className="inline-flex flex-1 items-center border border-slate-300 h-9 rounded-md bg-white px-6 pb-2.5 pt-2 text-xs font-medium leading-normal text-gray-800 hover:bg-gray-50"
              onClick={handleAddClick}

            >
              <BsPlus className="font-medium text-lg" />
              <span >Add</span>
            </button>
            {/* menu add data */}



            {/* Button export excel */}
            <button
              type="button"
              className="center border border-slate-300 h-9 rounded-md bg-white p-2 hover:bg-gray-50"
              onClick={onDownload}
            >
              <RiFileExcel2Line className="relative font-medium text-lg" />
            </button>

            {/* End */}

            {/* Button export pdf */}
            <button
              type="button"
              className="center  border border-slate-300 h-9 rounded-md  bg-white p-2 hover:bg-gray-50"
              onClick={generatePDF}
            >
              <AiOutlineFilePdf className="relative font-medium text-lg" />
            </button>
          </div>
          {/* End */}
        </div>
        {/*  */}
        <div className=" w-full rounded-md overflow-hidden outline-none shadow-lg shadow-slate-900/10 border-none max-md:overflow-x-auto" ref={componentPDF}>
          <table
            {...getTableProps()}
            ref={tableRef}
            className="table-auto w-full"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className={` p-2 text-black font-semibold  border-t-1  border-gray-300 ${column.id === "status" || column.id === "id"
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
                    className={` text-gray-600 hover:bg-blue-200 hover:text-gray-700 ${i % 2 === 1 ? "bg-stone-200" : "bg-white"
                      } `}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}

                          className={`p-2 border-gray-300 border-b-0   ${cell.column.id === "status" ||
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
          <IoIosArrowForward />
        </button>{' '}
      </div>
      {/* End Pagination */}
    </div>

  );
}

export default DataTable;
