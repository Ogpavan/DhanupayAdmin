import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { useLoader } from '../context/LoaderContext.jsx'

const initialData = [
  { operator: "Prepaid Mobile", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Postpaid Mobile", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "AEPS 1", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "AEPS 2", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "CMS", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "M-ATM", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "DMT 1", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "DMT 2", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Flight Booking", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },  { operator: "Airtel", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Aadhaar Pay", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Cash Deposit", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Move to Bank", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Insurance", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Loan", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Credit Card", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Account Opening", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "IRCTC", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Motor Insurance", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Personal Loan", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Loan Repayment", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Education Fee", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Insurance Premium", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Fastag", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "BroadBand", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "DTH", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
];

const UserCommission = () => {

  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    showLoader(); // Show loader immediately

    const timer = setTimeout(() => {
      hideLoader(); // Hide after 3 seconds
    }, 1000);

    // Cleanup function to clear timer if component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this only runs once
  
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState(initialData);
  const [editingCell, setEditingCell] = useState(null);
  const [isEditingAll, setIsEditingAll] = useState(false);
  const [filter, setFilter] = useState("");
  const inputRef = useRef(null);

  const rowsPerPage = 10;

  const filteredData = tableData.filter((row) =>
    row.operator.toLowerCase().includes(filter.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  const handleChangePage = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "next" && prev < totalPages) return prev + 1;
      if (direction === "prev" && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handleCellDoubleClick = (rowIdx, category, valIdx) => {
    setEditingCell({ rowIdx, category, valIdx });
  };

  const handleCellChange = (e, rowIdx, category, valIdx) => {
    const updatedData = [...tableData];
    updatedData[rowIdx][category][valIdx] = parseFloat(e.target.value);
    setTableData(updatedData);
  };

  const handleBlur = () => {
    setEditingCell(null);
  };

  const toggleEditAll = () => {
    setIsEditingAll((prev) => !prev);
    setEditingCell(null);
  };

  const saveDataToServer = async () => {
    try {
      const response = await fetch("/api/save-commission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tableData)
      });
      

      if (!response.ok) throw new Error("Failed to save data");

      const result = await response.json();
      Swal.fire("Success", "Data saved successfully!", "success");
    } catch (error) {
      console.error("Save failed:", error);
      Swal.fire("Error", "Failed to save data.", "error");
    }
  };

  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="overflow-x-auto p-4 text-sm ">
      <div className="flex justify-between items-center">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Operator Name..."
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded  max-w-xs outline-none  w-64"
        />
      </div>


      <div className="flex justify-end gap-2 ">
          <button
            onClick={toggleEditAll}
            className="px-6 py-2 bg-yellow-500 text-white rounded shadow-md hover:bg-yellow-600"
          >
            {isEditingAll ? "Cancel Edit All" : "Edit All"}
          </button>
          <button
            onClick={saveDataToServer}
            className="px-6 py-2 bg-green-600 text-white rounded shadow-md hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>

        </div>
      <div className="h-full overflow-y-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 ">
              <th className="border border-gray-300 p-2" rowSpan="2">Operator Name</th>
              <th className="border border-gray-300 p-2" colSpan="3">Master Distributor (M/D) %<br /><span className="text-sm">Including GST (Goods and Service Tax) if commission agent</span></th>
              <th className="border border-gray-300 p-2" colSpan="3">Distributor %<br /><span className="text-sm">Including GST (Goods and Service Tax) if commission agent</span></th>
              <th className="border border-gray-300 p-2" colSpan="3">Retailer %<br /><span className="text-sm">Including GST (Goods and Service Tax)</span></th>
              <th className="border border-gray-300 p-2" colSpan="3">API %<br /><span className="text-sm">Including GST (Goods and Service Tax)</span></th>
            </tr>
            <tr className="bg-gray-100">
              {Array.from({ length: 4 }, () => ["1-100", "101-200", "201-ABOVE"]).flat().map((label, i) => (
                <th key={i} className="border border-gray-300 p-2 text-xs bg-gray-100">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border border-gray-300 p-2 whitespace-nowrap">{row.operator}</td>
                {["md", "distributor", "retailer", "api"].flatMap((category) => (
                  row[category].map((val, valIdx) => {
                    const globalRowIdx = tableData.findIndex(item => item.operator === row.operator);
                    const isEditing =
                      isEditingAll ||
                      (editingCell?.rowIdx === globalRowIdx &&
                      editingCell?.category === category &&
                      editingCell?.valIdx === valIdx);
                    return (
                      <td
                        key={`${category}-${valIdx}-${rowIndex}`}
                        className="border border-gray-300 p-2 text-center cursor-pointer"
                        onDoubleClick={() => handleCellDoubleClick(globalRowIdx, category, valIdx)}
                      >
                        {isEditing ? (
                          <input
                            ref={inputRef}
                            type="number"
                            step="0.01"
                            value={val}
                            onChange={(e) => handleCellChange(e, globalRowIdx, category, valIdx)}
                            onBlur={handleBlur}
                            className="w-full text-center border rounded p-1"
                          />
                        ) : (
                          val.toFixed(2)
                        )}
                      </td>
                    );
                  })
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handleChangePage("prev")}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handleChangePage("next")}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
       
      </div>
    </div>
  );
};

export default UserCommission;
