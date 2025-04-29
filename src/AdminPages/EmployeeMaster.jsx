import { Pencil, Plus } from "phosphor-react";
import { useState } from "react";

export default function EmployeeMaster() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Ravi Sharma",
      email: "ravi@dhanupay.com",
      mobile: "9876543210",
      role: "Distributor",
      status: "Active",
    },
    {
      id: 2,
      name: "Neha Singh",
      email: "neha@dhanupay.com",
      mobile: "9123456780",
      role: "Retailer",
      status: "Inactive",
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "Retailer",
    status: "Active",
  });

  const handleEdit = (emp) => {
    setEditingId(emp.id);
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

  const handleAddEmployee = () => {
    const newId = Math.max(...employees.map((e) => e.id)) + 1;
    setEmployees([...employees, { ...newEmployee, id: newId }]);
    setNewEmployee({
      name: "",
      email: "",
      mobile: "",
      role: "Retailer",
      status: "Active",
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Employee List</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={20} /> Add Employee
        </button>
      </div>

      {/* Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Employee</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full border rounded px-3 py-2"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded px-3 py-2"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Mobile"
                className="w-full border rounded px-3 py-2"
                value={newEmployee.mobile}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, mobile: e.target.value })
                }
              />
              <select
                className="w-full border rounded px-3 py-2"
                value={newEmployee.role}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, role: e.target.value })
                }
              >
                <option value="Admin">Admin</option>
                <option value="MasterDistributor">Master Distributor</option>
                <option value="Distributor">Distributor</option>
                <option value="Retailer">Retailer</option>
              </select>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployee}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t text-sm">
                <td className="p-3">
                  {editingId === emp.id ? (
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  ) : (
                    emp.name
                  )}
                </td>
                <td className="p-3">
                  {editingId === emp.id ? (
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                    />
                  ) : (
                    emp.email
                  )}
                </td>
                <td className="p-3">
                  {editingId === emp.id ? (
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editForm.mobile}
                      onChange={(e) =>
                        setEditForm({ ...editForm, mobile: e.target.value })
                      }
                    />
                  ) : (
                    emp.mobile
                  )}
                </td>
                <td className="p-3">
                  {editingId === emp.id ? (
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                    >
                      <option value="Admin">Admin</option>
                      <option value="MasterDistributor">Master Distributor</option>
                      <option value="Distributor">Distributor</option>
                      <option value="Retailer">Retailer</option>
                    </select>
                  ) : (
                    emp.role
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                      emp.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                    onClick={() => handleStatusToggle(emp.id)}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="p-3">
                  {editingId === emp.id ? (
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
                      onClick={() => handleEdit(emp)}
                    >
                      <Pencil className="h-5 w-5" /> Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
