import React, { useState } from 'react';
import transactions from '../API_data/transactions';
import { FunnelSimple } from 'phosphor-react';

export default function Transactions() {
  const itemsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState({
    role: '',
    firmName: '',
    transactionDescription: '',
    crDrAmount: '',
    updatedBalance: '',
    transactionDate: '',
    status: '',
  });

  const [activeColumn, setActiveColumn] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(transactions);

  const handleSearch = (event, column) => {
    const value = event.target.value.toLowerCase();
    const updatedSearch = { ...searchTerm, [column]: value };

    setSearchTerm(updatedSearch);

    const filtered = transactions.filter((transaction) => {
      return Object.keys(updatedSearch).every((key) => {
        const searchValue = updatedSearch[key];
        if (!searchValue) return true;

        if (key === 'status') {
          return (
            transaction[key] === (searchValue === 'success' ? true : searchValue === 'failed' ? false : transaction[key])
          );
        }
        return transaction[key].toString().toLowerCase().includes(searchValue);
      });
    });

    setFilteredData(filtered);
  };

  const toggleColumn = (column) => {
    setActiveColumn((prev) => (prev === column ? '' : column));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  const renderHeader = (column, label, width = 'w-28') => (
<th className="border px-2 py-2 text-center">
  <div className="flex flex-col items-center ">
    <div className="flex justify-between items-center w-full px-1">
      <p className="text-xs poppins-bold text-left ">{label}</p>
      <FunnelSimple
        size={16}
        onClick={() => toggleColumn(column)}
        className="cursor-pointer hover:text-blue-600 "
      />
    </div>
    {activeColumn === column && (
      <input
        type="text"
        placeholder={`Search ${label}`}
        value={searchTerm[column]}
        onChange={(e) => handleSearch(e, column)}
        className={`border text-xs w-[100px] p-1 mt-1 rounded focus:outline-none`}
      />
    )}
  </div>
</th>

  );

  return (
    <div>
      <div className="flex justify-between items-center pb-5">
        <h2 className="text-2xl font-semibold">Transactions</h2>
      </div>

      <div className="overflow-hidden">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              {renderHeader('role', 'Role', 'w-16')}
              {renderHeader('firmName', 'Firm Name', 'w-28')}
              {renderHeader('transactionDescription', 'Description', 'w-32')}
              {renderHeader('crDrAmount', 'CR/DR Amount', 'w-20')}
              {renderHeader('updatedBalance', 'Balance', 'w-20')}
              {renderHeader('transactionDate', 'Date', 'w-28')}
              {renderHeader('status', 'Status', 'w-20')}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((transaction) => (
              <tr key={transaction.transactionId}>
                <td className="border text-center text-sm">{transaction.role}</td>
                <td className="border text-center text-sm">{transaction.firmName}</td>
                <td className="border text-center text-sm">{transaction.transactionDescription}</td>
                <td className="border text-center text-sm">{transaction.crDrAmount.toFixed(2)}</td>
                <td className="border text-center text-sm">{transaction.updatedBalance.toFixed(2)}</td>
                <td className="border text-center text-sm">{transaction.transactionDate}</td>
                <td className="border text-center text-sm">
                  <button
                    className={`status-button ${transaction.status ? 'on' : 'off'}`}
                    style={{
                      color: transaction.status ? 'green' : 'red',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '5px',
                    }}
                  >
                    {transaction.status ? 'Success' : 'Failed'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center py-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-2 bg-gray-300 text-gray-600 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        {[...Array(pageCount)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-2 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
          className="px-4 py-2 mx-2 bg-gray-300 text-gray-600 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
