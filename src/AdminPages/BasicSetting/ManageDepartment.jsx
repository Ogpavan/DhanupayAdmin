import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { fetchDepartmentList } from '../../api/DepartmentListApi.js';
import DepartmentTable from '../Tables/DepartmentTable';

const ManageDepartment = () => {
  // Constants
  const token = Cookies.get('token');
  const userId = Cookies.get('UserId');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // State management
  const [departmentList, setDepartmentList] = useState([]);
  const [departmentName, setDepartmentName] = useState('');
  const [departmentDesc, setDepartmentDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API Headers
  const getHeaders = useCallback(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }), [token]);

  // Load departments from API
  const loadDepartments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchDepartmentList();
      setDepartmentList(data || []);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      // Swal.fire({
      //   icon: 'error',
      //   title: 'Error',
      //   text: ,
      //   toast: true,
      //   position: 'center',
      //   showConfirmButton: false,
      //   timer: 3000
      // });
      Swal.fire("Success",  'Failed to load departments. Please try again.', "success");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize component
  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  // Create new department
  const handleCreate = async () => {
    const trimmedName = departmentName.trim();
    const trimmedDesc = departmentDesc.trim();

    if (!trimmedName) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Department name is required.',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/department/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          userId: parseInt(userId),
          DepartmentName: trimmedName,
          DepartmentDescription: trimmedDesc
        })
      });

      const result = await response.json();

      if (result.success) {
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Success!',
        //   text: result.message || 'Department created successfully',
        //   toast: true,
        //   position: 'center',
        //   showConfirmButton: false,
        //   timer: 3000
        // });

        Swal.fire("Success",  result?.message ||'Department created successfully', "success");
        setDepartmentName('');
        setDepartmentDesc('');
        await loadDepartments();
      } else {
        throw new Error(result.message || 'Failed to create department');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to create department. Please try again.',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit existing department
  const handleEdit = async (item) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Department',
      html: `
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
        <input id="swal-input1" class="swal2-input" placeholder="Department Name" value="${item.departmentName || ''}" maxlength="50" style="margin: 0;">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea id="swal-input2" class="swal2-textarea" placeholder="Description" maxlength="200" style="margin: 0;">${item.departmentDescription || ''}</textarea>
      </div>
    </div>
  `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value.trim();
        const description = document.getElementById('swal-input2').value.trim();

        if (!name) {
          Swal.showValidationMessage('Department name is required');
          return false;
        }
        if (!/^[a-zA-Z\s]*$/.test(name)) {
          Swal.showValidationMessage('Department name can only contain letters and spaces');
          return false;
        }
        if (name.length > 50) {
          Swal.showValidationMessage('Department name must be 50 characters or fewer');
          return false;
        }
        if (description.length > 200) {
          Swal.showValidationMessage('Description must be 200 characters or fewer');
          return false;
        }

        return { name, description };
      }
    });

    if (!formValues) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/department/update`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          userId: parseInt(userId),
          departmentId: item.DepartmentID,
          ...formValues
        })
      });

      const result = await response.json();

      if (result?.success !== false) {
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Updated!',
        //   text: result?.message || 'Department updated successfully',
        //   toast: true,
        //   position: 'center',
        //   showConfirmButton: false,
        //   timer: 3000
        // });

         Swal.fire("Success",  result?.message || 'Department updated successfully', "success");

      
        await loadDepartments();
      } else {
        throw new Error(result?.message || 'Update failed');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'Failed to update department. Please try again.',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  // Delete department
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Department',
      text: 'Are you sure you want to delete this department? This action cannot be undone.',
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
      const response = await fetch(`${BACKEND_URL}/api/department/delete`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          userId: parseInt(userId),
          DepartmentID: parseInt(id)
        })
      });

      const apiResult = await response.json();

      if (apiResult?.success !== false) {
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Deleted!',
        //   text: 'Department deleted successfully',
        //   toast: true,
        //   position: 'center',
        //   showConfirmButton: false,
        //   timer: 3000
        // });
        Swal.fire("Success",  'Department deleted successfully', "success");
        await loadDepartments();
      } else {
        throw new Error(apiResult?.message || 'Delete failed');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: error.message || 'Failed to delete department. Please try again.',
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
    setDepartmentName('');
    setDepartmentDesc('');
  };

  return (
    <div className="h-screen max-h-screen bg-gray-50 p-4 overflow-hidden">
      <div className="max-w-full mx-auto h-full flex flex-col">

        {/* Compact Header - Fixed height */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
              <p className="text-sm text-gray-600">Manage organizational departments and their descriptions</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Departments</div>
              <div className="text-lg font-semibold text-blue-600">
                {isLoading ? '...' : departmentList.length}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Flexible height using remaining space */}
        <div className="flex-1 min-h-0 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-full flex flex-col lg:flex-row">

            {/* Left Panel - Add Department Form - Fixed width on desktop */}
            <div className="flex-shrink-0 lg:w-96 border-b lg:border-b-0 lg:border-r border-gray-200 p-4">
              <div className="h-full flex flex-col">

                {/* Form Header */}
                <div className="flex-shrink-0 mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Add New Department</h2>
                  <p className="text-xs text-gray-600">Create a new organizational department</p>
                </div>

                {/* Form Content */}
                <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department Name *
                      </label>
                      <input
                        type="text"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        placeholder="e.g., Human Resources, IT, Finance"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                        disabled={isSubmitting}
                        maxLength={100}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={departmentDesc}
                        onChange={(e) => setDepartmentDesc(e.target.value)}
                        placeholder="Describe the department's responsibilities and functions..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm resize-none"
                        disabled={isSubmitting}
                        maxLength={500}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {departmentDesc.length}/500 characters
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-4 space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !departmentName.trim()}
                      className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
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
                        'Add Department'
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

            {/* Right Panel - Departments List - Takes remaining space */}
            <div className="flex-1 min-w-0 p-4 flex flex-col">

              {/* Table Header */}
              <div className="flex-shrink-0 flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Departments List</h2>
                  <p className="text-xs text-gray-600">
                    {isLoading ? 'Loading...' : `${departmentList.length} department(s) found`}
                  </p>
                </div>
                <button
                  onClick={loadDepartments}
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
                        <svg className="animate-spin h-6 w-6 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm text-gray-500">Loading departments...</p>
                      </div>
                    </div>
                  ) : departmentList.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center py-8">
                        <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        <h3 className="text-base font-medium text-gray-900 mb-1">No departments found</h3>
                        <p className="text-sm text-gray-500">Get started by adding your first department.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full">
                      <DepartmentTable
                        Departmentlist={departmentList}
                        handleDepartmentEdit={handleEdit}
                        handleDepartmentDelete={handleDelete}
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

export default ManageDepartment;