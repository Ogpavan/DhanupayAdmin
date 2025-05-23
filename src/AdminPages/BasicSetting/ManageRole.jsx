import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import RoleTable from '../Tables/RoleTable';
import { fetchRoleList } from '../../api/RoleList.jsx';
import { fetchUserTypeList } from '../../api/FetchUserTypeList.jsx';

const ManageRole = () => {
  // Constants
  const token = Cookies.get("token");
  const userId = Cookies.get("UserId");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // State management
  const [roles, setRoles] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API Headers
  const getHeaders = useCallback(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }), [token]);

  // Load roles and user types from API
  const loadRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const [rolesData, userTypesData] = await Promise.all([
        fetchRoleList(),
        fetchUserTypeList()
      ]);
      setRoles(rolesData || []);
      setUserTypes(userTypesData || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      // Swal.fire({
      //   icon: 'error',
      //   title: 'Error',
      //   text: 'Failed to load data. Please try again.',
      //   toast: true,
      //   position: 'center',
      //   showConfirmButton: false,
      //   timer: 3000
      // });
      Swal.fire("error",  'Failed to load data. Please try again.', "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize component
  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  // Create new role
  const handleCreate = async () => {
    const trimmedName = roleName.trim();
    const trimmedDesc = roleDesc.trim();
    
    if (!selectedUserType || !trimmedName) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please select a user type and enter a role name.',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/Role/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          UserId: parseInt(userId),
          RoleName: trimmedName,
          RoleDescription: trimmedDesc,
          UserTypeID: parseInt(selectedUserType)
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Success!',
        //   text: result.message || 'Role created successfully',
        //   toast: true,
        //   position: 'center',
        //   showConfirmButton: false,
        //   timer: 3000
        // });
        Swal.fire("success", result.message || 'Role created successfully', "success");
        setRoleName('');
        setRoleDesc('');
        setSelectedUserType('');
        await loadRoles();
      } else {
        throw new Error(result.message || 'Failed to create role');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to create role. Please try again.',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit existing role
  const handleEdit = async (role) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Role',
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
            <input id="swal-input1" class="swal2-input" placeholder="Role Name" value="${role.RoleName || ''}" style="margin: 0;">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id="swal-input2" class="swal2-textarea" placeholder="Description" style="margin: 0;">${role.RoleDescription || ''}</textarea>
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
          Swal.showValidationMessage('Role name is required');
          return false;
        }
        return { 
          RoleName: name.trim(), 
          RoleDescription: desc.trim() 
        };
      }
    });

    if (!formValues) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/Role/update`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          userId: parseInt(userId),
          RoleID: role.RoleID,
          ...formValues
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Updated!',
        //   text: result.message || 'Role updated successfully',
        //   toast: true,
        //   position: 'center',
        //   showConfirmButton: false,
        //   timer: 3000
        // });
        Swal.fire("success", result.message || 'Role updated successfully', "success");
        await loadRoles();
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'Failed to update role. Please try again.',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  // Delete role
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Role',
      text: 'Are you sure you want to delete this role? This action cannot be undone.',
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
      const response = await fetch(`${BACKEND_URL}/api/role/delete`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          userId: parseInt(userId),
          RoleId: parseInt(id)
        })
      });

      const apiResult = await response.json();
      
      if (apiResult?.success !== false) {
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Deleted!',
        //   text: 'Role deleted successfully',
        //   toast: true,
        //   position: 'center',
        //   showConfirmButton: false,
        //   timer: 3000
        // });
        Swal.fire("success", 'Role deleted successfully', "success");
        await loadRoles();
      } else {
        throw new Error(apiResult.message || 'Delete failed');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: error.message || 'Failed to delete role. Please try again.',
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
    setSelectedUserType('');
    setRoleName('');
    setRoleDesc('');
  };

  // Get selected user type name
  const getSelectedUserTypeName = () => {
    const userType = userTypes.find(ut => parseInt(ut.UserTypeID) === parseInt(selectedUserType));
   
    return userType?.UserTypeName || '';
  };

  return (
    <div className="h-screen max-h-screen bg-gray-50 p-4 overflow-y-scroll">
      <div className="max-w-full mx-auto h-full flex flex-col">
        
        {/* Compact Header - Fixed height */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
              <p className="text-sm text-gray-600">Manage roles and assign them to user types</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Roles</div>
              <div className="text-lg font-semibold text-blue-600">
                {isLoading ? '...' : roles.length}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Flexible height using remaining space */}
        <div className="flex-1 min-h-0 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-full flex flex-col lg:flex-row">
            
            {/* Left Panel - Add Role Form - Fixed width on desktop */}
            <div className="flex-shrink-0 lg:w-96 border-b lg:border-b-0 lg:border-r overflow-y-scroll hide-scrollbar border-gray-200 p-4">
              <div className="h-full flex flex-col">
                
                {/* Form Header */}
                <div className="flex-shrink-0 mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Add New Role</h2>
                  <p className="text-xs text-gray-600">Create a new role for specific user type</p>
                </div>

                {/* Form Content */}
                <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User Type *
                      </label>
                      <select
                        value={selectedUserType}
                        onChange={(e) => setSelectedUserType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2  focus:border-transparent transition-all duration-200 text-sm bg-white"
                        disabled={isSubmitting || isLoading}
                      >
                        <option value="">Select User Type</option>
                        {userTypes.map(userType => (
                          <option key={userType.UserTypeID} value={userType.UserTypeID}>
                            {userType.UserTypeName}
                          </option>
                        ))}
                      </select>
                      {selectedUserType && (
                        <div className="text-xs text-green-600 mt-1">
                          Selected: {getSelectedUserTypeName()}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role Name *
                      </label>
                      <input
                        type="text"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        placeholder="e.g., Content Manager, System Admin"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2  focus:border-transparent transition-all duration-200 text-sm"
                        disabled={isSubmitting}
                        maxLength={100}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={roleDesc}
                        onChange={(e) => setRoleDesc(e.target.value)}
                        placeholder="Describe the role responsibilities and permissions..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2  focus:border-transparent transition-all duration-200 text-sm resize-none"
                        disabled={isSubmitting}
                        maxLength={500}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {roleDesc.length}/500 characters
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-4 space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedUserType || !roleName.trim()}
                      className="w-full   disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
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
                        'Add Role'
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

            {/* Right Panel - Roles List - Takes remaining space */}
            <div className="flex-1 min-w-0 p-4 flex flex-col">
              
              {/* Table Header */}
              <div className="flex-shrink-0 flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Roles List</h2>
                  <p className="text-xs text-gray-600">
                    {isLoading ? 'Loading...' : `${roles.length} role(s) found`}
                  </p>
                </div>
                <button
                  onClick={loadRoles}
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
                        <p className="text-sm text-gray-500">Loading roles...</p>
                      </div>
                    </div>
                  ) : roles.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center py-8">
                        <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                        <h3 className="text-base font-medium text-gray-900 mb-1">No roles found</h3>
                        <p className="text-sm text-gray-500">Get started by adding your first role.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full">
                      <RoleTable
                        Rolelist={roles}
                        handleRoleEdit={handleEdit}
                        handleRoleDelete={handleDelete}
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
            max-height: 350px;
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

export default ManageRole;                    