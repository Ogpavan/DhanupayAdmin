import React from 'react';
import { PencilSimple, Trash } from 'phosphor-react';
import Swal from 'sweetalert2';

const DesignationTable = ({ designationList, handledesingnationEdit, handleDesignationDelete }) => {
  // console.log(designationList);

  const handleDeleteDesignation = (designationId) => {
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
        handleDesignationDelete(designationId);
        Swal.fire('Deleted!', 'The designation has been deleted.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
    });
  };

  if (!designationList || designationList.length === 0) {
    return (
      <div className="w-full lg:w-1/2 p-4">
        <h2 className="text-xl font-semibold mb-4">No designations Available</h2>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">S No</th>
              <th className="border p-2">Designation Name</th>
              <th className="border p-2">Designation Description</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {designationList.map((designation , index) => (
              <tr key={designation.DesignationID}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{designation.DesignationName}</td>
                <td className="border p-2">{designation.DesignationDescription || 'No description available'}</td>
                <td className="border p-2">
                  <div className="flex justify-around">
                    <button
                      onClick={() => handledesingnationEdit(designation)}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="Update"
                    >
                      <PencilSimple size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteDesignation(designation.DesignationID)}
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

export default DesignationTable;
