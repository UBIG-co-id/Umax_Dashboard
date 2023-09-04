import React, { useState, useEffect, useRef } from 'react';
import { useTable, useGlobalFilter } from 'react-table';
import data from './CampaignData';
import { BsTrash3, BsPlus } from 'react-icons/bs';
import { CiSearch } from 'react-icons/ci';
import { AiOutlineEdit, AiOutlineFilePdf } from 'react-icons/ai';
import { RiFileExcel2Line } from 'react-icons/ri';
import '../styles.css';


function DataTable() {
  const [tableData, setTableData] = useState(data);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [showAddPopup, setShowAddPopup] = useState(false);


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
        Header: 'Account',
        accessor: 'account',
      },
      {
        Header: 'Objective',
        accessor: 'objective',
      },
      {
        Header: 'StartDate',
        accessor: 'startdate',
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

 

// pop up add data
 const toggleAddPopup = () => {
  setShowAddPopup(!showAddPopup);
};

const handleAddData = () => {
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
              <option hidden>Platform</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Google">Google</option>
            </select>
          </div>

          {/* bagian objective */}
          <div className="relative">
            <select
              className="p-2 h-9 text-xs font-medium border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg sm:w-48"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
            >
              <option hidden>Objective</option>
              <option value="Facebook">Awareness</option>
              <option value="Instagram">Conversion</option>
              <option value="Google">Consideration</option>
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
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-5 rounded-lg shadow-lg">
                  <h2 className="text-xl  font-semibold mb-4">Campaign</h2>
                  <div className="flex space-x-12 mb-4">
                    <div className="flex flex-col">
                      <label htmlFor="">Name</label>
                      <input
                        type="text"
                        className="p-2 h-9 w-full border focus:border-gray-500 focus:outline-none focus:ring-0 bg-slate-100 border-slate-300 rounded-md"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="">Objective</label>
                      <select
                        className="p-2 h-9 w-full border focus:border-gray-500 focus:outline-none focus:ring-0 bg-slate-100 border-slate-300 rounded-md"
                      >
                        <option value="option1">Awareness</option>
                        <option value="option2">Conversion</option>
                        <option value="option3">Consideration</option>
                      </select>
                    </div>

                  </div>

                  <div className="mb-4">
                    <label htmlFor="">Name</label>
                    <input
                      type="text"
                      className="p-2 h-9 w-full border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg"
                    />
                  </div>
                  {/* Tambahkan field lain sesuai kebutuhan */}
                  <button
                    type="button"
                    onClick={handleAddData}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={toggleAddPopup}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}


           {/* end */}

          {/* Button export excel */}
          <button
            type="button"
            className="items-center border border-slate-300 h-9 rounded-md bg-white px-3 hover:bg-gray-50"
          >
            <RiFileExcel2Line className="relative font-medium text-lg" />
          </button>
       
          {/* End */}

          {/* Button export pdf */}
          <button
            type="button"
            className="items-center border border-slate-300 h-9 rounded-md bg-white px-3 hover:bg-gray-50"
          >
            <AiOutlineFilePdf className="relative font-medium text-lg" />
          </button>
          {/* End */}
        </div>

        <div className="w-full bg-white max-md:overflow-x-scroll">
          <table
            {...getTableProps()}
            className="table-auto border-collapse border w-full"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="p-2 border-slate-300 border"
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className="border border-slate-300 text-gray-600 hover:bg-gray-200 hover:text-blue-600"
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className="p-2 border border-slate-300"
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

export default DataTable;
