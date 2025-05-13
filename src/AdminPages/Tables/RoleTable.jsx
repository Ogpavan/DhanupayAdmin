import React from 'react';
import { PencilSimple, Trash } from 'phosphor-react';
import Swal from 'sweetalert2';

const RoleTable = ({ Rolelist, handleRoleEdit, handleRoleDelete }) => {
  const handleDeleteRole = (RoleID) => {
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
        handleRoleDelete(RoleID);
        Swal.fire('Deleted!', 'The role has been deleted.', 'success');
      }
    });
  };

  if (!Array.isArray(Rolelist) || Rolelist.length === 0) {
    return (
      <div className="w-full p-4">
        <h2 className="text-xl font-semibold mb-4">No Roles Available</h2>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">S No</th>
              <th className="border p-2 text-left">Role Name</th>
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-left">User Type</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Rolelist.map((role, index) => (
              <tr key={role.RoleID}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{role.RoleName}</td>
                <td className="border p-2">{role.RoleDescription || '—'}</td>
                <td className="border p-2">{role.UserType}</td>
                <td className="border p-2">
                  <div className="flex justify-start gap-2">
                    <button
                      onClick={() => handleRoleEdit(role)}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="Edit"
                    >
                      <PencilSimple size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.RoleID)}
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

export default RoleTable;
