import React from 'react';
import { PencilSimple, Trash } from 'phosphor-react';
import Swal from 'sweetalert2';

const CityTable = ({ cities, handleCityEdit, handlecityDelete }) => {
  const handleDeleteCity = (cityId) => {
    Swal.fire({
      title: 'Are you sure?',
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handlecityDelete(cityId);
        Swal.fire('Deleted!', 'The city has been deleted.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
    });
  };

  if (!cities || cities.length === 0) {
    return (
      <div className="w-full lg:w-1/2 p-4">
        <h2 className="text-xl font-semibold mb-4">No Cities Available</h2>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">City ID</th>
              <th className="border p-2">City Name</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr key={city.CityId}>
                <td className="border p-2">{city.CityId}</td>
                <td className="border p-2">{city.CityName}</td>
                <td className="border p-2">
                  <div className="flex justify-around">
                    <button
                      onClick={() => handleCityEdit(city)}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="Update"
                    >
                      <PencilSimple size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteCity(city.CityId)}
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

export default CityTable;
