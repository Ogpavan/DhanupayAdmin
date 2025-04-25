import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import users from '../API_data/users';

export default function Users() {
  const itemsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState({
    srNo: '',
    userInfo: '',
    distributorId: '',
    userMobile: '',
    aadharStatus: '',
    panStatus: '',
    emailStatus: '',
    financePermission: '',
    travelPermission: '',
    otherPermission: '',
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search terms
  const filteredData = users.filter((user) => {
    // Basic fields
    const srNoMatch = user.srNo?.toString().toLowerCase().includes(searchTerm.srNo.toLowerCase());
    const userInfoMatch = user.userInfo?.toString().toLowerCase().includes(searchTerm.userInfo.toLowerCase());
    const distributorIdMatch = user.distributorId?.toString().toLowerCase().includes(searchTerm.distributorId.toLowerCase());
    const userMobileMatch = user.userMobile?.toString().toLowerCase().includes(searchTerm.userMobile.toLowerCase());
    
    // Verification fields - checking nested objects
    const aadharMatch = searchTerm.aadharStatus === '' || 
      (searchTerm.aadharStatus === 'true' && user.verification?.aadharStatus) ||
      (searchTerm.aadharStatus === 'false' && !user.verification?.aadharStatus);
    
    const panMatch = searchTerm.panStatus === '' || 
      (searchTerm.panStatus === 'true' && user.verification?.panStatus) ||
      (searchTerm.panStatus === 'false' && !user.verification?.panStatus);
    
    const emailMatch = searchTerm.emailStatus === '' || 
      (searchTerm.emailStatus === 'true' && user.verification?.emailStatus) ||
      (searchTerm.emailStatus === 'false' && !user.verification?.emailStatus);
    
    // Permission fields - checking nested objects
    const financeMatch = searchTerm.financePermission === '' || 
      (searchTerm.financePermission === 'true' && user.permissions?.finance) ||
      (searchTerm.financePermission === 'false' && !user.permissions?.finance);
    
    const travelMatch = searchTerm.travelPermission === '' || 
      (searchTerm.travelPermission === 'true' && user.permissions?.travel) ||
      (searchTerm.travelPermission === 'false' && !user.permissions?.travel);
    
    const otherMatch = searchTerm.otherPermission === '' || 
      (searchTerm.otherPermission === 'true' && user.permissions?.other) ||
      (searchTerm.otherPermission === 'false' && !user.permissions?.other);
    
    return srNoMatch && userInfoMatch && distributorIdMatch && userMobileMatch &&
           aadharMatch && panMatch && emailMatch &&
           financeMatch && travelMatch && otherMatch;
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

  // Function to handle boolean search fields (verification & permissions)
  const handleBooleanSearch = (column, value) => {
    setSearchTerm({
      ...searchTerm,
      [column]: value,
    });
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div>
      <div className="flex justify-between items-center pb-5">
        <h2 className="text-2xl font-semibold">Users</h2>
        <div className="text-sm text-gray-500">
          Showing {filteredData.length} users
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200  ">
          <thead>
            {/* First row with main headers and spanning headers */}
            <tr>
              <th className="border border-gray-200  px-4 py-2 text-center">Sr No</th>
              <th className="border border-gray-200  px-4 py-2 text-center">User Info</th>
              <th className="border border-gray-200  px-4 py-2 text-center">Distributer ID</th>
              <th className="border border-gray-200  px-4 py-2 text-center">Mobile No</th>
              <th colSpan="3" className="border border-gray-200  px-4 py-2 text-center bg-gray-100">Verification</th>
              <th colSpan="3" className="border border-gray-200  px-4 py-2 text-center bg-gray-100">Permission</th>
            </tr>
            
            {/* Second row with sub-headers for verification and permission */}
            <tr>
              {/* Empty cells for the first 4 columns */}
              <th className="border border-gray-200  px-4 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm.srNo}
                  onChange={(e) => handleSearch(e, 'srNo')}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                />
              </th>
              <th className="border border-gray-200  px-4 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm.userInfo}
                  onChange={(e) => handleSearch(e, 'userInfo')}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                />
              </th>
              <th className="border border-gray-200  px-4 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm.distributorId}
                  onChange={(e) => handleSearch(e, 'distributorId')}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                />
              </th>
              <th className="border border-gray-200  px-4 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm.userMobile}
                  onChange={(e) => handleSearch(e, 'userMobile')}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                />
              </th>
              
              {/* Verification sub-headers */}
              <th className="border border-gray-200  px-4 py-2 text-center bg-gray-50">Aadhar</th>
              <th className="border border-gray-200  px-4 py-2 text-center bg-gray-50">PAN</th>
              <th className="border border-gray-200  px-4 py-2 text-center bg-gray-50">Email</th>
              
              {/* Permission sub-headers */}
              <th className="border border-gray-200  px-4 py-2 text-center bg-gray-50">Finance</th>
              <th className="border border-gray-200  px-4 py-2 text-center bg-gray-50">Travel</th>
              <th className="border border-gray-200  px-4 py-2 text-center bg-gray-50">Other</th>
            </tr>
            
            {/* Third row with search inputs for verification and permission */}
            <tr>
              {/* Empty cells for the first 4 columns */}
              <th className="border border-gray-200  px-4 py-2"></th>
              <th className="border border-gray-200  px-4 py-2"></th>
              <th className="border border-gray-200  px-4 py-2"></th>
              <th className="border border-gray-200  px-4 py-2"></th>
              
              {/* Verification search fields */}
              <th className="border border-gray-200  px-4 py-2 text-center">
                <select 
                  value={searchTerm.aadharStatus}
                  onChange={(e) => handleBooleanSearch('aadharStatus', e.target.value)}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                >
                  <option value="">All</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
                </select>
              </th>
              <th className="border border-gray-200  px-4 py-2 text-center">
                <select 
                  value={searchTerm.panStatus}
                  onChange={(e) => handleBooleanSearch('panStatus', e.target.value)}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                >
                  <option value="">All</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
                </select>
              </th>
              <th className="border border-gray-200  px-4 py-2 text-center">
                <select 
                  value={searchTerm.emailStatus}
                  onChange={(e) => handleBooleanSearch('emailStatus', e.target.value)}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                >
                  <option value="">All</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
                </select>
              </th>
              
              {/* Permission search fields */}
              <th className="border border-gray-200  px-4 py-2 text-center">
                <select 
                  value={searchTerm.financePermission}
                  onChange={(e) => handleBooleanSearch('financePermission', e.target.value)}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                >
                  <option value="">All</option>
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </th>
              <th className="border border-gray-200  px-4 py-2 text-center">
                <select 
                  value={searchTerm.travelPermission}
                  onChange={(e) => handleBooleanSearch('travelPermission', e.target.value)}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                >
                  <option value="">All</option>
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </th>
              <th className="border border-gray-200  px-4 py-2 text-center">
                <select 
                  value={searchTerm.otherPermission}
                  onChange={(e) => handleBooleanSearch('otherPermission', e.target.value)}
                  className="w-full border-none text-xs p-1 focus:outline-none"
                >
                  <option value="">All</option>
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </th>
            </tr>
          </thead>
          
          <tbody>
            {currentItems.map((user, index) => (
              <tr key={user.srNo} className={index % 2 !== 0 ? 'bg-white' : 'bg-white'}>
                <td className="border text-xs border-gray-200  text-center ">{user.srNo}</td>
                <td className="border text-xs border-gray-200  text-center ">{user.userInfo}</td>
                <td className="border text-xs border-gray-200  text-center ">{user.distributorId}</td>
                <td className="border text-xs border-gray-200  text-center">{user.userMobile}</td>
                
                {/* Verification status cells with icons */}
                <td className="border border-gray-200  text-center py-2">
                  {user.verification?.aadharStatus ? (
                    <Check size={20} className="mx-auto text-green-600" />
                  ) : (
                    <X size={20} className="mx-auto text-red-600" />
                  )}
                </td>
                <td className="border border-gray-200  text-center py-2">
                  {user.verification?.panStatus ? (
                    <Check size={20} className="mx-auto text-green-600" />
                  ) : (
                    <X size={20} className="mx-auto text-red-600" />
                  )}
                </td>
                <td className="border border-gray-200  text-center py-2">
                  {user.verification?.emailStatus ? (
                    <Check size={20} className="mx-auto text-green-600" />
                  ) : (
                    <X size={20} className="mx-auto text-red-600" />
                  )}
                </td>
                
                {/* Permission status cells with icons */}
                <td className="border border-gray-200  text-center py-2">
                  {user.permissions?.finance ? (
                    <Check size={20} className="mx-auto text-green-600" />
                  ) : (
                    <X size={20} className="mx-auto text-red-600" />
                  )}
                </td>
                <td className="border border-gray-200  text-center py-2">
                  {user.permissions?.travel ? (
                    <Check size={20} className="mx-auto text-green-600" />
                  ) : (
                    <X size={20} className="mx-auto text-red-600" />
                  )}
                </td>
                <td className="border border-gray-200  text-center py-2">
                  {user.permissions?.other ? (
                    <Check size={20} className="mx-auto text-green-600" />
                  ) : (
                    <X size={20} className="mx-auto text-red-600" />
                  )}
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="10" className="border border-gray-200   text-center py-4">
                  No users found matching the search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 0 && (
        <div className="flex justify-between items-center py-4">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} users
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
                srNo: '',
                userInfo: '',
                distributorId: '',
                userMobile: '',
                aadharStatus: '',
                panStatus: '',
                emailStatus: '',
                financePermission: '',
                travelPermission: '',
                otherPermission: '',
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