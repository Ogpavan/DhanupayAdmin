import React from 'react';
import { PencilSimple, Trash } from 'phosphor-react';
import Swal from 'sweetalert2';

const UserTypeTable = ({ UserTypelist, handleUserTypeEdit, handleUserTypeDelete }) => {
  const handleDeleteUserType = (UserTypeId) => {
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
        handleUserTypeDelete(UserTypeId);
        Swal.fire('Deleted!', 'The UserType has been deleted.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
    });
  };

  if (!UserTypelist || UserTypelist.length === 0) {
    return (
      <div className="w-full lg:w-1/2 p-4">
        <h2 className="text-xl font-semibold mb-4">No UserTypes Available</h2>
      </div>
    );
  }

  return (
    <div className="w-full  overflow-hidden">
      <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">S No</th>
              <th className="border p-2">UserType Name</th>
              <th className="border p-2">UserType Description</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {UserTypelist.map((UserType , index) => (
              <tr key={UserType.UserTypeID}>
                 <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{UserType.UserTypeName}</td>
                <td className="border p-2">{UserType.UserTypeDescription || 'No description available'}</td>
                <td className="border p-2">
                  <div className="flex justify-around">
                    <button
                      onClick={() => handleUserTypeEdit(UserType)}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="Update"
                    >
                      <PencilSimple size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteUserType(UserType.UserTypeID)}
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

export default UserTypeTable;