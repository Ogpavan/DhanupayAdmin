import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import transactions from '../API_data/transactions';

// // Sample transaction data (replace this with your actual data source)
// const transactions = [
//   { transactionId: 'TXN001', role: 'Master Distributor', firmName: 'Global Electronics Ltd.', transactionDescription: 'Purchase of inventory for retail chain', crDrAmount: 5000.00, updatedBalance: 15000.00, transactionDate: '2025-04-24 10:00:00', status: true },
//   { transactionId: 'TXN002', role: 'Distributor', firmName: 'City Tech Solutions', transactionDescription: 'Monthly service fee', crDrAmount: 1200.00, updatedBalance: 13800.00, transactionDate: '2025-04-23 14:30:00', status: true },
//   { transactionId: 'TXN003', role: 'Retailer', firmName: 'Main Street Store', transactionDescription: 'Return and refund processing', crDrAmount: -800.00, updatedBalance: 14600.00, transactionDate: '2025-04-22 09:15:00', status: false },
//   { transactionId: 'TXN004', role: 'Master Distributor', firmName: 'Global Electronics Ltd.', transactionDescription: 'Commission payment', crDrAmount: 2500.00, updatedBalance: 12100.00, transactionDate: '2025-04-21 16:45:00', status: true },
//   { transactionId: 'TXN005', role: 'Retailer', firmName: 'Downtown Gadgets', transactionDescription: 'Product shipment payment', crDrAmount: 3200.00, updatedBalance: 8900.00, transactionDate: '2025-04-20 11:20:00', status: true },
// ];

export default function TransactionList() {
  const itemsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState({
    transactionId: '',
    role: '',
    firmName: '',
    transactionDescription: '',
    crDrAmount: '',
    updatedBalance: '',
    transactionDate: '',
    status: '',
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search terms
  const filteredData = transactions.filter((transaction) => {
    // Basic fields
    const transactionIdMatch = transaction.transactionId?.toString().toLowerCase().includes(searchTerm.transactionId.toLowerCase());
    const roleMatch = transaction.role?.toString().toLowerCase().includes(searchTerm.role.toLowerCase());
    const firmNameMatch = transaction.firmName?.toString().toLowerCase().includes(searchTerm.firmName.toLowerCase());
    const transactionDescriptionMatch = transaction.transactionDescription?.toString().toLowerCase().includes(searchTerm.transactionDescription.toLowerCase());
    const crDrAmountMatch = transaction.crDrAmount?.toString().includes(searchTerm.crDrAmount);
    const updatedBalanceMatch = transaction.updatedBalance?.toString().includes(searchTerm.updatedBalance);
    const transactionDateMatch = transaction.transactionDate?.toString().toLowerCase().includes(searchTerm.transactionDate.toLowerCase());
    
    // Status field
    const statusMatch = searchTerm.status === '' || 
      (searchTerm.status === 'true' && transaction.status) ||
      (searchTerm.status === 'false' && !transaction.status);
    
    return transactionIdMatch && roleMatch && firmNameMatch && transactionDescriptionMatch && 
           crDrAmountMatch && updatedBalanceMatch && transactionDateMatch && statusMatch;
  });

  const handleSearch = (event, column) => {
    const value = event.target.value;
    setSearchTerm({
      ...searchTerm,
      [column]: value,
    });
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  // Function to handle boolean search fields
  const handleBooleanSearch = (column, value) => {
    setSearchTerm({
      ...searchTerm,
      [column]: value,
    });
    setCurrentPage(1); // Reset to first page when searching
  };

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center pb-5">
        <h2 className="text-2xl font-semibold">Transactions</h2>
        <div className="text-sm text-gray-500">
          Showing {filteredData.length} transactions
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            {/* Header row */}
            <tr>
              <th className="border border-gray-200 px-4 py-2 text-center bg-gray-100">Transaction ID</th>
              <th className="border border-gray-200 px-4 py-2 text-center bg-gray-100">Role</th>
              <th className="border border-gray-200 px-4 py-2 text-center bg-gray-100">Firm Name</th>
              <th className="border border-gray-200 px-4 py-2 text-center bg-gray-100">Description</th>
              <th className="border border-gray-200 px-4 py-2 text-center bg-gray-100">Amount</th>
              <th className="border border-gray-200 px-4 py-2 text-center bg-gray-100">Updated Balance</th>
              <th className="border border-gray-200 px-4 py-2 text-center bg-gray-100">Date & Time</th>
              <th className="border border-gray-200 px-4 py-2 text-center bg-gray-100">Status</th>
            </tr>
            
            {/* Search row */}
            <tr>
              <th className="border border-gray-200 px-4 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm.transactionId}
                  onChange={(e) => handleSearch(e, 'transactionId')}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                />
              </th>
              <th className="border border-gray-200 px-4 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm.role}
                  onChange={(e) => handleSearch(e, 'role')}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                />
              </th>
              <th className="border border-gray-200 px-4 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm.firmName}
                  onChange={(e) => handleSearch(e, 'firmName')}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                />
              </th>
              <th className="border border-gray-200 px-4 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm.transactionDescription}
                  onChange={(e) => handleSearch(e, 'transactionDescription')}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                />
              </th>
              <th className="border border-gray-200 px-4 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm.crDrAmount}
                  onChange={(e) => handleSearch(e, 'crDrAmount')}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                />
              </th>
              <th className="border border-gray-200 px-4 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm.updatedBalance}
                  onChange={(e) => handleSearch(e, 'updatedBalance')}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                />
              </th>
              <th className="border border-gray-200 px-4 py-2">
                <input
                  type="text"
                  placeholder="Search date..."
                  value={searchTerm.transactionDate}
                  onChange={(e) => handleSearch(e, 'transactionDate')}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                />
              </th>
              <th className="border border-gray-200 px-4 py-2 text-center">
                <select 
                  value={searchTerm.status}
                  onChange={(e) => handleBooleanSearch('status', e.target.value)}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                >
                  <option value="">All</option>
                  <option value="true">Completed</option>
                  <option value="false">Pending</option>
                </select>
              </th>
            </tr>
          </thead>
          
          <tbody>
            {currentItems.map((transaction, index) => (
              <tr key={transaction.transactionId} className={index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border text-xs border-gray-200 text-center py-2">{transaction.transactionId}</td>
                <td className="border text-xs border-gray-200 text-center py-2">{transaction.role}</td>
                <td className="border text-xs border-gray-200 py-2 px-4">{transaction.firmName}</td>
                <td className="border text-xs border-gray-200 py-2 px-4">{transaction.transactionDescription}</td>
                <td className="border text-xs border-gray-200 text-right py-2 px-4">
                  <span className={transaction.crDrAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(transaction.crDrAmount)}
                  </span>
                </td>
                <td className="border text-xs border-gray-200 text-right py-2 px-4">{formatCurrency(transaction.updatedBalance)}</td>
                <td className="border text-xs border-gray-200 text-center py-2">{formatDate(transaction.transactionDate)}</td>
                <td className="border border-gray-200 text-center py-2">
                  {transaction.status ? (
                    <Check size={20} className="mx-auto text-green-600" />
                  ) : (
                    <X size={20} className="mx-auto text-red-600" />
                  )}
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="8" className="border border-gray-200 text-center py-4">
                  No transactions found matching the search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 0 && (
        <div className="flex justify-between items-center py-4">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} transactions
          </div>
          
          <div className="flex">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-2 bg-gray-300 text-gray-600 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            
            {/* Dynamic pagination buttons */}
            {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
              // Show pages around the current page
              let pageNum;
              if (pageCount <= 5) {
                // If we have 5 or fewer pages, show all
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                // If we're near the start, show first 5 pages
                pageNum = i + 1;
              } else if (currentPage >= pageCount - 2) {
                // If we're near the end, show last 5 pages
                pageNum = pageCount - 4 + i;
              } else {
                // Otherwise show current page and 2 pages on each side
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 mx-1 rounded-md ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pageCount}
              className="px-4 py-2 mx-2 bg-gray-300 text-gray-600 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
          
          <div className="text-sm">
            Page {currentPage} of {pageCount}
          </div>
        </div>
      )}
      
      {/* Clear filters button */}
      {Object.values(searchTerm).some(term => term !== '') && (
        <div className="flex justify-end mt-2">
          <button
            onClick={() => {
              setSearchTerm({
                transactionId: '',
                role: '',
                firmName: '',
                transactionDescription: '',
                crDrAmount: '',
                updatedBalance: '',
                transactionDate: '',
                status: '',
              });
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}