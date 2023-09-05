import React, { useState, useEffect, useRef } from 'react';
import { useTable, useGlobalFilter } from 'react-table';
import data from './DataAccount';
import { BsTrash3, BsPlus } from 'react-icons/bs';
import { CiSearch } from 'react-icons/ci';
import { AiOutlineEdit, AiOutlineFilePdf, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { RiFileExcel2Line } from 'react-icons/ri';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../styles.css';



function AccountTable() {
  const [tableData, setTableData] = useState(data);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const tableRef = useRef(null);
  const [showAddPopup, setShowAddPopup] = useState(false); // State untuk menampilkan popup
  const [newData, setNewData] = useState({}); // State untuk data baru
  const [password, setPassword] = useState(''); // State untuk kata sandi
  const [showPassword, setShowPassword] = useState(false); // State untuk menampilkan atau menyembunyikan kata sandi

  
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
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Action',
        accessor: 'id',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(row.original.id)}
              className="bg-red-200 hover:bg-red-300 text-red-600 py-1 px-1 rounded"
            >
              <BsTrash3 />
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-blue-200 hover:bg-blue-300 text-blue-600 py-1 px-1 rounded"
            >
              <AiOutlineEdit />
            </button>
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
    rows,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: tableData,
    },
    useGlobalFilter
  );

  const { globalFilter } = state;

  const handleEdit = (rowId) => {
    console.log('Editing row with ID:', rowId);
  };

  const handleDelete = (rowId) => {
    const updatedData = tableData.filter((row) => row.id !== rowId);
    setTableData(updatedData);
  };

  useEffect(() => {
    const filteredData = data.filter((row) => {
      return selectedPlatform === '' || row.platform === selectedPlatform;
    });
    setTableData(filteredData);
  }, [selectedPlatform]);

  // bgian export ke pdf
  const exportToPDF = () => {
    const doc = new jsPDF();
    const pdfColumns = columns.map((column) => column.Header);

    const table = tableRef.current.getTableProps().instance;

    const tableRows = [];
    table.rows().every(function (rowIdx, tableLoop, rowLoop) {
      const rowData = [];
      const rowNode = this.node();
      const cells = rowNode.querySelectorAll('td');
      cells.forEach((cell) => {
        rowData.push(cell.textContent);
      });
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [pdfColumns],
      body: tableRows,
      didDrawPage: function (data) {},
    });

    doc.save('Data_Campaigns.pdf');
  };
  // End

// pop up add data
 const toggleAddPopup = () => {
  setShowAddPopup(!showAddPopup);
};

const handleAddData = () => {
  const updatedData = [...tableData, newData];
  setTableData(updatedData);
  toggleAddPopup(); 
};

  return (
    <div className="border-2 border-slate-200 bg-white p-5 m-10 rounded-lg relative">
      <div className="container mx-auto px-0 p-4">
        <div className="mb-4 -mt-4 flex space-x-4 justify-start">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search"
              className="p-2 h-9 pl-8 text-xs border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg sm:w-48"
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <CiSearch style={{ color: '#9BA0A8' }} />
            </span>
          </div>
          {/* End */}
          
          {/* Seleksi filter Platform dan objective */}

          {/* bagian platform */}
          <div className="relative">
            <select
              className="p-2 h-9 text-xs font-medium border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg sm:w-48"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
            >
              <option hidden>Client</option>
              <option value="Facebook">PT.Makmur</option>
              <option value="Instagram">Pondok Nurul Huda</option>
              <option value="Google">PT Haji Umar Barokah</option>
            </select>
          </div>

          {/* bagian Platform */}
          <div className="relative">
            <select
              className="p-2 h-9 text-xs font-medium border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg sm:w-48"
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
          <div className="relative">
            <select
              className="p-2 h-9 text-xs font-medium border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg sm:w-48"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
            >
              <option hidden>Status</option>
              <option value="Facebook">Active</option>
              <option value="Instagram">DeActive</option>
              <option value="Google">Google</option>
            </select>
          </div>
          {/* End */}
        </div>

        <div className="mb-4 -mt-14 flex space-x-1 justify-end">
          {/* Button add data */}
          <button
            type="button"
            data-te-ripple-init
            data-te-ripple-color="light"
            data-te-ripple-centered="true"
            className="inline-flex items-center border border-slate-300 h-9 w-28 rounded-md bg-white px-6 pb-2.5 pt-2 text-xs font-medium leading-normal text-gray-800 hover:bg-gray-50"
            onClick={toggleAddPopup} // Memanggil fungsi toggleAddPopup saat tombol "Add" diklik
         >
            <BsPlus className="relative right-5 font-medium text-lg" />
            <span className="relative right-4">Add</span>
          </button>

           {/* menu add data */}
   {/* Pop-up menu */}
   {showAddPopup && (
              <div className="fixed z-50 inset-0 flex items-center justify-center">
                    <div className="fixed -z-10 inset-0 bg-black bg-opacity-50"></div>
                <div className=" bg-white p-5 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Account</h2>
                  <div className="flex space-x-12 mb-4">
                    <div className="flex flex-col">
                      <label className='pb-2 text-sm ' htmlFor="">Name</label>
                      <input
                        type="text"
                        className="p-2 h-9 w-56 border focus:border-gray-500 focus:outline-none focus:ring-0 bg-slate-100 border-slate-300 rounded-md"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className='pb-2 text-sm ' htmlFor="">Client</label>
                      <select
                        className="px-3 text-slate-500 h-9 w-56 border focus:border-gray-500 focus:outline-none focus:ring-0 bg-slate-100 border-slate-300 rounded-md"
                      >
                         <option value="option1">Client1</option>
                        <option value="option2">Client2</option>
                        <option value="option3">Client3</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-12 mb-4">
                        <div className="flex flex-col">
                      <label className='pb-2 text-sm ' htmlFor="">Platform</label>
                      <select
                        className="px-3 text-slate-500 h-9 w-56 border focus:border-gray-500 focus:outline-none focus:ring-0 bg-slate-100 border-slate-300 rounded-md "
                      >
                       <option value="option1">Facebook Ads</option>
                        <option value="option2">Google Ads</option>
                        <option value="option3">Instagram Ads</option>
                      </select>
                    </div>

                    <div className='flex' >
                    <div className="flex flex-col">
                      <label className='pb-2 text-sm ' htmlFor="">Email</label>
                        <input type="email" 
                        className="px-3 text-slate-500 rounded-s-md w-36 h-9 border focus:border-gray-500 focus:outline-none focus:ring-0 bg-slate-100 border-slate-300 "
                        />
                       
                    </div>

                        <input type="email"
                        disabled
                        placeholder='gmail.com' 
                        className=" text-center text-sm relative top-7 rounded-e-md w-20 h-9 border bg-slate-300 border-slate-300 "
                        />

                    </div>

                  </div>

                  

                  <div className="flex space-x-12 mb-4">
                     <div className="flex flex-col">
      <label className="pb-2 text-sm" htmlFor="">
        Password
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 h-9 w-56 border focus:border-gray-500 focus:outline-none focus:ring-0 bg-slate-100 border-slate-300 rounded-md pr-10"
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
                        className="px-3 text-slate-500 h-9 w-56 border focus:border-gray-500 focus:outline-none focus:ring-0 bg-slate-100 border-slate-300 rounded-md "
                      >
                      <option value="option1">All</option>
                        <option value="option2">Draft</option>
                        <option value="option3">Active</option>
                        <option value="option3">Completed</option>
                      </select>
                    </div>
                  </div>

                

                  <div className="flex space-x-12 mb-4">
                  <div className="flex flex-col">
                  <label className='pb-2 text-sm ' htmlFor="">Notes</label>
                  <textarea
                    className="p-2 max-h-md w-56 text-slate-500 border focus:border-gray-500 focus:outline-none focus:ring-0 bg-slate-100 border-slate-300 rounded-md"
                    ></textarea>
                  </div>


                    <div className="flex flex-col">
                      <label className='pb-2 text-sm ' htmlFor="">Status</label>
                      <select
                        className="px-3 text-slate-500 h-9 w-56 border focus:border-gray-500 focus:outline-none focus:ring-0 bg-slate-100 border-slate-300 rounded-md "
                      >
                        <option value="option1">All</option>
                        <option value="option2">Draft</option>
                        <option value="option3">Active</option>
                        <option value="option3">Completed</option>
                      </select>
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
                    type="button"
                  onClick={handleAddData}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
                  >
                    Save
                  </button>
                </div>
                </div>
              </div>
            )}


           {/* end */}

          {/* Button export excel */}
          <button
            type="button"
            className="items-center border border-slate-300 h-9 rounded-md bg-white px-3 hover:bg-gray-50"
            onClick={() => tableRef.current.exportToExcel()}
          >
            <RiFileExcel2Line className="relative font-medium text-lg" />
          </button>
          <DownloadTableExcel
            ref={tableRef}
            data={tableData}
            columns={columns}
            filename="Data_Campaigns.xlsx"
          />
          {/* End */}

          {/* Button export pdf */}
          <button
            type="button"
            className="items-center border border-slate-300 h-9 rounded-md bg-white px-3 hover:bg-gray-50"
            onClick={exportToPDF}
          >
            <AiOutlineFilePdf className="relative font-medium text-lg" />
          </button>
          {/* End */}
        </div>

        <div className="w-full bg-white max-md:overflow-x-scroll">
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
                    className={`p-2 text-white bg-sky-700 font-medium border-slate-300 border ${
                      column.id === 'status' || column.id === 'action'
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
              {rows.map((row, rowIndex) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className={`border border-slate-300 text-gray-600 hover:bg-gray-200 hover:text-blue-600 ${
                      rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white' // Memberikan latar belakang selang-seling
                    }`}                   >
                    {row.cells.map((cell) => {
                      return (
                        <td
                        {...cell.getCellProps()}
                        className={`p-2 border border-slate-300 ${
                          cell.column.id === 'status' || cell.column.id === 'action'
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
      </div>
    </div>
  );
}

export default AccountTable;
