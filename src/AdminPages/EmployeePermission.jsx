import React, { useState } from "react";

const EmployeePermission = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [permissions, setPermissions] = useState({});

  const employees = ["John Doe", "Jane Smith", "Alice Johnson"];
  const pages = ["Dashboard", "Transactions", "Reports", "User Management"];

  const handlePermissionChange = (page) => {
    setPermissions((prev) => ({
      ...prev,
      [page]: !prev[page],
    }));
  };

  const handleSave = () => {
    if (!selectedEmployee) {
      alert("Please select an employee");
      return;
    }

    console.log("Saving permissions for:", selectedEmployee);
    console.log("Permissions:", permissions);
    alert("Permissions saved!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Assign Page Access</h1>

        {/* Employee Selector */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Select Employee</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-xl"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">-- Select --</option>
            {employees.map((emp) => (
              <option key={emp} value={emp}>
                {emp}
              </option>
            ))}
          </select>
        </div>

        {/* Permissions */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Assign Pages</label>
          <div className="grid grid-cols-2 gap-4">
            {pages.map((page) => (
              <label key={page} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={permissions[page] || false}
                  onChange={() => handlePermissionChange(page)}
                  className="accent-blue-600"
                />
                <span className="text-gray-800">{page}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Save Permissions
        </button>
      </div>
    </div>
  );
};

export default EmployeePermission;
