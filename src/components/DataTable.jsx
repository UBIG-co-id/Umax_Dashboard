import React, { useState } from 'react';
import { useTable, useGlobalFilter } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus, faSearch  } from '@fortawesome/free-solid-svg-icons'; 
import data from './data';


function DataTable() {
  const [tableData, setTableData] = useState(data);
  

  

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
          <div className="flex space-x-2 ">
            <button
              onClick={() => handleEdit(row.original.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
            >
              <FontAwesomeIcon icon={faTrash} />
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
      data,
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



  return (
    <div className="relative  bg-white p-5 m-3  rounded-lg ">
    <div className="container mx-auto p-4">
      <div className="mb-4 flex space-x-4 justify-between">

      <div className="relative">
        <input
          type="text"
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search"
          className="p-2 pl-8 border-2 rounded-lg sm:w-32"
        />
        <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <FontAwesomeIcon icon={faSearch} style={{ color: '#9BA0A8' }} />
        </span>
      </div>

              <button
        type="button"
        data-te-ripple-init
        data-te-ripple-color="light"
        data-te-ripple-centered="true"
        className="inline-flex items-center border-2  rounded-lg bg-white px-6 pb-2.5 pt-2 text-xs font-medium leading-normal text-gray-800 hover:bg-gray-100"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        <span>Add</span>
      </button>
      </div>
      <div className="w-full bg-white overflow-x-auto">
        <table {...getTableProps()} className="table-auto border-collapse border w-full">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="p-2 border"
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
                  className="border hover:bg-gray-100"
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="p-2 border"
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

