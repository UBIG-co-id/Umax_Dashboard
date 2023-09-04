import React, { useState, useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from "primereact/paginator";
import { useReactToPrint } from "react-to-print";
import { useDownloadExcel } from "react-export-table-to-excel";
import pdfImage from '../assets/pdf.png';
import excelImage from '../assets/excel.png';
import { users } from "./DataHistory";
import { Ripple } from 'primereact/ripple';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function App() {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const [rows, setRows] = useState(5);

  const onPageChange = (e) => {
    setCurrentPage(e.first);
    setRows(e.rows);
  };

  const startIndex = currentPage;
  const endIndex = currentPage + rows;
  const visibleUsers = users.slice(startIndex, endIndex);

  // EXPORT PDF AND EXCEL
  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Data",
    sheet: "Data",
  });

  const componentPDF = useRef();
  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Data",
    onAfterPrint: () => alert("Data Saved in PDF")
  });

  const pagination1 = {
    layout: 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
    PrevPageLink: (options) => {
      return (
        <button type="button" className={classNames(options.className, 'border-round')} onClick={options.onClick} disabled={options.disabled}>
          <span className="p-3">Previous</span>
          <Ripple />
        </button>
      );
    },
    NextPageLink: (options) => {
      return (
        <button type="button" className={classNames(options.className, 'border-round')} onClick={options.onClick} disabled={options.disabled}>
          <span className="p-3">Next</span>
          <Ripple />
        </button>
      );
    },
    PageLinks: (options) => {
      if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
        const className = classNames(options.className, { 'p-disabled': true });

        return (
          <span className={className} style={{ userSelect: 'none' }}>
            ...
          </span>
        );
      }

      return (
        <button type="button" className={options.className} onClick={options.onClick}>
          {options.page + 1}
          <Ripple />
        </button>
      );
    },
  };

  return (
    <div className="relative rounded-lg">
      <div className="container mx-auto p-4">
        <div className="flex gap-5 items-center justify-end">
          <button onClick={generatePDF}>
            <img
              className="h-8 w-auto"
              src={pdfImage}
              alt="pdfImage"
            />
          </button>
          <button onClick={onDownload}>
            <img
              className="h-8 w-auto"
              src={excelImage}
              alt="excelImage"
            />
          </button>
        </div>
        <br />
        <div className='table-container'>
          <div className='table'>
            <div className="mb-4 flex space-x-4 justify-between">
              <div className="w-full flex flex-col gap-5 justify-between" ref={componentPDF} style={{ width: '100%' }}>
                <div ref={tableRef}>
                  <DataTable value={visibleUsers} className="table1">
                    <Column field="update" header="Last Update" sortable style={{ width: '25%' }} />
                    <Column field="amount" header="Amount Spent" sortable style={{ width: '25%' }} />
                    <Column field="reach" header="Reach" sortable style={{ width: '25%' }} />
                    <Column field="impressions" header="Impressions" sortable style={{ width: '25%' }} />
                    <Column field="frequency" header="Frequency" sortable style={{ width: '25%' }} />
                    <Column field="rar" header="RAR" sortable style={{ width: '25%' }} />
                    <Column field="cpc" header="CPC" sortable style={{ width: '25%' }} />
                    <Column field="ctr" header="CTR" sortable style={{ width: '25%' }} />
                    <Column field="oclp" header="OCLP" sortable style={{ width: '25%' }} />
                    <Column field="cpr" header="CPR" sortable style={{ width: '25%' }} />
                    <Column field="atc" header="ATC" sortable style={{ width: '25%' }} />
                    <Column field="roas" header="ROAS" sortable style={{ width: '25%' }} />
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Paginator template={pagination1} first={currentPage} rows={rows} totalRecords={120} onPageChange={onPageChange} />
        <Divider />
      </div>
    </div>
  );
}
