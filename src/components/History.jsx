import React, { useState, useRef, useMemo,useEffect } from "react";
import { useReactToPrint } from "react-to-print";
// import { useDownloadExcel } from "react-export-table-to-excel"
import { Box, Button } from '@mui/material';
import pdfImage from '../assets/pdf.png';
import excelImage from '../assets/excel.png';
import Data from "../components/DataHistory";
import { MaterialReactTable } from 'material-react-table'
import { darken } from '@mui/material';
// import XLSX from 'xlsx';
import { CSVLink, CSVDownload } from "react-csv";
// import { mkConfig, generateCsv, download } from "export-to-csv";

const History = () => {
  const [tableData, setTableData] = useState([]);

  async function fetchData() {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch("https://umax-1-z7228928.deta.app/history",{
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

  // MENGGUNAKAN LIBRARY DARI MATERIAL REACT TABLE
  const columns = useMemo(
    () => [
      {
        accessorKey: 'lastupdate',
        enableColumnFilter: false,
        header: 'Last Update',
      },
      {
        accessorKey: 'amountspent',
        header: 'Amount Spent',
      },
      {
        accessorKey: 'reach',
        header: 'Reach',
      },
      {
        accessorKey: 'impressions',
        header: 'Impressions',
      },
      {
        accessorKey: 'frequency',
        header: 'Frequency',
      },
      {
        accessorKey: 'rar',
        header: 'RAR',
      },
      {
        accessorKey: 'cpc',
        header: 'CPC',
      },
      {
        accessorKey: 'ctr',
        header: 'CTR',
      },
      {
        accessorKey: 'oclp',
        header: 'OCLP',
      },
      {
        accessorKey: 'cpr',
        header: 'CPR',
      },
      {
        accessorKey: 'atc',
        header: 'ATC',
      },
      {
        accessorKey: 'roas',
        header: 'ROAS',
      },
    ],
    [],
  );

  // const data = useMemo(
  //   () => [
  //     {
  //       update: '28 Jul 2023, 09:20',
  //       amount: 'Rp. 2.000.000',
  //       reach: '97.000',
  //       impressions: '230.000',
  //       frequency: '2,3',
  //       rar: '6,1% ',
  //       cpc: 'Rp. 2.000',
  //       ctr: '1,0%',
  //       oclp: '30%',
  //       cpr: 'Rp. 5.000',
  //       atc: '2,5%',
  //       roas: '3,1x'
  //     },
  //     {
  //       update: '28 Jul 2023, 09:20',
  //       amount: 'Rp. 4.000.000',
  //       reach: '97.000',
  //       impressions: '230.000',
  //       frequency: '2,3',
  //       rar: '6,1% ',
  //       cpc: 'Rp. 2.000',
  //       ctr: '1,0%',
  //       oclp: '30%',
  //       cpr: 'Rp. 5.000',
  //       atc: '2,5%',
  //       roas: '3,1x'
  //     },
  //     {
  //       update: '28 Jul 2023, 09:20',
  //       amount: 'Rp. 4.000.000',
  //       reach: '97.000',
  //       impressions: '230.000',
  //       frequency: '2,3',
  //       rar: '6,1% ',
  //       cpc: 'Rp. 2.000',
  //       ctr: '1,0%',
  //       oclp: '30%',
  //       cpr: 'Rp. 5.000',
  //       atc: '2,5%',
  //       roas: '3,1x'
  //     },
  //     {
  //       update: '28 Jul 2023, 09:20',
  //       amount: 'Rp. 4.000.000',
  //       reach: '97.000',
  //       impressions: '230.000',
  //       frequency: '2,3',
  //       rar: '6,1% ',
  //       cpc: 'Rp. 2.000',
  //       ctr: '1,0%',
  //       oclp: '30%',
  //       cpr: 'Rp. 5.000',
  //       atc: '2,5%',
  //       roas: '3,1x'
  //     },
  //     {
  //       update: '28 Jul 2023, 09:20',
  //       amount: 'Rp. 4.000.000',
  //       reach: '97.000',
  //       impressions: '230.000',
  //       frequency: '2,3',
  //       rar: '6,1% ',
  //       cpc: 'Rp. 2.000',
  //       ctr: '1,0%',
  //       oclp: '30%',
  //       cpr: 'Rp. 5.000',
  //       atc: '2,5%',
  //       roas: '3,1x'
  //     },
  //     {
  //       update: '28 Jul 2023, 09:20',
  //       amount: 'Rp. 4.000.000',
  //       reach: '97.000',
  //       impressions: '230.000',
  //       frequency: '2,3',
  //       rar: '6,1% ',
  //       cpc: 'Rp. 2.000',
  //       ctr: '1,0%',
  //       oclp: '30%',
  //       cpr: 'Rp. 5.000',
  //       atc: '2,5%',
  //       roas: '3,1x'
  //     },
  //     {
  //       update: '28 Jul 2023, 09:20',
  //       amount: 'Rp. 4.000.000',
  //       reach: '97.000',
  //       impressions: '230.000',
  //       frequency: '2,3',
  //       rar: '6,1% ',
  //       cpc: 'Rp. 2.000',
  //       ctr: '1,0%',
  //       oclp: '30%',
  //       cpr: 'Rp. 5.000',
  //       atc: '2,5%',
  //       roas: '3,1x'
  //     },
  //     {
  //       update: '28 Jul 2023, 09:20',
  //       amount: 'Rp. 4.000.000',
  //       reach: '97.000',
  //       impressions: '230.000',
  //       frequency: '2,3',
  //       rar: '6,1% ',
  //       cpc: 'Rp. 2.000',
  //       ctr: '1,0%',
  //       oclp: '30%',
  //       cpr: 'Rp. 5.000',
  //       atc: '2,5%',
  //       roas: '3,1x'
  //     },
  //     {
  //       update: '28 Jul 2023, 09:20',
  //       amount: 'Rp. 4.000.000',
  //       reach: '97.000',
  //       impressions: '230.000',
  //       frequency: '2,3',
  //       rar: '6,1% ',
  //       cpc: 'Rp. 2.000',
  //       ctr: '1,0%',
  //       oclp: '30%',
  //       cpr: 'Rp. 5.000',
  //       atc: '2,5%',
  //       roas: '3,1x'
  //     },
  //     {
  //       update: '27 Jul 2023, 09:20',
  //       amount: 'Rp. 4.000.000',
  //       reach: '97.000',
  //       impressions: '230.000',
  //       frequency: '2,3',
  //       rar: '6,1% ',
  //       cpc: 'Rp. 2.000',
  //       ctr: '1,0%',
  //       oclp: '30%',
  //       cpr: 'Rp. 5.000',
  //       atc: '2,5%',
  //       roas: '3,1x'
  //     },
  //     {
  //       update: '27 Jul 2023, 09:20',
  //       amount: 'Rp. 4.000.000',
  //       reach: '97.000',
  //       impressions: '230.000',
  //       frequency: '2,3',
  //       rar: '6,1% ',
  //       cpc: 'Rp. 2.000',
  //       ctr: '1,0%',
  //       oclp: '30%',
  //       cpr: 'Rp. 5.000',
  //       atc: '2,5%',
  //       roas: '3,1x'
  //     },
  //   ]
  // )

  // SORTING
  // const [sortBy, setSortBy] = useState({
  //   column: 'key',
  //   ascending: true,
  // });
  // const handleSort = (column) => {
  //   if (column === sortBy.column) {
  //     setSortBy({ column, ascending: !sortBy.ascending });
  //   } else {
  //     setSortBy({ column, ascending: true });
  //   }
  // };
  // const sortedData = [...tableData].sort((a, b) => {
  //   const keyA = a[sortBy.column];
  //   const keyB = b[sortBy.column];
  //   if (sortBy.ascending) {
  //     return keyA.localeCompare(keyB);
  //   } else {
  //     return keyB.localeCompare(keyA);
  //   }
  // });

  // EXPORT EXCEL

  // const tableRef = useRef(null);
  // const { onDownload } = useDownloadExcel({
  //   tableRef: tableRef, // Use 'tableRef' instead of 'currentTableRef'
  //   data: data,
  //   filename: "Data",
  //   sheet: "Data",
  // });

  // EXPORT PDF
  const componentPDF = useRef();
  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Data",
    onAfterPrint: () => alert("Data Saved in PDF")
  });



  return (
    <div className="relative w-full">
    <div className='flex justify-end'>
      <div className="container mx-auto p-4">
        <div className="flex gap-5 items-center justify-end">
          <div className='flex gap-5 items-center'>
            <button onClick={generatePDF}>
              <img
                className="h-8 w-auto"
                src={pdfImage}
                alt="pdfImage"
              />
            </button>
            <CSVLink data={tableData}>
              <img
                className="h-8 w-auto"
                src={excelImage}
                alt="excelImage"
              />
            </CSVLink>

            <select name="" id="" className='focus:outline-none p-2 px-5 border border-gray-300 text-gray-500 rounded-md'>
              <option value="">Today</option>
            </select>

          </div>
        </div>
        <div ref={componentPDF} >
          <MaterialReactTable
            columns={columns}
            data={tableData}
            enableStickyHeader
            enableRowSelection
            // muiTableHeadCellProps={{
            //   sx: (theme) => ({
            //     backgroundColor: theme.palette.primary.main, 
            //     color: theme.palette.common.white, 
            //   })
            // }}
            // muiTablePaperProps={{
            //   elevation: 0,
            //   sx: {
            //     borderRadius: '10px',
            //     border: '1px dashed #e0e0e0',
            //   },
            // }}
            // muiTableBodyProps={{
            //   sx: (theme) => ({
            //     '& tr:nth-of-type(odd)': {
            //       backgroundColor: darken(theme.palette.background.default, 0.1),
            //     },
            //   }),
            // }}
          />


        </div>
      </div>
    </div>
    </div>
  )
}

export default History