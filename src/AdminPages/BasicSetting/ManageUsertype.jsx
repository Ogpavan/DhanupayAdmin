import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { fetchUserTypeList } from '../../api/FetchUserTypeList.jsx';
import UserTypeTable from '../Tables/UserTypeTable';

const ManageUsertype = () => {
  // Constants
  const token = Cookies.get('token');
  const userId = Cookies.get('UserId');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // State management
  const [userTypeList, setUserTypeList] = useState([]);
  const [userTypeName, setUserTypeName] = useState('');
  const [userTypeDesc, setUserTypeDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API Headers
  const getHeaders = useCallback(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }), [token]);

  // Load user types from API
  const loadUserTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchUserTypeList();
      setUserTypeList(data || []);
    } catch (error) {
      console.error("Failed to fetch user types:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load user types. Please try again.',
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 3000
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize component
  useEffect(() => {
    loadUserTypes();
  }, [loadUserTypes]);

  // Create new user type
  const handleCreate = async () => {
    const trimmedName = userTypeName.trim();
    const trimmedDesc = userTypeDesc.trim();
    
    if (!trimmedName) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'User type name is required.',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/TypeMaster/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          userId: parseInt(userId),
          UserTypeName: trimmedName,
          UserTypeDescription: trimmedDesc
        })
      });

      const result = await response.json();
      
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: result.message || 'User type created successfully',
          toast: true,
          position: 'center',
          showConfirmButton: false,
          timer: 3000
        });
        setUserTypeName('');
        setUserTypeDesc('');
        await loadUserTypes();
      } else {
        throw new Error(result.message || 'Failed to create user type');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to create user type. Please try again.',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit user type
  const handleEdit = async (item) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit User Type',
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">User Type Name</label>
            <input id="swal-input1" class="swal2-input" placeholder="User Type Name" value="${item.UserTypeName || ''}" style="margin: 0;">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id="swal-input2" class="swal2-textarea" placeholder="Description" style="margin: 0;">${item.UserTypeDescription || ''}</textarea>
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
        const name = document.getElementById('swal-input1').value;
        const desc = document.getElementById('swal-input2').value;
        if (!name.trim()) {
          Swal.showValidationMessage('User type name is required');
          return false;
        }
        return { name: name.trim(), description: desc.trim() };
      }
    });

    if (formValues) {
      Swal.fire({
        icon: 'info',
        title: 'Coming Soon',
        text: 'Update API is not yet implemented. This feature will be available soon.',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  // Delete user type
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete User Type',
      text: 'Are you sure you want to delete this user type? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      Swal.fire({
        icon: 'info',
        title: 'Coming Soon',
        text: 'Delete API is not yet implemented. This feature will be available soon.',
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
    setUserTypeName('');
    setUserTypeDesc('');
  };

  return (
    <div className="h-screen max-h-screen bg-gray-50 p-4 overflow-hidden">
      <div className="max-w-full mx-auto h-full flex flex-col">
        
        {/* Compact Header - Fixed height */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Type Management</h1>
              <p className="text-sm text-gray-600">Manage user types and their descriptions</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Types</div>
              <div className="text-lg font-semibold text-purple-600">
                {isLoading ? '...' : userTypeList.length}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Flexible height using remaining space */}
        <div className="flex-1 min-h-0 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-full flex flex-col lg:flex-row">
            
            {/* Left Panel - Add User Type Form - Fixed width on desktop */}
            <div className="flex-shrink-0 lg:w-96 border-b lg:border-b-0 lg:border-r border-gray-200 p-4">
              <div className="h-full flex flex-col">
                
                {/* Form Header */}
                <div className="flex-shrink-0 mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Add New User Type</h2>
                  <p className="text-xs text-gray-600">Create a new user type with description</p>
                </div>

                {/* Form Content */}
                <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User Type Name *
                      </label>
                      <input
                        type="text"
                        value={userTypeName}
                        onChange={(e) => setUserTypeName(e.target.value)}
                        placeholder="e.g., Administrator, Editor, Viewer"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                        disabled={isSubmitting}
                        maxLength={100}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={userTypeDesc}
                        onChange={(e) => setUserTypeDesc(e.target.value)}
                        placeholder="Describe the user type and its permissions..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm resize-none"
                        disabled={isSubmitting}
                        maxLength={500}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {userTypeDesc.length}/500 characters
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-4 space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !userTypeName.trim()}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
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
                        'Add User Type'
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

            {/* Right Panel - User Types List - Takes remaining space */}
            <div className="flex-1 min-w-0 p-4 flex flex-col">
              
              {/* Table Header */}
              <div className="flex-shrink-0 flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">User Types List</h2>
                  <p className="text-xs text-gray-600">
                    {isLoading ? 'Loading...' : `${userTypeList.length} user type(s) found`}
                  </p>
                </div>
                <button
                  onClick={loadUserTypes}
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
                        <svg className="animate-spin h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm text-gray-500">Loading user types...</p>
                      </div>
                    </div>
                  ) : userTypeList.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center py-8">
                        <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                        </svg>
                        <h3 className="text-base font-medium text-gray-900 mb-1">No user types found</h3>
                        <p className="text-sm text-gray-500">Get started by adding your first user type.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full">
                      <UserTypeTable
                        UserTypelist={userTypeList}
                        handleUserTypeEdit={handleEdit}
                        handleUserTypeDelete={handleDelete}
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

export default ManageUsertype;