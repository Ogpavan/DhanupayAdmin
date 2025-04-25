import React, { useState } from 'react';
import transactions from '../API_data/transactions';

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

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(transactions);

  const handleSearch = (event, column) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm({
      ...searchTerm,
      [column]: value,
    });

    // If all search inputs are empty, reset to show all transactions
    if (Object.values(searchTerm).every((val) => val === '')) {
      setFilteredData(transactions);
    } else {
      setFilteredData(
        transactions.filter((transaction) => {
          return Object.keys(searchTerm).every((key) => {
            if (key === 'status') {
              return (
                transaction[key] === (value === 'success' ? true : value === 'failed' ? false : transaction[key])
              );
            }
            return transaction[key].toString().toLowerCase().includes(searchTerm[key]);
          });
        })
      );
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center pb-5">
        <h2 className="text-2xl font-semibold">Transactions</h2>
      </div>

      <div className="overflow-hidden"> {/* Remove horizontal scroll bar */}
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border  px-1 py-2">
                <input
                  type="text"
                  placeholder="Role"
                  value={searchTerm.role}
                  onChange={(e) => handleSearch(e, 'role')}
                  className="border-none text-xs w-10  p-1 rounded-none underline focus:outline-none"
                />
              </th>
              <th className="border px-1 py-1">
                <input
                  type="text"
                  placeholder="Firm Name"
                  value={searchTerm.firmName}
                  onChange={(e) => handleSearch(e, 'firmName')}
                  className="border-none text-xs w-30 p-1 rounded-none underline focus:outline-none"
                />
              </th>
              <th className="border  px-1 py-2">
                <input
                  type="text"
                  placeholder="Description"
                  value={searchTerm.transactionDescription}
                  onChange={(e) => handleSearch(e, 'transactionDescription')}
                  className="border-none text-xs w-30 p-1 rounded-none underline focus:outline-none"
                />
              </th>
              <th className="border px-4 py-2">
                <input
                  type="text"
                  placeholder="Search CR/DR Amount"
                  value={searchTerm.crDrAmount}
                  onChange={(e) => handleSearch(e, 'crDrAmount')}
                  className="border-none text-xs w-12 p-1 rounded-none underline focus:outline-none"
                />
              </th>
              <th className="border px-4 py-2">
                <input
                  type="text"
                  placeholder="Balance"
                  value={searchTerm.updatedBalance}
                  onChange={(e) => handleSearch(e, 'updatedBalance')}
                  className="border-none text-xs w-16 p-1 rounded-none underline focus:outline-none"
                />
              </th>
              <th className="border px-4 py-2">
                <input
                  type="text"
                  placeholder="Date"
                  value={searchTerm.transactionDate}
                  onChange={(e) => handleSearch(e, 'transactionDate')}
                  className="border-none text-xs w-20 p-1 rounded-none underline focus:outline-none"
                />
              </th>
              <th className="border px-4 py-2">
                <input
                  type="text"
                  placeholder="Status"
                  value={searchTerm.status}
                  onChange={(e) => handleSearch(e, 'status')}
                  className="border-none text-xs w-14 p-1 rounded-none underline focus:outline-none"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((transaction, index) => (
              <tr key={transaction.transactionId} className={index % 2 !== 0 ? 'bg-gray-200' : ''}>
                <td className="border text-center text-sm py-2">{transaction.role}</td>
                <td className="border text-center text-sm py-2">{transaction.firmName}</td>
                <td className="border text-center text-sm py-2">{transaction.transactionDescription}</td>
                <td className="border text-center text-sm py-2">{transaction.crDrAmount.toFixed(2)}</td>
                <td className="border text-center text-sm py-2">{transaction.updatedBalance.toFixed(2)}</td>
                <td className="border text-center text-sm py-2">{transaction.transactionDate}</td>
                <td className="border text-center text-sm py-2">
                  <button
                    className={`status-button ${transaction.status ? 'on' : 'off'}`}
                    style={{
                      backgroundColor: transaction.status ? 'green' : 'red',
                      color: 'white',
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
