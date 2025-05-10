import React from 'react';
import { PencilSimple, Trash } from 'phosphor-react';
import Swal from 'sweetalert2';

const StateTable = ({ states, handlestateEdit, handlestateDelete }) => {
  const handleDeleteState = (stateId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(async(result) => {
      if (result.isConfirmed) {
        const resp=await handlestateDelete(stateId);
        console.log(resp);
        // Swal.fire('Deleted!', 'The state has been deleted.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
    });
  };

  if (!states || states.length === 0) {
    return (
      <div className="w-full lg:w-1/2 p-4">
        <h2 className="text-xl font-semibold mb-4">No States Available</h2>
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
              <th className="border p-2">State Name</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {states.map((state , index) => (
              <tr key={state.StateId}>
                 <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{state.StateName}</td>
                <td className="border p-2">
                  <div className="flex justify-around">
                    <button
                      onClick={() => handlestateEdit(state)}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="Edit"
                    >
                      <PencilSimple size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteState(state.StateId)}
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

export default StateTable;