import { Pencil, Plus, X } from "phosphor-react"; // Import X (close) icon
import { useState } from "react";
import EmployeeRegistration from "./EmployeeRegistration"; // Adjust the import path as necessary

export default function EmployeeMaster() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      employeeId: "EMP001",
      name: "Ravi Sharma",
      email: "ravi@dhanupay.com",
      mobile: "9876543210",
      role: "HR",
      joiningDate: "2023-01-15",
      branch: "Mumbai",
      status: "Active",
    },
    {
      id: 2,
      employeeId: "EMP002",
      name: "Neha Singh",
      email: "neha@dhanupay.com",
      mobile: "9123456780",
      role: "Fund Manager",
      joiningDate: "2023-03-20",
      branch: "Delhi",
      status: "Inactive",
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);

  const handleEdit = (id) => {
    const emp = employees.find((emp) => emp.id === id);
    setEditingId(id);
    setEditForm({ ...emp });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = () => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === editingId ? { ...editForm } : emp))
    );
    setEditingId(null);
    setEditForm({});
  };

  const handleStatusToggle = (id) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              status: emp.status === "Active" ? "Inactive" : "Active",
            }
          : emp
      )
    );
  };

  const handleAddEmployee = (newEmployee) => {
    const newId = Math.max(...employees.map((e) => e.id)) + 1;
    setEmployees([...employees, { ...newEmployee, id: newId }]);
    setIsRegistrationVisible(false);
  };

  const columns = [
    {
      header: "Employee ID",
      accessor: "employeeId",
      editable: false,
    },
    {
      header: "Full Name",
      accessor: "name",
      editable: true,
    },
    {
      header: "Email",
      accessor: "email",
      editable: true,
    },
    {
      header: "Mobile",
      accessor: "mobile",
      editable: true,
    },
    {
      header: "Role",
      accessor: "role",
      editable: true,
      renderEdit: (value, onChange) => (
        <select
          className="border rounded px-2 py-1 w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="HR">HR</option>
          <option value="Fund Manager">Fund Manager</option>
          <option value="Customer Care">Customer Care</option>
          <option value="Worker">Worker</option>
          <option value="Support">Support</option>
          <option value="Finance">Finance</option>
        </select>
      ),
    },
    {
      header: "Joining Date",
      accessor: "joiningDate",
      editable: true,
      renderEdit: (value, onChange) => (
        <input
          type="date"
          className="border rounded px-2 py-1 w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ),
    },
    {
      header: "Branch",
      accessor: "branch",
      editable: true,
    },
    {
      header: "Status",
      accessor: "status",
      editable: false,
      render: (value, id) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer ${
            value === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
          onClick={() => handleStatusToggle(id)}
        >
          {value}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      editable: false,
      render: (id) =>
        editingId === id ? (
          <>
            <button
              className="text-green-600 hover:underline mr-2"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="text-gray-600 hover:underline"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="text-blue-600 hover:underline flex items-center gap-1"
            onClick={() => handleEdit(id)}
          >
            <Pencil className="h-5 w-5" /> Edit
          </button>
        ),
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Employee List</h2>
        <button
          onClick={() => setIsRegistrationVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={20} /> Add Employee
        </button>
      </div>

      {isRegistrationVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div className="bg-white rounded-lg w-full max-w-2xl relative h-[650px]"> {/* Set a fixed height */}
    <button
      className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
      onClick={() => setIsRegistrationVisible(false)}
    >
      <X size={24} />
    </button>
    <div className="h-full overflow-y-auto"> {/* This ensures content scrolls if it's too long */}
      <EmployeeRegistration
        onSave={handleAddEmployee}
        onCancel={() => setIsRegistrationVisible(false)}
      />
    </div>
  </div>
</div>

      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              {columns.map((col) => (
                <th key={col.accessor} className="p-3">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t text-sm">
                {columns.map((col) => (
                  <td key={col.accessor} className="p-3">
                    {col.editable && editingId === emp.id ? (
                      col.renderEdit ? (
                        col.renderEdit(
                          editForm[col.accessor],
                          (value) =>
                            setEditForm({
                              ...editForm,
                              [col.accessor]: value,
                            })
                        )
                      ) : (
                        <input
                          className="border rounded px-2 py-1 w-full"
                          value={editForm[col.accessor]}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              [col.accessor]: e.target.value,
                            })
                          }
                        />
                      )
                    ) : col.render ? (
                      col.render(emp[col.accessor], emp.id)
                    ) : (
                      emp[col.accessor]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
