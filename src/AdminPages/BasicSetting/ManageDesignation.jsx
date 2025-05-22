import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { fetchdesingnationList } from '../../api/desingnationListApi .js';
import DesingnationTable from '../Tables/DesingnationTable';

const ManageDesignation = () => {
  const token = Cookies.get('token');
  const userId = Cookies.get('UserId');

  const [designationList, setDesignationList] = useState([]);
  const [designationName, setDesignationName] = useState('');
  const [designationDesc, setDesignationDesc] = useState('');

  useEffect(() => {
    fetchdesingnationList().then(setDesignationList);
  }, []);

  const handleCreate = async () => {
    if (!designationName) return Swal.fire('Error', 'Name required', 'error');

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/desingnation/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: parseInt(userId),
        desingnationName: designationName,
        desingnationDescription: designationDesc,
      }),
    });

    const data = await res.json();
    if (data.success) {
      Swal.fire('Success', data.message, 'success');
      setDesignationName('');
      setDesignationDesc('');
      fetchdesingnationList().then(setDesignationList);
    }
  };

  const handleEdit = async (designation) => {
    const { value: form } = await Swal.fire({
  title: 'Edit Designation',
  html: `
    <input id="name" class="swal2-input" placeholder="Designation Name" value="${designation.DesignationName || ''}" maxlength="50">
    <input id="desc" class="swal2-input" placeholder="Description" value="${designation.DesignationDescription || ''}" maxlength="200">
  `,
  showCancelButton: true,
  focusConfirm: false,
  preConfirm: () => {
    const name = document.getElementById('name').value.trim();
    const desc = document.getElementById('desc').value.trim();

    // Validations
    if (!name) {
      Swal.showValidationMessage('Designation name is required');
      return false;
    }
    if (!/^[a-zA-Z]+$/.test(name)) {
      Swal.showValidationMessage('Designation name must contain only alphabets (A–Z, a–z)');
      return false;
    }
    if (name.length > 50) {
      Swal.showValidationMessage('Designation name must be 50 characters or fewer');
      return false;
    }
    if (desc.length > 200) {
      Swal.showValidationMessage('Description must be 200 characters or fewer');
      return false;
    }

    return {
      desingnationName: name,
      desingnationDescription: desc,
    };
  }
});


    if (form) {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/desingnation/update`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          desingnationId: designation.DesignationID,
          ...form,
        }),
      });
      fetchdesingnationList().then(setDesignationList);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/desingnation/delete`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: parseInt(userId), desingnationID: parseInt(id) }),
    });
    fetchdesingnationList().then(setDesignationList);
  };

  return (
    <div className="p-6 bg-white rounded-lg mt-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div className="w-1/2 pr-6">
          <h2 className="text-xl font-bold mb-2">Add New Designation</h2>
          <p className="text-sm text-gray-500 mb-4">Create a new organizational designation</p>

          <label className="block text-sm font-medium mb-1">Designation Name *</label>
          <input
            className="border p-2 rounded w-full mb-4"
            value={designationName}
            onChange={(e) => setDesignationName(e.target.value)}
            placeholder="e.g., Manager, Assistant, Executive"
             maxLength={50}
          />

          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="border p-2 rounded w-full mb-4"
            value={designationDesc}
            onChange={(e) => setDesignationDesc(e.target.value)}
            placeholder="Describe the responsibilities and scope of this designation..."
            maxLength={500}
            rows={3}
          ></textarea>

          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Designation
            </button>
            <button
              onClick={() => {
                setDesignationName('');
                setDesignationDesc('');
              }}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Reset Form
            </button>
          </div>
        </div>

        <div className="w-1/2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Designations List</h2>
            <span className="text-sm text-gray-600">Total: <strong>{designationList.length}</strong></span>
          </div>
          <DesingnationTable
            designationList={designationList}
            handledesingnationEdit={handleEdit}
            handleDesignationDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageDesignation;