import React, { useState } from 'react';

const items = [
  { LastUpdate: "28 Jul 2023, 09:20", 
    AmountSpent: 'Rp 4.000.000',
    Reach: '97.000',
    Impressions: '85.000' ,
    Frequency: '2,3' ,
    RAR: '6,1%' ,
    CPC: 'Rp 2.000' ,
    CTR: '1,0%' ,
    OCLP: '30%' ,
    CPR: 'Rp 5.000' ,
    ATC: '2,5%' ,
    ROAS: '3,1x' ,
  },
  { LastUpdate: "28 Jul 2023, 09:20", 
    AmountSpent: 'Rp 4.000.000',
    Reach: '97.000',
    Impressions: '85.000' ,
    Frequency: '2,3' ,
    RAR: '6,1%' ,
    CPC: 'Rp 2.000' ,
    CTR: '1,0%' ,
    OCLP: '30%' ,
    CPR: 'Rp 5.000' ,
    ATC: '2,5%' ,
    ROAS: '3,1x' ,
  },
  
];

const itemsPerPage = 8;

const columnDefinitions = [
  { key: "LastUpdate", title: "LastUpdate" },
  { key: "AmountSpent", title: "AmountSpent" },
  { key: "Reach", title: "Reach" },
  { key: "Impressions", title: "Impressions" },
  { key: "Frequency", title: "Frequency" },
  { key: "RAR", title: "RAR" },
  { key: "CPC", title: "CPC" },
  { key: "CTR", title: "CTR" },
  { key: "OCLP", title: "OCLP" },
  { key: "CPR", title: "CPR" },
  { key: "ATC", title: "ATC" },
  { key: "ROAS", title: "ROAS" },
];

const History = () => {
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastUpdateFilter, setLastUpdateFilter] = useState(''); 
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const filteredItems = items
    .filter((item) =>
      item.AmountSpent.toLowerCase()
    )
    .filter((item) => 
      lastUpdateFilter === '' || item.LastUpdate.toString() === lastUpdateFilter
    )
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.LastUpdate - b.LastUpdate; 
      } else {
        return b.LastUpdate - a.LastUpdate;
      }
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleLastUpdateFilterChange = (e) => {
    setLastUpdateFilter(e.target.value);
  };


  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* <div style={{ overflowX: "auto", maxHeight: "300px" }}>
        <table className="w-max mt-4 border-collapse">
          <thead>
            <tr>
              {columnDefinitions.map((column) => (
                <th key={column.key} className="border text-left px-4 py-2 bg-blue-500 text-white">
                {column.title}
                  {column.key === "LastUpdate" && (
                    <button
                      className="ml-2"
                      onClick={toggleSortDirection}
                    >
                      {sortDirection === 'asc' ? '↓' : '↑'}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                {columnDefinitions.map((column) => (
                  <td key={column.key} className="border px-4 py-2">
                    {item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Next
        </button>
      </div> */}
    </div>
  );
};

export default History;
