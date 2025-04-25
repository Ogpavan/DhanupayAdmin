import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

const initialData = [
  { operator: "Airtel", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Airtel Digital TV", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Big TV", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "BSNL Recharge", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "BSNL Topup", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Dish TV", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Idea", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Independent TV", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "JIO", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },  { operator: "Airtel", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Airtel Digital TV", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Big TV", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "BSNL Recharge", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "BSNL Topup", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Dish TV", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Idea", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "Independent TV", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] },
  { operator: "JIO", md: [0.25, 0.25, 0.25], distributor: [0.5, 0.5, 0.5], retailer: [2.0, 2.0, 2.0], api: [0.0, 0.0, 0.0] }
  
];

const Commission = () => {
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
    <div className="ag-theme-quartz" style={{ height: "500px", width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        // gridOptions={myTheme.config}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          
          editable: true,
          cellStyle: { borderRight: "1px solid #e0e0e0" },
        }}
        gridOptions={myTheme.themeQuartz}
      />
    </div>
  );
};

export default Commission;
