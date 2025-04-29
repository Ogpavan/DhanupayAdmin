import React from 'react';
import { PencilSimple, Trash } from 'phosphor-react';
import Swal from 'sweetalert2';

const DepartmentTable = ({ Departmentlist, handleDepartmentEdit, handleDepartmentDelete }) => {
  const handleDeleteDepartment = (departmentId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDepartmentDelete(departmentId);
        Swal.fire('Deleted!', 'The department has been deleted.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
    });
  };

  if (!Departmentlist || Departmentlist.length === 0) {
    return (
      <div className="w-full lg:w-1/2 p-4">
        <h2 className="text-xl font-semibold mb-4">No Departments Available</h2>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Department ID</th>
              <th className="border p-2">Department Name</th>
              <th className="border p-2">Department Description</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Departmentlist.map((department) => (
              <tr key={department.DepartmentID}>
                <td className="border p-2">{department.DepartmentID}</td>
                <td className="border p-2">{department.DepartmentName}</td>
                <td className="border p-2">{department.DepartmentDescription || 'No description available'}</td>
                <td className="border p-2">
                  <div className="flex justify-around">
                    <button
                      onClick={() => handleDepartmentEdit(department)}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="Update"
                    >
                      <PencilSimple size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(department.DepartmentID)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentTable;