import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { fetchdesingnationList } from '../../api/desingnationListApi .js';
import DesingnationTable from '../Tables/DesingnationTable';

const ManageDesignation = () => {
  // Constants
  const token = Cookies.get('token');
  const userId = Cookies.get('UserId');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // State management
  const [designationList, setDesignationList] = useState([]);
  const [designationName, setDesignationName] = useState('');
  const [designationDesc, setDesignationDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API Headers
  const getHeaders = useCallback(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }), [token]);

  // Load designations from API
  const loadDesignations = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchdesingnationList();
      setDesignationList(data || []);
    } catch (error) {
      console.error("Failed to fetch designations:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load designations. Please try again.',
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 3000
      });

     Swal.fire("error",  'Failed to load designations. Please try again.', "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize component
  useEffect(() => {
    loadDesignations();
  }, [loadDesignations]);

  // Create new designation
  const handleCreate = async () => {
    const trimmedName = designationName.trim();
    const trimmedDesc = designationDesc.trim();

    if (!trimmedName) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Designation name is required.',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/desingnation/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          userId: parseInt(userId),
          desingnationName: trimmedName,
          desingnationDescription: trimmedDesc
        })
      });

      const result = await response.json();

      if (result.success) {
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Success!',
        //   text: result.message || 'Designation created successfully',
        //   toast: true,
        //   position: 'center',
        //   showConfirmButton: false,
        //   timer: 3000
        // });

        Swal.fire("success", result.message || 'Designation created successfully', "success");
        setDesignationName('');
        setDesignationDesc('');
        await loadDesignations();
      } else {
        throw new Error(result.message || 'Failed to create designation');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to create designation. Please try again.',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit existing designation
  const handleEdit = async (designation) => {
    const { value: form } = await Swal.fire({
      title: 'Edit Designation',
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Designation Name</label>
            <input id="name" class="swal2-input" placeholder="Designation Name" value="${designation.DesignationName || ''}" maxlength="50" style="margin: 0;">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id="desc" class="swal2-textarea" placeholder="Description" maxlength="200" style="margin: 0;">${designation.DesignationDescription || ''}</textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      preConfirm: () => {
        const name = document.getElementById('name').value.trim();
        const desc = document.getElementById('desc').value.trim();

        if (!name) {
          Swal.showValidationMessage('Designation name is required');
          return false;
        }
        if (!/^[a-zA-Z\s]*$/.test(name)) {
          Swal.showValidationMessage('Designation name can only contain letters and spaces');
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

    if (!form) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/desingnation/update`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          userId: parseInt(userId),
          desingnationId: designation.DesignationID,
          ...form
        })
      });

      const result = await response.json();

      if (result?.success !== false) {
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Updated!',
        //   text: result?.message || 'Designation updated successfully',
        //   toast: true,
        //   position: 'center',
        //   showConfirmButton: false,
        //   timer: 3000
        // });
        Swal.fire("success", result?.message || 'Designation updated successfully', "success");
        await loadDesignations();
      } else {
        throw new Error(result?.message || 'Update failed');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'Failed to update designation. Please try again.',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  // Delete designation
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Designation',
      text: 'Are you sure you want to delete this designation? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/desingnation/delete`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          userId: parseInt(userId),
          desingnationID: parseInt(id)
        })
      });

      const apiResult = await response.json();

      if (apiResult?.success !== false) {
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Deleted!',
        //   text: 'Designation deleted successfully',
        //   toast: true,
        //   position: 'center',
        //   showConfirmButton: false,
        //   timer: 3000
        // });
        Swal.fire("success", 'Designation deleted successfully', "success");
        await loadDesignations();
      } else {
        throw new Error(apiResult?.message || 'Delete failed');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: error.message || 'Failed to delete designation. Please try again.',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleCreate();
  };

  // Reset form
  const handleReset = () => {
    setDesignationName('');
    setDesignationDesc('');
  };

  return (
    <div className="h-screen max-h-screen bg-gray-50 p-4 overflow-hidden">
      <div className="max-w-full mx-auto h-full flex flex-col">

        {/* Compact Header - Fixed height */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Designation Management</h1>
              <p className="text-sm text-gray-600">Manage organizational designations and their descriptions</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Designations</div>
              <div className="text-lg font-semibold text-blue-600">
                {isLoading ? '...' : designationList.length}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Flexible height using remaining space */}
        <div className="flex-1 min-h-0 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-full flex flex-col lg:flex-row">

            {/* Left Panel - Add Designation Form - Fixed width on desktop */}
            <div className="flex-shrink-0 lg:w-96 border-b lg:border-b-0 lg:border-r border-gray-200 p-4">
              <div className="h-full flex flex-col">

                {/* Form Header */}
                <div className="flex-shrink-0 mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Add New Designation</h2>
                  <p className="text-xs text-gray-600">Create a new organizational designation</p>
                </div>

                {/* Form Content */}
                <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Designation Name *
                      </label>
                      <input
                        type="text"
                        value={designationName}
                        onChange={(e) => setDesignationName(e.target.value)}
                        placeholder="e.g., Manager, Assistant, Executive"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                        disabled={isSubmitting}
                        maxLength={50}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={designationDesc}
                        onChange={(e) => setDesignationDesc(e.target.value)}
                        placeholder="Describe the responsibilities and scope of this designation..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm resize-none"
                        disabled={isSubmitting}
                        maxLength={500}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {designationDesc.length}/500 characters
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-4 space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !designationName.trim()}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </>
                      ) : (
                        'Add Designation'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={isSubmitting}
                      className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm"
                    >
                      Reset Form
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Panel - Designations List - Takes remaining space */}
            <div className="flex-1 min-w-0 p-4 flex flex-col">

              {/* Table Header */}
              <div className="flex-shrink-0 flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Designations List</h2>
                  <p className="text-xs text-gray-600">
                    {isLoading ? 'Loading...' : `${designationList.length} designation(s) found`}
                  </p>
                </div>
                <button
                  onClick={loadDesignations}
                  disabled={isLoading}
                  className="flex items-center space-x-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 disabled:opacity-50"
                >
                  <svg className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  <span>Refresh</span>
                </button>
              </div>

              {/* Table Container - Uses all remaining space */}
              <div className="flex-1 min-h-0 overflow-hidden rounded-md border border-gray-200">
                <div className="h-full overflow-y-auto custom-scrollbar">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex flex-col items-center space-y-3">
                        <svg className="animate-spin h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm text-gray-500">Loading designations...</p>
                      </div>
                    </div>
                  ) : designationList.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center py-8">
                        <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                        </svg>
                        <h3 className="text-base font-medium text-gray-900 mb-1">No designations found</h3>
                        <p className="text-sm text-gray-500">Get started by adding your first designation.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full">
                      <DesingnationTable
                        designationList={designationList}
                        handledesingnationEdit={handleEdit}
                        handleDesignationDelete={handleDelete}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Ensure the container takes 80vh height */
        .h-screen {
          height: 80vh !important;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 1024px) {
          .lg\\:w-96 {
            width: 100%;
            max-height: 300px;
          }
        }

        /* SweetAlert2 custom styles */
        .swal2-html-container .space-y-4 > div + div {
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default ManageDesignation;