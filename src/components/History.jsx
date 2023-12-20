import React, { useState, useEffect, useRef } from "react";
import { useTable, useGlobalFilter, usePagination } from "react-table";
// import data from "./CampaignData";
import { BsTrash3, BsPlus } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { AiOutlineEdit, AiOutlineFilePdf } from "react-icons/ai";
import { RiFileExcel2Line } from "react-icons/ri";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import "../styles.css";
import "react-tabs/style/react-tabs.css";
import { useFormik } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles.css";

const History = ({ campaign_id }) => {
  const [tableData, setTableData] = useState([]);

  // state buat sort history
  const [sortHistory, setSortHistory] = useState("terbaru");

  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(
          `https://umaxxnew-1-d6861606.deta.app/history?campaign_id=${campaign_id}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setData(data.Data);
        } else {
          console.error("Gagal mengambil data");
        }
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      }
    };

    fetchCampaignData();
  }, [setData, campaign_id]);

  const handleRowSelection = (selectedRowData) => {
    setSelectedData(selectedRowData);
  };

  // PAGINATION
  const paginationStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    marginTop: "20px",
  };

  const buttonStyle = {
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "5px 10px",
    cursor: "pointer",
    fontSize: "16px",
    margin: "0 5px",
  };

  const disabledButtonStyle = {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  };

  const pageInfoStyle = {
    fontSize: "16px",
    margin: "0 10px",
    color: "#333",
  };
  // END PAGINATION

  const getStatusString = (status) => {
    let statusStyle = {}; // Objek gaya status

    switch (status) {
      case 1:
        statusStyle = {
          color: "#00CA00",
          padding: "2px",
          borderRadius: "7px",
          fontWeight: "500",
        };
        return <span style={statusStyle}>Active</span>;
      case 2:
        statusStyle = {
          color: "#8F8F8F",
          padding: "2px",
          borderRadius: "7px",
          fontWeight: "500",
        };
        return <span style={statusStyle}>Draft</span>;
      case 3:
        statusStyle = {
          color: "#FF8A00",
          padding: "2px",
          borderRadius: "7px",
          fontWeight: "500",
        };
        return <span style={statusStyle}>Completed</span>;
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

  const columns = React.useMemo(
    () => [
      {
        Header: "Last Update",
        accessor: "perubahan.timestamp_update",
        // Cell: ({ value }) => {
        //   const date = new Date(value);
        //   const formattedTime = date.toLocaleTimeString("id-ID", {
        //     year: "numeric",  
        //     day: "2-digit",
        //     month: "2-digit",
        //     hour: "2-digit",
        //     minute: "2-digit",
        //   });
        //   return <div className="flex justify-center">{formattedTime}</div>;
        // },
      },
      {
        Header: "Amount Spent",
        accessor: "perubahan.amountspent",
      },
      {
        Header: "Reach",
        accessor: "perubahan.reach",
      },
      {
        Header: "Impressions",
        accessor: "perubahan.impressions",
      },
      {
        Header: "Frequency",
        accessor: "perubahan.frequency",
      },
      {
        Header: "RAR",
        accessor: "perubahan.rar",
      },
      {
        Header: "CPC",
        accessor: "perubahan.cpc",
      },
      {
        Header: "CTR",
        accessor: "perubahan.ctr",
      },
      {
        Header: "OCLP",
        accessor: "perubahan.oclp",
      },
      {
        Header: "CPR",
        accessor: "perubahan.cpr",
      },
      {
        Header: "ATC",
        accessor: "perubahan.atc",
      },
      {
        Header: "ROAS",
        accessor: "perubahan.roas",
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
      data,
      initialState: { pageIndex: 0, pageSize: 5 }, // Initial page settings
    },
    useGlobalFilter,
    usePagination
  );

  // sort history logic
  const sortedHistory = page.sort((a, b) => {
    if (sortHistory === "terbaru") {
      return (
        new Date(a.values["perubahan.timestamp_update"]).getTime() -
        new Date(b.values["perubahan.timestamp_update"]).getTime()
      );
    }

    if (sortHistory === "terlama") {
      return (
        new Date(b.values["perubahan.timestamp_update"]).getTime() -
        new Date(a.values["perubahan.timestamp_update"]).getTime()
      );
    }
  });

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
    doc.text("Campaign Data", 14, 15);

    const filteredData = tableData.map((row) => ({
      Name: row.name,
      Client: row.client,
      Platform: row.platform,
      Account: row.account,
      Objective: row.objective,
      "Start Date": row.startdate,
      Status: getStatusString(row.status),
    }));

    const tableColumnNames = Object.keys(filteredData[0]);
    const tableColumnValues = filteredData.map((row) => Object.values(row));

    doc.autoTable({
      head: [tableColumnNames],
      body: tableColumnValues,
      startY: 20,
    });

    doc.save("campaigns.pdf");
  };

  return (
    <div>
      <div className="border-2 border-slate-200  p-0 m-2 lg:m-10 mt-8 rounded-lg relative">
        <div className="container mx-auto p-4">
          <div className="flex items-center">
            <button onClick={() => setSortHistory("terbaru")}>terbaru</button>
            <button onClick={() => setSortHistory("terlama")}>terlama</button>
          </div>
          <div className="grid grid-cols-12 gap-3 px-2 md:px-0 mb-2">
            {/* div kosong untuk memberi jarak */}
            <div className="hidden lg:flex col-span-11 "></div>

            {/* Button add data */}
            <div className="gap-2 flex lg:justify-end">
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
          <div
            className=" w-full table-container outline-none shadow-lg shadow-slate-900/10 border-none "
            ref={componentPDF}
          >
          <table {...getTableProps()} ref={tableRef} className="table-auto w-full">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className={`p-2 text-white bg-sky-500 font-medium border-t-0 border-slate-300 ${
                          column.id === "status" || column.id === "id"
                            ? "place-items-center"
                            : "text-left"
                        }`}
                        style={{ width: "50px" }} // Set the width to 20px
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody {...getTableBodyProps()}>
                {/** sort logic */}
                {sortedHistory.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className={`text-gray-600 hover:bg-blue-200 hover:text-gray-700 ${
                        i % 2 === 1 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      {row.cells.map((cell) => {
                        const textAlign =
                          cell.column.id === "perubahan.frequency" ||
                          cell.column.id === "perubahan.rar" ||
                          cell.column.id === "perubahan.ctr" ||
                          cell.column.id === "perubahan.oclp" ||
                          cell.column.id === "perubahan.atc" ||
                          cell.column.id === "perubahan.roas"
                            ? "text-center"
                            : cell.column.id === "perubahan.timestamp_update"
                            ? "text-left"
                            : "text-right"; // Assuming amount spent, reach, impressions, cpc, and cpr should be right-aligned.
                        return (
                          <td
                            {...cell.getCellProps()}
                            className={`p-2 border border-slate-300 border-b-0 ${textAlign}`}
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
            {"<<"}
          </button>{" "}
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            style={{
              ...buttonStyle,
              ...(canPreviousPage ? {} : disabledButtonStyle),
            }}
          >
            {"<"}
          </button>{" "}
          <span style={pageInfoStyle}>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            style={{
              ...buttonStyle,
              ...(canNextPage ? {} : disabledButtonStyle),
            }}
          >
            {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            style={{
              ...buttonStyle,
              ...(canNextPage ? {} : disabledButtonStyle),
            }}
          >
            <IoIosArrowForward />
          </button>{" "}
        </div>
        {/* End Pagination */}
      </div>
    </div>
  );
};

export default History;
